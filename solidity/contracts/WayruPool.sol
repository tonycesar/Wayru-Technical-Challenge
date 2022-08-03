// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WayruPool {
  address owner;

  constructor(){
    owner = msg.sender;
  }

  function sendAmount(uint _data) external payable {
    require(msg.sender.balance > _data);
    require(msg.value == _data);
    address payable _payable = payable(address(this));
     _payable.send(_data);
  }

  function withdraw() external {
    address payable to = payable(msg.sender);
        to.transfer(address(this).balance);
  }

  function transferOwnerTo(address _newOwner) external {

  }

  function isOwner() external view returns(bool) {
    return owner == msg.sender;
  }
  
}
