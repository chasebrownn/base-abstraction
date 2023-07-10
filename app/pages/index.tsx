import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Contract, Signer, VoidSigner, providers } from 'ethers';
import counterABI from '../abis/Counter.json';
import { Account, Permission, PermissionSet } from '@permissivelabs/client';
import { EntryPoint__factory } from '@permissivelabs/client';
import { formatEther, parseEther } from 'ethers/lib/utils';

export const counterAddress = '0xE79E3479b897cd626b6BBb58d158C6AAE928047e';

export default function Home() {
	const [address, setAddress] = useState<`0x${string}`>();
	const [balance, setBalance] = useState(BigInt(0));
	const [counter, setCounter] = useState<Contract>();
	const [disabled, setDisabled] = useState(false);
	const [signer, setSigner] = useState<Signer>();
	const [allowed, setAllowed] = useState(false);

	const connect = async () => {
		const [a]: `0x${string}`[] = await (
			window as unknown as Window & { ethereum: any }
		).ethereum.request({
			method: 'eth_requestAccounts',
		});
		if (a.toLowerCase() != process.env.NEXT_PUBLIC_OWNER?.toLowerCase()) return;
		setAddress(a);
		console.log(a)
		const provider = new providers.Web3Provider((window as any).ethereum);
		setSigner(await provider.getSigner());
		setCounter(new Contract(counterAddress, counterABI.abi, await provider.getSigner()));
		console.log(counter)
	};

	const queryBalance = async () => {
		if (!counter || !signer) return;
		const account = new Account({
			operator: new VoidSigner(
				process.env.NEXT_PUBLIC_OPERATOR as string,
				signer.provider
			),
			owner: signer,
			chainId: 84531,
		});
		const balance = await counter.number();
		setBalance(BigInt(balance as bigint));
	};

	const queryAllowed = async () => {
		if (!signer || !counter) return;
		const chainId = (await signer.provider?.getNetwork())?.chainId;
		if (!chainId || chainId != 84531) return;
		const account = new Account({
			operator: new VoidSigner(
				process.env.NEXT_PUBLIC_OPERATOR as string,
				signer.provider
			),
			owner: signer,
			chainId: Number(chainId) as 84531,
		});
		await account.getAccount();
		const root = window.localStorage.getItem('root');
		if (!(await account.isDeployed())) return;
		setAllowed(
			(await account.allowedPermission()) === root &&
				Number(window.localStorage.getItem('expiration')) > Date.now()
		);
	};

	useEffect(() => {
		if (!address) return;
		queryBalance();
		queryAllowed();
		const interv = setInterval(queryBalance, 5000);

		return () => {
			clearInterval(interv);
		};
	}, [address, counter]);

	const incrementWithPermissive = async () => {
		if (!signer || !counter) return;
		setDisabled(true);
		const chainId = (await signer.provider?.getNetwork())?.chainId;
		if (!chainId || chainId != 84531) return;
		const account = new Account({
			operator: new VoidSigner(
				process.env.NEXT_PUBLIC_OPERATOR as string,
				signer.provider
			),
			owner: signer,
			chainId: Number(chainId) as 84531,
		});

		await account.getAccount();
		if (!(await account.isDeployed())) {
			await account.deploy();
		}
		const permSet = new PermissionSet({
			title: 'Counter Project',
			maxFee: parseEther('1'),
			maxValue: 0,
			permissions: [
				new Permission({
					operator: process.env.NEXT_PUBLIC_OPERATOR as string,
					to: counter.address,
					selector: counter.interface.getSighash('increment'),
					allowed_arguments: '0xc0',
					expiresAtUnix: new Date(1813986312 * 1000),
					maxUsage: 11,
				}),
			],
		});
		window.localStorage.setItem('root', permSet.hash().toString());
		window.localStorage.setItem(
			'expiration',
			new Date(Date.now() + 1000 * 3600 * 1).getTime().toString()
		);
		await permSet.upload();
		// in normal conditions redirect to authorization page
		await account.setOperatorPermissions(permSet);
		await signer.sendTransaction({
			to: await account.getAddress(),
			value: parseEther('0.01'),
		});
		console.log(await account.getAddress())
		setDisabled(false);
	};

	return (
		<div className="w-screen h-screen bg-white">
			<div className="w-scren h-screen bg-black bg-opacity-30 flex flex-col justify-center items-center gap-8 backdrop-blur-lg">
				<h1 className="font-bold text-6xl">Abstraction Counter</h1>
				{address ? (
					<>
						<div className="flex flex-col items-start w-1/5 gap-4">
							<h2 className="text-2xl">Global Number</h2>
							<div className="bg-white bg-opacity-30 border-white border-opacity-50 border-2 rounded-lg w-full py-4 flex px-4 justify-between items-center">
								<div className="bg-white rounded-full p-4">
									<Image src="/base.png" alt="wheat" width={32} height={32} />
								</div>
								<h3>{formatEther(balance)}</h3>
							</div>
						</div>
						<>
							<button
								className={`${
									disabled ? 'bg-slate-400' : 'bg-pink-500'
								} font-semibold text-lg px-4 py-2 rounded-lg`}
								onClick={incrementWithPermissive}
								disabled={disabled}
							>
								Increment Number
							</button>
						</>
					</>
				) : (
					<button
						className="bg-blue-500 font-semibold text-lg px-4 py-2 rounded-lg"
						onClick={connect}
					>
						Connect Wallet
					</button>
				)}
			</div>
		</div>
	);
}
