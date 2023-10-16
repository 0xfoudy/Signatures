import { useEffect, useState } from 'react'
import { type Address, useSignTypedData, useNetwork, useAccount, useContractWrite, useWaitForTransaction } from 'wagmi'
import { BaseError, recoverTypedDataAddress } from 'viem'
import { Rare20PermitContractConfig } from '../contracts'
import { getAddresses, Nonces } from './ReadRareContract'
import { utils } from 'ethers';
import { stringify } from '../../utils/stringify'


const bid = [
  { name: "amount", type: "uint256" },
  { name: "bidder", type: "Identity" },
];
const identity = [
  { name: "userId", type: "uint256" },
  { name: "wallet", type: "address" },
];


// Define a new functional component for permit logic
function PermitComponent({owner, operator, amount, deadline, signature}) {
  let split = utils.splitSignature(signature);
  const [hasInitiatedWrite, setHasInitiatedWrite] = useState(false);

  const { write, data, isLoading, error, isError } = useContractWrite({
    ...Rare20PermitContractConfig,
    functionName: 'permit',
    args: [owner, operator, amount, deadline, split.v, split.r, split.s],
  });

   const { 
    data: receipt,
    isLoading: isPending, 
    isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  useEffect(() => {
    if (!hasInitiatedWrite) {
      write();
      setHasInitiatedWrite(true); // Ensure that write isn't called repeatedly
    }
  }, [split]); // Assuming write should be triggered whenever the signature changes


  // Add logic to handle the permit functionality
  return (
    <div>
    {isLoading && <div>Check wallet...</div>}
      {isPending && <div>Transaction pending...</div>}
      {isSuccess && (
        <>
          <div>Transaction Hash: {data?.hash}</div>
          <div>
            Transaction Receipt: <pre>{stringify(receipt, null, 2)}</pre>
          </div>
        </>
      )}
      {isError && <div>{(error as BaseError)?.shortMessage}</div>}
      </div>
  );
}

    export function SignEIP172() {
      let signedData = null;
      
      const contract = Rare20PermitContractConfig.address as Address;
      const chainID = useNetwork().chain?.id;
      const myAccount = useAccount().address as Address;
      const nonce = Nonces(myAccount) || BigInt(0);
      const amount = 1000;
      
      
      // const operator = getAddresses()[1];
      const operator = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8" as Address;

      type Message = {
        owner: Address;
        spender: Address;
        value: number;
        nonce: bigint;
        deadline: number;
      };

      const [message, setMessage] = useState<Message | null>(null);

      const types = {
          Permit: [
            { name: "owner", type: "address"},
            { name: "spender", type: "address"},
            { name: "value", type: "uint256"},
            { name: "nonce", type: "uint256"}, 
            { name: "deadline", type: "uint256" }
          ],
        };

      const primaryType = 'Permit';

      const domain = {
        name: "Rare20",
        version: "1",
        chainId: chainID,
        verifyingContract: contract,
       // salt: '0x1233213371233213371233213371233213371233213371233213371233213371' as `0x${string}`,
      }
      
      const handleSigningTypedData = () => {
        const currentDeadline = Math.floor(Date.now() / 1000) + 3600;
        
        const constructedMessage = {
          owner: myAccount,
          spender: operator,
          value: amount,
          nonce: nonce,
          deadline: currentDeadline,
        }
        setMessage(constructedMessage);
      }

      // When 'message' changes, sign the data
      useEffect(() => {
        if (message) {
          signTypedData();
        }
      }, [message]);
      

      const { data, error, isLoading, signTypedData } = useSignTypedData({
        domain,
        types,
        message,
        primaryType,
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
      signedData = data;
    }, [data, message])

    return (
      <>
        <button disabled={isLoading} onClick={() => {
        handleSigningTypedData()
      }}>
          {isLoading ? 'Check Wallet' : 'Sign Message'}
        </button>
  
        {data && (
          <div>
            <div>Signature: {data}</div>
            <div>Recovered address {recoveredAddress}</div>
          <PermitComponent
            owner={message?.owner}
            operator={message?.spender}
            amount={message?.value}
            deadline={message?.deadline}
            signature={data}
          />
          </div>
         
        )}
        {error && <div>Error: {error?.message}</div>}
      </>
    )
  }
