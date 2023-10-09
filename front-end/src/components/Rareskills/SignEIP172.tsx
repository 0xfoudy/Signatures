import { useEffect, useState } from 'react'
import { recoverMessageAddress } from 'viem'
import { type Address, useSignMessage } from 'wagmi'

const domain = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
  { name: "verifyingContract", type: "address" },
  { name: "salt", type: "bytes32" },
];
const bid = [
  { name: "amount", type: "uint256" },
  { name: "bidder", type: "Identity" },
];
const identity = [
  { name: "userId", type: "uint256" },
  { name: "wallet", type: "address" },
];

const contract = ""; // TODO: GET CONTRACT ADDRESS
const chainID = 1; // TODO: GET CHAIN ID
const _operator = ""; // TODO: GET OPERATOR

export function SignEIP172() { 
    
  const domainData = {
    name: "SignEIP172",
    version: "1",
    chainId: chainID,
    verifyingContract: contract,
    salt: "0xf2d857f4a3edcb9b78b4d503bfe733db1e3f6cdc2b7971ee739626c97e86a558"
  };
  var message = {
    approval: {
        operator: _operator,
        amount: 1000
    }
  };

    function generateEIP172Signature(message: { message: string; }) {
        return message;
    }

    const [recoveredAddress, setRecoveredAddress] = useState<Address>()
    const {
      data: signature,
      variables,
      error,
      isLoading,
      signMessage,
    } = useSignMessage()

    useEffect(() => {
    ;(async () => {
      if (variables?.message && signature) {
        const recoveredAddress = await recoverMessageAddress({
          message: variables?.message,
          signature,
        })
        setRecoveredAddress(recoveredAddress)
      }
    })()
    }, [signature, variables?.message])

    return (
        <>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              const element = event.target as HTMLFormElement
              const formData = new FormData(element)
              const message = formData.get('message') as string
              generateEIP172Signature({ message })
            }}
          >
            <input name="message" type="text" required />
            <button disabled={isLoading} type="submit">
              {isLoading ? 'Check Wallet' : 'Sign Message'}
            </button>
          </form>
    
          {signature && (
            <div>
              <div>Signature: {signature}</div>
              <div>Recovered address: {recoveredAddress}</div>
            </div>
          )}
          {error && <div>Error: {error?.message}</div>}
        </>
      )

    
}