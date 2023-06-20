import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react';
import { Web3Button } from '@web3modal/react'
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'
import counterABI from '../abis/counter.json';

const inter = Inter({ subsets: ['latin'] })
export const counterAddress = '0xE79E3479b897cd626b6BBb58d158C6AAE928047e'

export default function Home() {
    const { address, isConnected } = useAccount() as any

    const writeWithPermissive = async () => {}

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">


            </div>

            <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
                {/* <button className="bg-blue-500 font-semibold text-lg px-4 py-2 rounded-lg" onClick={() => open()}>
                    Connect Wallet
                </button> */}
                
                { isConnected ? 
                    <button className="bg-blue-500 font-semibold text-lg px-4 py-2 rounded-lg" onClick={writeWithPermissive}>
                        Write to Counter
                    </button>
                    :
                    <Web3Button />
                }
            </div>

            <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">

            </div>
        </main>
    )
}
