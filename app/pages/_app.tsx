import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Web3Modal } from '@web3modal/react'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { baseGoerli } from 'wagmi/chains'

// 1. Get projectID at https://cloud.walletconnect.com
if (!process.env.PROJECT_ID) {
  throw new Error('You need to provide PROJECT_ID env variable')
}
const projectId = process.env.PROJECT_ID

// 2. Configure wagmi client
const chains = [ baseGoerli ]
const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const config = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  publicClient
})

// 3. Configure modal ethereum client
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