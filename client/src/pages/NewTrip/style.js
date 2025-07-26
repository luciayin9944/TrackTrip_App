import styled from "styled-components";


export const Wrapper = styled.section`
  max-width: 800px;
  margin: 40px auto 40px 400px; 
  padding: 60px;
  display: flex;
  gap: 200px;

  @media (max-width: 768px) {
    flex-direction: column;
    margin-left: 20px; 
    padding: 20px;
  }
`;


export const WrapperChild = styled.div`
  flex: 0.6;
  margin: 40px auto;
`;
