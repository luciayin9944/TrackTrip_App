// SideBar.jsx

import { Wrapper, NavButton } from "./style";

function SideBar() {
  return (
    <Wrapper>
      <NavButton to="/dashboard">Dashboard</NavButton>
      <NavButton to="/trips">Trips</NavButton>
    </Wrapper>
  );
}

export default SideBar;