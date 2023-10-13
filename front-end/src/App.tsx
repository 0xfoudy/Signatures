import { Web3Button } from '@web3modal/react'
import { useAccount } from 'wagmi'

import { Account } from './components/Account'
import { Balance } from './components/Balance'
import { NetworkSwitcher } from './components/NetworkSwitcher'
import { ReadRareContract } from './components/ReadRareContract'
import { SignEIP172 } from './components/Rareskills/SignEIP172'
import { WriteContractPrepared } from './components/WriteContractPrepared'



export function App() {

  return (
    <>
      <h1>wagmi + Web3Modal + Vite</h1>

      <Web3Button />

      {(
        <>
          <hr />
          <h2>Network</h2>
          <NetworkSwitcher />
          <br />
          <hr />
          <h2>Account</h2>
          <Account />
          <br />
          <hr />
          <h2>Balance</h2>
          <Balance />
          <br />
          <h2>Read Contract</h2>
          <ReadRareContract />
          <br />
          <hr />
          <h2>Sign with EIP172</h2>
          <SignEIP172 />
        </>
      )}
    </>
  )
}
