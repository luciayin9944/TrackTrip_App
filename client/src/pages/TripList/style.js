// styled-component
import styled from "styled-components";

export const Wrapper = styled.section`
  max-width: 800px;
  margin: 40px auto 40px 400px; 
`;

export const FilterWrapper = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
//   align-items: flex-end;
  gap: 16px;
  margin-top: 100px;
`;

export const Title = styled.h1`
  color: #255b80;
  text-align: center;
  font-size: 2.5rem;
  margin-top: 100px;
  margin-bottom: 32px;
`;


export const TripCard = styled.article`
  margin-top: 40px;
  margin-bottom: 40px;
  padding: 16px;
  background-color: #f6f8fa;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;