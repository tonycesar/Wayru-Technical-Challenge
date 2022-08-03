import React from "react";
import WayruPool from "./wayru-pool";
import { ethers } from "ethers";
import Errors from "../errors/Errors";
import './Pool.scss'; 
class Pool extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isOwner: false,
      balance: 0,
      wallet: "",
      amount: "",
      isLoadingTranfer: false,
      isLoadingDeposit: false,
      isLoadingWithdraw: false,
      errorMessages: [],
    };
    this.wayruPool = new WayruPool();
    this.ref = React.createRef();
  }

  componentDidMount() {
    this.load();
  }

  async load() {
    this.setState({ isLoading: true });
    Promise.all([
      this.wayruPool.isOwner({ from: this.props.account }),
      this.wayruPool.getBalance(),
    ])
      .then(([isOwner, balance]) => {
        let bal = ethers.utils.formatEther(balance);
        this.setState({ isOwner, balance: bal });
        this.setState({ isLoading: false });
      })
      .catch((e) => {
        this.setState({ isLoading: false });
        this.addErrorMessage(e);
      });
  }

  addErrorMessage(e) {
    const message = e.errorCode + (!!e.context ? ": " + e.context : "");
    this.state.errorMessages.push({ message, key: new Date().getTime()});
    this.setState({ errorMessages: this.state.errorMessages });
  }

  removeMessage(position) {
    this.state.errorMessages.splice(position, 1);
    this.setState({ errorMessages: this.state.errorMessages });
  }

  setInput(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  withdraw(e) {
    e.preventDefault();
    if (this.state.isLoadingWithdraw) return;
    this.setState({ isLoadingWithdraw: true });
    this.wayruPool
      .withdraw({ from: this.props.account })
      .then((result) => {
        this.load();
        this.props.refreshBalance();
        this.setState({ isLoadingWithdraw: false });
      })
      .catch((e) => {
        this.setState({ isLoadingWithdraw: false });
        this.addErrorMessage(e);
      });
  }

  transfer(e) {
    e.preventDefault();
    if (this.state.isLoadingTranfer) return;
    this.setState({ isLoadingTranfer: true });

    this.wayruPool
      .transferOwnerTo({ to: this.state.wallet, from: this.props.account })
      .then((result) => {
        this.setState({ wallet: "" });
        this.load();
        this.props.refreshBalance();
        this.setState({ isLoadingTranfer: false });
      })
      .catch((e) => {
        this.setState({ isLoadingTranfer: false });
        this.addErrorMessage(e);
      });
  }

  deposit(e) {
    e.preventDefault();
    if (this.state.isLoadingDeposit) return;
    this.setState({ isLoadingDeposit: true });
    this.wayruPool
      .sendAmount({ amount: this.state.amount, from: this.props.account })
      .then(
        (result) => {
          this.setState({ isLoadingDeposit: false });

          this.setState({ amount: "" });
          this.load();
          this.props.refreshBalance();
        },
        (e) => {
          this.setState({ isLoadingDeposit: false });
          this.addErrorMessage(e);
        }
      );
  }

  render() {
    return (
      <div className="Pool">
        <h3>Wayru Pool</h3>
        { this.state.isLoading ? 'Loading ...':
            <>
        <h4>Current Balance</h4>

        <p>{this.state.balance}</p>
        {this.state.isOwner ? (
          <>
            <h4>Owner Options</h4>
            <button
              onClick={(e) => {
                this.withdraw(e);
              }}
              disabled={this.state.isLoadingWithdraw}> {!this.state.isLoadingWithdraw?'Withdraw':'Loading ...'} </button>

            <form
              onSubmit={(e) => {
                this.transfer(e);
              }}
            >
              <label htmlFor="wallet">Transfer owner to:</label>
              <input
                type="text"
                name="wallet"
                required
                value={this.state.wallet}
                max="42"
                onChange={(e) => {
                  this.setInput(e);
                }}
              />
                        <button disabled={this.state.isLoadingTranfer}> {!this.state.isLoadingTranfer?'Transfer':'Loading ...'} </button>

            </form>
          </>
        ) : (
          <></>
        )}
        <h4>Pool Options</h4>

        <form
          onSubmit={(e) => {
            this.deposit(e);
          }}
        >
          <label htmlFor="amount">ETH:</label>
          <input
            name="amount"
            required
            value={this.state.amount}
            placeholder="0"
            onChange={(e) => {
              this.setInput(e);
            }}
          ></input>
          <button disabled={this.state.isLoadingDeposit}> {!this.state.isLoadingDeposit?'Deposit':'Loading ...'} </button>
        </form>
        </>
    }
        <Errors
          errors={this.state.errorMessages}
          removeMessage={(i) => {
            this.removeMessage(i);
          }}
        ></Errors>
      </div>
    );
  }
}

export default Pool;
