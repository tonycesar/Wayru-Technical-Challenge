import { ethers } from "ethers";
import ABI from "./WayruPoolAbi.json";
import { getParsedEthersError } from "@enzoferey/ethers-error-parser";

const { ethereum } = window;
const provider = new ethers.providers.Web3Provider(ethereum);
const signer = provider.getSigner();
const WayruPoolContract = new ethers.Contract(
  "0xb662A8029f00F5a9298598876C0321d508945cBc",
  ABI,
  signer
);

class ContractAbstract {
  constructor(contract) {
    this.contract = contract;
  }

  process(method) {
    let asyncFuntion = async (method, resolve, reject) => {
      try {
        const transaction = await method();
        const result = await transaction.wait();
        resolve(result);
      } catch (error) {
        const parsedEthersError = getParsedEthersError(error);
        reject(parsedEthersError);
      }
    };

    return new Promise((resolve, reject) => {
      asyncFuntion(method, resolve, reject);
    });
  }
}

class WayruPool extends ContractAbstract {
  constructor() {
    super(WayruPoolContract);
    this.value = true;
  }

  sendAmount({ from, amount }) {
    const realAmount = ethers.utils.parseEther(amount);
    return this.process(() =>
      this.contract.sendAmount(realAmount, { from, value: realAmount })
    );
  }

  transferOwnerTo({ from, to }) {
    return this.process(() => this.contract.transferOwnerTo(to, { from }));
  }

  withdraw({ from }) {
    return this.process(() => this.contract.withdraw({ from }));
  }

  isOwner({ from }) {
    return this.contract.isOwner({ from });
  }

  getBalance() {
    return provider.getBalance(this.contract.address);
  }
}

export default WayruPool;
