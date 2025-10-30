import React, { useEffect, useState } from "react";
import styled, { keyframes, useTheme } from "styled-components";
import { Card } from "../components/common/Card";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { cryptoAPI, stocksAPI, newsAPI } from "../services/api";
import { 
  FaArrowUp, 
  FaArrowDown, 
  FaDownload, 
  FaStar, 
  FaShieldAlt, 
  FaRocket,
  FaExternalLinkAlt,
  FaBitcoin,
  FaEthereum,
  FaDollarSign,
  FaChartLine
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [indicesData, setIndicesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tickerData, setTickerData] = useState([]);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [cryptoRes, newsRes, indicesRes, tickerRes] = await Promise.all([
          cryptoAPI.getTopCrypto(6),
          newsAPI.getMarketNews(),
          stocksAPI.getMajorIndices(),
          cryptoAPI.getTopCrypto(20)
        ]);

        setCryptoData(cryptoRes.data || []);
        setNewsData((newsRes.data || []).slice(0, 4));
        setIndicesData(indicesRes.data || []);
        setTickerData(tickerRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    const fallback = e.target.nextSibling;
    if (fallback && fallback.style) {
      fallback.style.display = 'flex';
    }
  };

  const handleCryptoClick = (cryptoId) => {
    navigate(`/crypto/${cryptoId}`);
  };

  const handleViewAllCrypto = () => {
    navigate('/crypto');
  };

  const handleViewAllNews = () => {
    navigate('/news');
  };

  const handleNewsClick = (newsId, url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      navigate(`/news#${newsId}`);
    }
  };

  const handleIndexClick = (indexSymbol) => {
    navigate(`/stocks?index=${indexSymbol}`);
  };

  const handleGetStarted = () => {
    const section = document.getElementById('featured-crypto');
    if (section) {
      section.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }
  };

  const handleDownloadApp = () => {
    alert('Redirecting to app store...');
  };

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Loading market data...</LoadingText>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <ErrorIcon>⚠️</ErrorIcon>
        <ErrorMessage>{error}</ErrorMessage>
        <RetryButton onClick={() => window.location.reload()}>
          Retry
        </RetryButton>
      </ErrorContainer>
    );
  }

  return (
    <Wrapper>
      <TickerContainer>
        <TickerContent>
          <TickerLabel>
            <FaChartLine style={{ marginRight: '8px' }} />
            Live Markets
          </TickerLabel>
          <TickerItems>
            {tickerData.map((crypto, index) => (
              <React.Fragment key={crypto.id}>
                <TickerItem>
                  <TickerIcon>
                    {crypto.symbol && crypto.symbol.toLowerCase() === 'btc' ? <FaBitcoin /> :
                     crypto.symbol && crypto.symbol.toLowerCase() === 'eth' ? <FaEthereum /> :
                     crypto.symbol && crypto.symbol.toLowerCase().includes('usd') ? <FaDollarSign /> :
                     <img src={crypto.image} alt={crypto.name} onError={handleImageError} />}
                    <TickerIconFallback>
                      {crypto.symbol ? crypto.symbol.slice(0, 3).toUpperCase() : 'CRY'}
                    </TickerIconFallback>
                  </TickerIcon>
                  <TickerSymbol>{crypto.symbol ? crypto.symbol.toUpperCase() : 'N/A'}</TickerSymbol>
                  <TickerPrice>${formatNumber(crypto.current_price)}</TickerPrice>
                  <TickerChange $positive={crypto.price_change_percentage_24h > 0}>
                    {crypto.price_change_percentage_24h > 0 ? <FaArrowUp /> : <FaArrowDown />}
                    {Math.abs(crypto.price_change_percentage_24h || 0).toFixed(2)}%
                  </TickerChange>
                </TickerItem>
                {index < tickerData.length - 1 && <TickerSeparator>•</TickerSeparator>}
              </React.Fragment>
            ))}
          </TickerItems>
        </TickerContent>
      </TickerContainer>

      <Container>
        <HeroSection>
          <HeroContent>
            <Title>
              The Future of <GradientText>Crypto Investing</GradientText> Starts Here
            </Title>
            <Subtitle>
              Join millions of investors on the world's most secure crypto platform. 
              Trade with confidence using institutional-grade security and lightning-fast execution.
            </Subtitle>

            <StatsGrid>
              <StatItem>
                <StatNumber>10M+</StatNumber>
                <StatLabel>Active Users</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>$30B+</StatNumber>
                <StatLabel>Volume Traded</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>99.9%</StatNumber>
                <StatLabel>Platform Uptime</StatLabel>
              </StatItem>
            </StatsGrid>

            <EmailForm>
              <EmailInput 
                type="email" 
                placeholder="Enter your email to get started..."
              />
              <CTAButton onClick={handleGetStarted}>
                <FaRocket style={{ marginRight: '8px' }} />
                Start Trading Free
              </CTAButton>
            </EmailForm>

            <TrustBadges>
              <TrustBadge>
                <FaShieldAlt />
                <span>Bank-level Security</span>
              </TrustBadge>
              <TrustBadge>
                <FaStar />
                <span>Forbes Recommended</span>
              </TrustBadge>
              <TrustBadge>
                <FaChartLine />
                <span>Real-time Data</span>
              </TrustBadge>
            </TrustBadges>
          </HeroContent>

          <HeroVisual>
            <AppCard>
              <CardHeader>
                <AppTitle>Live Portfolio</AppTitle>
                <DownloadButton onClick={handleDownloadApp}>
                  <FaDownload style={{ marginRight: '6px' }} />
                  Download App
                </DownloadButton>
              </CardHeader>

              <PortfolioValue>
                <Price>${(91858.34).toLocaleString()}</Price>
                <PriceChange $positive={true}>
                  <FaArrowUp />
                  +$15,540.34 (+20.36%)
                </PriceChange>
              </PortfolioValue>

              <RewardsSection>
                <RewardsTitle>Staking Rewards</RewardsTitle>
                <RewardsAmount>$3.26 earned today</RewardsAmount>
              </RewardsSection>

              <LiveCryptoSection>
                <SectionTitle>Live Crypto Prices</SectionTitle>
                {cryptoData.slice(0, 3).map((crypto) => (
                  <LiveCryptoItem 
                    key={crypto.id}
                    onClick={() => handleCryptoClick(crypto.id)}
                  >
                    <CryptoIconSmall src={crypto.image} alt={crypto.name} onError={handleImageError} />
                    <LiveCryptoDetails>
                      <LiveCryptoSymbol>{crypto.symbol ? crypto.symbol.toUpperCase() : 'N/A'}</LiveCryptoSymbol>
                      <LiveCryptoFullName>{crypto.name || 'Unknown Crypto'}</LiveCryptoFullName>
                    </LiveCryptoDetails>
                    <LiveCryptoPrice>
                      <PriceValue>${formatNumber(crypto.current_price)}</PriceValue>
                      <PriceChange $positive={crypto.price_change_percentage_24h > 0}>
                        {crypto.price_change_percentage_24h > 0 ? <FaArrowUp /> : <FaArrowDown />}
                        {Math.abs(crypto.price_change_percentage_24h || 0).toFixed(2)}%
                      </PriceChange>
                    </LiveCryptoPrice>
                    <ViewLink>
                      <FaExternalLinkAlt />
                    </ViewLink>
                  </LiveCryptoItem>
                ))}
                <ViewAllLink onClick={handleViewAllCrypto}>
                  View All Cryptocurrencies →
                </ViewAllLink>
              </LiveCryptoSection>
            </AppCard>
          </HeroVisual>
        </HeroSection>

        <Section id="featured-crypto">
          <SectionHeader>
            <SectionTitle>Featured Cryptocurrencies</SectionTitle>
            <SectionSubtitle>Deep dive into top performing assets</SectionSubtitle>
            <ViewAllButton onClick={handleViewAllCrypto}>
              View All Assets
            </ViewAllButton>
          </SectionHeader>
          
          <FeaturedGrid>
            {cryptoData.slice(0, 3).map((crypto) => (
              <FeaturedCard 
                key={crypto.id}
                onClick={() => handleCryptoClick(crypto.id)}
              >
                <CurrencyHighlight>
                  <CurrencyBadge>
                    <CurrencyIconLarge src={crypto.image} alt={crypto.name} onError={handleImageError} />
                    <CurrencyStats>
                      <CurrencyNameLarge>{crypto.name || 'Unknown Crypto'}</CurrencyNameLarge>
                      <CurrencySymbolLarge>{crypto.symbol ? crypto.symbol.toUpperCase() : 'N/A'}</CurrencySymbolLarge>
                      <PriceLarge>${formatNumber(crypto.current_price)}</PriceLarge>
                    </CurrencyStats>
                  </CurrencyBadge>
                  <PerformanceIndicator $positive={crypto.price_change_percentage_24h > 0}>
                    {crypto.price_change_percentage_24h > 0 ? <FaArrowUp /> : <FaArrowDown />}
                    {Math.abs(crypto.price_change_percentage_24h || 0).toFixed(2)}%
                  </PerformanceIndicator>
                </CurrencyHighlight>
                
                <CardContent>
                  <CardTitle>Why {crypto.name || 'this asset'}?</CardTitle>
                  <CardDescription>
                    {getCryptoDescription(crypto.symbol)} Market cap: ${formatMarketCap(crypto.market_cap)}. 
                    24h volume: ${formatVolume(crypto.total_volume)}.
                  </CardDescription>
                  <MarketData>
                    <DataItem>
                      <Label>Market Cap</Label>
                      <Value>${formatMarketCap(crypto.market_cap)}</Value>
                    </DataItem>
                    <DataItem>
                      <Label>24h Volume</Label>
                      <Value>${formatVolume(crypto.total_volume)}</Value>
                    </DataItem>
                    <DataItem>
                      <Label>24h High</Label>
                      <Value>${formatNumber(crypto.high_24h)}</Value>
                    </DataItem>
                    <DataItem>
                      <Label>24h Low</Label>
                      <Value>${formatNumber(crypto.low_24h)}</Value>
                    </DataItem>
                  </MarketData>
                  <ActionButtons>
                    <PrimaryButton>Buy {crypto.symbol ? crypto.symbol.toUpperCase() : 'CRYPTO'}</PrimaryButton>
                    <SecondaryButton>Learn More</SecondaryButton>
                  </ActionButtons>
                </CardContent>
              </FeaturedCard>
            ))}
          </FeaturedGrid>
        </Section>

        <MarketOverview id="market-overview">
          <SectionHeader>
            <SectionTitle>Market Overview</SectionTitle>
            <SectionSubtitle>Global indices and market performance</SectionSubtitle>
          </SectionHeader>
          
          <IndicesGrid>
            {indicesData.map((index) => (
              <IndexCard 
                key={index.symbol}
                onClick={() => handleIndexClick(index.symbol)}
              >
                <IndexName>{index.name || 'Unknown Index'}</IndexName>
                <IndexPrice>${formatNumber(index.current)}</IndexPrice>
                <IndexChange $positive={index.change > 0}>
                  {index.change > 0 ? <FaArrowUp /> : <FaArrowDown />}
                  {Math.abs(index.change || 0).toFixed(2)} ({(index.change_percent || 0).toFixed(2)}%)
                </IndexChange>
                <IndexLink>View Details <FaExternalLinkAlt /></IndexLink>
              </IndexCard>
            ))}
          </IndicesGrid>
        </MarketOverview>

        <NewsSection id="latest-news">
          <SectionHeader>
            <SectionTitle>Market News</SectionTitle>
            <SectionSubtitle>Latest updates from the crypto world</SectionSubtitle>
            <ViewAllButton onClick={handleViewAllNews}>
              View All News
            </ViewAllButton>
          </SectionHeader>
          
          <NewsGrid>
            {newsData.map((news, index) => (
              <NewsCard 
                key={news.id} 
                $featured={index === 0}
                onClick={() => handleNewsClick(news.id, news.url)}
              >
                <NewsContent>
                  <NewsTitle $featured={index === 0}>{news.title || 'Market Update'}</NewsTitle>
                  <NewsSummary>
                    {news.summary || "Stay informed with the latest market developments and expert analysis..."}
                  </NewsSummary>
                  <NewsMeta>
                    <NewsSource>{news.source || 'News Source'}</NewsSource>
                    <NewsDate>{formatNewsDate(news.datetime)}</NewsDate>
                  </NewsMeta>
                  {index === 0 && <FeaturedBadge>Featured</FeaturedBadge>}
                  <NewsLink>
                    Read Full Story <FaExternalLinkAlt />
                  </NewsLink>
                </NewsContent>
              </NewsCard>
            ))}
          </NewsGrid>
        </NewsSection>

        <FeaturesSection>
          <SectionHeader>
            <SectionTitle>Why Choose CryptoWealth?</SectionTitle>
            <SectionSubtitle>Experience the difference with our premium features</SectionSubtitle>
          </SectionHeader>
          
          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon>
                <FaShieldAlt />
              </FeatureIcon>
              <FeatureTitle>Secure Storage</FeatureTitle>
              <FeatureDescription>
                Multi-signature wallets and cold storage for maximum security with $500M insurance coverage.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>
                <FaRocket />
              </FeatureIcon>
              <FeatureTitle>Lightning Fast</FeatureTitle>
              <FeatureDescription>
                Execute trades in milliseconds with our advanced trading engine. 99.9% uptime guarantee.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>
                <FaStar />
              </FeatureIcon>
              <FeatureTitle>Premium Support</FeatureTitle>
              <FeatureDescription>
                24/7 customer support with dedicated account managers and trading specialists.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <FaChartLine />
              </FeatureIcon>
              <FeatureTitle>Advanced Analytics</FeatureTitle>
              <FeatureDescription>
                Real-time market data, technical indicators, and portfolio performance insights.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </FeaturesSection>

        <CTASection>
          <CTACard>
            <CTAContent>
              <CTATitle>Ready to Start Your Crypto Journey?</CTATitle>
              <CTASubtitle>
                Join millions of investors and start building your portfolio today with zero commission fees for the first month.
              </CTASubtitle>
              <CTAButtons>
                <PrimaryButton $large onClick={handleGetStarted}>
                  <FaRocket style={{ marginRight: '8px' }} />
                  Get Started Free
                </PrimaryButton>
                <SecondaryButton $large onClick={handleDownloadApp}>
                  Download Mobile App
                </SecondaryButton>
              </CTAButtons>
            </CTAContent>
            <CTAVisual>
              <FloatingBitcoin>
                <FaBitcoin />
              </FloatingBitcoin>
              <FloatingEthereum>
                <FaEthereum />
              </FloatingEthereum>
            </CTAVisual>
          </CTACard>
        </CTASection>
      </Container>
    </Wrapper>
  );
};

const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0.00';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  });
};

const formatMarketCap = (marketCap) => {
  if (marketCap === null || marketCap === undefined || isNaN(marketCap)) return '0.00B';
  return (marketCap / 1e9).toFixed(2) + 'B';
};

const formatVolume = (volume) => {
  if (volume === null || volume === undefined || isNaN(volume)) return '0.00M';
  return (volume / 1e6).toFixed(1) + 'M';
};

const formatNewsDate = (dateString) => {
  if (!dateString) return 'Recent';
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return 'Recent';
  }
};

const getCryptoDescription = (symbol) => {
  if (!symbol) return 'A leading cryptocurrency with strong market performance and growing adoption.';
  
  const descriptions = {
    btc: 'Bitcoin continues to dominate as the leading cryptocurrency with strong institutional adoption.',
    eth: 'Ethereum powers the decentralized finance ecosystem with smart contract capabilities.',
    bnb: 'Binance Coin facilitates transactions on the world\'s largest cryptocurrency exchange.',
    ada: 'Cardano focuses on sustainability and scalability through peer-reviewed research.',
    sol: 'Solana offers high-speed transactions for decentralized applications and crypto projects.',
    dot: 'Polkadot enables cross-blockchain transfers of any type of data or asset.'
  };
  return descriptions[symbol.toLowerCase()] || 'A leading cryptocurrency with strong market performance and growing adoption.';
};

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
`;

const gradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const tickerScroll = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const floatBitcoin = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

const floatEthereum = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(-3deg); }
`;

const Wrapper = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.background.primary};
  color: ${({ theme }) => theme.text.primary};
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 1rem;
`;

const LoadingText = styled.p`
  color: ${({ theme }) => theme.text.secondary};
  font-size: 1.1rem;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 1rem;
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.danger};
  font-size: 1.1rem;
  margin-bottom: 1rem;
`;

const RetryButton = styled.button`
  background: ${({ theme }) => theme.gradients.primary};
  border: none;
  padding: 1rem 2rem;
  border-radius: 10px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(67, 97, 238, 0.3);
  }
`;

// Ticker Styles
const TickerContainer = styled.div`
  background: ${({ theme }) => theme.gradients.primary};
  color: white;
  padding: 0.75rem 0;
  overflow: hidden;
  position: relative;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const TickerContent = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  white-space: nowrap;
`;

const TickerLabel = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  padding: 0.4rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  margin-right: 1rem;
  display: flex;
  align-items: center;
`;

const TickerItems = styled.div`
  display: flex;
  gap: 2rem;
  animation: ${tickerScroll} 60s linear infinite;
  
  &:hover {
    animation-play-state: paused;
  }
`;

const TickerItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  font-weight: 500;
`;

const TickerIcon = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  font-size: 1rem;
  
  img {
    width: 16px;
    height: 16px;
    border-radius: 50%;
  }
`;

const TickerIconFallback = styled.div`
  display: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  font-weight: 600;
`;

const TickerSymbol = styled.span`
  font-weight: 600;
`;

const TickerPrice = styled.span`
  font-weight: 500;
`;

const TickerChange = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: ${props => props.$positive ? '#10b981' : '#ef4444'};
`;

const TickerSeparator = styled.div`
  color: rgba(255, 255, 255, 0.5);
`;

// Hero Section
const HeroSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  min-height: 100vh;
  padding: 4rem 0;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 3rem;
    padding: 2rem 0;
  }
`;

const HeroContent = styled.div`
  animation: ${fadeInUp} 0.8s ease-out;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.text.primary};

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const GradientText = styled.span`
  background: ${({ theme }) => theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% 200%;
  animation: ${gradient} 3s ease infinite;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.6;
  margin-bottom: 2.5rem;
  max-width: 500px;

  @media (max-width: 968px) {
    margin: 0 auto 2.5rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 2.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const StatItem = styled.div`
  text-align: left;

  @media (max-width: 968px) {
    text-align: center;
  }
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  background: ${({ theme }) => theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.9rem;
`;

const EmailForm = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  max-width: 500px;

  @media (max-width: 768px) {
    flex-direction: column;
  }

  @media (max-width: 968px) {
    margin: 0 auto 2rem;
  }
`;

const EmailInput = styled.input`
  flex: 1;
  padding: 1rem 1.5rem;
  border: 2px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  background: ${({ theme }) => theme.background.secondary};
  color: ${({ theme }) => theme.text.primary};
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.background.tertiary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.text.secondary};
  }
`;

const CTAButton = styled.button`
  background: ${({ theme }) => theme.gradients.primary};
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(67, 97, 238, 0.3);
  }
`;

const TrustBadges = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 968px) {
    justify-content: center;
  }
`;

const TrustBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ theme }) => theme.background.secondary};
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.border};
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text.secondary};

  svg {
    color: ${({ theme }) => theme.primary};
  }
`;

const HeroVisual = styled.div`
  position: relative;
  animation: ${fadeInUp} 0.8s ease-out 0.2s both;
`;

const AppCard = styled.div`
  background: ${({ theme }) => theme.card.background};
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  max-width: 450px;
  margin-left: auto;
  animation: ${float} 4s ease-in-out infinite;
  box-shadow: ${({ theme }) => theme.shadow};

  @media (max-width: 968px) {
    margin: 0 auto;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const AppTitle = styled.h3`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
  font-weight: 600;
`;

const DownloadButton = styled.button`
  background: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border};
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  color: ${({ theme }) => theme.text.primary};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;

  &:hover {
    background: ${({ theme }) => theme.background.tertiary};
  }
`;

const PortfolioValue = styled.div`
  margin-bottom: 2rem;
`;

const Price = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.text.primary};
`;

const PriceChange = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.$positive ? props.theme.success : props.theme.danger};
`;

const RewardsSection = styled.div`
  background: rgba(67, 97, 238, 0.1);
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid rgba(67, 97, 238, 0.2);
  margin-bottom: 2rem;
`;

const RewardsTitle = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 0.5rem;
`;

const RewardsAmount = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
`;

const LiveCryptoSection = styled.div``;

const LiveCryptoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${({ theme }) => theme.background.secondary};
    border-radius: 8px;
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

const CryptoIconSmall = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;

const LiveCryptoDetails = styled.div`
  flex: 1;
  text-align: left;
`;

const LiveCryptoSymbol = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 0.25rem;
`;

const LiveCryptoFullName = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.text.secondary};
`;

const LiveCryptoPrice = styled.div`
  text-align: right;
`;

const PriceValue = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 0.25rem;
`;

const ViewLink = styled.div`
  opacity: 0;
  transition: all 0.3s ease;
  color: ${({ theme }) => theme.primary};
  font-size: 0.8rem;

  ${LiveCryptoItem}:hover & {
    opacity: 1;
  }
`;

const ViewAllLink = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.primary};
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;
  padding: 0.5rem;
  border-radius: 8px;
  
  &:hover {
    transform: translateX(5px);
    background: ${({ theme }) => theme.background.secondary};
  }
`;

// Section Styles
const Section = styled.section`
  padding: 5rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled.p`
  color: ${({ theme }) => theme.text.secondary};
  font-size: 1.1rem;
  margin-top: 0.5rem;
`;

const ViewAllButton = styled.button`
  background: transparent;
  border: 2px solid ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.primary};
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:hover {
    background: ${({ theme }) => theme.primary};
    color: white;
    transform: translateY(-2px);
  }
`;

// Featured Cryptocurrencies Section
const FeaturedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeaturedCard = styled.div`
  background: ${({ theme }) => theme.card.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: ${({ theme }) => theme.shadow};
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    background: ${({ theme }) => theme.card.hover};
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const CurrencyHighlight = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  background: ${({ theme }) => theme.gradients.secondary};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const CurrencyBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CurrencyIconLarge = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const CurrencyStats = styled.div`
  text-align: left;
`;

const CurrencyNameLarge = styled.div`
  font-weight: 700;
  color: white;
  font-size: 1.3rem;
  margin-bottom: 0.25rem;
`;

const CurrencySymbolLarge = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const PriceLarge = styled.div`
  font-weight: 700;
  color: white;
  font-size: 1.5rem;
`;

const PerformanceIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.$positive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(249, 65, 68, 0.1)'};
  color: ${props => props.$positive ? props.theme.success : props.theme.danger};
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  border: 1px solid ${props => props.$positive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(249, 65, 68, 0.3)'};
`;

const CardContent = styled.div`
  padding: 2rem;
`;

const CardTitle = styled.h3`
  color: ${({ theme }) => theme.text.primary};
  font-size: 1.2rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const CardDescription = styled.p`
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const MarketData = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: ${({ theme }) => theme.background.secondary};
  border-radius: 12px;
`;

const DataItem = styled.div`
  text-align: center;
`;

const Label = styled.div`
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
`;

const Value = styled.div`
  color: ${({ theme }) => theme.text.primary};
  font-weight: 600;
  font-size: 0.9rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const PrimaryButton = styled.button`
  background: ${({ theme }) => theme.gradients.primary};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(67, 97, 238, 0.3);
  }
`;

const SecondaryButton = styled.button`
  background: ${({ theme }) => theme.card.background};
  border: 1px solid ${({ theme }) => theme.border};
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  color: ${({ theme }) => theme.text.primary};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;

  &:hover {
    background: ${({ theme }) => theme.card.hover};
    transform: translateY(-2px);
  }
`;

// Market Overview Section
const MarketOverview = styled(Section)``;

const IndicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const IndexCard = styled.div`
  background: ${({ theme }) => theme.card.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: ${({ theme }) => theme.shadow};
  cursor: pointer;
  position: relative;

  &:hover {
    transform: translateY(-3px);
    background: ${({ theme }) => theme.card.hover};
    border-color: ${({ theme }) => theme.primary};
  }
`;

const IndexName = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 0.5rem;
`;

const IndexPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 0.5rem;
`;

const IndexChange = styled(PriceChange)`
  justify-content: center;
`;

const IndexLink = styled.div`
  margin-top: 1rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.primary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0;
  transition: all 0.3s ease;
  justify-content: center;

  ${IndexCard}:hover & {
    opacity: 1;
  }
`;

// News Section
const NewsSection = styled(Section)``;

const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const NewsCard = styled.div`
  background: ${({ theme }) => theme.card.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: ${({ theme }) => theme.shadow};
  cursor: pointer;
  ${props => props.$featured && `
    grid-column: 1 / -1;
    background: ${props.theme.background.secondary};
    border-color: ${props.theme.primary};
  `}

  &:hover {
    transform: translateY(-3px);
    background: ${({ theme }) => theme.card.hover};
  }
`;

const NewsContent = styled.div`
  position: relative;
`;

const NewsTitle = styled.h3`
  color: ${({ theme }) => theme.text.primary};
  font-size: ${props => props.$featured ? '1.3rem' : '1.1rem'};
  margin-bottom: 1rem;
  line-height: 1.4;
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
  font-size: 0.8rem;
  color: ${({ theme }) => theme.text.secondary};
`;

const NewsSource = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
`;

const NewsDate = styled.span``;

const FeaturedBadge = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  background: ${({ theme }) => theme.gradients.primary};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const NewsLink = styled.div`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.primary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  opacity: 0;
  transition: all 0.3s ease;

  ${NewsCard}:hover & {
    opacity: 1;
  }
`;

// Features Section
const FeaturesSection = styled(Section)`
  border-bottom: none;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.card.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: ${({ theme }) => theme.shadow};

  &:hover {
    transform: translateY(-5px);
    background: ${({ theme }) => theme.card.hover};
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background: ${({ theme }) => theme.gradients.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 1.5rem;
  color: white;
`;

const FeatureTitle = styled.h3`
  color: ${({ theme }) => theme.text.primary};
  font-size: 1.2rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.6;
`;

// CTA Section
const CTASection = styled(Section)`
  border-bottom: none;
  padding: 4rem 0;
`;

const CTACard = styled.div`
  background: ${({ theme }) => theme.gradients.primary};
  border-radius: 24px;
  padding: 4rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(67, 97, 238, 0.3);
`;

const CTAContent = styled.div`
  position: relative;
  z-index: 2;
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CTASubtitle = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const CTAVisual = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  pointer-events: none;
`;

const FloatingBitcoin = styled.div`
  position: absolute;
  top: 20%;
  right: 10%;
  width: 80px;
  height: 80px;
  background: #f59e0b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  animation: ${floatBitcoin} 4s ease-in-out infinite;
  box-shadow: 0 10px 30px rgba(245, 158, 11, 0.4);
`;

const FloatingEthereum = styled.div`
  position: absolute;
  bottom: 20%;
  left: 8%;
  width: 60px;
  height: 60px;
  background: #8b5cf6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  animation: ${floatEthereum} 3s ease-in-out infinite;
  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.4);
`;

export default Home;