import React from "react";
import styled from "styled-components";

export const Card = ({
  title,
  children,
  padding,
  hover = true,
  headerAction,
  ...props
}) => {
  return (
    <CardContainer $padding={padding} $hover={hover} {...props}>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {headerAction}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  background: ${({ theme }) => theme.card.background};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: ${({ $padding }) => $padding || "1.5rem"};
  box-shadow: ${({ theme }) => theme.shadow};
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    transform: ${({ $hover }) => ($hover ? "translateY(-4px)" : "none")};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
`;

const CardContent = styled.div`
  color: ${({ theme }) => theme.text.secondary};
`;
