// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Counter {
    uint256 public number;

    function increment() public {
        number++;
    }
}

// export ETHERSCAN_API_KEY="NQQRMWZVUB1DUYAWX3UPWUHWHTUGQNSEQB"
// forge create --verify --verifier etherscan --rpc-url https://goerli.base.org --optimize --optimizer-runs 200 --private-key c3d8068a8a7eb1b9b9599a2d1c81da0a18f31ec3e31e675896722b9e1a4305f9 src/Counter.sol:Counter

//https://goerli.basescan.org/address/0xE79E3479b897cd626b6BBb58d158C6AAE928047e