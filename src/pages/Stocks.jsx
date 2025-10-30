import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Card } from "../components/common/Card";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { SearchBar } from "../components/common/SearchBar";
import { PriceChart } from "../components/common/PriceChart";
import { stocksAPI } from "../services/api";
import {
  FaArrowUp,
  FaArrowDown,
  FaBuilding,
  FaDollarSign,
  FaGlobe,
  FaIndustry,
  FaExchangeAlt,
} from "react-icons/fa";

export const Stocks = () => {
  const [searchSymbol, setSearchSymbol] = useState("AAPL");
  const [stockData, setStockData] = useState(null);
  const [stockProfile, setStockProfile] = useState(null);
  const [stockHistory, setStockHistory] = useState(null);
  const [indicesData, setIndicesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStockData("AAPL");
    fetchIndices();
  }, []);

  const formatPrice = (price) => {
    if (!price || isNaN(price) || !isFinite(price)) return "$0.00";
    return `$${price.toFixed(2)}`;
  };

  const formatPercentage = (percent) => {
    if (!percent || isNaN(percent) || !isFinite(percent)) return "0.00%";
    return `${percent > 0 ? "+" : ""}${Math.abs(percent).toFixed(2)}%`;
  };

  const formatMarketCap = (marketCap) => {
    if (!marketCap || isNaN(marketCap) || !isFinite(marketCap)) return "N/A";
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return `$${marketCap.toFixed(2)}`;
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

  const fetchStockData = async (symbol) => {
    try {
      setLoading(true);
      setError(null);

      const [quoteRes, profileRes, historyRes] = await Promise.all([
        stocksAPI.getStockQuote(symbol),
        stocksAPI.getStockProfile(symbol),
        stocksAPI.getStockHistory(symbol),
      ]);

      setStockData(quoteRes.data);
      setStockProfile(profileRes.data);
      setStockHistory(historyRes.data);
    } catch (err) {
      setError(
        "Failed to fetch stock data. Please check the symbol and try again."
      );
      console.error("Error fetching stock data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchIndices = async () => {
    try {
      const response = await stocksAPI.getMajorIndices();
      setIndicesData(response.data || []);
    } catch (err) {
      console.error("Error fetching indices:", err);
      setIndicesData([]);
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
        placeholder="Enter stock symbol (e.g., AAPL, GOOGL, TSLA, MSFT)"
        onSearch={handleSearch}
        showFilters={false}
      />

      {error && <ErrorCard>{error}</ErrorCard>}

      {stockData && stockProfile && (
        <>
          <Card>
            <StockHeader>
              <StockIcon>
                <FaBuilding />
              </StockIcon>
              <StockInfo>
                <StockSymbol>{searchSymbol.toUpperCase()}</StockSymbol>
                <StockName>
                  {stockProfile.name || "Company Information Not Available"}
                </StockName>
              </StockInfo>
              <StockPrice>
                <CurrentPrice>
                  {formatPrice(getSafeValue(stockData.c))}
                </CurrentPrice>
                <PriceChange $positive={getSafeValue(stockData.d, 0) > 0}>
                  {getSafeValue(stockData.d, 0) > 0 ? (
                    <FaArrowUp />
                  ) : (
                    <FaArrowDown />
                  )}
                  {formatPrice(Math.abs(getSafeValue(stockData.d, 0)))} (
                  {formatPercentage(getSafeValue(stockData.dp, 0))})
                </PriceChange>
              </StockPrice>
            </StockHeader>

            <StatsGrid>
              <StatItem>
                <StatLabel>Open</StatLabel>
                <StatValue>{formatPrice(getSafeValue(stockData.o))}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>High</StatLabel>
                <StatValue>{formatPrice(getSafeValue(stockData.h))}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Low</StatLabel>
                <StatValue>{formatPrice(getSafeValue(stockData.l))}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Previous Close</StatLabel>
                <StatValue>{formatPrice(getSafeValue(stockData.pc))}</StatValue>
              </StatItem>
            </StatsGrid>
          </Card>

          <Grid>
            <Card>
              <SectionTitle>Price Chart</SectionTitle>
              {stockHistory && stockHistory.length > 0 ? (
                <PriceChart
                  data={{
                    prices: stockHistory.map((item) => [
                      new Date(item.date).getTime(),
                      getSafeValue(item.close, 0),
                    ]),
                  }}
                />
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    color: "#6b7280",
                    padding: "2rem",
                    fontSize: "0.9rem",
                  }}
                >
                  Historical data not available
                </div>
              )}
            </Card>

            <Card>
              <SectionTitle>Company Information</SectionTitle>
              <CompanyInfo>
                <InfoItem>
                  <FaIndustry />
                  <InfoLabel>Industry:</InfoLabel>
                  <InfoValue>
                    {stockProfile.finnhubIndustry || "Not Available"}
                  </InfoValue>
                </InfoItem>

                <InfoItem>
                  <FaDollarSign />
                  <InfoLabel>Market Cap:</InfoLabel>
                  <InfoValue>
                    {formatMarketCap(
                      getSafeValue(stockProfile.marketCapitalization)
                    )}
                  </InfoValue>
                </InfoItem>

                <InfoItem>
                  <FaExchangeAlt />
                  <InfoLabel>Exchange:</InfoLabel>
                  <InfoValue>
                    {stockProfile.exchange || "Not Available"}
                  </InfoValue>
                </InfoItem>

                {stockProfile.weburl && (
                  <InfoItem>
                    <FaGlobe />
                    <InfoLabel>Website:</InfoLabel>
                    <WebsiteLink
                      href={stockProfile.weburl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaGlobe />
                      Visit Website
                    </WebsiteLink>
                  </InfoItem>
                )}
              </CompanyInfo>
            </Card>
          </Grid>
        </>
      )}

      <Card style={{ marginTop: "1.5rem" }}>
        <SectionTitle>Major Indices</SectionTitle>
        <IndicesGrid>
          {indicesData.map((index) => (
            <IndexCard key={index.symbol} hover>
              <IndexName>{index.name || "Index"}</IndexName>
              <IndexPrice>
                {formatPrice(getSafeValue(index.current))}
              </IndexPrice>
              <PriceChange $positive={getSafeValue(index.change, 0) > 0}>
                {getSafeValue(index.change, 0) > 0 ? (
                  <FaArrowUp />
                ) : (
                  <FaArrowDown />
                )}
                {formatPercentage(getSafeValue(index.change_percent, 0))}
              </PriceChange>
            </IndexCard>
          ))}
        </IndicesGrid>

        {indicesData.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "#6b7280",
              padding: "1rem",
              fontSize: "0.9rem",
            }}
          >
            Market indices data not available
          </div>
        )}
      </Card>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Grid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const StockHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
`;

const StockIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background: ${({ theme }) => theme.gradients.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
`;

const StockInfo = styled.div`
  flex: 1;
`;

const StockSymbol = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 0.2rem;
`;

const StockName = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.3;
`;

const StockPrice = styled.div`
  text-align: right;
`;

const CurrentPrice = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 0.4rem;
  line-height: 1.2;
`;

const PriceChange = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  justify-content: flex-end;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ $positive }) => ($positive ? "#10b981" : "#ef4444")};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-top: 1.25rem;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: ${({ theme }) => theme.background.secondary};
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.border};
`;

const StatLabel = styled.span`
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.85rem;
`;

const StatValue = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  font-size: 0.85rem;
`;

const IndicesGrid = styled.div`
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  margin-top: 1.5rem;
`;

const IndexCard = styled(Card)`
  text-align: center;
  padding: 1.25rem;
`;

const IndexName = styled.h4`
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: ${({ theme }) => theme.text.primary};
  font-size: 0.9rem;
`;

const IndexPrice = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
  color: ${({ theme }) => theme.text.primary};
`;

const CompanyInfo = styled.div`
  line-height: 1.6;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
`;

const InfoLabel = styled.strong`
  color: ${({ theme }) => theme.text.primary};
  min-width: 80px;
`;

const InfoValue = styled.span`
  color: ${({ theme }) => theme.text.secondary};
`;

const ErrorCard = styled(Card)`
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #dc2626;
  text-align: center;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const WebsiteLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  background: rgba(67, 97, 238, 0.1);
  border-radius: 6px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(67, 97, 238, 0.2);
    transform: translateY(-1px);
  }
`;
