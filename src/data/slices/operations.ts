/* eslint-disable no-unused-vars */
// prettier-ignore
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { delay } from '@utils/misc/delay'
import { ContractTransaction } from 'ethers'
import { v4 as uuidv4 } from 'uuid'

export enum OPStatus {
  PENDING,
  COMPLETE,
  FAILED,
}

export enum OPType {
  MINT,
  PILL_PURCHASE,
  PILL_GROW,
}

export interface Operation {
  id: string
  hash: string | undefined
  description: string
  status: OPStatus
  type: OPType
}

interface OperationState {
  operations: { [key: string]: Operation }
  cockpitIndicator: boolean
}

// Define the initial state using that type
const initialState: OperationState = {
  operations: {},
  cockpitIndicator: false,
}

const manageOperationInPool = createAsyncThunk(
  'op/manageOperationInPool',
  async (
    payload: {
      result: ContractTransaction
      data: { type: OPType; description: string }
    },
    thunkAPI
  ) => {
    const { result, data } = payload

    const operation: Operation = {
      id: uuidv4(),
      hash: result.hash,
      status: OPStatus.PENDING,
      type: data.type,
      description: data.description,
    }

    try {
      thunkAPI.dispatch(setOperation(operation))

      const recipe = await payload.result.wait()

      thunkAPI.dispatch(
        setOperation({
          ...operation,
          status: recipe.status === 1 ? OPStatus.COMPLETE : OPStatus.FAILED,
        })
      )

      if (recipe.status === 1) {
        thunkAPI.dispatch(setPingIndicator(true))
      }
    } catch (e) {
      thunkAPI.dispatch(
        setOperation({
          ...operation,
          status: OPStatus.FAILED,
        })
      )
    } finally {
      await delay(5000)

      thunkAPI.dispatch(removeOperation(operation.id))
    }
  }
)

export const operationSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setOperation: (state, action: PayloadAction<Operation>) => {
      state.operations[action.payload.id] = action.payload
    },
    removeOperation: (state, action: PayloadAction<string>) => {
      delete state.operations[action.payload]
    },
    resetOperations: (state) => {
      state.operations = {}
    },
    setPingIndicator: (state, action: PayloadAction<boolean>) => {
      state.cockpitIndicator = action.payload
    },
  },
})

const { resetOperations, setOperation, removeOperation, setPingIndicator } =
  operationSlice.actions

export {
  resetOperations,
  manageOperationInPool,
  setOperation,
  removeOperation,
  setPingIndicator,
}
export default operationSlice.reducer
