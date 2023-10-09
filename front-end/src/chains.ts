import { configureChains, createConfig, sepolia } from 'wagmi'
import { mainnet, polygon, optimism, foundry } from 'wagmi/chains'
import { w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { InjectedConnector } from 'wagmi/connectors/injected'
 
export const walletConnectProjectId = '73e7f958b2e2dc4dcaf0922d9bc0cba7'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, polygon, optimism, sepolia, foundry],
  [w3mProvider({ projectId: walletConnectProjectId })],
)
 
export const config = createConfig({
    autoConnect: true,
    connectors: w3mConnectors({
      chains,
      projectId: walletConnectProjectId,
      version: 2,
    }),
    publicClient,
    webSocketPublicClient,
  })

export { chains }