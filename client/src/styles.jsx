// styled.js

import styled from "styled-components";

// Box
export const Box = styled.div`
  border-radius: 6px;
  box-shadow: 0 0.5em 1em -0.125em rgb(10 10 10 / 10%),
    0 0 0 1px rgb(10 10 10 / 2%);
  padding: 16px;
`;

// FormField
export const FormField = styled.div`
  &:not(:last-child) {
    margin-bottom: 12px;
  }
`;

// Input
export const Input = styled.input`
  border-radius: 6px;
  border: 1px solid transparent;
  border-color: #dbdbdb;
  -webkit-appearance: none;
  max-width: 100%;
  width: 100%;
  font-size: 1rem;
  line-height: 1.5;
  padding: 4px;
`;

// Label
export const Label = styled.label`
  color: #363636;
  display: block;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 8px;
`;

// Textarea
export const Textarea = styled.textarea`
  border-radius: 6px;
  border: 1px solid transparent;
  border-color: #dbdbdb;
  -webkit-appearance: none;
  max-width: 100%;
  width: 100%;
  font-size: 1rem;
  line-height: 1.5;
  padding: 4px;
  resize: none;
`;

export const Error = styled.p`
  color: red;
  margin-top: 4px;
`;

// === Button Section ===
const COLORS = {
  primary: {
    "--main": "grey",
    "--accent": "white",
  },
  secondary: {
    "--main": "lavenderblush",
    "--accent": "grey",
  },
};

export const ButtonBase = styled.button`
  cursor: pointer;
  font-size: 1rem;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 8px 16px;
  text-decoration: none;
`;

export const FillButton = styled(ButtonBase)`
  background-color: var(--main);
  color: var(--accent);

  &:hover {
    opacity: 0.9;
  }
`;

export const OutlineButton = styled(ButtonBase)`
  background-color: white;
  color: var(--main);
  border: 2px solid var(--main);

  &:hover {
    background: hsl(235deg 85% 97%);
  }
`;


// Button component that switches between Fill and Outline
export function Button({ variant = "fill", color = "primary", ...props }) {
  let Component;
  if (variant === "fill") {
    Component = FillButton;
  } else if (variant === "outline") {
    Component = OutlineButton;
  }

  return <Component style={COLORS[color]} {...props} />;
}


export const PageButton = styled.button`
  margin: 0 4px;
  padding: 6px 12px;
  background-color: ${({ active }) => (active ? "#8884d8" : "#f0f0f0")};
  color: ${({ active }) => (active ? "#fff" : "#000")};
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;
