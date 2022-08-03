import React from "react";
import "./Errors.scss";

class Errors extends React.Component {
  render() {
    return (
      <>
        {this.props.errors && this.props.errors.length > 0 ? (
          <div>
            {this.props.errors.map((error, index) => (
              <div className="error">
                {error && error.message ? error.message : error}
                {!!this.props.removeMessage ? (
                  <button
                    onClick={() => {
                      this.props.removeMessage(index);
                    }}
                  >
                    X
                  </button>
                ) : (
                  <></>
                )}
              </div>
            ))}
          </div>
        ) : (
          <></>
        )}
      </>
    );
  }
}

export default Errors;
