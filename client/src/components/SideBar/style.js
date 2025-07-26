import styled from "styled-components";
import { Link } from "react-router-dom";

export const Wrapper = styled.aside`
  width: 300px;
  background-color: #f8fafc;
  height: 100vh;
  position: fixed;
  top: 60px;
  left: 0;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  align-items: center; 
  padding-top: 60px;
  gap: 20px;
`;

export const NavButton = styled(Link)`
  width: 60%;
  padding: 12px 16px;
  text-align: center;
  text-decoration: none;
  font-size: 1rem;
  color: #255b80;
  font-weight: 600;
  border: 2px solid #255b80;
  border-radius: 8px;
  background-color: white;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #e0f2fe;
    color: #1e3a8a;
    border-color: #1e3a8a;
  }
`;
