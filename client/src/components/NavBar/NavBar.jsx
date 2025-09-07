// components/NavBar.jsx

import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../styles";
import { Wrapper, Inner, Logo, Nav } from "./style";

function NavBar({ user, setUser }) {
  const navigate = useNavigate(); 

  function handleLogoutClick() {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  }

  return (
    <Wrapper>
      <Inner>
        <Logo>
          <Link to="/">TrackTrip</Link>
        </Logo>
        <Nav>
          {user && <h4>Welcome, {user.username}!</h4>}
          <Button variant="outline" onClick={handleLogoutClick}>
            Logout
          </Button>
        </Nav>
      </Inner>
    </Wrapper>
  );
}

export default NavBar;



