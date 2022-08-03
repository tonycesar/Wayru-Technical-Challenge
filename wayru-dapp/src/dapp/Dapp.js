import React from "react";
import { ethers } from "ethers";
import Pool from "./Pool";
import './DApp.scss';
const { ethereum } = window;
const provider = new ethers.providers.Web3Provider(ethereum);

class DApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      haveMetamask: !!ethereum,
      isConnected: false,
      accountAddress: "",
      accountBalance: 0,
      chainId: null,
      chainName: null,
    };
    this.configureListerners();
    this.pool = React.createRef();
  }

  componentDidMount() {
    this.connectWallet();
  }

  async configureListerners() {
    ethereum.on("accountsChanged", (accounts) => {
      this.connectWallet();
    });

    ethereum.on("connect", () => {
      this.connectWallet();
    });

    ethereum.on("disconnect", () => {
      this.connectWallet();
    });

    ethereum.on("chainChanged", async (chainId) => {
      window.location.reload();
    });
  }

  async connectWallet() {
    try {
      const { ethereum } = window;
      this.setState({ haveMetamask: !!ethereum });
      if (!ethereum) {
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length === 0) {
        this.setState({
          isConnected: false,
        });
        return;
      }
      this.setState({
        accountAddress: accounts[0],
        isConnected: true,
      });

      let balance = await provider.getBalance(accounts[0]);
      let bal = ethers.utils.formatEther(balance);
      this.setState({ accountBalance: bal });
      const { name, chainId } = await provider.getNetwork();
      this.setState({ chainName: name, chainId });
      if (this.pool && this.pool.current) 
        this.pool.current.load();
    } catch (e) {
      console.error(e);
      this.setState({
        isConnected: false,
      });
    }
  }
  async refreshBalance() {
    let balance = await provider.getBalance(this.state.accountAddress);
      let bal = ethers.utils.formatEther(balance);
      this.setState({ accountBalance: bal });
  }
  toHex = (num) => {
    return "0x" + num.toString(16);
  };
  async addNetwork() {
    const params = {
      chainId: "0x" + (4).toString(16), // A 0x-prefixed hexadecimal string
      chainName: "Rinkeby",
      nativeCurrency: {
        name: "RinkebyETH",
        symbol: "RinkebyETH", // 2-6 characters long
        decimals: "18",
      },
      rpcUrls: "https://rinkeby.infura.io/v3/",
      blockExplorerUrls: ["https://rinkeby.etherscan.io"],
    };
    try {
      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [params],
      });
    } catch (e) {
      console.error(e);
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: params.chainId }],
      });
    }
    this.connectWallet();
  }
  isRinkeby() {
    return this.state.chainId === 4;
  }
  render() {
    return (
      <div>
        <h2>DApp</h2>
        <p>You need ETHER for start: <a href="https://rinkebyfaucet.com/" target="_blank" rel="noreferrer">
          Get ETHER from Faucet
        </a></p>
        <div>
          {this.state.haveMetamask ? (
            <div >
              {this.state.isConnected ? (
                <div className="MyWalletInfo">
                  <div >
                    <h3>{this.state.chainName}</h3>
                    <h3>Wallet Address:</h3>
                    <p>
                      {this.state.accountAddress.slice(0, 4)}...
                      {this.state.accountAddress.slice(38, 42)}
                    </p>
                  </div>
                  <div>
                    <h3>Wallet Balance:</h3>
                    <p>{this.state.accountBalance} ETH</p>
                  </div>
                </div>
              ) : (
                <></>
              )}
              {this.state.isConnected ? (
                <>
                  <p className="InfoStatus">🎉 Connected Successfully</p>
                  {!this.isRinkeby() ? (
                    <button onClick={() => this.addNetwork()}>
                      Go to Rinkeby
                    </button>
                  ) : (
                    <Pool account={this.state.accountAddress}  ref={this.pool} myBalance={this.state.accountBalance} refreshBalance={() => {this.refreshBalance()}}></Pool>
                  )}
                </>
              ) : (
                <button className="btn" onClick={() => this.connectWallet()}>
                  Connect
                </button>
              )}
            </div>
          ) : (
            <p>Please Install MataMask</p>
          )}
        </div>
      </div>
    );
  }
}

export default DApp;
