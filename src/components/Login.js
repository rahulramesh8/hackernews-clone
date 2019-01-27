import React, { useState } from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

import { AUTH_TOKEN } from "../constants";

const Login = props => {
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const _confirm = async data => {
    const { token } = login ? data.login : data.signup;
    _saveUserData({ token });
    props.history.push("/");
  };

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
        <Mutation
          mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
          variables={{ email, password, name }}
          onCompleted={_confirm}
          onError={alert}
        >
          {mutation => (
            <div className="pointer mr2 button" onClick={mutation}>
              {login ? "Login" : "Create account"}
            </div>
          )}
        </Mutation>

        <div className="pointer button" onClick={() => setLogin(!login)}>
          {login ? "Need to create an account?" : "Already have an account?"}
        </div>
      </div>
    </>
  );
};

export default Login;

//Store JWT in localStorage just for the purposes of this GraphQL project.
//Wouldn't do it otherwise 💩
const _saveUserData = ({ token }) => localStorage.setItem(AUTH_TOKEN, token);

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;
