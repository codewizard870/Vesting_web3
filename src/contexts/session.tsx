/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext } from 'react';
import { checkAuthentication } from 'utils';

export interface ISessionContext {
  getUsername: () => Maybe<string>;
  requestUserSignin: (email: string, password: string) => Promise<any>;
  requestUserSignup: (
    email: string,
    password: string,
    name: string
  ) => Promise<any>;
  requestUserSignout: () => void
}

const SessionContext = React.createContext<Maybe<ISessionContext>>(null);

export const SessionProvider = ({ children = null as any }) => {
  const options = (method = 'get', data = 'null') => {
    return {
      headers: {
        'Content-Type': 'application/json',
      },
      method: method,
      body: JSON.stringify(data),
    };
  };

  const getUsername = () => {
    return checkAuthentication() ? localStorage.getItem('username') : '';
  };

  const requestUserSignin = (email: string, password: string) => {
    const data = { email, password };
    return fetch(
      process.env.REACT_APP_REST_SERVER + '/signin',
      options('post', data as any)
    )
      .then((res) => res.json())
      .then((res) => {
        if (!res.errors) {
          localStorage.setItem('jwtToken', res.user.token);
          localStorage.setItem('username', res.user.name);
          localStorage.setItem('role', res.user.role);
        }
        return res;
      });
  };

  const requestUserSignup = (email: string, password: string, name: string) => {
    const data = { email, password, name };
    return fetch(
      process.env.REACT_APP_REST_SERVER + '/signup',
      options('post', data as any)
    ).then((res) => res.json());
  };

  const requestUserSignout = () => {
    localStorage.setItem('jwtToken', '');
    localStorage.setItem('username', '');
    localStorage.setItem('role', '');
  };

  return (
    <SessionContext.Provider
      value={{ getUsername, requestUserSignin, requestUserSignup, requestUserSignout }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error('Component rendered outside the provider tree');
  }

  return context;
};
