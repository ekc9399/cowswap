import { useWeb3React } from '@web3-react/core'

import { useSelectedWallet } from 'legacy/state/user/hooks'

import { Web3ReactConnection } from 'modules/wallet/web3-react/types'

export const useIsActiveWallet = (connection: Web3ReactConnection) => {
  const { account } = useWeb3React()

  const selectedWallet = useSelectedWallet()
  const isActive = connection.hooks.useIsActive()

  if (!isActive) {
    return false
  } else if (isActive && !selectedWallet && account) {
    return true
  } else {
    return selectedWallet === connection.type
  }
}
