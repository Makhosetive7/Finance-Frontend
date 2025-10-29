import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card } from '../components/common/Card';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { newsAPI } from '../services/api';
import { FaNewspaper, FaExternalLinkAlt, FaCalendar, FaTag } from 'react-icons/fa';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const Tab = styled.button`
  padding: 1rem 2rem;
  background: ${({ $active, theme }) => 
    $active ? theme.primary : 'transparent'};
  color: ${({ $active, theme }) => 
    $active ? 'white' : theme.text.secondary};
  border: none;
  border-radius: 8px 8px 0 0;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: ${({ $active, theme }) => 
      $active ? 'white' : theme.primary};
    background: ${({ $active, theme }) => 
      $active ? theme.primary : theme.background.tertiary};
  }
`;

const NewsGrid = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const NewsCard = styled(Card)`
  cursor: pointer;
  transition: all 0.3s ease;
  height: fit-content;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }
`;

const NewsImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
  background: ${({ theme }) => theme.background.secondary};
`;

const NewsTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.text.primary};
  line-height: 1.4;
  
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const NewsSummary = styled.p`
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.6;
  margin-bottom: 1rem;
  
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
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 600;
`;

const Date = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text.secondary};
`;

const ReadMore = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.primary};
  font-weight: 600;
  font-size: 0.9rem;
  transition: color 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.primaryHover};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${({ theme }) => theme.text.secondary};
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

export const News = () => {
  const [activeTab, setActiveTab] = useState('market');
  const [marketNews, setMarketNews] = useState([]);
  const [cryptoNews, setCryptoNews] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentNews = activeTab === 'market' ? marketNews : cryptoNews;

  const handleNewsClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <Tabs>
        <Tab 
          $active={activeTab === 'market'} 
          onClick={() => setActiveTab('market')}
        >
          <FaNewspaper style={{ marginRight: '0.5rem' }} />
          Market News
        </Tab>
        <Tab 
          $active={activeTab === 'crypto'} 
          onClick={() => setActiveTab('crypto')}
        >
          <FaTag style={{ marginRight: '0.5rem' }} />
          Crypto News
        </Tab>
      </Tabs>

      {currentNews.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <FaNewspaper />
          </EmptyIcon>
          <h3>No news available</h3>
          <p>Please check back later for the latest updates.</p>
        </EmptyState>
      ) : (
        <NewsGrid>
          {currentNews.map((article) => (
            <NewsCard 
              key={article.id} 
              hover
              onClick={() => handleNewsClick(article.url)}
            >
              {article.image && (
                <NewsImage 
                  src={article.image} 
                  alt={article.title}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              
              <NewsTitle>{article.title}</NewsTitle>
              
              {article.summary && (
                <NewsSummary>{article.summary}</NewsSummary>
              )}

              <NewsMeta>
                <Source>
                  <FaNewspaper />
                  {article.source}
                </Source>
                
                <Date>
                  <FaCalendar />
                  {formatDate(article.datetime)}
                </Date>
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
            </NewsCard>
          ))}
        </NewsGrid>
      )}
    </Container>
  );
};