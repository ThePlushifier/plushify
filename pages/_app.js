import '../styles/globals.css'
import dynamic from 'next/dynamic'

const WalletProvider = dynamic(
  () => import('../components/WalletProvider'),
  { ssr: false }
)

export default function App({ Component, pageProps }) {
  return (
    <WalletProvider>
      <Component {...pageProps} />
    </WalletProvider>
  )
}
