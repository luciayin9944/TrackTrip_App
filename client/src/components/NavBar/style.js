import styled from "styled-components";

export const Wrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: white;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: center; 
  align-items: center;
  z-index: 1000;
  padding: 0 20px;
`;

export const Inner = styled.div`
  width: 100%;
  max-width: 1500px;        
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Logo = styled.h1`
  font-size: 1.8rem;
  font-family: "Permanent Marker", cursive;
  color: #255b80;

  a {
    text-decoration: none;
    color: inherit;
  }
`;

export const Nav = styled.nav`
  display: flex;
  gap: 10px;
`;