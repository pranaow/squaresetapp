import React from "react";
import Square from './Square.js'

class SquareSet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squareset: this.props.squareset
        }
    }

    removeElement = (idx) => {
        this.setState({
            squareset: this.state.squareset.filter((person, index) => {
                if (index !== idx) {

                    return person
                };
            })
        });
    }

    addElement = () => {
        this.setState({
            squareset: this.state.squareset.concat([{width : 11, height:12}])
        });
    }

    // handleChange = (idx, event) => {
    //     this.setState({
    //         squareset: this.state.squareset.filter((person, index) => {
    //             if (index !== idx) {

    //                 return person
    //             }else{
    //                 return event;
    //             };
    //         })
    //     });
    // }

    render() {
        return (
            <div>
                <button onClick={() => {
                    alert(JSON.stringify(this.state))
                }}>update</button>
                <button onClick={this.addElement}>add</button>
                {
                    this.state.squareset.map((square,idx)=>(
                        <Square debug="1" key={idx} name={idx} square={square} handleValueChange={this.handleChange} removeChild={this.removeElement}/>
                    ))
                }
                
            </div>)
    }
}

SquareSet.defaultProps = {
    squareset: [{
        width: 10,
        height: 10
    }, {
        width: 20,
        height: 20
    }, {
        width: 30,
        height: 30
    }]
}

export default SquareSet