import React from "react";

class Square extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: this.props.square.width,
            height: this.props.square.height
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: parseFloat(event.target.value) });
        this.props.handleValueChange(this.props.name, this.state)
    }

    handleClick = (event) =>{
        this.props.removeChild(this.props.name);
    }


    componentDidUpdate() {
        if (this.props.onChange) {
            this.props.onChange(this.state)
        }
    }

    showStatus = (event) => {
        alert(JSON.stringify(this.state))
    }

    render() {
        console.log(JSON.stringify(this.props))
        return (
            <div>
                <h4>Section {this.props.name + 1} <button onClick={this.handleClick}>-</button></h4>
                <label>Width</label>
                <input type="text" name="width" value={this.props.square.width} onChange={this.handleChange} />
                <br />
                <label>Height</label>
                <input type="text" name="height" value={this.props.square.height} onChange={this.handleChange} />
                <br />
                
                {this.props.debug &&
                    <button onClick={this.showStatus}>Show Status</button>}
            </div>
        )
    }
}

Square.defaultProps = {
    square: {
        width: 10,
        height: 10
    }
}

export default Square