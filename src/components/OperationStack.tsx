import { useAppSelector } from '@data/hooks'
import { Operation, OPStatus } from '@data/slices/operations'
import React from 'react'
import { BsLightningFill } from 'react-icons/bs'
import { IoIosCheckmark, IoIosHourglass } from 'react-icons/io'

interface OperationStackProps {}

export const OperationStack: React.FC<OperationStackProps> = () => {
  const operations = useAppSelector((state) => state.OPPool.operations)

  const getEtherscanURL = (hash: string) =>
    process.env.NEXT_PUBLIC_DEPLOYED_NETWORK == 'MAINNET'
      ? 'https://etherscan.io/tx/' + hash
      : 'https://rinkeby.etherscan.io/tx/' + hash

  const drawDescription = (operation: Operation) => (
    <div className="flex-grow flex flex-col items-start pr-4">
      <span className="text-lg">{operation.description}</span>
      {operation.hash && (
        <a
          href={getEtherscanURL(operation.hash)}
          className="text-white cursor-pointer hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          view on etherscan
        </a>
      )}
    </div>
  )

  interface StackWrapperProps {
    operation: Operation
  }

  const StackWrapper: React.FC<StackWrapperProps> = ({ operation, children }) => (
    <a
      href={operation.hash ? getEtherscanURL(operation.hash) : undefined}
      target="_blank"
      rel="noreferrer"
      className="flex flex-row opacity-80 space-x-4 items-center px-2 py-2 rounded-full bg-white bg-opacity-10 backdrop-blur-sm shadow-md"
    >
      {children}
    </a>
  )

  const drawPending = (operation: Operation) => (
    <StackWrapper key={operation.id} operation={operation}>
      <div className="w-12 h-12 rounded-full bg-white bg-opacity-10 flex items-center justify-center">
        <IoIosHourglass className="w-7 h-7 animate-pulse" />
      </div>
      <div className="hidde md:flex">{drawDescription(operation)}</div>
    </StackWrapper>
  )

  const drawComplete = (operation: Operation) => (
    <StackWrapper key={operation.id} operation={operation}>
      <div className="w-12 h-12 rounded-full bg-dmss-accent2-50 flex items-center justify-center">
        <IoIosCheckmark className="w-12 h-12" />
      </div>
      <div className="hidde md:flex">{drawDescription(operation)}</div>
    </StackWrapper>
  )

  const drawFailed = (operation: Operation) => (
    <StackWrapper key={operation.id} operation={operation}>
      <div className="w-12 h-12 rounded-full bg-red-400 flex items-center justify-center">
        <BsLightningFill className="w-6 h-6" />
      </div>
      <div className="hidde md:flex">{drawDescription(operation)}</div>
    </StackWrapper>
  )

  const drawOperations = () =>
    Object.keys(operations).map((id) => {
      const operation = operations[id]

      if (operation.status == OPStatus.PENDING) {
        return drawPending(operation)
      } else if (operation.status == OPStatus.COMPLETE) {
        return drawComplete(operation)
      } else {
        return drawFailed(operation)
      }
    })

  return (
    <div className="absolute flex flex-col space-y-4 justify-end bottom-4 md:bottom-8 lg:bottom-20 right-2 md:right-4 lg:right-6 z-50">
      {drawOperations()}
    </div>
  )
}
