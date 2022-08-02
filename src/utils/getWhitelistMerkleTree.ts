import MerkleTree from 'merkletreejs'
import keccak256 from 'keccak256'
import { getWhitelist } from './getWhitelist'
import { hashToken } from './hashToken'

export const getWhitelistMerkleTree = () =>
  new MerkleTree(
    Object.entries(getWhitelist()).map((entry) =>
      hashToken(entry[0], entry[1].whitelist, entry[1].freeMint)
    ),
    keccak256,
    { sortPairs: true }
  )
