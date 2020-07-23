import React from "react";

class VariableCounter extends React.Component {
    count = 0;
  
    render() {
      return (
        <div>
          <p>The count is: {this.count}</p>
          <button onClick={this.increment}>Add one</button>
        </div>
      );
    }
  
    increment = () => {
      this.count = this.count + 1;
      this.forceUpdate();
    };
  }

  export default VariableCounter