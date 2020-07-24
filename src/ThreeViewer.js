import React from "react";
import * as THREE from "three";
import _ from 'lodash';

class ThreeViewer extends React.Component {
    constructor(props) {
        super(props)

        this.start = this.start.bind(this)
        this.stop = this.stop.bind(this)
        this.animate = this.animate.bind(this)

        this.state = this.props.data

        this.cubes = new THREE.Object3D()
    }

    removeA(arr) {
        var what, a = arguments, L = a.length, ax;
        while (L > 1 && arr.length) {
            what = a[--L];
            while ((ax = arr.indexOf(what)) !== -1) {
                arr.splice(ax, 1);
            }
        }
        return arr;
    }

    createCubes(data) {
        //this.scene.remove(this.cubes[0])
        for (var i = this.cubes.children.length - 1; i >= 0; i--) {
            this.cubes.remove(this.cubes.children[i]);
        }
        const thickness = data.panels.thickness
        const subsections = data.subsections
        var x1 = 0
        for (var i = 0; i < subsections.length; i++) {
            x1 -= subsections[i].width
        }
        var x = x1 / 2
        for (var i = 0; i < subsections.length; i++) {
            const width = subsections[i].width
            const height = data.cabinet.height
            if (subsections[i].config === 0) {
                const section = subsections[i]
                const ratio = this.removeA([...section.ratio], 0)
                const noOfPanels = ratio.length
                const multiplier = width / ((ratio).reduce(function (a, b) {
                    return a + b;
                }, 0))
                const widthPerPane = (ratio).map(function (x) { return x * multiplier; });
                //console.log(widthPerPane)
                for (var j = 0; j < noOfPanels; j++) {
                    const renderer = new THREE.WebGLRenderer({ antialias: true })
                    const geometry = new THREE.BoxGeometry(widthPerPane[j], height, thickness)
                    const material = new THREE.MeshBasicMaterial({ color: 'white' })
                    let cube = new THREE.Mesh(geometry, material)
                    var edges = new THREE.EdgesHelper(cube, "gray");
                    edges.material.linewidth = 2;
                    cube.position.set(x + widthPerPane[j] / 2, 0, 0)
                    edges.position.set(x + widthPerPane[j] / 2, 0, 0)
                    this.cubes.add(cube)
                    this.cubes.add(edges)
                    x += widthPerPane[j]
                }

            } else {
                const section = subsections[i]
                const ratio = this.removeA([...section.ratio], 0)
                const noOfPanels = ratio.length
                const multiplier = height / ((ratio).reduce(function (a, b) {
                    return a + b;
                }, 0))
                const heightPerPane = (ratio).map(function (x) { return x * multiplier; });
                //console.log(heightPerPane)
                var h = height / 2
                for (var j = 0; j < noOfPanels; j++) {
                    const renderer = new THREE.WebGLRenderer({ antialias: true })
                    const geometry = new THREE.BoxGeometry(width, heightPerPane[j], thickness)
                    const material = new THREE.MeshBasicMaterial({ color: 'white' })
                    let cube = new THREE.Mesh(geometry, material)
                    var edges = new THREE.EdgesHelper(cube, "gray");
                    edges.material.linewidth = 2;
                    console.log(h + heightPerPane[j] / 2)
                    cube.position.set(x + width / 2, h - heightPerPane[j] / 2, 0)
                    edges.position.set(x + width / 2, h - heightPerPane[j] / 2, 0)
                    this.cubes.add(cube)
                    this.cubes.add(edges)
                    h -= heightPerPane[j]
                }
                x += width
            }


        }

        const geometry = new THREE.BoxGeometry(-x1, data.cabinet.height, data.cabinet.depth)
        const material = new THREE.MeshBasicMaterial({ color: 'white' })
        let cube = new THREE.Mesh(geometry, material)
        var edges = new THREE.EdgesHelper(cube, "gray");
        edges.material.linewidth = 2;

        cube.position.set(0, 0, -data.cabinet.depth/2+thickness/2)
        edges.position.set(0, 0, -data.cabinet.depth/2 +thickness/2)

        this.cubes.add(cube)
        this.cubes.add(edges)

        this.cubes.position.z = -data.cabinet.depth/2

        this.scene.add(this.cubes)
        this.camera.position.z = -Math.min(x1, -data.cabinet.height) + data.cabinet.depth/2
    }

    updateCubes(data) {
        //console.log('hi')
        this.createCubes(data);
        //this.forceUpdate();
        //this.cubes[0].geometry = new THREE.BoxGeometry(this.props.data, 1, 1)
        //this.scene.add(this.cubes[0])
    }

    // componentDidUpdate(props) {
    //     // console.log(props.data);
    //     // console.log(this.state);
    //     // if(!( _.isEqual(props.data, this.state) )){
    //     //     this.updateCubes();
    //     // };
    //     // //this.updateCubes();
    // }

    componentDidMount() {

        const width = this.mount.clientWidth
        const height = this.mount.clientHeight

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            1000
        )
        const renderer = new THREE.WebGLRenderer({ antialias: true })

        camera.position.z = 100
        renderer.setClearColor('#000000')
        renderer.setSize(width, height)



        this.scene = scene
        this.camera = camera
        this.renderer = renderer

        this.mount.appendChild(this.renderer.domElement)
        this.start()
        this.createCubes(this.props.data)
    }

    componentWillUnmount() {
        this.stop()
        this.mount.removeChild(this.renderer.domElement)
    }

    start() {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate)
        }
    }

    stop() {
        cancelAnimationFrame(this.frameId)
    }

    animate() {
        //this.cubes.rotation.x += 0.01
        this.cubes.rotation.y += 0.01

        this.renderScene()
        this.frameId = window.requestAnimationFrame(this.animate)
    }

    renderScene() {
        this.renderer.render(this.scene, this.camera)
    }

    render() {
        return (
            <div
                style={{ width: '400px', height: '400px', margin: 'auto' }}
                ref={(mount) => { this.mount = mount }}
            />
        )
    }
}


ThreeViewer.defaultProps = {
    data: {
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
        }, {
            width: 38,
            config: 0,
            ratio: [1, 1, 0, 0, 0]
        }]
    }
}

export default ThreeViewer;