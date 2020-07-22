import React from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";

class ThreeViewer extends React.Component {
    componentDidMount() {
        var width = 300
        var height = 300
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        // document.body.appendChild( renderer.domElement );
        // use ref as a mount point of the Three.js scene instead of the document.body
        this.mount.appendChild(renderer.domElement);
        var geometry = new THREE.BoxGeometry(19, 38, 2);
        var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        var cube = new THREE.Mesh(geometry, material);

        var cubeEdges = new THREE.EdgesGeometry(geometry);
        var edges = new THREE.LineSegments(cubeEdges, new THREE.LineBasicMaterial({ color: "orange" }));
        cube.add(edges);
        cube.position.set(10,0,0)
        scene.add(cube);
        camera.position.z = 40;
        camera.position.x = -10;

        var raycaster = new THREE.Raycaster();
        var mouse = new THREE.Vector2();
        var plane = new THREE.Plane();
        var pNormal = new THREE.Vector3(0, 1, 0); // plane's normal
        var planeIntersect = new THREE.Vector3(); // point of intersection with the plane
        var pIntersect = new THREE.Vector3(); // point of intersection with an object (plane's point)
        var shift = new THREE.Vector3(); // distance between position of an object and points of intersection with the object
        var isDragging = false;
        var dragObject;

        var animate = function () {
            requestAnimationFrame(animate);
            //cube.rotation.x += 0.01;
            //cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        };
        animate();
    }
    render() {
        return (
            <div ref={ref => (this.mount = ref)} />
        )
    }
}

export default ThreeViewer;