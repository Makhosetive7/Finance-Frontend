import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaCoins, 
  FaChartLine, 
  FaExchangeAlt, 
  FaNewspaper, 
  FaMoon, 
  FaSun,
  FaHome 
} from 'react-icons/fa';

const HeaderContainer = styled.header`
  background: ${({ theme }) => theme.background.secondary};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  
  &:hover {
    color: ${({ theme }) => theme.primaryHover};
    transform: translateY(-1px);
  }
  
  transition: all 0.3s ease;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;

  @media (max-width: 768px) {
    gap: 0.25rem;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  color: ${({ theme, $isActive }) => 
    $isActive ? theme.primary : theme.text.secondary};
  background: ${({ theme, $isActive }) => 
    $isActive ? theme.background.tertiary : 'transparent'};
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.background.tertiary};
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
    span {
      display: none;
    }
  }
`;

const ThemeToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  border-radius: 8px;
  background: ${({ theme }) => theme.background.tertiary};
  color: ${({ theme }) => theme.text.secondary};
  transition: all 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.card.hover};
    transform: translateY(-1px);
  }
`;

export const Header = ({ theme, toggleTheme }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: FaHome, label: 'Dashboard' },
    { path: '/crypto', icon: FaCoins, label: 'Crypto' },
    { path: '/stocks', icon: FaChartLine, label: 'Stocks' },
    { path: '/forex', icon: FaExchangeAlt, label: 'Forex' },
    { path: '/news', icon: FaNewspaper, label: 'News' },
  ];

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">
          <FaCoins />
          <span>FinanceHub</span>
        </Logo>
        
        <NavLinks>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink 
                key={item.path} 
                to={item.path}
                $isActive={isActive}
                title={item.label}
              >
                <Icon />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
          
          <ThemeToggle onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </ThemeToggle>
        </NavLinks>
      </Nav>
    </HeaderContainer>
  );
};