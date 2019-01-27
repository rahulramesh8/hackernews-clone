import React, { useState } from "react";
import { AUTH_TOKEN } from "../constants";

const Login = () => {
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  return (
    <>
      <h4 className="mv3">{login ? "Login" : "Sign up"}</h4>
      <div className="flex flex-column">
        {!login && (
          <input
            value={name}
            onChange={event => setName(event.target.value)}
            type="text"
            placeholder="Your name"
          />
        )}
        <input
          value={email}
          onChange={event => setEmail(event.target.value)}
          type="text"
          placeholder="Your email address"
        />
        <input
          value={password}
          onChange={event => setPassword(event.target.value)}
          type="password"
          placeholder="Your password here"
        />
      </div>
      <div className="flex mt3">
        <div className="pointer mr2 button" onClick={() => _confirm()}>
          {login ? "Login" : "Create account"}
        </div>
        <div className="pointer button" onClick={() => setLogin(!login)}>
          {login ? "Need to create an account?" : "Already have an account?"}
        </div>
      </div>
    </>
  );
};

const _confirm = async () => {
  //..Something here
};

const _saveUserData = token => localStorage.setItem(AUTH_TOKEN, token);

export default Login;
