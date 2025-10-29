import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Card } from '../components/common/Card';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { cryptoAPI, stocksAPI, newsAPI } from '../services/api';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

export const Home = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [indicesData, setIndicesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [cryptoRes, newsRes, indicesRes] = await Promise.all([
          cryptoAPI.getTopCrypto(6),
          newsAPI.getMarketNews(),
          stocksAPI.getMajorIndices()
        ]);

        setCryptoData(cryptoRes.data);
        setNewsData(newsRes.data.slice(0, 5));
        setIndicesData(indicesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <Wrapper>
      <HeroSection
        as={motion.section}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <HeroTitle>Track Global Markets in Real-Time</HeroTitle>
        <HeroSubtitle>
          Stay informed on cryptocurrencies, market indices, and breaking financial news —
          beautifully organized and updated live.
        </HeroSubtitle>
      </HeroSection>

      <Grid>
        <MotionCard
          title="Top Cryptocurrencies"
          as={motion.div}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {cryptoData.map((crypto) => (
            <CryptoCard key={crypto.id}>
              <CryptoIcon src={crypto.image} alt={crypto.name} />
              <CryptoInfo>
                <CryptoSymbol>{crypto.symbol.toUpperCase()}</CryptoSymbol>
                <CryptoName>{crypto.name}</CryptoName>
              </CryptoInfo>
              <CryptoRight>
                <CryptoPrice>${crypto.current_price?.toLocaleString()}</CryptoPrice>
                <PriceChange $positive={crypto.price_change_percentage_24h > 0}>
                  {crypto.price_change_percentage_24h > 0 ? <FaArrowUp /> : <FaArrowDown />}
                  {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                </PriceChange>
              </CryptoRight>
            </CryptoCard>
          ))}
        </MotionCard>

        <MotionCard
          title="Major Market Indices"
          as={motion.div}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {indicesData.map((index) => (
            <IndexRow key={index.symbol}>
              <span>{index.name}</span>
              <div>
                <strong>${index.current?.toFixed(2)}</strong>
                <PriceChange $positive={index.change > 0}>
                  {index.change > 0 ? <FaArrowUp /> : <FaArrowDown />}
                  {index.change?.toFixed(2)} ({index.change_percent?.toFixed(2)}%)
                </PriceChange>
              </div>
            </IndexRow>
          ))}
        </MotionCard>

        <MotionCard
          title="Latest Market News"
          as={motion.div}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {newsData.map((news) => (
            <NewsItem key={news.id}>
              <NewsTitle>{news.title}</NewsTitle>
              <NewsMeta>
                <span>{news.source}</span>
                <span>{new Date(news.datetime).toLocaleDateString()}</span>
              </NewsMeta>
            </NewsItem>
          ))}
        </MotionCard>
      </Grid>
    </Wrapper>
  );
};

// Styled Components
const Wrapper = styled.div`
  min-height: 100vh;
  background: radial-gradient(circle at top left, #1e293b, #0f172a);
  color: ${({ theme }) => theme.text.primary};
  padding-bottom: 4rem;
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 5rem 1rem 3rem;
  color: white;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(120deg, #00c6ff, #0072ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  color: #cbd5e1;
  max-width: 650px;
  margin: 0 auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const MotionCard = styled(Card)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }
`;

const CryptoCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  &:last-child {
    border-bottom: none;
  }
`;

const CryptoIcon = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const CryptoInfo = styled.div`
  flex: 1;
  margin-left: 0.75rem;
`;

const CryptoSymbol = styled.div`
  font-weight: 700;
  font-size: 1rem;
  text-transform: uppercase;
`;

const CryptoName = styled.div`
  font-size: 0.85rem;
  color: #94a3b8;
`;

const CryptoRight = styled.div`
  text-align: right;
`;

const CryptoPrice = styled.div`
  font-weight: 600;
  font-size: 1.05rem;
`;

const PriceChange = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
  color: ${({ $positive }) => ($positive ? '#22c55e' : '#ef4444')};
`;

const IndexRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  &:last-child {
    border-bottom: none;
  }
  span {
    font-weight: 600;
  }
`;

const NewsItem = styled.div`
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  &:last-child {
    border-bottom: none;
  }
`;

const NewsTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: #e2e8f0;
  &:hover {
    color: #60a5fa;
    cursor: pointer;
  }
`;

const NewsMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #94a3b8;
`;
