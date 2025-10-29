import React from 'react';
import styled from 'styled-components';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background: ${({ theme }) => theme.background.secondary};
  border-top: 1px solid ${({ theme }) => theme.border};
  padding: 2rem 0;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.9rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 8px;
  background: ${({ theme }) => theme.background.tertiary};
  color: ${({ theme }) => theme.text.secondary};
  transition: all 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.card.hover};
    transform: translateY(-2px);
  }
`;

export const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <Copyright>
          © 2024 FinanceHub. Built with multiple financial APIs.
        </Copyright>
        
        <SocialLinks>
          <SocialLink href="https://github.com" target="_blank" rel="noopener noreferrer">
            <FaGithub />
          </SocialLink>
          <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </SocialLink>
          <SocialLink href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </SocialLink>
        </SocialLinks>
      </FooterContent>
    </FooterContainer>
  );
};