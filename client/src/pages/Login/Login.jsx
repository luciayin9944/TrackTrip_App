// Login.jsx

import { useState } from "react";
import LoginForm from "../../components/LoginForm.jsx";
import SignupForm from "../../components/SignupForm.jsx";
import { Button } from "../../styles.jsx";
import { PageWrapper, Logo, Wrapper, Divider, Slogan } from "./style.js";

function Login({ onLogin }) {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <PageWrapper>
      <Wrapper>
        <Logo>TrackTrip</Logo>
        <Slogan>Track your journey, master your budget.</Slogan>

        {showLogin ? (
          <>
            <LoginForm onLogin={onLogin} />
            <Divider />
            <p>
              Don't have an account? &nbsp;
              <Button color="secondary" onClick={() => setShowLogin(false)}>
                Sign Up
              </Button>
            </p>
          </>
        ) : (
          <>
            <SignupForm onLogin={onLogin} />
            <Divider />
            <p>
              Already have an account? &nbsp;
              <Button color="secondary" onClick={() => setShowLogin(true)}>
                Log In
              </Button>
            </p>
          </>
        )}
      </Wrapper>
    </PageWrapper>
  );
}

export default Login;


