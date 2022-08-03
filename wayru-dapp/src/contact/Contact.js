import React from "react";
import "./Contact.scss";

class Errors extends React.Component {

  render() {
    return (
      <>
        {(this.props.errors && this.props.errors.length > 0) ? (
          <div>
            {this.props.errors.map((error) => (
              <div className="error">{ error }</div>
            ))}
          </div>
        ) : (
          <></>
        )}
      </>
    );
  }
}

class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        email: "",
        isEmailValid: true,
        reason: "",
        reasonInvalid: [],
        description: "",
        desciptionInvalid: [],
        isLoading: false
      };
  }

  initState() {
    this.setState({
        email: "",
        isEmailValid: true,
        reason: "",
        reasonInvalid: [],
        description: "",
        desciptionInvalid: [],
        isLoading: false
      });
  }

  validateEmail() {
    var exp = /\S+@\S+\.\S[\S]+/;
    let isValid = exp.test(this.state.email);
    this.setState({ isEmailValid: isValid });
    return isValid;
  }

  validateReason() {
    let reasons = [];
    if (this.state.reason.split(" ").length < 2) {
      reasons.push("Min 2 words");
    }
    if (this.state.reason.length > 20) {
      reasons.push("Max 20 characters");
    }
    this.setState({ reasonInvalid: reasons });
    return reasons.length === 0;
  }

  validateDescription() {
    let reasons = [];
    if (this.state.description.split("\n").length > 2) {
      reasons.push("Max 2 paragraphs");
    }
    if (this.state.description.length > 20) {
      reasons.push("Max 20 characters");
    }
    this.setState({ desciptionInvalid: reasons });
    return reasons.length === 0;
  }

  onSubmit(event) {
    event.preventDefault();
    if(this.state.isLoading) return;
    let isValidEmail = this.validateEmail();
    let isValidReason = this.validateReason();
    let isValidDescription = this.validateDescription();
    if (isValidDescription && isValidEmail && isValidReason) {
        this.sendEmail({email: this.state.email, reason: this.state.reason, description: this.state.description});
    }
  }

  sendEmail(body) {
    this.setState({isLoading: true});
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };
    fetch('https://reqres.in/api/posts', requestOptions)
        .then(response => response.json())
        .then(data =>  {
            this.initState();
        }).catch(error => {
            this.setState({isLoading: true});
        });
  }

  setInput(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <div>
        <form onSubmit={(e) => this.onSubmit(e)}>
          <h2>Conctact form</h2>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              required
              value={this.state.email}
              onChange={(e) => {
                this.setInput(e);
              }}
            />
            {!this.state.isEmailValid ? <Errors errors={["The email is invalid"]}></Errors> : <></>}
          </div>
          <div>
            <label htmlFor="reason">Reason:</label>
            <input
              type="text"
              name="reason"
              required
              value={this.state.reason}
              max="20"
              onChange={(e) => {
                this.setInput(e);
              }}
            />
            <Errors errors={this.state.reasonInvalid}></Errors>
          </div>
          <div>
            <label htmlFor="reason">Description:</label>
            <textarea
              type="text"
              name="description"
              required
              value={this.state.description}
              max="100"
              onChange={(e) => {
                this.setInput(e);
              }}
            />
            <Errors errors={this.state.desciptionInvalid}></Errors>
          </div>
          <button type="submit" disabled={this.state.isLoading}>Send Mail</button>
          {this.state.isLoading ? <div>Loading ...</div> : <></> }
        </form>
      </div>
    );
  }
}

export default Contact;
