import React from "react";
import axios from 'axios';
import ThreeViewer from './ThreeViewer.js';
import Jumbotron from 'react-bootstrap/Jumbotron'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button, Form } from "react-bootstrap";

class SquareSet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scale: this.props.scale,
            subsections: this.props.subsections,
            panels: this.props.panels,
            cabinet: this.props.cabinet,
        }


    }

    data = {
        scale: 1,
        cabinet: {
            depth: 36,
            height: 38
        },
        panels: {
            thickness: 2
        },
        subsections: [{
            width: 38,
            config: 1,
            ratio: [1, 1, 0, 0, 0]
        }, {
            width: 38,
            config: 0,
            ratio: [1, 1, 0, 0, 0]
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
            subsections: this.state.subsections.concat([{ width: 38, config: 0, ratio: [1, 1, 0, 0, 0] }])
        });
    }

    handleChange = (idx, event) => {
        const subsections = Object.assign([], this.state.subsections);
        subsections[idx] = event;
        this.setState({ subsections: subsections })
        console.log(event);
    }

    showState = () => {
        const inputJSON = { ...this.state }
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
        if (event.target.name === "thickness") {
            let a = {
                thickness: parseFloat(event.target.value)
            }
            this.setState({ panels: a })
        } else if (event.target.name === "cabDepth") {
            let a = Object.assign({}, this.state.cabinet);
            a["depth"] = parseFloat(event.target.value)
            console.log(JSON.stringify(a));
            this.setState({ cabinet: a })
        } else if (event.target.name === "cabHeight") {
            let a = Object.assign({}, this.state.cabinet);
            a["height"] = parseFloat(event.target.value)
            console.log(JSON.stringify(a));
            this.setState({ cabinet: a })
        }
        else {
            this.setState({ [event.target.name]: parseFloat(event.target.value) })
        }
    }

    ratioChange = (idx, idx1, event) => {
        const ratio = this.state.subsections[idx].ratio
        ratio[idx1] = parseFloat(event.target.value)
        // if (isNaN(parseFloat(event.target.value)))
        //     ratio[idx1] = ""
        this.setState({ ratio: { ...this.state.subsections[idx], ratio: ratio } })
        console.log(this.state)
    }

    updateView = () => {
        //console.log(this.state)
        //this.setState({data : 7})
        this.data = JSON.parse(JSON.stringify(this.state));
        this.refs.child.updateCubes(this.data);
        this.forceUpdate()
    }

    render() {
        //
        return (
            <div>

                <Jumbotron><h1>Generate Paper templates for miniature cabinets</h1></Jumbotron>
                <Container style={{ textAlign: "left" }}>
                    <Row>
                        <Col xs="12" md="12" lg="6">
                            <div > <ThreeViewer ref="child" data={this.data} /></div>
                        </Col>
                        <Col xs="12" md="12" lg="6">
                            <Button variant="outline-primary m-2" onClick={this.updateView}> Show Preview of Cabinet</Button>

                            <Button variant="outline-primary m-2" onClick={this.showState}>Download Template</Button>

                            <br></br>
                            <Form.Group controlId="formBasic">
                                <Form.Label>Scale</Form.Label>
                                <Form.Control type="number" name="scale" defaultValue={this.state.scale} onChange={this.handleChangeMockHL} placeholder="Enter Scale" />
                                <Form.Text className="text-muted">
                                    Model dimensions in mm / Actual dimensions in mm
                                </Form.Text>
                            </Form.Group>

                            <br />
                            <h2>Panels</h2>
                            <Form.Group controlId="formBasic">
                                <Form.Label>Thickenss</Form.Label>
                                <Form.Control type="number" step="0.001" name="thickness" defaultValue={this.state.scale} onChange={this.handleChangeMockHL} placeholder="Enter Thickness" />
                                <Form.Text className="text-muted">
                                    Actual dimension in mm
                                </Form.Text>
                            </Form.Group>
                            <br />
                            <h2>Cabinet</h2>
                            <Form.Group controlId="formBasic">
                                <Form.Label>Depth</Form.Label>
                                <Form.Control type="number" step="0.001" name="cabDepth" defaultValue={this.state.cabinet.depth} onChange={this.handleChangeMockHL} placeholder="Enter Depth" />
                                <Form.Text className="text-muted">
                                    Actual dimension in mm
                                </Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formBasic">
                                <Form.Label>Height</Form.Label>
                                <Form.Control type="number" step="0.001" name="cabHeight" defaultValue={this.state.cabinet.height} onChange={this.handleChangeMockHL} placeholder="Enter Height" />
                                <Form.Text className="text-muted">
                                    Actual dimension in mm
                                </Form.Text>
                            </Form.Group>
                            <br></br>
                            <h2>Subsections<Button variant="outline-secondary m-2" onClick={this.addElement}>+</Button></h2>
                            {


                                this.state.subsections.map((subsection, idx) => (
                                    <>
                                        <h3>Section {idx + 1} <Button variant="outline-secondary m-2" onClick={this.removeElement.bind(this, idx)}>-</Button></h3>
                                        <Form.Group controlId="formBasic">
                                            <Form.Label>Width</Form.Label>
                                            <Form.Control type="number" step="0.001" key={idx} name="width" defaultValue={this.state.cabinet.height} value={subsection.width} onChange={this.handleChangeMock.bind(this, idx)} placeholder="Enter Width" />
                                            <Form.Text className="text-muted">
                                                Actual dimension in mm
                                            </Form.Text>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Custom select</Form.Label>
                                            <Form.Control as="select" custom key={idx + 50} name="config" value={subsection.config} onChange={this.handleChangeMock.bind(this, idx)} >
                                                <option value={1}>Horizontal</option>
                                                <option value={0}>Vertical</option>
                                            </Form.Control>
                                        </Form.Group>

                                        <br />
                                        <Form.Group>

                                            <Form.Label>Panels</Form.Label>
                                            <br></br>
                                            {
                                                subsection.ratio.map((num, idx1) => (
                                                    <>
                                                        <input type="number" step="0.001" onChange={this.ratioChange.bind(this, idx, idx1)} value={num} style={{ width: "4em" }} />
                                                        {(idx1 !== (subsection.ratio.length-1)) && ":"}
                                                    </>
                                                ))
                                            }
                                            <Form.Text className="text-muted">
                                                Ratios
                                            </Form.Text>
                                            </Form.Group>
                                    </>

                                ))
                            }



                        </Col>
                    </Row>
                </Container>
            </div>)
    }
}

SquareSet.defaultProps = {
    scale: 1,
    cabinet: {
        depth: 36,
        height: 38
    },
    panels: {
        thickness: 2
    },
    subsections: [{
        width: 38,
        config: 1,
        ratio: [1, 1, 0, 0, 0]
    }, {
        width: 38,
        config: 0,
        ratio: [1, 1, 0, 0, 0]
    }]
}

export default SquareSet