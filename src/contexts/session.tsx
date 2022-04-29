/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext } from 'react'
import { checkAuthentication } from 'utils'
import { useWallet } from './wallets'

export interface ISessionContext {
  getUsername: () => Maybe<string>
  requestUserSignin: (email: string, password: string) => Promise<any>
  requestUserSignup: (
    email: string,
    password: string,
    name: string
  ) => Promise<any>
  requestResendVerification: (
    email:string
  ) => Promise<any>
  requestUserSignout: () => void
  requestUserList: () => any
  requestUpdatePermit: (id: string, permit: number) => any
}

const SessionContext = React.createContext<Maybe<ISessionContext>>(null)

export const SessionProvider = ({ children = null as any }) => {

  const options = (method = 'get', data = 'null') => {
    return {
      headers: {
        'Content-Type': 'application/json',
      },
      method: method,
      body: JSON.stringify(data),
    }
  }

  const getUsername = () => {
    return checkAuthentication() ? localStorage.getItem('username') : ''
  }

  const getUserToken = () => {
    return checkAuthentication() ? localStorage.getItem('jwtToken') : ''
  }

  const requestUserSignin = (email: string, password: string) => {
    const data = { email, password }
    return fetch(
      process.env.REACT_APP_REST_SERVER + '/signin',
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
    const requestOptions = {
      method: 'post',
      headers: new Headers({
        'Authorization': 'Bearer ' + getUserToken()
      })
    }
    return fetch(
      process.env.REACT_APP_REST_SERVER + '/userlist', requestOptions
    )
      .then((res) => res.json())
      .then((res) => {
        return res
      })
  }

  const requestUpdatePermit = (id: string, permit: number) => {
    const data = { id, permit }
    const requestOptions = {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getUserToken()
      }),
      body: JSON.stringify(data)
    }
    return fetch(
      process.env.REACT_APP_REST_SERVER + '/updatepermit',
      requestOptions
    ).then((res) => res.json())
      .then((res) => {
        return { status: true, msg: '' }
      })
      .catch(error => {
        return { status: false, msg: error.message }
      })
  }


  const requestUserSignup = (email: string, password: string, name: string) => {
    const data = { email, password, name }
    return fetch(
      process.env.REACT_APP_REST_SERVER + '/signup',
      options('post', data as any)
    ).then((res) => res.json())
  }

  const requestResendVerification = (email: string) => {
    const data = { email }
    return fetch(
      process.env.REACT_APP_REST_SERVER + '/resendverification',
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
      value={{ getUsername, requestUserSignin, requestUserSignup, requestResendVerification, requestUserSignout, requestUserList, requestUpdatePermit }}
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
