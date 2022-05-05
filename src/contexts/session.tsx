/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext } from 'react'
import { getUserToken } from 'utils'

export interface ISessionContext {
  requestUserSignin: (email: string, password: string) => Promise<any>
  requestUserSignup: (
    email: string,
    password: string,
    name: string
  ) => Promise<any>
  requestResendVerification: (
    email: string
  ) => Promise<any>
  requestUserSignout: () => void
  requestUserList: () => any
  requestUpdatePermit: (id: string, permit: number) => any
}

const SessionContext = React.createContext<Maybe<ISessionContext>>(null)

export const SessionProvider = ({ children = null as any }) => {

  const options = (method = 'get', data = {}) => {
    return {
      headers: {
        'Content-Type': 'application/json',
      },
      method: method,
      body: JSON.stringify(data)
    }
  }

  const optionsAuthorized = (method = 'get', data = {}) => {
    return {
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getUserToken()
      }),
      method: method,
      body: JSON.stringify(data)
    }
  }

  const requestUserSignin = (email: string, password: string) => {
    const data = { email, password }
    return fetch(
      process.env.REACT_APP_REST_SERVER + '/auth/signin',
      options('post', data as any)
    )
      .then((res) => res.json())
      .then((res) => {
        if (!res.errors) {
          localStorage.setItem('jwtToken', res.user.token)
          localStorage.setItem('username', res.user.name)
          localStorage.setItem('role', res.user.role)
        }
        return res
      })
  }

  const requestUserList = () => {

    return fetch(
      process.env.REACT_APP_REST_SERVER + '/auth/userlist', optionsAuthorized('post')
    )
      .then((res) => res.json())
  }

  const requestUpdatePermit = (id: string, permit: number) => {
    const data = { id, permit }    
    return fetch(
      process.env.REACT_APP_REST_SERVER + '/auth/updatepermit',
      optionsAuthorized('post', data)
    ).then((res) => res.json())
  }

  const requestUserSignup = (email: string, password: string, name: string) => {
    const data = { email, password, name }
    return fetch(
      process.env.REACT_APP_REST_SERVER + '/auth/signup',
      options('post', data as any)
    ).then((res) => res.json())
  }

  const requestResendVerification = (email: string) => {
    const data = { email }
    return fetch(
      process.env.REACT_APP_REST_SERVER + '/auth/resendverification',
      options('post', data as any)
    ).then((res) => res.json())
  }

  const requestUserSignout = () => {
    localStorage.setItem('jwtToken', '')
    localStorage.setItem('username', '')
    localStorage.setItem('role', '')
    localStorage.setItem('wallet_type', '')
  }

  return (
    <SessionContext.Provider
      value={{ requestUserSignin, requestUserSignup, requestResendVerification, requestUserSignout, requestUserList, requestUpdatePermit }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => {
  const context = useContext(SessionContext)

  if (!context) {
    throw new Error('Component rendered outside the provider tree')
  }

  return context
}
