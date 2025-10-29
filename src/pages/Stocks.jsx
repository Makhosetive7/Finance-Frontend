import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card } from '../components/common/Card';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { SearchBar } from '../components/common/SearchBar';
import { PriceChart } from '../components/common/PriceChart';
import { stocksAPI } from '../services/api';
import { FaArrowUp, FaArrowDown, FaBuilding, FaDollarSign } from 'react-icons/fa';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const Grid = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr 1fr;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const StockHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StockIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
`;

const StockInfo = styled.div`
  flex: 1;
`;

const StockSymbol = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 0.25rem;
`;

const StockName = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.text.secondary};
`;

const StockPrice = styled.div`
  text-align: right;
`;

const CurrentPrice = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 0.5rem;
`;

const PriceChange = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: flex-end;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ $positive }) => ($positive ? '#10b981' : '#ef4444')};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1.5rem;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: ${({ theme }) => theme.background.secondary};
  border-radius: 8px;
`;

const StatLabel = styled.span`
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.9rem;
`;

const StatValue = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
`;

const IndicesGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  margin-top: 2rem;
`;

const IndexCard = styled(Card)`
  text-align: center;
  padding: 1.5rem;
`;

const IndexName = styled.h4`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.text.primary};
`;

const IndexPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

export const Stocks = () => {
  const [searchSymbol, setSearchSymbol] = useState('AAPL');
  const [stockData, setStockData] = useState(null);
  const [stockProfile, setStockProfile] = useState(null);
  const [stockHistory, setStockHistory] = useState(null);
  const [indicesData, setIndicesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStockData('AAPL');
    fetchIndices();
  }, []);

  const fetchStockData = async (symbol) => {
    try {
      setLoading(true);
      setError(null);
      
      const [quoteRes, profileRes, historyRes] = await Promise.all([
        stocksAPI.getStockQuote(symbol),
        stocksAPI.getStockProfile(symbol),
        stocksAPI.getStockHistory(symbol)
      ]);

      setStockData(quoteRes.data);
      setStockProfile(profileRes.data);
      setStockHistory(historyRes.data);
    } catch (err) {
      setError('Failed to fetch stock data. Please check the symbol and try again.');
      console.error('Error fetching stock data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchIndices = async () => {
    try {
      const response = await stocksAPI.getMajorIndices();
      setIndicesData(response.data);
    } catch (err) {
      console.error('Error fetching indices:', err);
    }
  };

  const handleSearch = () => {
    if (searchSymbol.trim()) {
      fetchStockData(searchSymbol.trim().toUpperCase());
    }
  };

  if (loading && !stockData) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <SearchBar
        value={searchSymbol}
        onChange={setSearchSymbol}
        placeholder="Enter stock symbol (e.g., AAPL, GOOGL, TSLA)"
        onSearch={handleSearch}
      />

      {error && (
        <Card style={{ background: '#fef2f2', borderColor: '#fecaca' }}>
          <div style={{ color: '#dc2626', textAlign: 'center' }}>
            {error}
          </div>
        </Card>
      )}

      {stockData && stockProfile && (
        <>
          <Card>
            <StockHeader>
              <StockIcon>
                <FaBuilding />
              </StockIcon>
              <StockInfo>
                <StockSymbol>{searchSymbol.toUpperCase()}</StockSymbol>
                <StockName>{stockProfile.name}</StockName>
              </StockInfo>
              <StockPrice>
                <CurrentPrice>${stockData.c?.toFixed(2)}</CurrentPrice>
                <PriceChange $positive={stockData.d > 0}>
                  {stockData.d > 0 ? <FaArrowUp /> : <FaArrowDown />}
                  {stockData.d?.toFixed(2)} ({stockData.dp?.toFixed(2)}%)
                </PriceChange>
              </StockPrice>
            </StockHeader>

            <StatsGrid>
              <StatItem>
                <StatLabel>Open</StatLabel>
                <StatValue>${stockData.o?.toFixed(2)}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>High</StatLabel>
                <StatValue>${stockData.h?.toFixed(2)}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Low</StatLabel>
                <StatValue>${stockData.l?.toFixed(2)}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Previous Close</StatLabel>
                <StatValue>${stockData.pc?.toFixed(2)}</StatValue>
              </StatItem>
            </StatsGrid>
          </Card>

          <Grid>
            <Card title="Price Chart">
              <PriceChart data={{ prices: stockHistory.map(item => [
                new Date(item.date).getTime(), 
                item.close
              ])}} />
            </Card>

            <Card title="Company Info">
              {stockProfile && (
                <div style={{ lineHeight: '1.8' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Industry:</strong> {stockProfile.finnhubIndustry}
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Market Cap:</strong> {stockProfile.marketCapitalization ? 
                      `$${(stockProfile.marketCapitalization / 1e9).toFixed(2)}B` : 'N/A'
                    }
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Exchange:</strong> {stockProfile.exchange}
                  </div>
                  {stockProfile.weburl && (
                    <a 
                      href={stockProfile.weburl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#2563eb', textDecoration: 'underline' }}
                    >
                      Visit Website
                    </a>
                  )}
                </div>
              )}
            </Card>
          </Grid>
        </>
      )}

      <Card title="Major Indices" style={{ marginTop: '2rem' }}>
        <IndicesGrid>
          {indicesData.map((index) => (
            <IndexCard key={index.symbol} hover>
              <IndexName>{index.name}</IndexName>
              <IndexPrice>${index.current?.toFixed(2)}</IndexPrice>
              <PriceChange $positive={index.change > 0}>
                {index.change > 0 ? <FaArrowUp /> : <FaArrowDown />}
                {index.change?.toFixed(2)}%
              </PriceChange>
            </IndexCard>
          ))}
        </IndicesGrid>
      </Card>
    </Container>
  );
};