import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';

const ChartContainer = styled.div`
  width: 100%;
  height: 300px;
  margin-top: 1rem;
`;

const CustomTooltip = styled.div`
  background: ${({ theme }) => theme.card.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 1rem;
  box-shadow: ${({ theme }) => theme.shadow};
`;

export const PriceChart = ({ data, dataKey = 'price', color = '#2563eb' }) => {
  const formatData = (rawData) => {
    if (!rawData || !rawData.prices) return [];
    
    return rawData.prices.map(([timestamp, price]) => ({
      timestamp,
      price: price,
      date: new Date(timestamp).toLocaleDateString()
    }));
  };

  const chartData = formatData(data);

  const CustomTooltipContent = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <CustomTooltip>
          <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
            {new Date(label).toLocaleDateString()}
          </p>
          <p style={{ color }}>
            Price: ${payload[0].value.toLocaleString()}
          </p>
        </CustomTooltip>
      );
    }
    return null;
  };

  if (!chartData.length) {
    return (
      <ChartContainer>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          color: '#64748b'
        }}>
          No chart data available
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date"
            tick={{ fill: '#64748b' }}
            axisLine={{ stroke: '#374151' }}
          />
          <YAxis 
            tick={{ fill: '#64748b' }}
            axisLine={{ stroke: '#374151' }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip content={<CustomTooltipContent />} />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, stroke: color, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};