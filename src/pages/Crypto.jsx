import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Card } from "../components/common/Card";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { cryptoAPI } from "../services/api";
import {
  FaArrowUp,
  FaArrowDown,
  FaStar,
  FaRegStar,
  FaFire,
  FaChartLine,
  FaSearch,
} from "react-icons/fa";
import { SearchBar } from "../components/common/SearchBar";

export const Crypto = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState(new Set());
  const [marketStats, setMarketStats] = useState({
    totalMarketCap: 0,
    totalVolume: 0,
    activeCryptos: 0,
    trending: 0,
  });

  useEffect(() => {
    fetchCryptoData();
  }, []);

  const fetchCryptoData = async () => {
    try {
      setLoading(true);
      const response = await cryptoAPI.getTopCrypto(100);
      const data = response.data;
      setCryptoData(data);

      // Calculate market stats
      const totalMarketCap = data.reduce(
        (sum, crypto) => sum + (crypto.market_cap || 0),
        0
      );
      const totalVolume = data.reduce(
        (sum, crypto) => sum + (crypto.total_volume || 0),
        0
      );
      const trending = data.filter(
        (crypto) => (crypto.price_change_percentage_24h || 0) > 10
      ).length;

      setMarketStats({
        totalMarketCap,
        totalVolume,
        activeCryptos: data.length,
        trending,
      });
    } catch (error) {
      console.error("Error fetching crypto data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (cryptoId, event) => {
    event.stopPropagation();
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(cryptoId)) {
        newFavorites.delete(cryptoId);
      } else {
        newFavorites.add(cryptoId);
      }
      return newFavorites;
    });
  };

  const filteredCrypto = cryptoData.filter(
    (crypto) =>
      crypto.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crypto.symbol?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
  };

  const formatNumber = (num) => {
    if (!num || isNaN(num) || !isFinite(num)) return "$0.00";
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatPrice = (price) => {
    if (!price || isNaN(price) || !isFinite(price)) return "$0.00";

    if (price >= 1000) {
      return `$${price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    } else if (price >= 1) {
      return `$${price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      })}`;
    } else {
      return `$${price.toLocaleString(undefined, {
        minimumFractionDigits: 4,
        maximumFractionDigits: 6,
      })}`;
    }
  };

  const formatPercentage = (percent) => {
    if (!percent || isNaN(percent) || !isFinite(percent)) return "0.00%";
    return `${percent > 0 ? "+" : ""}${Math.abs(percent).toFixed(2)}%`;
  };

  const getSafeValue = (value, fallback = "N/A") => {
    if (
      value === null ||
      value === undefined ||
      isNaN(value) ||
      !isFinite(value)
    ) {
      return fallback;
    }
    return value;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <PageHeader>
        <PageTitle>Cryptocurrency Markets</PageTitle>
        <PageSubtitle>
          Real-time cryptocurrency prices, market caps, and trading volumes.
          Track your favorite assets.
        </PageSubtitle>
      </PageHeader>

      <StatsBar>
        <StatCard>
          <StatValue>{formatNumber(marketStats.totalMarketCap)}</StatValue>
          <StatLabel>Total Market Cap</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{formatNumber(marketStats.totalVolume)}</StatValue>
          <StatLabel>24h Trading Volume</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{marketStats.activeCryptos}</StatValue>
          <StatLabel>Active Cryptocurrencies</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{marketStats.trending}</StatValue>
          <StatLabel>Trending Assets</StatLabel>
        </StatCard>
      </StatsBar>

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search 100+ cryptocurrencies by name or symbol..."
        onSearch={handleSearch}
        showFilters={true}
        loading={false}
      />

      <ResultsCount>
        Showing {filteredCrypto.length} of {cryptoData.length} cryptocurrencies
        {searchQuery && ` for "${searchQuery}"`}
      </ResultsCount>

      {filteredCrypto.length === 0 ? (
        <EmptyState>
          <FaSearch />
          <EmptyTitle>No cryptocurrencies found</EmptyTitle>
          <EmptyText>Try adjusting your search terms or filters</EmptyText>
        </EmptyState>
      ) : (
        <CryptoGrid>
          {filteredCrypto.map((crypto, index) => {
            const priceChange = getSafeValue(
              crypto.price_change_percentage_24h,
              0
            );
            const isPositive = priceChange > 0;
            const isTrending = priceChange > 15;

            return (
              <CryptoItem key={crypto.id} hover>
                {isTrending && (
                  <TrendingBadge>
                    <FaFire />
                    Trending
                  </TrendingBadge>
                )}

                <CryptoHeader>
                  <CryptoRank>#{index + 1}</CryptoRank>
                  <CryptoIcon
                    src={crypto.image || "/placeholder-crypto.png"}
                    alt={crypto.name || "Cryptocurrency"}
                    onError={(e) => {
                      e.target.src = "/placeholder-crypto.png";
                    }}
                  />
                  <CryptoInfo>
                    <CryptoSymbol>
                      {(crypto.symbol || "???").toUpperCase()}
                      {priceChange > 20 && <FaChartLine color="#10b981" />}
                    </CryptoSymbol>
                    <CryptoFullName>
                      {crypto.name || "Unknown Cryptocurrency"}
                    </CryptoFullName>
                  </CryptoInfo>
                  <FavoriteButton
                    onClick={(e) => toggleFavorite(crypto.id, e)}
                    title={
                      favorites.has(crypto.id)
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    {favorites.has(crypto.id) ? (
                      <FaStar color="#f59e0b" />
                    ) : (
                      <FaRegStar />
                    )}
                  </FavoriteButton>
                </CryptoHeader>

                <PriceSection>
                  <CryptoPrice>
                    {formatPrice(getSafeValue(crypto.current_price, 0))}
                  </CryptoPrice>
                  <PriceChange $positive={isPositive}>
                    {isPositive ? <FaArrowUp /> : <FaArrowDown />}
                    {formatPercentage(priceChange)}
                  </PriceChange>
                </PriceSection>

                <MarketData>
                  <MarketStat>
                    <StatLabel>Market Cap</StatLabel>
                    <StatValue>
                      {formatNumber(getSafeValue(crypto.market_cap, 0))}
                    </StatValue>
                  </MarketStat>
                  <MarketStat>
                    <StatLabel>24h Volume</StatLabel>
                    <StatValue>
                      {formatNumber(getSafeValue(crypto.total_volume, 0))}
                    </StatValue>
                  </MarketStat>
                  <MarketStat>
                    <StatLabel>24h High</StatLabel>
                    <StatValue>
                      {formatPrice(getSafeValue(crypto.high_24h, 0))}
                    </StatValue>
                  </MarketStat>
                  <MarketStat>
                    <StatLabel>24h Low</StatLabel>
                    <StatValue>
                      {formatPrice(getSafeValue(crypto.low_24h, 0))}
                    </StatValue>
                  </MarketStat>
                </MarketData>
              </CryptoItem>
            );
          })}
        </CryptoGrid>
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

const CryptoGrid = styled.div`
  display: grid;
  gap: 1.25rem;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const CryptoItem = styled(Card)`
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  padding: 1.25rem;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  }
`;

const CryptoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  position: relative;
`;

const CryptoRank = styled.div`
  position: absolute;
  top: -8px;
  left: -8px;
  background: ${({ theme }) => theme.gradients.primary};
  color: white;
  padding: 0.4rem 0.6rem;
  border-radius: 16px;
  font-size: 0.7rem;
  font-weight: 700;
  box-shadow: 0 3px 8px rgba(67, 97, 238, 0.3);
`;

const CryptoIcon = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1.5px solid ${({ theme }) => theme.border};
`;

const CryptoInfo = styled.div`
  flex: 1;
`;

const CryptoSymbol = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const CryptoFullName = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.3;
`;

const FavoriteButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text.secondary};
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 6px;
  transition: all 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.warning};
    background: rgba(245, 158, 11, 0.1);
  }
`;

const PriceSection = styled.div`
  margin-bottom: 0.75rem;
`;

const CryptoPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 0.4rem;
  line-height: 1.2;
`;

const PriceChange = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ $positive }) => ($positive ? "#10b981" : "#ef4444")};
  padding: 0.4rem 0.75rem;
  background: ${({ $positive }) =>
    $positive ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)"};
  border-radius: 6px;
  border: 1px solid
    ${({ $positive }) =>
      $positive ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"};
`;

const MarketData = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const MarketStat = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
`;

const StatLabel = styled.span`
  color: ${({ theme }) => theme.text.secondary};
  display: flex;
  align-items: center;
  gap: 0.2rem;
`;

const StatValue = styled.span`
  color: ${({ theme, $positive }) =>
    $positive === undefined
      ? theme.text.primary
      : $positive
      ? theme.success
      : theme.danger};
  font-weight: 600;
  font-size: 0.85rem;
`;

const TrendingBadge = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: ${({ theme }) => theme.gradients.danger};
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 16px;
  font-size: 0.65rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.2rem;
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
