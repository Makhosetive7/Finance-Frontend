import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card } from '../components/common/Card';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { newsAPI } from '../services/api';
import { FaNewspaper, FaExternalLinkAlt, FaCalendar, FaTag, FaFire, FaSearch, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { SearchBar } from '../components/common/SearchBar';



export const News = () => {
  const [activeTab, setActiveTab] = useState('market');
  const [marketNews, setMarketNews] = useState([]);
  const [cryptoNews, setCryptoNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState(new Set());
  const [newsStats, setNewsStats] = useState({
    totalArticles: 0,
    trending: 0,
    today: 0,
    sources: 0
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const [marketRes, cryptoRes] = await Promise.all([
        newsAPI.getMarketNews(),
        newsAPI.getCryptoNews()
      ]);

      setMarketNews(marketRes.data);
      setCryptoNews(cryptoRes.data);

      // Calculate news stats
      const allNews = [...marketRes.data, ...cryptoRes.data];
      const todayString = new Date().toDateString();
      const todayArticles = allNews.filter(article => {
        const articleDate = new Date(article.datetime);
        return articleDate.toDateString() === todayString;
      });
      
      const sources = new Set(allNews.map(article => article.source)).size;
      const trending = allNews.filter(article => 
        article.trending || Math.random() > 0.7
      ).length;

      setNewsStats({
        totalArticles: allNews.length,
        trending,
        today: todayArticles.length,
        sources
      });
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = (articleId, event) => {
    event.stopPropagation();
    setBookmarks(prev => {
      const newBookmarks = new Set(prev);
      if (newBookmarks.has(articleId)) {
        newBookmarks.delete(articleId);
      } else {
        newBookmarks.add(articleId);
      }
      return newBookmarks;
    });
  };

  const currentNews = activeTab === 'market' ? marketNews : cryptoNews;

  const filteredNews = currentNews.filter(article =>
    article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.source?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewsClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const formatDate = (dateString) => {
    const articleDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - articleDate);
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return articleDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const isTrending = (article) => {
    const articleDate = new Date(article.datetime);
    const now = new Date();
    const diffHours = Math.abs(now - articleDate) / (1000 * 60 * 60);
    return diffHours < 24 && Math.random() > 0.5;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <PageHeader>
        <PageTitle>Financial News</PageTitle>
        <PageSubtitle>
          Stay updated with the latest market news, cryptocurrency updates, and financial insights from trusted sources.
        </PageSubtitle>
      </PageHeader>
      <StatsBar>
        <StatCard>
          <StatValue>{newsStats.totalArticles}</StatValue>
          <StatLabel>Total Articles</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{newsStats.today}</StatValue>
          <StatLabel>Today</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{newsStats.trending}</StatValue>
          <StatLabel>Trending</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{newsStats.sources}</StatValue>
          <StatLabel>News Sources</StatLabel>
        </StatCard>
      </StatsBar>

      <TabsContainer>
        <Tab 
          $active={activeTab === 'market'} 
          onClick={() => setActiveTab('market')}
        >
          <FaNewspaper />
          Market News
        </Tab>
        <Tab 
          $active={activeTab === 'crypto'} 
          onClick={() => setActiveTab('crypto')}
        >
          <FaTag />
          Crypto News
        </Tab>
      </TabsContainer>

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder={`Search ${currentNews.length} news articles...`}
        onSearch={() => {}}
        showFilters={true}
        loading={false}
      />

      <ResultsCount>
        Showing {filteredNews.length} of {currentNews.length} articles
        {searchQuery && ` for "${searchQuery}"`}
      </ResultsCount>

      {filteredNews.length === 0 ? (
        <EmptyState>
          <FaSearch />
          <EmptyTitle>No articles found</EmptyTitle>
          <EmptyText>Try adjusting your search terms or check back later for updates.</EmptyText>
        </EmptyState>
      ) : (
        <NewsGrid>
          {filteredNews.map((article) => (
            <NewsCard 
              key={article.id} 
              hover
              onClick={() => handleNewsClick(article.url)}
            >
              <NewsImageContainer>
                {article.image ? (
                  <NewsImage 
                    src={article.image} 
                    alt={article.title}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <ImagePlaceholder style={{ display: article.image ? 'none' : 'flex' }}>
                  <FaNewspaper />
                </ImagePlaceholder>
                
                {isTrending(article) && (
                  <TrendingBadge>
                    <FaFire />
                    Trending
                  </TrendingBadge>
                )}
                
                <BookmarkButton 
                  onClick={(e) => toggleBookmark(article.id, e)}
                  title={bookmarks.has(article.id) ? 'Remove bookmark' : 'Bookmark article'}
                >
                  {bookmarks.has(article.id) ? 
                    <FaBookmark color="#4361ee" /> : 
                    <FaRegBookmark />
                  }
                </BookmarkButton>
              </NewsImageContainer>
              
              <NewsContent>
                <NewsTitle>{article.title}</NewsTitle>
                
                {article.summary && (
                  <NewsSummary>{article.summary}</NewsSummary>
                )}

                <NewsMeta>
                  <Source>
                    <FaNewspaper />
                    {article.source}
                  </Source>
                  
                  <DateInfo>
                    <FaCalendar />
                    {formatDate(article.datetime)}
                  </DateInfo>
                </NewsMeta>

                <ReadMore 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  Read Full Article
                  <FaExternalLinkAlt />
                </ReadMore>
              </NewsContent>
            </NewsCard>
          ))}
        </NewsGrid>
      )}
    </Container>
  );
};


const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 1.5rem;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 0.5rem;
  background: ${({ theme }) => theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const PageSubtitle = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.text.secondary};
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.4;
`;

const StatsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  padding: 1.25rem;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  }
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.text.secondary};
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  background: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 0.5rem;
`;

const Tab = styled.button`
  flex: 1;
  padding: 1rem 1.5rem;
  background: ${({ $active, theme }) => 
    $active ? theme.gradients.primary : 'transparent'};
  color: ${({ $active }) => $active ? 'white' : 'inherit'};
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: ${({ $active, theme }) => 
      $active ? theme.gradients.primary : theme.background.tertiary};
    transform: translateY(-1px);
  }
`;

const NewsGrid = styled.div`
  display: grid;
  gap: 1.25rem;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const NewsCard = styled(Card)`
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  padding: 0;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  }
`;

const NewsImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
`;

const NewsImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${NewsCard}:hover & {
    transform: scale(1.05);
  }
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.gradients.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
`;

const TrendingBadge = styled.div`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background: ${({ theme }) => theme.gradients.danger};
  color: white;
  padding: 0.3rem 0.75rem;
  border-radius: 16px;
  font-size: 0.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  z-index: 2;
`;

const BookmarkButton = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;

  &:hover {
    background: white;
    transform: scale(1.1);
  }
`;

const NewsContent = styled.div`
  padding: 1.25rem;
`;

const NewsTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 0.75rem;
  line-height: 1.4;
  
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const NewsSummary = styled.p`
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.5;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const NewsMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const Source = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 600;
`;

const DateInfo = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.text.secondary};
`;

const ReadMore = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.primary};
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;

  &:hover {
    color: white;
    background: ${({ theme }) => theme.gradients.primary};
    border-color: transparent;
    transform: translateY(-1px);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1.5rem;
  color: ${({ theme }) => theme.text.secondary};
  
  svg {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
    opacity: 0.5;
  }
`;

const EmptyTitle = styled.h3`
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 0.4rem;
  font-size: 1.1rem;
`;

const EmptyText = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text.secondary};
`;

const ResultsCount = styled.div`
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 1.25rem;
  text-align: center;
  font-size: 0.85rem;
`;