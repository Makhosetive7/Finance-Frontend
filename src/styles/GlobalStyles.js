import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    background: ${({ theme }) => theme.background.primary};
    color: ${({ theme }) => theme.text.primary};
    line-height: 1.6;
    transition: all 0.3s ease;
  }

  #root {
    min-height: 100vh;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    border: none;
    outline: none;
    cursor: pointer;
    font-family: inherit;
  }

  input {
    border: none;
    outline: none;
    font-family: inherit;
  }

  /* Scrollbar Styling */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.background.secondary};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.border};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.primary};
  }
`;

export const lightTheme = {
  primary: "#4361ee",
  primaryHover: "#3a56d4",
  secondary: "#9D4EDD",
  success: "#10b981",
  danger: "#f94144",
  warning: "#f59e0b",

  background: {
    primary: "#ffffff",
    secondary: "#f8fafc",
    tertiary: "#f1f5f9",
    gradient: "linear-gradient(135deg, #4361ee 0%, #9D4EDD 100%)",
  },

  text: {
    primary: "#10002B",
    secondary: "#3C096C",
    inverse: "#ffffff",
  },

  border: "#e2e8f0",
  shadow:
    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",

  card: {
    background: "#ffffff",
    hover: "#f8fafc",
  },

  gradients: {
    primary: "linear-gradient(135deg, #4361ee 0%, #9D4EDD 100%)",
    secondary: "linear-gradient(135deg, #3C096C 0%, #10002B 100%)",
    success: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    danger: "linear-gradient(135deg, #f94144 0%, #dc2626 100%)",
  },
};
