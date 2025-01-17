import { useAtomValue } from 'jotai'
import { useState } from 'react'

import { useAdvancedOrdersDerivedState } from 'modules/advancedOrders'
import { TradeConfirmation, TradeConfirmModal, useTradeConfirmActions } from 'modules/trade'
import { TradeBasicConfirmDetails } from 'modules/trade/containers/TradeBasicConfirmDetails'

import { useRateInfoParams } from 'common/hooks/useRateInfoParams'

import { TwapConfirmDetails } from './TwapConfirmDetails'

import { useCreateTwapOrder } from '../../hooks/useCreateTwapOrder'
import { partsStateAtom } from '../../state/partsStateAtom'
import { twapOrderAtom } from '../../state/twapOrderAtom'
import { twapOrderSlippage } from '../../state/twapOrdersSettingsAtom'

interface TwapConfirmModalProps {
  fallbackHandlerIsNotSet: boolean
}

export function TwapConfirmModal({ fallbackHandlerIsNotSet }: TwapConfirmModalProps) {
  const {
    inputCurrencyAmount,
    inputCurrencyFiatAmount,
    inputCurrencyBalance,
    outputCurrencyAmount,
    outputCurrencyFiatAmount,
    outputCurrencyBalance,
  } = useAdvancedOrdersDerivedState()
  // TODO: there's some overlap with what's in each atom
  const twapOrder = useAtomValue(twapOrderAtom)
  const slippage = useAtomValue(twapOrderSlippage)
  const partsState = useAtomValue(partsStateAtom)

  const tradeConfirmActions = useTradeConfirmActions()
  const createTwapOrder = useCreateTwapOrder()

  const isInvertedState = useState(false)

  // TODO: add conditions based on warnings
  const isConfirmDisabled = false

  // TODO: define priceImpact
  const priceImpact = {
    priceImpact: undefined,
    error: undefined,
    loading: false,
  }

  const inputCurrencyInfo = {
    amount: inputCurrencyAmount,
    fiatAmount: inputCurrencyFiatAmount,
    balance: inputCurrencyBalance,
    label: 'Sell amount',
  }

  const outputCurrencyInfo = {
    amount: outputCurrencyAmount,
    fiatAmount: outputCurrencyFiatAmount,
    balance: outputCurrencyBalance,
    label: 'Estimated receive amount',
  }

  const rateInfoParams = useRateInfoParams(inputCurrencyInfo.amount, outputCurrencyInfo.amount)

  // This already takes into account the full order
  const minReceivedAmount = twapOrder?.buyAmount

  const { timeInterval, numOfParts } = twapOrder || {}

  const partDuration = timeInterval
  const totalDuration = timeInterval && numOfParts ? timeInterval * numOfParts : undefined

  return (
    <TradeConfirmModal>
      <TradeConfirmation
        title="Review TWAP order"
        inputCurrencyInfo={inputCurrencyInfo}
        outputCurrencyInfo={outputCurrencyInfo}
        onConfirm={() => createTwapOrder(fallbackHandlerIsNotSet)}
        onDismiss={tradeConfirmActions.onDismiss}
        isConfirmDisabled={isConfirmDisabled}
        priceImpact={priceImpact}
      >
        <>
          <TradeBasicConfirmDetails
            rateInfoParams={rateInfoParams}
            minReceiveAmount={minReceivedAmount}
            isInvertedState={isInvertedState}
            slippage={slippage}
          />
          <TwapConfirmDetails
            startTime={twapOrder?.startTime}
            partDuration={partDuration}
            partsState={partsState}
            totalDuration={totalDuration}
          />
        </>
      </TradeConfirmation>
    </TradeConfirmModal>
  )
}
