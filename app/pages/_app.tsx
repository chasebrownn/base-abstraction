import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Web3Modal } from '@web3modal/react'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { baseGoerli } from 'wagmi/chains'

// export const Flare = {
//   id: 14,
//   name: 'Flare',
//   network: 'Flare Network',
//   nativeCurrency: {
//     decimals: 18,
//     name: 'FLR',
//     symbol: 'FLR',
//   },
//   rpcUrls: {
//     public: { http: ['https://flare-api.flare.network/ext/C/rpc'] },
//     default: { http: ['https://flare-api.flare.network/ext/C/rpc'] },
//   },
// } as const satisfies Chain

// 1. Get projectID at https://cloud.walletconnect.com
if (!process.env.WALLET_CONNECT_PROJECT_ID) {
  throw new Error('You need to provide WALLET_CONNECT_PROJECT_ID env variable')
}

const projectId = process.env.WALLET_CONNECT_PROJECT_ID

// 2. Configure wagmi client
// const chains = [Flare]
// const { provider } = configureChains(chains, [w3mProvider({ projectId })])
// export const wagmiClient = createClient({
//   autoConnect: true,
//   connectors: w3mConnectors({ projectId, version: 1, chains }),
//   provider,
// })
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [baseGoerli],
  [publicProvider()],
)

// 3. Configure modal ethereum client
const config = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  publicClient
})

export const ethereumClient = new EthereumClient(config, chains)

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <WagmiConfig config={config}>
        <Component {...pageProps} />
      </WagmiConfig>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  )
}
