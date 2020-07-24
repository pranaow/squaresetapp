import React from "react";
import axios from 'axios';
import ThreeViewer from './ThreeViewer.js';

class SquareSet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scale: this.props.scale,
            subsections: this.props.subsections,
            panels : this.props.panels,
            cabinet : this.props.cabinet,
        }
        
        
    }

    data =  {
        scale: 1,
        cabinet : {
            depth : 36,
            height: 38
        },
        panels: {
            thickness: 2
        },
        subsections: [{
            width: 38,
            config: 1,
            ratio : [1,1,0,0,0]
        }, {
            width: 38,
            config: 0,
            ratio : [1,1,0,0,0]
        }]
    }
    x = 1

    removeElement = (idx) => {
        console.log(idx)
        const subsections = Object.assign([], this.state.subsections);
        subsections.splice(idx, 1);
        console.log(JSON.stringify(subsections))
        this.setState({ subsections: subsections })
        // this.setState({
        //     subsections: this.state.subsections.filter((person, index) => {
        //         if (index !== idx) {

        //             return person
        //         };
        //     })
        // });
    }

    addElement = () => {
        this.setState({
            subsections: this.state.subsections.concat([{ width: 38, config: 0, ratio: [1,1,0,0,0] }])
        });
    }

    handleChange = (idx, event) => {
        const subsections = Object.assign([], this.state.subsections);
        subsections[idx] = event;
        this.setState({ subsections: subsections })
        console.log(event);
    }

    showState = () => {
        const inputJSON = {...this.state}
        console.log(inputJSON);
        axios.post('https://pranaowalekar.pythonanywhere.com/generateCabinet', inputJSON).then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'file.svg'); //or any other extension
            document.body.appendChild(link);
            link.click();
        }).catch(error => {
            alert("Something went wrong. Please try again later.");
        });
    }

    handleChangeMock = (idx, event) => {
        const subsections = Object.assign([], this.state.subsections);
        subsections[idx][event.target.name] = parseFloat(event.target.value);
        this.setState({ subsections: subsections })
        console.log(JSON.stringify(this.state))
    }

    handleChangeMockHL = (event) => {
        if (event.target.name === "thickness"){
            let a = {
                thickness : parseFloat(event.target.value)
            }
            this.setState({ panels:  a})
        }else if(event.target.name === "cabDepth"){
            let a = Object.assign({}, this.state.cabinet);
            a["depth"] = parseFloat(event.target.value)
            console.log(JSON.stringify(a));
            this.setState({cabinet:a})
        }else if(event.target.name === "cabHeight"){
            let a = Object.assign({}, this.state.cabinet);
            a["height"] = parseFloat(event.target.value)
            console.log(JSON.stringify(a));
            this.setState({cabinet:a})
        }
        else{
            this.setState({ [event.target.name]: parseFloat(event.target.value) })
        }
    }

    ratioChange = (idx, idx1, event) => {
        const ratio = this.state.subsections[idx].ratio
        ratio[idx1] = parseFloat(event.target.value)
        // if (isNaN(parseFloat(event.target.value)))
        //     ratio[idx1] = ""
        this.setState({ratio : {...this.state.subsections[idx], ratio:ratio}})
        console.log(this.state)
    }

    updateView = () => {
        //console.log(this.state)
        //this.setState({data : 7})
        this.data =JSON.parse(JSON.stringify(this.state));
        this.refs.child.updateCubes(this.data);
        this.forceUpdate()
    }

    render() {
        //
        return (
            <div>
                
                <h1>Generate Paper templates for miniature cabinets</h1>
                <div > <ThreeViewer ref="child"  data={this.data}/></div>
                <button onClick={this.updateView}>Show Preview of Cabinet</button>

                <button onClick={this.showState}>Download Template</button>
                
                <br></br>
                Scale:<input type="text" name="scale" defaultValue={this.state.scale} onChange={this.handleChangeMockHL} /> Model/Actual
                <br />
                <h2>Panels</h2>
                Thickness (mm):<input type="number" scale="0.001" name="thickness" defaultValue={this.state.scale} onChange={this.handleChangeMockHL} />
                <br />
                <h2>Cabinet</h2>
                Depth (mm):<input type="text" name="cabDepth" defaultValue={this.state.cabinet.depth} onChange={this.handleChangeMockHL} />
                <br/>
                Height (mm):<input type="text" name="cabHeight" defaultValue={this.state.cabinet.height} onChange={this.handleChangeMockHL} />
                <br></br>
                <h2>Subsections<button onClick={this.addElement}>+</button></h2>
                {


                    this.state.subsections.map((subsection, idx) => (
                        <>
                            <h3>Section {idx + 1} <button onClick={this.removeElement.bind(this, idx)}>-</button></h3>
                            
                        Width (mm):<input type="number" step="0.0001" key={idx} name="width" value={subsection.width} onChange={this.handleChangeMock.bind(this, idx)} />
                            <br />
                        Panel Configuration: <select  key={idx + 50} name="config" value={subsection.config} onChange={this.handleChangeMock.bind(this, idx)} >
                            <option value={0}>Vertical</option>
                            <option value={1}>Horizontal</option>
                        </select>

                            <br />
                            Panel Ratios
                            {
                                subsection.ratio.map((num, idx1) => (
                                    <>
                                    <input type="number" step="0.001" onChange={this.ratioChange.bind(this, idx, idx1)} value={num} style={{width : "3em"}}/>
                                    {(idx1 !== subsection.ratio.length-1) && ":"}
                                    </>
                                ))
                            }
                        </>

                    ))
                }

            </div>)
    }
}

SquareSet.defaultProps = {
    scale: 1,
    cabinet : {
        depth : 36,
        height: 38
    },
    panels: {
        thickness: 2
    },
    subsections: [{
        width: 38,
        config: 1,
        ratio : [1,1,0,0,0]
    }, {
        width: 38,
        config: 0,
        ratio : [1,1,0,0,0]
    }]
}

export default SquareSet