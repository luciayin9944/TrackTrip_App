// SideBar.jsx

import { Wrapper, NavButton } from "./style";

function SideBar() {
  return (
    <Wrapper>
      <NavButton to="/dashboard">Current Trip</NavButton>
      <NavButton to="/trips">All Trips</NavButton>
    </Wrapper>
  );
}

export default SideBar;