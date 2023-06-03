import React, { useEffect, useRef, useState, Suspense } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";

// import GLTF loader - originally in examples/jsm/loaders/
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// import components:
import BackButton from "../components/BackButton.js";
import VTOButton from "../components/VTOButton.js";

// import neural network model:
import NN from "../contrib/WebARRocksFace/neuralNets/NN_NECKLACE_6.json";

// import WebARRocksMirror, a helper
// This helper is not minified, feel free to customize it (and submit pull requests bro):
import mirrorHelper from "../contrib/WebARRocksFace/helpers/WebARRocksMirror.js";

const model_id = window.location.pathname.split('/').pop();


// import occluder
// import GLTFOccluderModel from "../../assets/necklace3D/models3D/occluder.glb";

// import envMap:
import envMap from "../../assets/necklace3D/envmaps/venice_sunset_1k.hdr";
import { useParams } from "react-router-dom/cjs/react-router-dom.min.js";

let _threeFiber = null;

const get_pauseButtonText = (isPaused) => {
  return isPaused ? "Resume" : "Pause";
};

// fake component, display nothing
// just used to get the Camera and the renderer used by React-fiber:
const ThreeGrabber = (props) => {
  const threeFiber = useThree();
  _threeFiber = threeFiber;

  useFrame(mirrorHelper.update.bind(null, props.sizing, threeFiber.camera));
  mirrorHelper.set_lighting(threeFiber.gl, threeFiber.scene, props.lighting);

  return null;
};

const compute_sizing = () => {
  // compute  size of the canvas:
  const height = window.innerHeight;
  const wWidth = window.innerWidth;
  const width = Math.min(wWidth, height);

  // compute position of the canvas:
  const top = 0;
  const left = (wWidth - width) / 2;
  return { width, height, top, left };
};

const VTOModelContainer = (props) => {
  mirrorHelper.clean();

  const objRef = useRef();
  useEffect(() => {
    const threeObject3DParent = objRef.current;
    const threeObject3D = threeObject3DParent.children[0];
    const model = threeObject3D.children[0];

    mirrorHelper.set_faceFollower(
      threeObject3DParent,
      threeObject3D,
      props.faceIndex
    );
  }, [props.GLTFModel, props.sizing]);

  // import main model:
  const gltf = useLoader(GLTFLoader, props.GLTFModel);
  const model = gltf.scene.clone();

  // import and create occluder:
  // const isDebugOccluder = false; // true to debug the occluder
  // const gltfOccluder = useLoader(GLTFLoader, props.GLTFOccluderModel);
  // const occluderModel = gltfOccluder.scene.clone();
  // const occluderMesh = mirrorHelper.create_occluderMesh(
  //   occluderModel,
  //   isDebugOccluder
  // );

  return (
    <object3D ref={objRef}>
      <object3D>
        <primitive object={model} />
        {/* <primitive object={occluderMesh} /> */}
      </object3D>
    </object3D>
  );
};

const DebugCube = (props) => {
  const s = props.size || 1;
  return (
    <mesh name="debugCube">
      <boxBufferGeometry args={[s, s, s]} />
      <meshNormalMaterial />
    </mesh>
  );
};

const VTONecklace = (props) => {
  const {model_id} = useParams();
  const GLTFNecklaceModel_1 = "https://arpimages.s3.us-west-1.amazonaws.com/aiassets/necklace3D/" + `${model_id}`+ ".glb"
  const PI = 3.1415;
  const scale = 100;

  // state:
  const [sizing, setSizing] = useState(compute_sizing());
  const [model, setModel] = useState(GLTFNecklaceModel_1);
  const [isInitialized] = useState(true);

  const changeModel = (id) => {
    const necklaceList = [
      GLTFNecklaceModel_1,
      GLTFNecklaceModel_2
    ]
    setModel(necklaceList[id]);
  }

  // refs:
  const togglePauseRef = useRef();
  const canvasFaceRef = useRef();

  // misc private vars:
  const _settings = {
    lighting: {
      envMap,
      pointLightIntensity: 0.5, // intensity of the point light. Set to 0 to disable
      pointLightY: 200, // larger -> move the pointLight to the top
      hemiLightIntensity: 0, // intensity of the hemispheric light. Set to 0 to disable (not really useful if we use an envmap)
    },

    // occluder 3D model:
    // GLTFOccluderModel,
  };
  let _timerResize = null;
  let _isPaused = false;

  const handle_resize = () => {
    // do not resize too often:
    if (_timerResize) {
      clearTimeout(_timerResize);
    }
    _timerResize = setTimeout(do_resize, 200);
  };

  const do_resize = () => {
    _timerResize = null;
    const newSizing = compute_sizing();
    setSizing(newSizing);
  };

  useEffect(() => {
    if (_timerResize === null) {
      mirrorHelper.resize();
    }
  }, [sizing]);

  const toggle_pause = () => {
    if (_isPaused) {
      // we are in paused state => resume
      mirrorHelper.resume(true);
    } else {
      mirrorHelper.pause(true);
    }
    _isPaused = !_isPaused;
    togglePauseRef.current.innerHTML = get_pauseButtonText(_isPaused);
  };

  const capture_image = () => {
    const threeCanvas = _threeFiber.gl.domElement;
    mirrorHelper.capture_image(threeCanvas).then((cv) => {
      // download the image in a new window:
      const dataURL = cv.toDataURL("image/png");
      const a = document.createElement('a')
      a.href = dataURL
      a.download = dataURL.split('/').pop()
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    });
  };

  useEffect(() => {
    // init WEBARROCKSFACE through the helper:
    mirrorHelper
      .init({
        NN,
        canvasFace: canvasFaceRef.current,
        maxFacesDetected: 1,
        landmarksStabilizerSpec: {
          // increase stabilization
          beta: 5,
          forceFilterNNInputPxRange: [4, 12],
        },
        scanSettings: {
          threshold: 0.7,
        },
        rotationContraints: {
          order: "YXZ",
          rotXFactor: 1,
          rotYFactor: 0.3,
          rotZFactor: 0.5,
        },
        solvePnPObjPointsPositions: {
          // indices of the points are given as comments.
          // Open dev/torso.blend to get point positions

          torsoNeckCenterUp: [0.000006, -78.16777, 33.542694], // ind: 4,
          torsoNeckCenterDown: [0.000004, -112.370636, 44.173981], // ind: 5,

          torsoNeckLeftUp: [77.729225, -1.220459, -42.653336], // ind: 41,
          torsoNeckLeftDown: [130.661072, -11.937241, -44.70636], // ind: 117,
          torsoNeckRightUp: [-77.898209, -1.191437, -42.648613], // ind: 14,
          torsoNeckRightDown: [-130.661041, -11.937241, -44.70636], // ind: 112,

          torsoNeckBackUp: [-0.040026, -11.528961, -99.635696], // ind: 218,
          torsoNeckBackDown: [0.000007, -47.934677, -127.748184], // ind: 2
        },
        solvePnPImgPointsLabels: [
          "torsoNeckCenterUp",
          "torsoNeckLeftUp",
          "torsoNeckRightUp",
          "torsoNeckBackUp",
          "torsoNeckCenterDown",
          //"torsoNeckLeftDown",
          //"torsoNeckRightDown",
          "torsoNeckBackDown",
        ],
      })
      .then(() => {
        // handle resizing / orientation change:
        window.addEventListener("resize", handle_resize);
        window.addEventListener("orientationchange", handle_resize);
        console.log("WEBARROCKSMIRROR helper has been initialized");
      });

    return () => {
      _threeFiber = null;
      return mirrorHelper.destroy();
    };
  }, [isInitialized]);

  return (
    <div>
      {/* Canvas managed by three fiber, for AR: */}
      <Canvas
        // className="mirrorX"
        style={{
          position: "fixed",
          zIndex: 2,
          ...sizing,
        }}
        gl={{
          preserveDrawingBuffer: true, // allow image capture
        }}
        updateDefaultCamera={false}
      >
        <ThreeGrabber sizing={sizing} lighting={_settings.lighting} />

        <Suspense fallback={<DebugCube />}>
          <VTOModelContainer
            GLTFModel={model}
            // GLTFOccluderModel={_settings.GLTFOccluderModel}
            faceIndex={0}
            sizing={sizing}
          />
        </Suspense>
      </Canvas>

      {/* Canvas managed by WebAR.rocks, just displaying the video (and used for WebGL computations) */}
      <canvas
        // className="mirrorX"
        ref={canvasFaceRef}
        style={{
          position: "fixed",
          zIndex: 1,
          ...sizing,
        }}
        width={sizing.width}
        height={sizing.height}
      />

      <BackButton />
      <VTOButton onClick={capture_image}>Capture</VTOButton>
      {/* <div className="VTOButtons">
        <VTOButton onClick={setModel.bind(null, GLTFNecklaceModel_1)}>Black Panther</VTOButton>
        <VTOButton onClick={setModel.bind(null, GLTFNecklaceModel_2)}>Native American</VTOButton>
        <VTOButton ref={togglePauseRef} onClick={toggle_pause}>{get_pauseButtonText(_isPaused)}</VTOButton>
        <VTOButton onClick={capture_image}>Capture</VTOButton>
      </div> */}
    </div>
  );
};

export default VTONecklace;
