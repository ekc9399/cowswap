import { createAction } from '@reduxjs/toolkit'
import { WithChainId } from 'state/lists/actions'
import { GasFeeEndpointResponse } from 'api/gasPrices'

export type UpdateGasPrices = GasFeeEndpointResponse & WithChainId

export const updateGasPrices = createAction<UpdateGasPrices>('gas/updateGasPrices')