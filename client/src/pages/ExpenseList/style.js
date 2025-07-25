import styled from "styled-components";

export const Wrapper = styled.section`
  max-width: 800px;
  margin: 40px auto 400px;
`;

export const Title = styled.h1`
  color: #255b80;
  text-align: center;
  font-size: 2.5rem;
  margin-top: 100px;
  margin-bottom: 32px;
`;

export const ExpenseCard = styled.article`
  margin-bottom: 24px;
  padding: 16px;
  background-color: #f6f8fa;
  border-radius: 12px;
`;

export const EditForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  input, select {
    padding: 8px;
    font-size: 16px;
  }
`;

export const FilterWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin: 40px auto;
`;