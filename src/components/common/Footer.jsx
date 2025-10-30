import React from "react";
import styled from "styled-components";
import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaDiscord,
  FaShieldAlt,
  FaRocket,
  FaAward,
  FaGlobe,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { SiBinance, SiCoinbase } from "react-icons/si";

export const Footer = () => {
  return (
    <FooterContainer>
      <FooterMain>
        <BrandSection>
          <Logo>
            <LogoIcon>
              <FaRocket />
            </LogoIcon>
            <LogoText>CryptoWealth</LogoText>
          </Logo>
          <Tagline>
            Your gateway to the future of finance. Trade cryptocurrencies,
            stocks, and forex with institutional-grade security and
            lightning-fast execution.
          </Tagline>
          <Features>
            <Feature>
              <FaShieldAlt />
              <span>Secure</span>
            </Feature>
            <Feature>
              <FaRocket />
              <span>Fast</span>
            </Feature>
            <Feature>
              <FaAward />
              <span>Trusted</span>
            </Feature>
          </Features>
        </BrandSection>

        <FooterSection>
          <SectionTitle>Products</SectionTitle>
          <FooterLinks>
            <FooterLink href="/crypto">Cryptocurrency Trading</FooterLink>
            <FooterLink href="/stocks">Stock Market</FooterLink>
            <FooterLink href="/forex">Forex Trading</FooterLink>
            <FooterLink href="/wallet">Digital Wallet</FooterLink>
            <FooterLink href="/staking">Staking & Rewards</FooterLink>
            <FooterLink href="/api">API Access</FooterLink>
          </FooterLinks>
        </FooterSection>

        <FooterSection>
          <SectionTitle>Company</SectionTitle>
          <FooterLinks>
            <FooterLink href="/about">About Us</FooterLink>
            <FooterLink href="/careers">Careers</FooterLink>
            <FooterLink href="/blog">Blog</FooterLink>
            <FooterLink href="/press">Press</FooterLink>
            <FooterLink href="/partners">Partners</FooterLink>
            <FooterLink href="/legal">Legal</FooterLink>
          </FooterLinks>
        </FooterSection>

        <FooterSection>
          <SectionTitle>Connect</SectionTitle>
          <ContactInfo>
            <ContactItem>
              <FaEnvelope />
              <span>support@cryptowealth.com</span>
            </ContactItem>
            <ContactItem>
              <FaPhone />
              <span>+1 (555) 123-4567</span>
            </ContactItem>
            <ContactItem>
              <FaMapMarkerAlt />
              <span>New York, NY 10001</span>
            </ContactItem>
          </ContactInfo>

          <SocialSection>
            <SectionTitle>Follow Us</SectionTitle>
            <SocialLinks>
              <SocialLink
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Twitter"
              >
                <FaTwitter />
              </SocialLink>
              <SocialLink
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
              >
                <FaGithub />
              </SocialLink>
              <SocialLink
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
              >
                <FaLinkedin />
              </SocialLink>
              <SocialLink
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Discord"
              >
                <FaDiscord />
              </SocialLink>
            </SocialLinks>

            <PartnerLogos>
              <PartnerLogo title="Binance Partner">
                <SiBinance />
              </PartnerLogo>
              <PartnerLogo title="Coinbase Partner">
                <SiCoinbase />
              </PartnerLogo>
            </PartnerLogos>
          </SocialSection>
        </FooterSection>
      </FooterMain>

      <FooterBottom>
        <BottomContent>
          <Copyright>
            © 2024 CryptoWealth. All rights reserved. Built with multiple
            financial APIs.
          </Copyright>

          <LegalLinks>
            <LegalLink href="/privacy">Privacy Policy</LegalLink>
            <LegalLink href="/terms">Terms of Service</LegalLink>
            <LegalLink href="/cookies">Cookie Policy</LegalLink>
            <LegalLink href="/security">Security</LegalLink>
            <LegalLink href="/compliance">Compliance</LegalLink>
          </LegalLinks>

          <SecurityBadge>
            <FaShieldAlt />
            <span>Bank-Level Security</span>
          </SecurityBadge>
        </BottomContent>
      </FooterBottom>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background: ${({ theme }) => theme.background.secondary};
  border-top: 1px solid ${({ theme }) => theme.border};
  margin-top: auto;
`;

const FooterMain = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem 2rem;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 3rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    padding: 2rem 1.5rem 1.5rem;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
`;

const BrandSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;

  @media (max-width: 640px) {
    justify-content: center;
  }
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.gradients.primary};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.1rem;
`;

const LogoText = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  background: ${({ theme }) => theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Tagline = styled.p`
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.9rem;
  line-height: 1.5;
  max-width: 300px;
`;

const Features = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.text.secondary};
  background: ${({ theme }) => theme.background.tertiary};
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.border};
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionTitle = styled.h3`
  color: ${({ theme }) => theme.text.primary};
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FooterLink = styled.a`
  color: ${({ theme }) => theme.text.secondary};
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: ${({ theme }) => theme.primary};
    transform: translateX(5px);
  }

  @media (max-width: 640px) {
    justify-content: center;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.9rem;

  @media (max-width: 640px) {
    justify-content: center;
  }
`;

const SocialSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  border-radius: 10px;
  background: ${({ theme }) => theme.background.tertiary};
  color: ${({ theme }) => theme.text.secondary};
  border: 1px solid ${({ theme }) => theme.border};
  transition: all 0.3s ease;
  font-size: 1.1rem;

  &:hover {
    color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.card.hover};
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(67, 97, 238, 0.2);
  }
`;

const PartnerLogos = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    justify-content: center;
  }
`;

const PartnerLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.text.secondary};
  font-size: 1.2rem;
  opacity: 0.7;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid ${({ theme }) => theme.border};
  padding: 1.5rem 2rem;
  background: ${({ theme }) => theme.background.tertiary};
`;

const BottomContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
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
  font-size: 0.85rem;
`;

const LegalLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const LegalLink = styled.a`
  color: ${({ theme }) => theme.text.secondary};
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const SecurityBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.success};
  font-size: 0.8rem;
  font-weight: 600;
  background: rgba(16, 185, 129, 0.1);
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  border: 1px solid rgba(16, 185, 129, 0.2);
`;
