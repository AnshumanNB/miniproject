import { div } from "framer-motion/client";
import React, { useRef, useEffect, useState } from "react";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
const experiments = [
  {
    id: 'exp1',
    label: 'Computer Network - Experiment 1',
    path: '/labs/experiment1',
    rpath: 'experiment1',
    render: (
      <div>
        <h2>Experiment 1</h2>
        <img src="https://robu.in/wp-content/uploads/2024/12/1-51.jpg" alt="" />
        <p>This is the content for Experiment 1.</p>
      </div>
    ),
  },
  {
    id: 'exp2',
    label: 'Theory of Computation - DFA',
    path: '/labs/experiment2',
    rpath: 'experiment2',
    render: (
      <div>
        <DFAExperiment />
        <div style={{}}>
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', background: '#222', color: '#eee', padding: 16, borderRadius: 8, marginTop: '1vh' }}>{`The deterministic finite automaton (DFA) accepts all strings over the alphabet {A, B} that start with the letter A and end with the letter B. It consists of four distinct states: S0, the start state; S1, an intermediate state; S2, the accepting state; and Dead, which rejects invalid strings.

The transitions are defined to enforce the conditions of starting with A and ending with B. From the start state S0, if the input is A, the DFA moves to S1, marking that the first character is valid. If the input is B, it moves to the Dead state, since the string does not begin properly.

In state S1, the DFA processes the middle part of the string. If the input is A, it remains in S1, allowing any number of A's after the first character. If the input is B, it transitions to S2, indicating the string now ends with a B, a necessary condition for acceptance.

Once in the accepting state S2, the machine loops on B, maintaining acceptance for strings ending with B. If an A is read in this state, it goes back to S1, as the string’s last character is no longer a B, hence the string may no longer be accepted if it finishes here.

The Dead state acts as a sink state that absorbs any string that violates the conditions, looping on all inputs to signify rejection clearly.

This design successfully recognizes strings like AB, AAB, AAAB, ABB, and ABAB—all of which start with A and end with B. It rejects the empty string, strings that don't begin with A, or end with B, such as B, A, and ABA.

The DFA is minimal and efficient, using only four states to capture all necessary behaviors. It processes inputs in linear time with constant space, tracking only the current state. The transitions precisely reflect the constraints on the string’s start and end, ensuring correctness.`}</pre>
        </div>
      </div>
    ),
  },
  // Add more experiments similarly
];

function DFAExperiment() {
  const STATE_RADIUS = 0.5;
  const HIGHLIGHT_COLOR = 0xffff00;

  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);

  const [inputString, setInputString] = useState('');
  const [currentState, setCurrentState] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const [transitionLog, setTransitionLog] = useState([]);
  const [finalResult, setFinalResult] = useState(null); // 'ACCEPTED' or 'REJECTED'

  const transitions = {
    S0: { A: 'S1' },
    S1: { A: 'S1', B: 'S2' },
    S2: { A: 'S1', B: 'S2' },
    Dead: { A: 'Dead', B: 'Dead' },
  };

  const positions = {
    S0: new THREE.Vector3(-2, 0, 0),
    S1: new THREE.Vector3(0, 1.5, 0),
    S2: new THREE.Vector3(2, 0, 0),
    Dead: new THREE.Vector3(0, -1.5, 0),
  };

  const stateColors = {
    S0: 0x00ff00,
    S1: 0xffff00,
    S2: 0x0000ff,
    Dead: 0xff0000,
  };

  const stateMeshes = useRef({});
  const labelSprites = useRef({});

  useEffect(() => {
    if (!sceneRef.current) return;

    const width = sceneRef.current.clientWidth;
    const height = sceneRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    sceneRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    function createState(stateId) {
      const color = stateColors[stateId];
      const geom = new THREE.SphereGeometry(STATE_RADIUS, 32, 32);
      const mat = new THREE.MeshBasicMaterial({ color });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.copy(positions[stateId]);
      scene.add(mesh);

      const outlineGeom = new THREE.SphereGeometry(STATE_RADIUS * 1.15, 32, 32);
      const outlineMat = new THREE.MeshBasicMaterial({
        color: HIGHLIGHT_COLOR,
        side: THREE.BackSide,
        transparent: true,
        opacity: 0,
      });
      const outline = new THREE.Mesh(outlineGeom, outlineMat);
      outline.position.copy(positions[stateId]);
      scene.add(outline);

      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      ctx.font = 'bold 28px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText(stateId, canvas.width / 2, 48);
      const texture = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(1.6, 0.4, 1);
      sprite.position.set(positions[stateId].x, positions[stateId].y - STATE_RADIUS * 2, positions[stateId].z);
      scene.add(sprite);

      return { mesh, outline };
    }

    Object.keys(positions).forEach((stateId) => {
      const { mesh, outline } = createState(stateId);
      stateMeshes.current[stateId] = { mesh, outline };
      labelSprites.current[stateId] = mesh;
    });

    function drawLine(from, to) {
      const points = [from, to];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: 0xffffff });
      const line = new THREE.Line(geometry, material);
      scene.add(line);
    }

    function drawLoop(pos) {
      const curve = new THREE.EllipseCurve(
        pos.x,
        pos.y + STATE_RADIUS * 1.5,
        STATE_RADIUS * 0.7,
        STATE_RADIUS * 0.7,
        0,
        2 * Math.PI,
        false,
        0
      );
      const points = curve.getPoints(50);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: 0xffffff });
      const ellipse = new THREE.LineLoop(geometry, material);
      scene.add(ellipse);
    }

    drawLine(positions.S0, positions.S1);
    drawLine(positions.S0, positions.Dead);
    drawLoop(positions.S1);
    drawLine(positions.S1, positions.S2);
    drawLine(positions.S1, positions.Dead);
    drawLoop(positions.S2);
    drawLoop(positions.Dead);

    const legend = document.createElement('div');
    legend.style.position = 'absolute';
    legend.style.top = '10px';
    legend.style.left = '10px';
    legend.style.backgroundColor = 'rgba(30,30,30,0.8)';
    legend.style.padding = '10px 16px';
    legend.style.borderRadius = '10px';
    legend.style.fontFamily = 'Arial, sans-serif';
    legend.style.boxShadow = '0 3px 15px rgba(0,0,0,0.5)';
    legend.style.fontSize = '14px';
    legend.style.userSelect = 'none';
    legend.style.color = '#fff';
    legend.style.zIndex = 10;
    legend.innerHTML = `
      <div style="margin-bottom:8px; font-weight:bold; font-size:16px;">Legend</div>
      <div style="display:flex; align-items:center; margin-bottom:6px;">
        <div style="width:16px; height:16px; background:#00ff00; border-radius:3px; margin-right:10px;"></div> Start State
      </div>
      <div style="display:flex; align-items:center; margin-bottom:6px;">
        <div style="width:16px; height:16px; background:#ff0000; border-radius:3px; margin-right:10px;"></div> Dead State
      </div>
      <div style="display:flex; align-items:center; margin-bottom:6px;">
        <div style="width:16px; height:16px; background:#0000ff; border-radius:3px; margin-right:10px;"></div> Final State
      </div>
      <div style="display:flex; align-items:center;">
        <div style="width:16px; height:16px; background:#ffff00; border-radius:3px; margin-right:10px;"></div> Other States
      </div>
    `;
    sceneRef.current.style.position = 'relative';
    sceneRef.current.appendChild(legend);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      Object.values(stateMeshes.current).forEach(({ mesh, outline }) => {
        scene.remove(mesh);
        scene.remove(outline);
        mesh.geometry.dispose();
        outline.geometry.dispose();
        mesh.material.dispose();
        outline.material.dispose();
      });
      Object.values(labelSprites.current).forEach((sprite) => {
        scene.remove(sprite);
        if (sprite.material.map) sprite.material.map.dispose();
        sprite.material.dispose();
      });
      scene.clear();
      controls.dispose();
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
      if (legend.parentNode) {
        legend.parentNode.removeChild(legend);
      }
    };
  }, []);

  useEffect(() => {
    if (!currentState || !stateMeshes.current[currentState]) return;
    Object.values(stateMeshes.current).forEach(({ outline }) => (outline.material.opacity = 0));
    const outline = stateMeshes.current[currentState].outline;
    outline.material.opacity = 1.0;
  }, [currentState]);

  const parseString = () => {
    if (isParsing || !inputString) return;

    setIsParsing(true);
    setTransitionLog([]);
    setFinalResult(null);

    let state = 'S0';
    setCurrentState(state);

    const chars = inputString.trim().toUpperCase().split('');
    let idx = 0;

    setTimeout(() => {
      const step = () => {
        if (idx >= chars.length) {
          setIsParsing(false);

          // Check accept condition: ends in S2 and last char is 'B'
          if (state === 'S2' && chars.length > 0 && chars[chars.length - 1] === 'B') {
            setFinalResult('ACCEPTED');
          } else {
            setFinalResult('REJECTED');
          }
          return;
        }
        const c = chars[idx];
        const nextState = transitions[state]?.[c] || 'Dead';

        setTransitionLog((log) => [...log, `δ(${state}, '${c}') = ${nextState}`]);

        state = nextState;
        setCurrentState(state);
        idx++;
        setTimeout(step, 700);
      };
      step();
    }, 5000); // 5 sec initial highlight prev functionality
  };

  return (
    <div>
      <h2 style={{ color: 'white' }}>
        DFA Simulation - String starts with A and ends with B
      </h2>
      <p style={{ color: 'white' }}>
        Rotate the DFA with mouse drag, zoom with scroll.
      </p>

      <div
        ref={sceneRef}
        style={{
          position: 'relative',
          width: '800px',
          height: '500px',
          border: '1px solid #444',
          marginBottom: 12,
          backgroundColor: 'black',
          overflow: 'hidden',
        }}
      >
        {/* Transition Log */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '280px',
            maxHeight: '480px',
            overflowY: 'auto',
            backgroundColor: 'rgba(30,30,30,0.8)',
            borderRadius: '10px',
            padding: '10px 16px',
            fontFamily: 'monospace',
            fontSize: '13px',
            color: '#fff',
            boxShadow: '0 3px 15px rgba(0,0,0,0.5)',
            userSelect: 'none',
            zIndex: 10,
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Transition Log</div>
          {transitionLog.length === 0 && <div>No transitions yet.</div>}
          {transitionLog.map((t, idx) => (
            <div key={idx}>{t}</div>
          ))}
          {finalResult && (
            <div
              style={{
                marginTop: '12px',
                fontWeight: 'bold',
                color: finalResult === 'ACCEPTED' ? '#00ff00' : '#ff4444',
                fontSize: '16px',
              }}
            >
              {finalResult}
            </div>
          )}
        </div>
      </div>

      <input
        value={inputString}
        onChange={(e) => setInputString(e.target.value)}
        placeholder="Enter string (A/B characters)"
        style={{ fontSize: 16, padding: 6, width: 300, marginRight: 8 }}
        disabled={isParsing}
      />
      <button
        onClick={parseString}
        disabled={isParsing || !inputString}
        style={{ fontSize: 16, padding: '6px 12px' }}
      >
        {isParsing ? 'Parsing...' : 'Parse String'}
      </button>
    </div>
  );
}


export default experiments;
