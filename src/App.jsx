import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import { lightTheme, darkTheme } from './styles/theme';
import { useTheme } from './hooks/useTheme';
import { Layout } from './components/common/Layout';
import { Home } from './pages/Home';
import { Crypto } from './pages/Crypto';
import { Stocks } from './pages/Stocks';
import { Forex } from './pages/Forex';
import { News } from './pages/News';

function App() {
  const { isDark, toggleTheme } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <Layout theme={isDark ? 'dark' : 'light'} toggleTheme={toggleTheme}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/crypto" element={<Crypto />} />
            <Route path="/stocks" element={<Stocks />} />
            <Route path="/forex" element={<Forex />} />
            <Route path="/news" element={<News />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;