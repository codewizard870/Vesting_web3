import { FortmaticConnector } from './Fortmatic'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { Web3Provider } from '@ethersproject/providers'

const NETWORK_URL = process.env.REACT_APP_NETWORK_URL
const FORMATIC_KEY = process.env.REACT_APP_FORTMATIC_KEY

export enum ChainId {
    Mainnet = 1,
    Rinkeby = 4
}

export const ProviderUrl: { [chainId in ChainId]?: string } = {
    [ChainId.Mainnet]: "https://mainnet.infura.io/v3/f8bdc9ea610d4e3d9f7d07c4d76bb08e",
    [ChainId.Rinkeby]: "https://rinkeby.infura.io/v3/f8bdc9ea610d4e3d9f7d07c4d76bb08e"
}

// add 43114 for AVAX
export const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42, 43113, 43114, 97, 56, 1287, 80001, 137, 128]
})

// mainnet only
export const walletconnect = new WalletConnectConnector({
    rpc: {
        1: ProviderUrl[ChainId.Mainnet] ?? '',
        4: ProviderUrl[ChainId.Rinkeby] ?? ''
    },
    bridge: 'https://bridge.walletconnect.org',
    qrcode: true
})

// mainnet only
export const fortmatic = new FortmaticConnector({
    apiKey: FORMATIC_KEY ?? '',
    chainId: 1
})

// // mainnet only
// export const walletlink = new WalletLinkConnector({
//     url: NETWORK_URL,
//     appName: 'Uniswap',
//     appLogoUrl:
//         'https://mpng.pngfly.com/20181202/bex/kisspng-emoji-domain-unicorn-pin-badges-sticker-unicorn-tumblr-emoji-unicorn-iphoneemoji-5c046729264a77.5671679315437924251569.jpg'
// })
