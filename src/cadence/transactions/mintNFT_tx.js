export const mintNFT = `
// REPLACE THIS WITH YOUR CONTRACT NAME + ADDRESS
import CarMoji from 0xe5de429200719cee

// Do not change these
import NonFungibleToken from 0x631e88ae7f1d7c20
import MetadataViews from 0x631e88ae7f1d7c20

transaction(
  recipient: Address,
  name: String,
  description: String,
  thumbnail: String,
) {
  prepare(signer: AuthAccount) {
    if signer.borrow<&CarMoji.Collection>(from: CarMoji.CollectionStoragePath) != nil {
      return
    }

    // Create a new empty collection
    let collection <- CarMoji.createEmptyCollection()

    // save it to the account
    signer.save(<-collection, to: CarMoji.CollectionStoragePath)

    // create a public capability for the collection
    signer.link<&{NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection}>(
      CarMoji.CollectionPublicPath,
      target: CarMoji.CollectionStoragePath
    )
  }


  execute {
    // Borrow the recipient's public NFT collection reference
    let receiver = getAccount(recipient)
      .getCapability(CarMoji.CollectionPublicPath)
      .borrow<&{NonFungibleToken.CollectionPublic}>()
      ?? panic("Could not get receiver reference to the NFT Collection")

    // Mint the NFT and deposit it to the recipient's collection
    CarMoji.mintNFT(
      recipient: receiver,
      name: name,
      description: description,
      thumbnail: thumbnail,
    )

    log("Minted an NFT and stored it into the collection")
  }
}
`;
