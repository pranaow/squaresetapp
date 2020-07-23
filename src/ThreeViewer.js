import React from "react";
import * as THREE from "three";

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

    createCubes() {
        //this.scene.remove(this.cubes[0])
        for (var i = this.cubes.children.length - 1; i >= 0; i--) {
            this.cubes.remove(this.cubes.children[i]);
        }
        const thickness = this.props.data.panels.thickness
        const subsections = this.props.data.subsections
        var x1 = 0
        for (var i = 0; i < subsections.length; i++){
            x1 -= subsections[i].width
        }
        var x = x1/2        
        for (var i = 0; i < subsections.length; i++) {
            const width = subsections[i].width
            const height = this.props.data.cabinet.height
            if (subsections[i].config) {
                const section = subsections[i]
                const ratio = this.removeA([...section.ratio], 0)
                const noOfPanels = ratio.length
                const multiplier = width / ((ratio).reduce(function (a, b) {
                    return a + b;
                }, 0))
                const widthPerPane = (ratio).map(function (x) { return x * multiplier; });
                console.log(widthPerPane)
                for (var j = 0; j < noOfPanels; j++) {
                    const renderer = new THREE.WebGLRenderer({ antialias: true })
                    const geometry = new THREE.BoxGeometry(widthPerPane[j], height, thickness)
                    const material = new THREE.MeshBasicMaterial({ color: 'blue' })
                    let cube = new THREE.Mesh(geometry, material)
                    var edges = new THREE.EdgesHelper(cube, "gray");
                    edges.material.linewidth = 2;
                    cube.position.set(x + widthPerPane[j]/2, 0, 0)
                    edges.position.set(x + widthPerPane[j]/2, 0, 0)
                    this.cubes.add(cube)
                    this.cubes.add(edges)
                    x += widthPerPane[j]
                }

            }else{
                const section = subsections[i]
                const ratio = this.removeA([...section.ratio], 0)
                const noOfPanels = ratio.length
                const multiplier = height / ((ratio).reduce(function (a, b) {
                    return a + b;
                }, 0))
                const heightPerPane = (ratio).map(function (x) { return x * multiplier; });
                console.log(heightPerPane)
                var h = 0
                for (var j = 0; j < noOfPanels; j++) {
                    const renderer = new THREE.WebGLRenderer({ antialias: true })
                    const geometry = new THREE.BoxGeometry(width, heightPerPane[j], thickness)
                    const material = new THREE.MeshBasicMaterial({ color: 'blue' })
                    let cube = new THREE.Mesh(geometry, material)
                    var edges = new THREE.EdgesHelper(cube, "gray");
                    edges.material.linewidth = 2;
                    cube.position.set(x + width/2, h + heightPerPane[j]/2, 0)
                    edges.position.set(x + width/2, h + heightPerPane[j]/2, 0)
                    this.cubes.add(cube)
                    this.cubes.add(edges)
                    h -= heightPerPane[j]
                }
                x += width
            }

            
        }
        this.scene.add(this.cubes)
        this.camera.position.z = -x1
    }

    updateCubes() {
        this.createCubes()

        //this.cubes[0].geometry = new THREE.BoxGeometry(this.props.data, 1, 1)
        //this.scene.add(this.cubes[0])
    }

    componentDidUpdate() {
        this.updateCubes();
    }

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
        this.createCubes()  
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