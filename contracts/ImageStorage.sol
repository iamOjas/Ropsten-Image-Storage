// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Contract for Decentralized Image Storage
/// @author Scott Guthrie
/// @notice Allows a user to store an image wihtout any centralized entity 
/// @dev Image will be stored in ipfs and link to ipfs will be stored in smart contract
contract ImageStorage is Ownable{

  /// @dev counts how many image has been added to the storage
  uint public imageCount;

  /// @notice Emitted when an image link is added to the blockchain
  /// @param imageID Image count
  event ImageAdded(uint indexed imageID);

  
  mapping(uint => string) public images;

  /// @notice Adds image link to a given image count
  /// @param _path link of the image stored in ipfs
  function set(string memory _path) public onlyOwner{
    imageCount++;
    images[imageCount] = _path;
    emit ImageAdded(imageCount);
  }

}


