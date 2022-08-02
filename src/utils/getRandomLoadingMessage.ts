import { getRandomInt } from '@utils/math/getRandomInt'

export const getRandomLoadingMessage = () => {
  const messages = [
    'NFTs are getting ready ...',
    'GM! Soon your NFTs are ready ...',
    'The general mood is great today ...',
    'Oh man Bob caused some turmoil today ...',
    'Today a few repairs got done on the DMSS ...',
    'Buckle up! Another day on the awaits ...',
  ]

  return messages[getRandomInt(0, messages.length - 1)]
}
