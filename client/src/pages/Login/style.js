// styled-component
import styled from "styled-components";



export const PageWrapper = styled.div`
  min-height: 100vh;
  background-image: url('/travel4.jpeg');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;


export const Wrapper = styled.section`
  max-width: 600px;
  margin: 40px 100px 40px auto;
  padding: 60px;
  background: rgba(255, 255, 255, 0.5); 
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1); 
`;

export const Logo = styled.h1`
  font-family: "Permanent Marker", cursive;
  font-size: 3rem;
  color: #255b80;
  margin: 8px 0 16px;
`;


export const Slogan = styled.p`
  font-size: 1.6rem;
  font-weight: 600;
  color: #255b80;
  text-align: center;
  margin-bottom: 36px;
  margin-top: -10px;
`;


export const Divider = styled.hr`
  border: none;
  border-bottom: 1px solid #ccc;
  margin: 16px 0;
`;


