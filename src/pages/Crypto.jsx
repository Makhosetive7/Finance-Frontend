import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card } from '../components/common/Card';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { cryptoAPI } from '../services/api';
import { FaArrowUp, FaArrowDown, FaSearch } from 'react-icons/fa';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const SearchBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.background.primary};
  color: ${({ theme }) => theme.text.primary};
  font-size: 1rem;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
  }
`;

const SearchButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.primary};
  color: white;
  border-radius: 8px;
  font-weight: 600;
  transition: background 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.primaryHover};
  }
`;

const CryptoGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
`;

const CryptoItem = styled(Card)`
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const CryptoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const CryptoIcon = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
`;

const CryptoName = styled.div`
  flex: 1;
`;

const CryptoSymbol = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
`;

const CryptoFullName = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text.secondary};
`;

const CryptoPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const MarketData = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const MarketStat = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
`;

const StatLabel = styled.span`
  color: ${({ theme }) => theme.text.secondary};
`;

const StatValue = styled.span`
  color: ${({ theme, $positive }) => 
    $positive === undefined ? theme.text.primary : 
    $positive ? theme.success : theme.danger};
  font-weight: 600;
`;

export const Crypto = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCryptoData();
  }, []);

  const fetchCryptoData = async () => {
    try {
      setLoading(true);
      const response = await cryptoAPI.getTopCrypto(100);
      setCryptoData(response.data);
    } catch (error) {
      console.error('Error fetching crypto data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCrypto = cryptoData.filter(crypto =>
    crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <SearchBar>
        <SearchInput
          type="text"
          placeholder="Search cryptocurrencies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <SearchButton>
          <FaSearch />
        </SearchButton>
      </SearchBar>

      <CryptoGrid>
        {filteredCrypto.map((crypto) => (
          <CryptoItem key={crypto.id} hover>
            <CryptoHeader>
              <CryptoIcon src={crypto.image} alt={crypto.name} />
              <CryptoName>
                <CryptoSymbol>{crypto.symbol}</CryptoSymbol>
                <CryptoFullName>{crypto.name}</CryptoFullName>
              </CryptoName>
            </CryptoHeader>

            <CryptoPrice>
              ${crypto.current_price?.toLocaleString()}
            </CryptoPrice>

            <PriceChange $positive={crypto.price_change_percentage_24h > 0}>
              {crypto.price_change_percentage_24h > 0 ? (
                <FaArrowUp />
              ) : (
                <FaArrowDown />
              )}
              {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
            </PriceChange>

            <MarketData>
              <MarketStat>
                <StatLabel>Market Cap:</StatLabel>
                <StatValue>
                  ${(crypto.market_cap / 1e9).toFixed(2)}B
                </StatValue>
              </MarketStat>
              <MarketStat>
                <StatLabel>24h Volume:</StatLabel>
                <StatValue>
                  ${(crypto.total_volume / 1e6).toFixed(2)}M
                </StatValue>
              </MarketStat>
              <MarketStat>
                <StatLabel>24h High:</StatLabel>
                <StatValue>
                  ${crypto.high_24h?.toLocaleString()}
                </StatValue>
              </MarketStat>
              <MarketStat>
                <StatLabel>24h Low:</StatLabel>
                <StatValue>
                  ${crypto.low_24h?.toLocaleString()}
                </StatValue>
              </MarketStat>
            </MarketData>
          </CryptoItem>
        ))}
      </CryptoGrid>
    </Container>
  );
};

// Reuse the PriceChange component from Home
const PriceChange = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${({ $positive }) => ($positive ? '#10b981' : '#ef4444')};
  font-weight: 600;
  margin-bottom: 1rem;
`;