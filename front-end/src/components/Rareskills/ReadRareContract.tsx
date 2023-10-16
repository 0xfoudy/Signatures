import { useState } from 'react'
import { BaseError } from 'viem'
import { type Address, useContractRead } from 'wagmi'

import { Rare20PermitContractConfig } from '../contracts'


export function ReadRareContract() {
  return (
    <div>
      <div>
        <Approvals />
      </div>
    </div>
  )
}

const [Addresses] = ['0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC','0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC']


export function getAddresses() {
  return Addresses;
}

export function Nonces(myAccount: Address) {
  const { data } = useContractRead({
    ...Rare20PermitContractConfig,
    functionName: 'nonces',
    args: [myAccount],
  })
  
  return data?.valueOf();
}

function Approvals() {
  const [Addresses, setAddresses] = useState<Address[]>(
    ['0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC','0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC']
  )

  const { data, error, isLoading, isSuccess } = useContractRead({
    ...Rare20PermitContractConfig,
    functionName: 'allowance',
    args: [Addresses[0], Addresses[1]],
    enabled: Boolean(Addresses[0]),
  })


  const [ownerInputAddress, setOwnerInputValue] = useState<string>(Addresses[0])
  const [operatorInputAddress, setOperatorInputValue] = useState<string>(Addresses[1])


  return (
    <div>
      Token approval: {isSuccess && data?.toString()}
      <br></br>
      Owner:
      <input
        onChange={(e) => setOwnerInputValue(e.target.value)}
        placeholder="Owner address"
        style={{ marginLeft: 18 }}
        value={ownerInputAddress}
        />
      <br></br>
      Operator:
      <input
        onChange={(e) => setOperatorInputValue(e.target.value)}
        placeholder="Oprator address"
        style={{ marginLeft: 4 }}
        value={operatorInputAddress}
        />
        
      <button onClick={() => setAddresses([ownerInputAddress, operatorInputAddress] as Address[])}>
        {isLoading ? 'fetching...' : 'fetch'}
      </button>
      {error && <div>{(error as BaseError).shortMessage}</div>}
    </div>
  )
}