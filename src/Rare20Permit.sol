// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract Rare20Permit is ERC20Permit {
    
    constructor(string memory name_, string memory symbol_)  ERC20(name_, symbol_)  ERC20Permit(name_){
        DOMAIN_SEPARATOR = hashDomain(EIP712Domain({
            name: "EIP712Example",
            version: "1",
            chainId: block.chainid,
            verifyingContract: address(this),
            salt: SALT
        }));
    }

}

