import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styled, { keyframes, css } from "styled-components";
import {
  FaCoins,
  FaExchangeAlt,
  FaNewspaper,
  FaMoon,
  FaSun,
  FaHome,
  FaRocket,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { MdOutlineTrendingUp } from "react-icons/md";

export const Header = ({ theme: currentTheme, toggleTheme }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [justToggled, setJustToggled] = useState(false);
  const [marketTrend, setMarketTrend] = useState({
    positive: true,
    change: 1.8,
  });

  const navItems = [
    { path: "/", icon: FaHome, label: "Dashboard" },
    { path: "/crypto", icon: FaCoins, label: "Crypto" },
    { path: "/stocks", icon: MdOutlineTrendingUp, label: "Stocks" },
    { path: "/forex", icon: FaExchangeAlt, label: "Forex" },
    { path: "/news", icon: FaNewspaper, label: "News" },
  ];

  const handleThemeToggle = () => {
    console.log("Theme toggle clicked - Current theme:", currentTheme);
    if (toggleTheme) {
      toggleTheme();
      setJustToggled(true);
      setTimeout(() => setJustToggled(false), 600);
    } else {
      console.warn("toggleTheme function not provided");
    }
  };

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    closeMenu();
  }, [location]);

  // Simulate market data changes
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketTrend({
        positive: Math.random() > 0.3,
        change: (Math.random() * 3).toFixed(1),
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <HeaderContainer>
        <Nav>
          <LogoSection to="/">
            <LogoIcon>
              <FaRocket />
            </LogoIcon>
            <LogoText>
              <LogoMain>CryptoWealth</LogoMain>
              <LogoTagline>Invest Smart</LogoTagline>
            </LogoText>
          </LogoSection>

          <NavLinks $isOpen={isMenuOpen}>
            <CloseButton onClick={closeMenu}>
              <FaTimes />
            </CloseButton>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink key={item.path} to={item.path} $isActive={isActive}>
                  <NavIcon>
                    <Icon />
                  </NavIcon>
                  <NavLabel>{item.label}</NavLabel>
                </NavLink>
              );
            })}
          </NavLinks>

          <ActionsSection>
            <MarketIndicator $positive={marketTrend.positive}>
              <MdOutlineTrendingUp />
              <span>
                {marketTrend.positive ? "+" : ""}
                {marketTrend.change}%
              </span>
            </MarketIndicator>

            <ThemeToggle
              onClick={handleThemeToggle}
              title={`Switch to ${
                currentTheme === "dark" ? "light" : "dark"
              } mode`}
              $justToggled={justToggled}
            >
              {currentTheme === "dark" ? <FaSun /> : <FaMoon />}
            </ThemeToggle>

            <MobileMenuButton
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              title="Toggle menu"
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </MobileMenuButton>
          </ActionsSection>
        </Nav>
      </HeaderContainer>

      <Overlay $isOpen={isMenuOpen} onClick={closeMenu} />
    </>
  );
};

const slideDown = keyframes`
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
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const HeaderContainer = styled.header`
  background: ${({ theme }) => theme.background.secondary};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
  animation: ${slideDown} 0.3s ease-out;
  height: 70px;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    height: 65px;
    padding: 0.75rem 0;
  }
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 2rem;

  @media (max-width: 768px) {
    padding: 0 1rem;
    gap: 1rem;
  }
`;

const LogoSection = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    transform: translateY(-1px);
  }
`;

const LogoIcon = styled.div`
  width: 36px;
  height: 36px;
  background: ${({ theme }) => theme.gradients.primary};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
`;

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.2;
`;

const LogoMain = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  letter-spacing: -0.5px;
`;

const LogoTagline = styled.div`
  font-size: 0.6rem;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 500;
  letter-spacing: 0.3px;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 0.25rem;
  align-items: center;
  flex: 1;
  justify-content: center;

  @media (max-width: 1024px) {
    position: fixed;
    top: 0;
    right: ${(props) => (props.$isOpen ? "0" : "-100%")};
    width: 260px;
    height: 100vh;
    background: ${({ theme }) => theme.background.primary};
    flex-direction: column;
    padding: 2rem 1.5rem;
    box-shadow: -2px 0 20px rgba(0, 0, 0, 0.1);
    transition: right 0.3s ease;
    gap: 0.5rem;
    justify-content: flex-start;
    padding-top: 70px;
    z-index: 1001;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9rem;
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.primary : theme.text.secondary};
  background: ${({ theme, $isActive }) =>
    $isActive ? theme.background.tertiary : "transparent"};
  border: ${({ theme, $isActive }) =>
    $isActive ? `1px solid ${theme.primary}15` : "1px solid transparent"};
  transition: all 0.2s ease;
  white-space: nowrap;
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.background.tertiary};
    transform: translateY(-1px);
  }

  @media (max-width: 1024px) {
    width: 100%;
    justify-content: flex-start;
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
  }
`;

const NavIcon = styled.div`
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
`;

const NavLabel = styled.span`
  @media (max-width: 1024px) {
    display: block;
  }
`;

const ActionsSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;

  @media (max-width: 1024px) {
    gap: 0.25rem;
  }
`;

const ThemeToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 6px;
  background: ${({ theme }) => theme.background.tertiary};
  color: ${({ theme }) => theme.text.secondary};
  border: 1px solid ${({ theme }) => theme.border};
  transition: all 0.2s ease;
  font-size: 0.9rem;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.card.hover};
    transform: scale(1.05);
  }

  ${(props) =>
    props.$justToggled &&
    css`
      animation: ${pulse} 0.6s ease;
    `}
`;

const MobileMenuButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 6px;
  background: ${({ theme }) => theme.background.tertiary};
  color: ${({ theme }) => theme.text.primary};
  border: 1px solid ${({ theme }) => theme.border};
  transition: all 0.2s ease;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.card.hover};
  }

  @media (max-width: 1024px) {
    display: flex;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem;
  border-radius: 6px;
  background: ${({ theme }) => theme.background.tertiary};
  color: ${({ theme }) => theme.text.primary};
  border: 1px solid ${({ theme }) => theme.border};
  transition: all 0.2s ease;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.card.hover};
  }

  @media (min-width: 1025px) {
    display: none;
  }
`;

const MarketIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  background: ${({ theme }) => theme.background.tertiary};
  border: 1px solid
    ${({ theme, $positive }) =>
      $positive ? "rgba(16, 185, 129, 0.2)" : theme.border};
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme, $positive }) =>
    $positive ? theme.success : theme.danger};

  @media (max-width: 768px) {
    display: none;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
  z-index: 999;
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
  transition: all 0.3s ease;

  @media (min-width: 1025px) {
    display: none;
  }
`;

export default Header;
