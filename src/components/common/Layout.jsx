import React from "react";
import styled from "styled-components";
import { Header } from "./Header";

export const Layout = ({ children, theme, toggleTheme }) => {
  return (
    <LayoutContainer>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <MainContent>{children}</MainContent>
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.background.primary};
  color: ${({ theme }) => theme.text.primary};
  transition: all 0.3s ease;
`;

const MainContent = styled.main`
  min-height: calc(100vh - 70px);
  padding-top: 0;
`;

export default Layout;
