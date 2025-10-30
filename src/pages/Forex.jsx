import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Card } from "../components/common/Card";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { forexAPI } from "../services/api";
import {
  FaExchangeAlt,
  FaCalculator,
  FaGlobe,
  FaSyncAlt,
} from "react-icons/fa";

const getCurrencySymbol = (currency) => {
  const symbols = {
    USD: "🇺🇸",
    EUR: "🇪🇺",
    GBP: "🇬🇧",
    JPY: "🇯🇵",
    CAD: "🇨🇦",
    AUD: "🇦🇺",
    CHF: "🇨🇭",
    CNY: "🇨🇳",
    SEK: "🇸🇪",
    NZD: "🇳🇿",
    NOK: "🇳🇴",
    DKK: "🇩🇰",
    SGD: "🇸🇬",
    HKD: "🇭🇰",
    KRW: "🇰🇷",
    INR: "🇮🇳",
    BRL: "🇧🇷",
    RUB: "🇷🇺",
    ZAR: "🇿🇦",
    MXN: "🇲🇽",
  };
  return symbols[currency] || "💵";
};

const getCurrencyName = (currency) => {
  const names = {
    USD: "US Dollar",
    EUR: "Euro",
    GBP: "British Pound",
    JPY: "Japanese Yen",
    CAD: "Canadian Dollar",
    AUD: "Australian Dollar",
    CHF: "Swiss Franc",
    CNY: "Chinese Yuan",
    SEK: "Swedish Krona",
    NZD: "New Zealand Dollar",
  };
  return names[currency] || currency;
};

export const Forex = () => {
  const [forexRates, setForexRates] = useState(null);
  const [majorPairs, setMajorPairs] = useState([]);
  const [converterData, setConverterData] = useState({
    from: "USD",
    to: "EUR",
    amount: 1,
    converted: 0,
    rate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchForexData();
    fetchMajorPairs();
  }, []);

  useEffect(() => {
    if (forexRates) {
      handleConversion();
    }
  }, [converterData.from, converterData.to, converterData.amount, forexRates]);

  const formatRate = (rate) => {
    if (!rate || isNaN(rate) || !isFinite(rate)) return "0.000000";
    return rate.toFixed(6);
  };

  const formatAmount = (amount) => {
    if (!amount || isNaN(amount) || !isFinite(amount)) return "0.00";
    return amount.toFixed(2);
  };

  const getSafeValue = (value, fallback = 0) => {
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

  const fetchForexData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await forexAPI.getForexRates();
      setForexRates(response.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching forex data:", error);
      setError("Failed to fetch exchange rates. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMajorPairs = async () => {
    try {
      const response = await forexAPI.getMajorPairs();
      setMajorPairs(response.data || []);
    } catch (error) {
      console.error("Error fetching major pairs:", error);
      setMajorPairs([]);
    }
  };

  const handleConversion = async () => {
    if (!forexRates) return;

    try {
      const response = await forexAPI.convertCurrency(
        converterData.from,
        converterData.to,
        converterData.amount
      );

      const result = response.data;
      setConverterData((prev) => ({
        ...prev,
        converted: getSafeValue(result.converted_amount),
        rate: getSafeValue(result.rate),
      }));
    } catch (error) {
      console.error("Error converting currency:", error);
      setConverterData((prev) => ({
        ...prev,
        converted: 0,
        rate: 0,
      }));
    }
  };

  const updateConverterField = (field, value) => {
    setConverterData((prev) => ({
      ...prev,
      [field]: field === "amount" ? getSafeValue(parseFloat(value), 0) : value,
    }));
  };

  const handleRefresh = () => {
    fetchForexData();
    fetchMajorPairs();
  };

  if (loading && !forexRates) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Grid>
        <ConverterCard>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <ConverterTitle>
              <FaCalculator />
              Currency Converter
            </ConverterTitle>
            <RefreshButton onClick={handleRefresh} title="Refresh rates">
              <FaSyncAlt />
              Refresh
            </RefreshButton>
          </div>

          <InputGroup>
            <CurrencyInput
              type="number"
              value={converterData.amount}
              onChange={(e) => updateConverterField("amount", e.target.value)}
              min="0"
              step="0.01"
              placeholder="0.00"
            />
            <CurrencySelect
              value={converterData.from}
              onChange={(e) => updateConverterField("from", e.target.value)}
            >
              {forexRates &&
                Object.keys(forexRates.rates || {}).map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
            </CurrencySelect>
          </InputGroup>

          <ExchangeIcon>
            <FaExchangeAlt />
          </ExchangeIcon>

          <InputGroup>
            <CurrencyInput
              type="number"
              value={formatAmount(converterData.converted)}
              readOnly
              style={{ background: "rgba(255, 255, 255, 0.7)" }}
              placeholder="0.00"
            />
            <CurrencySelect
              value={converterData.to}
              onChange={(e) => updateConverterField("to", e.target.value)}
            >
              {forexRates &&
                Object.keys(forexRates.rates || {}).map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
            </CurrencySelect>
          </InputGroup>

          <ExchangeRate>
            <RateText>Exchange Rate</RateText>
            <RateValue>
              1 {converterData.from} = {formatRate(converterData.rate)}{" "}
              {converterData.to}
            </RateValue>
            {lastUpdated && (
              <LastUpdated>
                Updated: {lastUpdated.toLocaleTimeString()}
              </LastUpdated>
            )}
          </ExchangeRate>
        </ConverterCard>

        <Card>
          <ConverterTitle style={{ color: "inherit", marginBottom: "1rem" }}>
            <FaGlobe />
            Major Forex Pairs
          </ConverterTitle>

          {majorPairs.length > 0 ? (
            <PairsGrid>
              {majorPairs.slice(0, 6).map((pair) => (
                <PairCard key={pair.pair} hover>
                  <PairName>{pair.pair}</PairName>
                  <PairRate>{formatRate(getSafeValue(pair.rate))}</PairRate>
                  {pair.change && (
                    <PairChange $positive={getSafeValue(pair.change) > 0}>
                      {getSafeValue(pair.change) > 0 ? "+" : ""}
                      {getSafeValue(pair.change).toFixed(4)}
                    </PairChange>
                  )}
                </PairCard>
              ))}
            </PairsGrid>
          ) : (
            <EmptyState>No major pairs data available</EmptyState>
          )}
        </Card>
      </Grid>

      {forexRates && (
        <Card style={{ marginTop: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <ConverterTitle style={{ color: "inherit", margin: 0 }}>
              <FaGlobe />
              All Exchange Rates
            </ConverterTitle>
            <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
              Base: {forexRates.base || "USD"}
            </div>
          </div>

          <RatesTable>
            <thead>
              <tr>
                <TableHeader>Currency</TableHeader>
                <TableHeader>Name</TableHeader>
                <TableHeader>Exchange Rate</TableHeader>
              </tr>
            </thead>
            <tbody>
              {Object.entries(forexRates.rates || {})
                .slice(0, 20)
                .map(([currency, rate]) => (
                  <tr key={currency}>
                    <TableCell>
                      <CurrencyFlag>{getCurrencySymbol(currency)}</CurrencyFlag>
                      {currency}
                    </TableCell>
                    <TableCell
                      style={{ fontSize: "0.85rem", color: "#64748b" }}
                    >
                      {getCurrencyName(currency)}
                    </TableCell>
                    <TableCell
                      style={{ fontWeight: 600, fontFamily: "monospace" }}
                    >
                      {formatRate(getSafeValue(rate))}
                    </TableCell>
                  </tr>
                ))}
            </tbody>
          </RatesTable>

          {Object.keys(forexRates.rates || {}).length > 20 && (
            <div
              style={{
                textAlign: "center",
                marginTop: "1rem",
                fontSize: "0.85rem",
                color: "#64748b",
              }}
            >
              Showing 20 of {Object.keys(forexRates.rates || {}).length}{" "}
              currencies
            </div>
          )}
        </Card>
      )}
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

const ConverterCard = styled(Card)`
  background: ${({ theme }) => theme.gradients.primary};
  color: white;
  position: relative;
  overflow: hidden;
`;

const ConverterTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const CurrencyInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  font-weight: 600;
  text-align: right;

  &:focus {
    outline: none;
    background: white;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
  }
`;

const CurrencySelect = styled.select`
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  font-weight: 600;
  min-width: 90px;
  cursor: pointer;

  &:focus {
    outline: none;
    background: white;
  }
`;

const ExchangeIcon = styled.div`
  text-align: center;
  margin: 0.5rem 0;
  font-size: 1.2rem;
  opacity: 0.8;
`;

const ExchangeRate = styled.div`
  text-align: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
`;

const RateText = styled.p`
  font-size: 0.85rem;
  opacity: 0.9;
  margin-bottom: 0.4rem;
`;

const RateValue = styled.p`
  font-size: 1.2rem;
  font-weight: 700;
`;

const PairsGrid = styled.div`
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
`;

const PairCard = styled(Card)`
  text-align: center;
  padding: 1.25rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const PairName = styled.h4`
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: ${({ theme }) => theme.text.primary};
  font-size: 0.9rem;
`;

const PairRate = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
  color: ${({ theme }) => theme.primary};
`;

const PairChange = styled.div`
  font-size: 0.8rem;
  color: ${({ theme, $positive }) =>
    $positive ? theme.success : theme.danger};
  font-weight: 600;
`;

const RatesTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 0.75rem;
  border-bottom: 2px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 600;
  font-size: 0.85rem;
`;

const TableCell = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  font-size: 0.9rem;
`;

const CurrencyFlag = styled.span`
  font-size: 1.1rem;
  margin-right: 0.5rem;
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 6px;
  text-align: center;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const LastUpdated = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.text.secondary};
  margin-top: 0.25rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.9rem;
`;
