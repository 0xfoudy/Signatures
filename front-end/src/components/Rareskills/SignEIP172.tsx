import { useEffect, useState } from 'react'
import { type Address, useSignTypedData, useNetwork, useAccount} from 'wagmi'
import { recoverTypedDataAddress } from 'viem'
import { Rare20PermitContractConfig } from '../contracts'
import { getAddresses, Nonces } from './ReadRareContract'

const bid = [
  { name: "amount", type: "uint256" },
  { name: "bidder", type: "Identity" },
];
const identity = [
  { name: "userId", type: "uint256" },
  { name: "wallet", type: "address" },
];




    export function SignEIP172() {
      
      const contract = Rare20PermitContractConfig.address;
      const chainID = useNetwork().chain?.id;
      const myAccount = useAccount().address;
    
      const amount = 1000;
      
      
     // const operator = getAddresses()[1];
      const operator = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

      const types = {
          Permit: [
            { name: "owner", type: "address"},
            { name: "spender", type: "address"},
            { name: "value", type: "uint256"},
            { name: "nonce", type: "uint256"},
          ],
        };

      const primaryType = 'Permit';

      const domain = {
        name: "Signing172",
        version: "1",
        chainId: chainID,
        verifyingContract: contract,
        salt: '0x1233213371233213371233213371233213371233213371233213371233213371' as `0x${string}`,
      }
      console.log( Nonces(myAccount as Address))

      const message = {
        owner: myAccount,
        spender: operator,
        value: amount,
        nonce: Nonces(myAccount as Address),
      };


      const { data, error, isLoading, signTypedData } = useSignTypedData({
        domain,
        message,
        primaryType,
        types,
      })

    const [recoveredAddress, setRecoveredAddress] = useState<Address>()
    useEffect(() => {
      if (!data) return
      ;(async () => {
        setRecoveredAddress(
          await recoverTypedDataAddress({
            domain,
            types,
            message,
            primaryType,
            signature: data,
          }),
        )
      })()
    }, [data])
  
    return (
      <>
        <button disabled={isLoading} onClick={() => signTypedData()}>
          {isLoading ? 'Check Wallet' : 'Sign Message'}
        </button>
  
        {data && (
          <div>
            <div>Signature: {data}</div>
            <div>Recovered address {recoveredAddress}</div>
          </div>
        )}
        {error && <div>Error: {error?.message}</div>}
      </>
    )
  }
