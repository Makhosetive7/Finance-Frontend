import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import { FaSearch, FaTimes, FaFilter, FaSlidersH } from "react-icons/fa";

export const SearchBar = ({
  value,
  onChange,
  placeholder = "Search cryptocurrencies, stocks, forex...",
  onSearch,
  showButton = true,
  showFilters = true,
  loading = false,
  className,
}) => {
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filters, setFilters] = useState({
    type: "all",
    market: "all",
    change: "all",
  });
  const containerRef = useRef(null);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && onSearch) {
      onSearch();
    }
  };

  const handleClear = () => {
    onChange("");
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion);
    if (onSearch) {
      onSearch();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowFilterPanel(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const quickSuggestions = ["BTC", "ETH", "AAPL", "TSLA", "EUR/USD"];
  const assetTypes = [
    { value: "all", label: "All Assets" },
    { value: "crypto", label: "Cryptocurrency" },
    { value: "stock", label: "Stocks" },
    { value: "forex", label: "Forex" },
  ];

  const marketFilters = [
    { value: "all", label: "All Markets" },
    { value: "gainers", label: "Top Gainers" },
    { value: "losers", label: "Top Losers" },
    { value: "volume", label: "High Volume" },
  ];

  return (
    <SearchContainer
      ref={containerRef}
      $expanded={showFilterPanel}
      className={className}
    >
      <SearchWrapper>
        <SearchInput
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          $searching={loading}
        />

        <ClearButton
          $visible={value.length > 0}
          onClick={handleClear}
          title="Clear search"
        >
          <FaTimes />
        </ClearButton>

        <SearchIcon>
          <FaSearch />
        </SearchIcon>

        {showFilters && (
          <FilterPanel $show={showFilterPanel}>
            <FilterSection>
              <FilterTitle>Asset Type</FilterTitle>
              <FilterOptions>
                {assetTypes.map((type) => (
                  <FilterOption
                    key={type.value}
                    $active={filters.type === type.value}
                    onClick={() => handleFilterChange("type", type.value)}
                  >
                    {type.label}
                  </FilterOption>
                ))}
              </FilterOptions>
            </FilterSection>

            <FilterSection>
              <FilterTitle>Market Filters</FilterTitle>
              <FilterOptions>
                {marketFilters.map((filter) => (
                  <FilterOption
                    key={filter.value}
                    $active={filters.market === filter.value}
                    onClick={() => handleFilterChange("market", filter.value)}
                  >
                    {filter.label}
                  </FilterOption>
                ))}
              </FilterOptions>
            </FilterSection>

            <FilterSection>
              <FilterTitle>Quick Search</FilterTitle>
              <QuickSuggestions>
                {quickSuggestions.map((suggestion) => (
                  <Suggestion
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </Suggestion>
                ))}
              </QuickSuggestions>
            </FilterSection>
          </FilterPanel>
        )}
      </SearchWrapper>

      {showFilters && (
        <FilterButton
          onClick={() => setShowFilterPanel(!showFilterPanel)}
          $active={showFilterPanel}
          title="Search filters"
        >
          <FaSlidersH />
        </FilterButton>
      )}

      {showButton && (
        <SearchButton onClick={onSearch} disabled={loading || !value.trim()}>
          {loading ? (
            <>
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  border: "2px solid transparent",
                  borderTop: "2px solid white",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              />
              Searching...
            </>
          ) : (
            <>
              <FaSearch />
              Search
            </>
          )}
        </SearchButton>
      )}
    </SearchContainer>
  );
};

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(67, 97, 238, 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(67, 97, 238, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(67, 97, 238, 0);
  }
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  max-width: 600px;
  width: 100%;
  position: relative;
  animation: ${slideIn} 0.3s ease-out;

  ${(props) =>
    props.$expanded &&
    css`
      max-width: 800px;
    `}

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const SearchWrapper = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 3rem 1rem 1rem;
  border: 2px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  background: ${({ theme }) => theme.background.primary};
  color: ${({ theme }) => theme.text.primary};
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 4px 20px rgba(67, 97, 238, 0.15);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: ${({ theme }) => theme.text.secondary};
    font-weight: 400;
  }

  ${(props) =>
    props.$searching &&
    css`
      animation: ${pulse} 2s infinite;
    `}
`;

const SearchIcon = styled.div`
  position: absolute;
  right: 1rem;
  color: ${({ theme }) => theme.text.secondary};
  font-size: 1rem;
  transition: all 0.3s ease;
  pointer-events: none;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 3rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  display: ${(props) => (props.$visible ? "flex" : "none")};
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${({ theme }) => theme.danger};
    background: ${({ theme }) => theme.background.tertiary};
  }
`;

const SearchButton = styled.button`
  padding: 1rem 1.5rem;
  background: ${({ theme }) => theme.gradients.primary};
  color: white;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  border: none;
  box-shadow: 0 4px 15px rgba(67, 97, 238, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(67, 97, 238, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 2px 10px rgba(67, 97, 238, 0.2);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const FilterButton = styled.button`
  padding: 1rem;
  background: ${({ theme }) => theme.background.tertiary};
  color: ${({ theme }) => theme.text.secondary};
  border: 2px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;

  &:hover {
    color: ${({ theme }) => theme.primary};
    border-color: ${({ theme }) => theme.primary};
    transform: translateY(-1px);
  }

  ${(props) =>
    props.$active &&
    css`
      color: ${({ theme }) => theme.primary};
      border-color: ${({ theme }) => theme.primary};
      background: rgba(67, 97, 238, 0.1);
    `}
`;

const FilterPanel = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.background.primary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 0.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  z-index: 100;
  animation: ${slideIn} 0.3s ease-out;
  display: ${(props) => (props.$show ? "block" : "none")};
`;

const FilterSection = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterTitle = styled.h4`
  color: ${({ theme }) => theme.text.primary};
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FilterOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const FilterOption = styled.button`
  padding: 0.5rem 1rem;
  background: ${({ theme, $active }) =>
    $active ? theme.primary : theme.background.tertiary};
  color: ${({ theme, $active }) => ($active ? "white" : theme.text.secondary)};
  border: 1px solid
    ${({ theme, $active }) => ($active ? theme.primary : theme.border)};
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: ${({ theme, $active }) =>
      $active ? theme.primaryHover : theme.background.secondary};
    transform: translateY(-1px);
  }
`;

const QuickSuggestions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

const Suggestion = styled.button`
  padding: 0.4rem 0.8rem;
  background: ${({ theme }) => theme.background.tertiary};
  color: ${({ theme }) => theme.text.secondary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 16px;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.primary};
    border-color: ${({ theme }) => theme.primary};
    transform: translateY(-1px);
  }
`;
