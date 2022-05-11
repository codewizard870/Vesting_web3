/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from 'react'
import { reqOptionsAuthorized } from 'utils'

export interface IApyContext {
    apyList: any[]
    requestApyList: () => any
    requestUpdateApy: (id: string, apy: number, apyBefore: number) => any
    requestUpdateLogs: (id: string) => any
    updateApyList: () => any
}

const ApyContext = React.createContext<Maybe<IApyContext>>(null)

export const ApyProvider = ({ children = null as any }) => {
    const [apyList, setApyList] = useState<any[]>([])

    const updateApyList = async () => {
        try {
            await fetch(
                process.env.REACT_APP_REST_SERVER + '/apy/apylist', reqOptionsAuthorized('post',)
            )
                .then((res) => res.json())
                .then((res) => {
                    if (!res.errors) {
                        setApyList(res.apylist)
                    }
                })
        } catch (err) {
            console.error(err)            
        }
    }

    useEffect(() => {
        updateApyList()
    }, [])

    const requestApyList = () => {
        return fetch(
            process.env.REACT_APP_REST_SERVER + '/apy/apylist', reqOptionsAuthorized('post')
        ).then((res) => res.json())
    }

    const requestUpdateLogs = (id: string) => {
        const data = { id }
        return fetch(
            process.env.REACT_APP_REST_SERVER + '/apy/log', reqOptionsAuthorized('post', data as any)
        ).then((res) => res.json())
    }

    const requestUpdateApy = (id: string, apy: number, apyBefore: number) => {
        const data = { id, apy, apyBefore }
        return fetch(
            process.env.REACT_APP_REST_SERVER + '/apy/updateapy',
            reqOptionsAuthorized('post', data as any)
        ).then((res) => res.json())
    }

    return (
        <ApyContext.Provider
            value={{ apyList, requestApyList, requestUpdateApy, updateApyList, requestUpdateLogs }}
        >
            {children}
        </ApyContext.Provider>
    )
}

export const useApy = () => {
    const context = useContext(ApyContext)

    if (!context) {
        throw new Error('Component rendered outside the provider tree')
    }

    return context
}
