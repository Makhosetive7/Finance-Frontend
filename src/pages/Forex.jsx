import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card } from '../components/common/Card';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { forexAPI } from '../services/api';
import { FaExchangeAlt, FaCalculator, FaGlobe } from 'react-icons/fa';

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

const ConverterCard = styled(Card)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const ConverterTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  color: white;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
`;

const CurrencyInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  font-weight: 600;
  text-align: right;

  &:focus {
    outline: none;
    background: white;
  }
`;

const CurrencySelect = styled.select`
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  font-weight: 600;
  min-width: 100px;

  &:focus {
    outline: none;
    background: white;
  }
`;

const ExchangeRate = styled.div`
  text-align: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
`;

const RateText = styled.p`
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
`;

const RateValue = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
`;

const PairsGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`;

const PairCard = styled(Card)`
  text-align: center;
  padding: 1.5rem;
`;

const PairName = styled.h4`
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.text.primary};
`;

const PairRate = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.primary};
`;

const RatesTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 1rem;
  border-bottom: 2px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 600;
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const CurrencyFlag = styled.span`
  font-size: 1.2rem;
  margin-right: 0.5rem;
`;

const getCurrencySymbol = (currency) => {
  const symbols = {
    USD: '🇺🇸',
    EUR: '🇪🇺',
    GBP: '🇬🇧',
    JPY: '🇯🇵',
    CAD: '🇨🇦',
    AUD: '🇦🇺',
    CHF: '🇨🇭',
    CNY: '🇨🇳',
    SEK: '🇸🇪',
    NZD: '🇳🇿'
  };
  return symbols[currency] || '💵';
};

export const Forex = () => {
  const [forexRates, setForexRates] = useState(null);
  const [majorPairs, setMajorPairs] = useState([]);
  const [converterData, setConverterData] = useState({
    from: 'USD',
    to: 'EUR',
    amount: 1,
    converted: 0,
    rate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForexData();
    fetchMajorPairs();
  }, []);

  useEffect(() => {
    if (forexRates) {
      handleConversion();
    }
  }, [converterData.from, converterData.to, converterData.amount, forexRates]);

  const fetchForexData = async () => {
    try {
      setLoading(true);
      const response = await forexAPI.getForexRates();
      setForexRates(response.data);
    } catch (error) {
      console.error('Error fetching forex data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMajorPairs = async () => {
    try {
      const response = await forexAPI.getMajorPairs();
      setMajorPairs(response.data);
    } catch (error) {
      console.error('Error fetching major pairs:', error);
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
      setConverterData(prev => ({
        ...prev,
        converted: result.converted_amount,
        rate: result.rate
      }));
    } catch (error) {
      console.error('Error converting currency:', error);
    }
  };

  const updateConverterField = (field, value) => {
    setConverterData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <Grid>
        <ConverterCard>
          <ConverterTitle>
            <FaCalculator />
            Currency Converter
          </ConverterTitle>
          
          <InputGroup>
            <CurrencyInput
              type="number"
              value={converterData.amount}
              onChange={(e) => updateConverterField('amount', parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
            />
            <CurrencySelect
              value={converterData.from}
              onChange={(e) => updateConverterField('from', e.target.value)}
            >
              {forexRates && Object.keys(forexRates.rates).map(currency => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </CurrencySelect>
          </InputGroup>

          <div style={{ textAlign: 'center', margin: '1rem 0', fontSize: '1.5rem' }}>
            <FaExchangeAlt />
          </div>

          <InputGroup>
            <CurrencyInput
              type="number"
              value={converterData.converted}
              readOnly
              style={{ background: 'rgba(255, 255, 255, 0.7)' }}
            />
            <CurrencySelect
              value={converterData.to}
              onChange={(e) => updateConverterField('to', e.target.value)}
            >
              {forexRates && Object.keys(forexRates.rates).map(currency => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </CurrencySelect>
          </InputGroup>

          <ExchangeRate>
            <RateText>Exchange Rate</RateText>
            <RateValue>1 {converterData.from} = {converterData.rate?.toFixed(6)} {converterData.to}</RateValue>
          </ExchangeRate>
        </ConverterCard>

        <Card title="Major Forex Pairs">
          <PairsGrid>
            {majorPairs.map((pair) => (
              <PairCard key={pair.pair} hover>
                <PairName>{pair.pair}</PairName>
                <PairRate>{pair.rate?.toFixed(4)}</PairRate>
                <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                  Last updated
                </div>
              </PairCard>
            ))}
          </PairsGrid>
        </Card>
      </Grid>

      {forexRates && (
        <Card title="All Exchange Rates" style={{ marginTop: '2rem' }}>
          <ConverterTitle style={{ color: 'inherit' }}>
            <FaGlobe />
            Base Currency: {forexRates.base}
          </ConverterTitle>
          
          <RatesTable>
            <thead>
              <tr>
                <TableHeader>Currency</TableHeader>
                <TableHeader>Symbol</TableHeader>
                <TableHeader>Exchange Rate</TableHeader>
              </tr>
            </thead>
            <tbody>
              {Object.entries(forexRates.rates).map(([currency, rate]) => (
                <tr key={currency}>
                  <TableCell>
                    <CurrencyFlag>
                      {getCurrencySymbol(currency)}
                    </CurrencyFlag>
                    {currency}
                  </TableCell>
                  <TableCell>{currency}</TableCell>
                  <TableCell style={{ fontWeight: 600 }}>
                    {rate.toFixed(6)}
                  </TableCell>
                </tr>
              ))}
            </tbody>
          </RatesTable>
        </Card>
      )}
    </Container>
  );
};