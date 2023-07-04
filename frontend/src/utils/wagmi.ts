import {
  WagmiConfig,
  createClient,
  configureChains,
  chain,
} from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'

// import { magicprovider } from '../hooks/useMagicLink'

const { chains, provider, webSocketProvider } = configureChains(
 [chain.polygonMumbai],
 [publicProvider()],
)

export const wagmiClient = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
})