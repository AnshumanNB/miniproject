import { div } from "framer-motion/client";
import React, { useRef, useEffect, useState } from "react";
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
const experiments = [
  {
    id: 'exp1',
    label: 'Computer Network - Network Topology',
    path: '/labs/experiment1',
    rpath: 'experiment1',
    render: (
      <NetworkTopology3D />
    ),
  },
  {
    id: 'exp2',
    label: 'Computer Network - Sliding Window',
    path: '/labs/experiment2',
    rpath: 'experiment2',
    render: (
      <SlidingWindowExperiment />
    ),
  },
  {
    id: 'exp3',
    label: 'Computer Network - Stop and Wait ARQ',
    path: '/labs/experiment3',
    rpath: 'experiment3',
    render: (
      <StopAndWaitVertical />
    ),
  },
  {
    id: 'exp4',
    label: 'Computer Network - Dijkstra\'s Algortihm',
    path: '/labs/experiment4',
    rpath: 'experiment4',
    render: (
      <DijkstraVisualization />
    ),
  },
  {
    id: 'exp21',
    label: 'Theory of Computation - DFA',
    path: '/labs/experiment21',
    rpath: 'experiment21',
    render: (
      <DFAExperiment />
    ),
  },
  // Add more experiments similarly
];

function NetworkTopology3D() {
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);

  const topologies = ["Bus", "Star", "Ring", "Mesh"];
  const [selectedTopology, setSelectedTopology] = React.useState("Bus");

  useEffect(() => {
    const container = sceneRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    // Smaller size: e.g., 600x400
    renderer.setSize(1100, 400);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    const nodes = [];

    // const createLabels = (labelText, position) => {
    //   const canvas = document.createElement("canvas");
    //   const ctx = canvas.getContext("2d");
    //   ctx.font = "Bold 24px Arial";
    //   ctx.fillStyle = "white";
    //   ctx.fillText(labelText, 0, 24);
    //   const texture = new THREE.CanvasTexture(canvas);
    //   const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    //   const sprite = new THREE.Sprite(spriteMaterial);
    //   sprite.scale.set(6, 3, 3);
    //   sprite.position.copy(position);
    //   scene.add(sprite);
    //   return sprite;
    // };

    const createTopology = (type) => {
      scene.children = [];
      nodes.length = 0;

      const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const nodeGeometry = new THREE.SphereGeometry(0.4, 16, 16);

      switch (type) {
        case "Bus":
          for (let i = 0; i < 5; i++) {
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
            node.position.set(i * 2 - 4, 0, 0);
            scene.add(node);
            nodes.push(node);
            //createLabels("Node " + i, node.position.clone().add(new THREE.Vector3(0, 0, 0)));
          }
          for (let i = 0; i < nodes.length - 1; i++) {
            const material = new THREE.LineBasicMaterial({ color: 0xffffff });
            const points = [nodes[i].position, nodes[i + 1].position];
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            scene.add(new THREE.Line(geometry, material));
          }
          break;

        case "Star":
          const center = new THREE.Vector3(0, 0, 0);
          for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
            node.position.set(Math.cos(angle) * 4, Math.sin(angle) * 4, 0);
            scene.add(node);
            nodes.push(node);
            //createLabels("Node " + i, node.position.clone().add(new THREE.Vector3(0, 0, 0)));
            // Connect to center
            const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff });
            const lineGeo = new THREE.BufferGeometry().setFromPoints([center, node.position]);
            scene.add(new THREE.Line(lineGeo, lineMat));
          }
          break;

        case "Ring":
          for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
            node.position.set(Math.cos(angle) * 5, Math.sin(angle) * 5, 0);
            scene.add(node);
            nodes.push(node);
            //createLabels("Node " + i, node.position.clone().add(new THREE.Vector3(0, 0, 0)));
          }
          // Connect in ring
          for (let i = 0; i < nodes.length; i++) {
            const nextIndex = (i + 1) % nodes.length;
            const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff });
            const points = [nodes[i].position, nodes[nextIndex].position];
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            scene.add(new THREE.Line(geometry, lineMat));
          }
          break;

        case "Mesh":
          const vertices = [
            [1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1],
            [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1]
          ];
          for (let i = 0; i < vertices.length; i++) {
            const v = vertices[i];
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
            node.position.set(v[0]*3, v[1]*3, v[2]*3);
            scene.add(node);
            nodes.push(node);
            //createLabels("Node " + i, node.position.clone().add(new THREE.Vector3(0, 0, 0)));
          }
          // Connect edges
          const edgesToConnect = [
            [0,1],[1,3],[3,2],[2,0],
            [4,5],[5,7],[7,6],[6,4],
            [0,4],[1,5],[2,6],[3,7],
          ];
          for (const [a, b] of edgesToConnect) {
            const lineGeo = new THREE.BufferGeometry().setFromPoints([nodes[a].position, nodes[b].position]);
            scene.add(new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0xffffff })));
          }
          break;
      }
    };

    createTopology(selectedTopology);

    // Animate
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      scene.children.forEach(c => {
        if (c.geometry) c.geometry.dispose();
        if (c.material) c.material.dispose();
      });
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
    };
  }, [selectedTopology]);

  return (
    <div style={{display:'flex', flexDirection:'column', gap:'70px'}}>
    <div style={{ width: "100%", height: "400px", position: "relative" }}> {/* Smaller container */}
      <h2 style={{ color: "#fff" }}>Network Topologies in 3D</h2>
      <select
        value={selectedTopology}
        onChange={(e) => setSelectedTopology(e.target.value)}
        style={{ marginBottom: 10, padding: 4 }}
      >
        {topologies.map((topo) => (
          <option key={topo} value={topo}>{topo}</option>
        ))}
      </select>
      <div
        ref={sceneRef}
        style={{
          width: "100%",
          height: "100%",
          border: "1px solid #444",
          backgroundColor: "#000",
          overflow: "hidden",
          borderRadius: 8,
        }}
      ></div>
    </div>
    <pre
        style={{
          marginTop: "40px",
          background: "#222",
          color: "#eee",
          padding: 16,
          borderRadius: 8,
          whiteSpace: "pre-wrap",
          fontFamily: "monospace",
        }}
      >{`This experiment helps you explore and understand different types of network topologies by visualizing them in a 3D environment. It demonstrates how nodes (devices or switches) are connected in various arrangements, helping you grasp their structure and differences.

Key Concepts

Network Topology: The pattern or layout of connections between devices in a network. It affects how data flows, how robust the network is, and how easy or complex it is to manage.

Common Topologies:

Bus: All nodes connect to a single shared line. Simple but vulnerable—if the main line fails, the whole network stops.

Star: All nodes connect to a central hub. If the hub fails, the entire network is affected; however, individual node failures are isolated.

Ring: Nodes form a closed loop, each connected to two neighbors. Data travels around the ring; breaking the loop can disrupt network flow unless protections are in place.

Mesh: Every node connects directly to every other node. Very reliable due to multiple paths but requires many cables and complex setup.`}</pre>
    </div>
  );
}

function SlidingWindowExperiment() {
  const [windowSize, setWindowSize] = useState(4);
  const [totalFrames, setTotalFrames] = useState(10);
  const [currentWindowStart, setCurrentWindowStart] = useState(0);
  const [acknowledged, setAcknowledged] = useState([]);
  const [inTransit, setInTransit] = useState([]);
  const [lostPackets, setLostPackets] = useState([]);
  const [log, setLog] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const sendFrames = () => {
    if (isRunning) return;

    setIsRunning(true);
    setLog([]);
    setAcknowledged([]);
    setInTransit([]);
    setLostPackets([]);
    setCurrentWindowStart(0);

    let windowStart = 0;
    let windowEnd = Math.min(windowSize, totalFrames);
    let tempAck = [];
    let tempTransit = [];
    let frameIndex = windowStart;

    const simulateStep = () => {
      if (windowStart >= totalFrames) {
        setIsRunning(false);
        setLog((prev) => [...prev, "All frames transmitted successfully."]);
        return;
      }

      if (frameIndex < windowEnd) {
        tempTransit.push(frameIndex);
        setInTransit([...tempTransit]);
        setLog((prev) => [...prev, `Sent frame ${frameIndex}`]);
        frameIndex++;
        setTimeout(simulateStep, 700);
      } else {
        setTimeout(() => {
          const ackFrames = tempTransit.filter(() => Math.random() > 0.1); // ~10% loss
          const lost = tempTransit.filter((f) => !ackFrames.includes(f));

          setAcknowledged((prev) => [...prev, ...ackFrames]);
          setLostPackets((prev) => [...prev, ...lost]);

          const sentCount = ackFrames.length;
          const totalCount = tempTransit.length;

          setLog((prev) => [
            ...prev,
            `Acknowledged frames: ${ackFrames.join(", ") || "None"}`,
            `Successfully transferred ${sentCount} out of ${totalCount} frames in this window.`,
            lost.length > 0 ? `Timeout / Missing ACK for frames: ${lost.join(", ")}` : null,
          ].filter(Boolean));

          windowStart = ackFrames.length > 0 ? ackFrames[ackFrames.length - 1] + 1 : windowStart;
          windowEnd = Math.min(windowStart + windowSize, totalFrames);
          setCurrentWindowStart(windowStart);

          tempTransit = [];
          setInTransit([]);
          frameIndex = windowStart;

          simulateStep();
        }, 1000);
      }
    };

    simulateStep();
  };

  const isAcked = (i) => acknowledged.includes(i);
  const isInTransitFrame = (i) => inTransit.includes(i);
  const isLostFrame = (i) => lostPackets.includes(i);

  return (
    <div style={{ fontFamily: "Arial", color: "#fff", padding: "20px", backgroundColor: "#111" }}>
      <h2>Sliding Window Protocol Simulation</h2>
      <p>Interactive simulation demonstrating sender window movement and acknowledgment handling.</p>

      <div style={{ marginBottom: 16 }}>
        <label>Window Size: </label>
        <input
          type="number"
          value={windowSize}
          min="1"
          max="10"
          onChange={(e) => setWindowSize(Number(e.target.value))}
          disabled={isRunning}
          style={{ marginRight: 10, padding: 4 }}
        />
        <label>Number of Frames: </label>
        <input
          type="number"
          value={totalFrames}
          min="1"
          max="20"
          onChange={(e) => setTotalFrames(Number(e.target.value))}
          disabled={isRunning}
          style={{ marginRight: 10, padding: 4 }}
        />
        <button onClick={sendFrames} disabled={isRunning} style={{ padding: "6px 12px", fontSize: 16 }}>
          {isRunning ? "Transmitting..." : "Start Transmission"}
        </button>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "20px",
          background: "#222",
          borderRadius: "8px",
          width: "fit-content",
          margin: "auto",
          marginBottom: "20px",
        }}
      >
        {Array.from({ length: totalFrames }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 40,
              height: 40,
              lineHeight: "40px",
              margin: "0 4px",
              borderRadius: 6,
              textAlign: "center",
              fontWeight: "bold",
              color: "#fff",
              backgroundColor: isAcked(i)
                ? "#00ff00" // green acknowledged
                : isInTransitFrame(i)
                  ? "#ffaa00" // yellow in transit
                  : isLostFrame(i)
                    ? "#ff4444" // red lost/missing after sending
                    : i >= currentWindowStart && i < currentWindowStart + windowSize
                      ? "#2196F3" // blue in current window
                      : "#555",
              position: "relative",
            }}
          >
            {i}
            {isLostFrame(i) && (
              <div
                style={{
                  position: "absolute",
                  top: 2,
                  right: 4,
                  color: "#ffdddd",
                  fontWeight: "bold",
                  fontSize: 14,
                }}
              >
              </div>
            )}
          </div>
        ))}
      </div>

      <div
        style={{
          backgroundColor: "rgba(30,30,30,0.9)",
          borderRadius: "8px",
          padding: "12px 16px",
          maxHeight: "200px",
          overflowY: "auto",
          fontFamily: "monospace",
          fontSize: "13px",
          boxShadow: "0 3px 10px rgba(0,0,0,0.4)",
        }}
      >
        <div style={{ fontWeight: "bold", marginBottom: 8 }}>Transmission Log</div>
        {log.length === 0 ? (
          <div>No transmission yet.</div>
        ) : (
          log.map((line, index) => <div key={index}>{line}</div>)
        )}
      </div>

      <pre
        style={{
          marginTop: "20px",
          background: "#222",
          color: "#eee",
          padding: 16,
          borderRadius: 8,
          whiteSpace: "pre-wrap",
          fontFamily: "monospace",
        }}
      >{`The Sliding Window Protocol is a flow control mechanism used in reliable transmission protocols such as TCP.

This protocol allows multiple frames to be in transit simultaneously, improving channel utilization compared to stop-and-wait transmission.

1. The sender maintains a "window" of N frames (where N is the window size) that it can send before waiting for acknowledgments.
2. As acknowledgments (ACKs) are received, the sender slides the window forward, permitting new frames to be transmitted.
3. If an acknowledgment is delayed or lost, a timeout mechanism triggers retransmission.
4. This ensures reliable delivery while optimizing throughput by keeping the communication channel busy.

In this simulation:
- Blue boxes denote the current transmission window.
- Yellow boxes represent frames currently being sent.
- Green boxes indicate acknowledged frames.
- Red boxes represent frames with missing ACK after sending.
- The log shows step-by-step progress of frame transmission, ACK reception, missing packets detection, and window sliding.

This visual model demonstrates how efficient and reliable data transfer is achieved in protocols like TCP using the sliding window mechanism.`}</pre>
    </div>
  );
}

function StopAndWaitVertical() {
  const [running, setRunning] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [sceneState, setSceneState] = useState(0); // progress inside scene (not used directly here)
  const [explainText, setExplainText] = useState(
    `Press Step to walk one event at a time.\n\nVisual summary:\n1) Success: Sender sends packet → Receiver receives → sends ACK → Sender receives ACK → next packet.\n2) Timeout: ACK not received within timeout → Sender retransmits packet.\n3) Lost: Packet lost in transit → no ACK → timeout → retransmit.`
  );

  // Refs for animation
  const rafId = useRef(null);
  const sceneStart = useRef(null);

  // Refs for SVG elements to manipulate transforms/opacities
  const s1PacketRef = useRef(null);
  const s1AckRef = useRef(null);
  const s2PacketRef = useRef(null);
  const s2AckRef = useRef(null);
  const s2RetransRef = useRef(null);
  const s3PacketRef = useRef(null);
  const s3LostVisualRef = useRef(null);
  const s3RetransRef = useRef(null);

  // Refs for path elements
  const pathS1ToR = useRef(null);
  const pathS1ToS = useRef(null);
  const pathS2ToR = useRef(null);
  const pathS2AckBack = useRef(null);
  const pathS3ToR = useRef(null);
  const pathS3Retrans = useRef(null);

  // Helper to set transform translate(x,y)
  const setTranslate = (elem, x, y) => {
    if (elem) {
      elem.setAttribute("transform", `translate(${x},${y})`);
    }
  };

  // Move element along path based on normalized t [0..1]
  const moveAlong = (pathElem, elem, t) => {
    if (!pathElem || !elem) return;
    const L = pathElem.getTotalLength();
    t = Math.min(Math.max(t, 0), 1);
    const pt = pathElem.getPointAtLength(L * t);
    setTranslate(elem, pt.x, pt.y);
  };

  // Reset visuals to initial state
  function resetAll() {
    cancelAnimationFrame(rafId.current);
    setRunning(false);
    setCurrentScene(0);
    sceneStart.current = null;
    setSceneState(0);

    // Initial positions
    moveAlong(pathS1ToR.current, s1PacketRef.current, 0);
    moveAlong(pathS1ToS.current, s1AckRef.current, 0);
    setTranslate(s2PacketRef.current, 220, 310);
    setTranslate(s2AckRef.current, 680, 340);
    setTranslate(s2RetransRef.current, 220, 360);
    setTranslate(s3PacketRef.current, 220, 480);
    setTranslate(s3LostVisualRef.current, 450, 520);
    setTranslate(s3RetransRef.current, 220, 560);

    // Opacities initial
    if (s1PacketRef.current) s1PacketRef.current.style.opacity = 1;
    if (s1AckRef.current) s1AckRef.current.style.opacity = 0;
    if (s2PacketRef.current) s2PacketRef.current.style.opacity = 1;
    if (s2AckRef.current) s2AckRef.current.style.opacity = 0;
    if (s2RetransRef.current) s2RetransRef.current.style.opacity = 0;
    if (s3PacketRef.current) s3PacketRef.current.style.opacity = 1;
    if (s3LostVisualRef.current) s3LostVisualRef.current.style.opacity = 0;
    if (s3RetransRef.current) s3RetransRef.current.style.opacity = 0;

    setExplainText(
      `Press Step to walk one event at a time.\n\nVisual summary:\n1) Success: Sender sends packet → Receiver receives → sends ACK → Sender receives ACK → next packet.\n2) Timeout: ACK not received within timeout → Sender retransmits packet.\n3) Lost: Packet lost in transit → no ACK → timeout → retransmit.`
    );
  }

  // Duration constants
  const DURATION = 2400; // ms per travel/action block

  // Animate a single scene given timestamp
  // Returns true if scene ends
  function animateScene(timestamp) {
    if (!sceneStart.current) sceneStart.current = timestamp;
    const elapsed = timestamp - sceneStart.current;

    if (currentScene === 0) {
      // Scenario 1: success
      if (elapsed < DURATION) {
        const t = elapsed / DURATION;
        moveAlong(pathS1ToR.current, s1PacketRef.current, t);
        if (s1PacketRef.current) s1PacketRef.current.style.opacity = 1;
        if (s1AckRef.current) s1AckRef.current.style.opacity = 0;
        setExplainText("Scenario 1: Sender sends DATA → Receiver will ACK.");
      } else if (elapsed < 2 * DURATION) {
        if (s1PacketRef.current) s1PacketRef.current.style.opacity = 0;
        const t2 = (elapsed - DURATION) / DURATION;
        moveAlong(pathS1ToS.current, s1AckRef.current, t2);
        if (s1AckRef.current) s1AckRef.current.style.opacity = 1;
        setExplainText("Scenario 1: Receiver sends ACK back to sender.");
      } else {
        if (s1AckRef.current) s1AckRef.current.style.opacity = 0;
        sceneStart.current = null;
        setCurrentScene((prev) => prev + 1);
        return true;
      }
    } else if (currentScene === 1) {
      // Scenario 2: timeout & retransmit
      if (elapsed < DURATION) {
        const t = elapsed / DURATION;
        moveAlong(pathS2ToR.current, s2PacketRef.current, t);
        if (s2PacketRef.current) s2PacketRef.current.style.opacity = 1;
        if (s2AckRef.current) s2AckRef.current.style.opacity = 0;
        if (s2RetransRef.current) s2RetransRef.current.style.opacity = 0;
        setExplainText("Scenario 2: Sender sends DATA; ACK is delayed.");
      } else if (elapsed < 1.6 * DURATION) {
        if (s2PacketRef.current) s2PacketRef.current.style.opacity = 0.4;
        setExplainText("Scenario 2: Sender waited; timeout occurs (no ACK).");
      } else if (elapsed < 2.6 * DURATION) {
        const t2 = (elapsed - 1.6 * DURATION) / DURATION;
        if (s2RetransRef.current) {
          s2RetransRef.current.style.opacity = 1;
          moveAlong(pathS2ToR.current, s2RetransRef.current, t2);
        }
        if (t2 > 0.85 && s2AckRef.current) {
          s2AckRef.current.style.opacity = 1;
          // Animate ack coming back a bit
          moveAlong(
            pathS2AckBack.current,
            s2AckRef.current,
            (t2 - 0.85) / 0.15
          );
        }
        setExplainText(
          "Scenario 2: Timeout → Sender retransmits DATA' → ACK returns."
        );
      } else {
        if (s2AckRef.current) s2AckRef.current.style.opacity = 0;
        if (s2RetransRef.current) s2RetransRef.current.style.opacity = 0;
        sceneStart.current = null;
        setCurrentScene((prev) => prev + 1);
        return true;
      }
    } else if (currentScene === 2) {
      // Scenario 3: lost packet
      if (elapsed < 0.6 * DURATION) {
        const t = elapsed / (0.6 * DURATION);
        moveAlong(pathS3ToR.current, s3PacketRef.current, t);
        if (s3PacketRef.current) s3PacketRef.current.style.opacity = 1;
        if (s3LostVisualRef.current) s3LostVisualRef.current.style.opacity = 0;
        setExplainText(
          "Scenario 3: Sender sends DATA (gets lost mid-way)."
        );
      } else if (elapsed < 1.4 * DURATION) {
        if (s3PacketRef.current)
          s3PacketRef.current.style.opacity = Math.max(
            0,
            1 - (elapsed - 0.6 * DURATION) / (0.3 * DURATION)
          );
        if (s3LostVisualRef.current)
          s3LostVisualRef.current.style.opacity = Math.min(
            1,
            (elapsed - 0.6 * DURATION) / (0.2 * DURATION)
          );
        setExplainText(
          "Scenario 3: Packet lost in transit → no ACK arrives."
        );
      } else if (elapsed < 2.6 * DURATION) {
        const t2 = (elapsed - 1.4 * DURATION) / DURATION;
        if (s3RetransRef.current) {
          s3RetransRef.current.style.opacity = 1;
          moveAlong(pathS3Retrans.current, s3RetransRef.current, t2);
        }
        setExplainText(
          "Scenario 3: Timeout → retransmit of DATA' → receiver receives."
        );
      } else {
        if (s3RetransRef.current) s3RetransRef.current.style.opacity = 0;
        if (s3LostVisualRef.current) s3LostVisualRef.current.style.opacity = 0;
        sceneStart.current = null;
        setCurrentScene((prev) => prev + 1);
        return true;
      }
    } else {
      // All scenes done
      setRunning(false);
      setExplainText(
        "Done: All scenarios completed. Press Reset to run again."
      );
      return true;
    }
    return false;
  }

  // Animation loop with requestAnimationFrame
  const loop = (timestamp) => {
    if (!running) return;
    const finished = animateScene(timestamp);
    if (finished && running) {
      sceneStart.current = null;
    }
    rafId.current = requestAnimationFrame(loop);
  };

  // Step one scene to completion
  const handleStep = () => {
    if (currentScene > 2) {
      setExplainText("All scenes already shown. Press Reset to run again.");
      return;
    }
    setRunning(true);
    sceneStart.current = null;
    const stepLoop = (timestamp) => {
      const finished = animateScene(timestamp);
      if (!finished) {
        rafId.current = requestAnimationFrame(stepLoop);
      } else {
        setRunning(false);
        cancelAnimationFrame(rafId.current);
      }
    };
    rafId.current = requestAnimationFrame(stepLoop);
  };

  // Reset all to initial state
  const handleReset = () => {
    resetAll();
  };

  // On mount, reset all to init state
  useEffect(() => {
    resetAll();
    // Cleanup on unmount
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  // JSX for SVG with ref bindings to elements and paths
  return (
    <div
      className="wrap"
      style={{
        maxWidth: 920,
        margin: "24px auto",
        padding: 18,
        borderRadius: 10,
        background: "var(--bg, #052626)",
        color: "var(--muted, #cfece6)",
        fontFamily: "'Segoe UI', Roboto, Arial, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: 32,
          margin: "4px 0 12px",
          textAlign: "center",
          color: "#ffd54a",
          letterSpacing: 1,
        }}
      >
        STOP-AND-WAIT PROTOCOL — Vertical visualization
      </h1>

      <div
        className="toolbar"
        style={{
          display: "flex",
          gap: 8,
          justifyContent: "center",
          marginBottom: 10,
        }}
      >
        <div className="controls" style={{ textAlign: "center" }}>
          <button
            onClick={handleStep}
            style={{
              background: "#0b3a3a",
              border: "1px solid rgba(255,255,255,0.04)",
              color: "var(--muted, #cfece6)",
              padding: "8px 12px",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 600,
              marginRight: 8,
            }}
          >
            Step ▶
          </button>
          <button
            onClick={handleReset}
            style={{
              background: "#0b3a3a",
              border: "1px solid rgba(255,255,255,0.04)",
              color: "var(--muted, #cfece6)",
              padding: "8px 12px",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Reset
          </button>
          <div
            className="controls small"
            style={{ fontSize: 11, color: "#99d9d0", marginTop: 6 }}
          >
            Use Step to walk through events
          </div>
        </div>
      </div>

      <div
        className="canvas"
        role="img"
        aria-label="Stop and wait protocol vertical interaction"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.06), transparent)",
          borderRadius: 10,
          padding: 14,
          boxShadow: "0 6px 18px rgba(0,0,0,0.5)",
        }}
      >
        <svg
          viewBox="0 0 900 700"
          preserveAspectRatio="xMidYMid meet"
          style={{ width: "100%", height: 640, display: "block", overflow: "visible" }}
        >
          <text
            x="450"
            y="36"
            fontSize="18"
            fill="#ffd54a"
            textAnchor="middle"
            fontWeight="700"
          >
            Stop-and-Wait — vertical timeline
          </text>

          {/* Sender and Receiver vertical lanes */}
          <line
            x1="220"
            y1="80"
            x2="220"
            y2="620"
            strokeWidth="6"
            strokeLinecap="round"
            stroke="#ff9f1c"
          />
          <line
            x1="680"
            y1="80"
            x2="680"
            y2="620"
            strokeWidth="6"
            strokeLinecap="round"
            stroke="#2ecc71"
          />
          <text
            x="220"
            y="60"
            fontSize="20"
            fill="var(--muted, #cfece6)"
            fontWeight="700"
            textAnchor="middle"
          >
            Sender
          </text>
          <text
            x="680"
            y="60"
            fontSize="20"
            fill="var(--muted, #cfece6)"
            fontWeight="700"
            textAnchor="middle"
          >
            Receiver
          </text>

          {/* Scenario labels */}
          <text
            x="450"
            y="120"
            fontSize="16"
            fill="#bff6ff"
            textAnchor="middle"
          >
            1) Successful send
          </text>
          <text
            x="450"
            y="290"
            fontSize="16"
            fill="#bff6ff"
            textAnchor="middle"
          >
            2) Timeout & Retransmit
          </text>
          <text
            x="450"
            y="460"
            fontSize="16"
            fill="#bff6ff"
            textAnchor="middle"
          >
            3) Packet Lost (timeout → retransmit)
          </text>

          {/* Scenario 1 group */}
          <g id="s1">
            <g id="s1Packet" ref={s1PacketRef} transform="translate(220,140)">
              <rect
                x="-12"
                y="-10"
                width="48"
                height="22"
                rx="4"
                fill="#66d1ff"
                stroke="rgba(0,0,0,0.12)"
                strokeWidth="1"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.4))"
              />
              <text
                x="12"
                y="6"
                fontSize="11"
                textAnchor="middle"
                fill="#032326"
                fontWeight="700"
              >
                DATA
              </text>
            </g>
            <g id="s1Ack" ref={s1AckRef} transform="translate(680,190)" opacity={0}>
              <rect
                x="-12"
                y="-10"
                width="40"
                height="20"
                rx="4"
                fill="#a7ffe1"
                stroke="rgba(0,0,0,0.12)"
                strokeWidth="1"
              />
              <text
                x="8"
                y="5"
                fontSize="11"
                fill="#03332b"
                fontWeight="700"
              >
                ACK
              </text>
            </g>
            <text
              x="450"
              y="160"
              fontSize="14"
              fill="#bff6ff"
              textAnchor="middle"
            >
              Data packet →
            </text>
            <text
              x="450"
              y="200"
              fontSize="14"
              fill="#bff6ff"
              textAnchor="middle"
            >
              ← Acknowledgement
            </text>
          </g>

          {/* Scenario 2 group */}
          <g id="s2">
            <g id="s2Packet" ref={s2PacketRef} transform="translate(220,310)">
              <rect
                x="-12"
                y="-10"
                width="48"
                height="22"
                rx="4"
                fill="#66d1ff"
                stroke="rgba(0,0,0,0.12)"
                strokeWidth="1"
              />
              <text
                x="12"
                y="6"
                fontSize="11"
                textAnchor="middle"
                fill="#032326"
                fontWeight="700"
              >
                DATA
              </text>
            </g>
            <g id="s2Ack" ref={s2AckRef} transform="translate(680,340)" style={{ opacity: 0 }}>
              <rect
                x="-12"
                y="-10"
                width="40"
                height="20"
                rx="4"
                fill="#a7ffe1"
                stroke="rgba(0,0,0,0.12)"
                strokeWidth="1"
              />
              <text
                x="8"
                y="5"
                fontSize="11"
                fill="#03332b"
                fontWeight="700"
              >
                ACK
              </text>
            </g>
            <g id="s2Retrans" ref={s2RetransRef} transform="translate(220,360)" style={{ opacity: 0 }}>
              <rect
                x="-12"
                y="-10"
                width="48"
                height="22"
                rx="4"
                fill="#66d1ff"
                stroke="rgba(0,0,0,0.12)"
                strokeWidth="1"
              />
              <text
                x="12"
                y="6"
                fontSize="11"
                textAnchor="middle"
                fill="#032326"
                fontWeight="700"
              >
                DATA'
              </text>
            </g>
            <text
              x="450"
              y="330"
              fontSize="14"
              fill="#bff6ff"
              textAnchor="middle"
            >
              Sender times out → retransmits
            </text>
          </g>

          {/* Scenario 3 group */}
          <g id="s3">
            <g id="s3Packet" ref={s3PacketRef} transform="translate(220,480)">
              <rect
                x="-12"
                y="-10"
                width="48"
                height="22"
                rx="4"
                fill="#66d1ff"
                stroke="rgba(0,0,0,0.12)"
                strokeWidth="1"
              />
              <text
                x="12"
                y="6"
                fontSize="11"
                textAnchor="middle"
                fill="#032326"
                fontWeight="700"
              >
                DATA
              </text>
            </g>
            <g id="s3LostVisual" ref={s3LostVisualRef} transform="translate(450,520)" opacity={0}>
              <text
                x="0"
                y="0"
                fontSize="13"
                fill="#ff6b6b"
                textAnchor="middle"
                fontWeight="700"
              >
                LOST
              </text>
            </g>
            <g id="s3Retrans" ref={s3RetransRef} transform="translate(220,560)" opacity={0}>
              <rect
                x="-12"
                y="-10"
                width="48"
                height="22"
                rx="4"
                fill="#66d1ff"
                stroke="rgba(0,0,0,0.12)"
                strokeWidth="1"
              />
              <text
                x="12"
                y="6"
                fontSize="11"
                textAnchor="middle"
                fill="#032326"
                fontWeight="700"
              >
                DATA'
              </text>
            </g>
            <text
              x="450"
              y="495"
              fontSize="14"
              fill="#bff6ff"
              textAnchor="middle"
            >
              Packet lost in transit → sender times out → retransmit
            </text>
          </g>

          {/* Arrow markers */}
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#66d1ff" />
            </marker>
            <marker
              id="arrowAck"
              viewBox="0 0 10 10"
              refX="1"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#a7ffe1" />
            </marker>
          </defs>

          {/* Invisible paths for animation (refs used for position calculation) */}
          <path
            id="pathS1ToR"
            ref={pathS1ToR}
            d="M220 140 C 360 155, 540 165, 680 190"
            fill="none"
            stroke="transparent"
          />
          <path
            id="pathS1ToS"
            ref={pathS1ToS}
            d="M680 190 C 540 200, 360 210, 220 220"
            fill="none"
            stroke="transparent"
          />
          <path
            id="pathS2ToR"
            ref={pathS2ToR}
            d="M220 310 C 360 325, 540 335, 680 340"
            fill="none"
            stroke="transparent"
          />
          <path
            id="pathS2AckBack"
            ref={pathS2AckBack}
            d="M680 340 C 540 350, 360 360, 220 360"
            fill="none"
            stroke="transparent"
          />
          <path
            id="pathS3ToR"
            ref={pathS3ToR}
            d="M220 480 C 360 500, 540 510, 680 520"
            fill="none"
            stroke="transparent"
          />
          <path
            id="pathS3Retrans"
            ref={pathS3Retrans}
            d="M220 560 C 360 570, 540 580, 680 590"
            fill="none"
            stroke="transparent"
          />

          {/* Legend bubble */}
          <rect
            x="20"
            y="20"
            width="160"
            height="70"
            rx="10"
            fill="rgba(255,255,255,0.03)"
            stroke="rgba(255,255,255,0.03)"
          />
          <text
            x="100"
            y="40"
            fontSize="13"
            fill="var(--muted, #cfece6)"
            textAnchor="middle"
            fontWeight="700"
          >
            Legend
          </text>
          <text
            x="100"
            y="58"
            fontSize="13"
            fill="var(--muted, #cfece6)"
            textAnchor="middle"
          >
            Blue=DATA, Mint=ACK
          </text>
        </svg>
      </div>

      <div
        className="step-card"
        style={{
          background: "rgba(255,255,255,0.03)",
          padding: 8,
          borderRadius: 8,
          marginTop: 12,
          color: "var(--muted, #cfece6)",
          fontSize: 15,
          lineHeight: 1.4,
          minHeight: 80,
          whiteSpace: "pre-line",
          fontFamily: "'Segoe UI', Roboto, Arial, sans-serif",
        }}
      >
        {explainText}
      </div>
    </div>
  );
}

function DijkstraVisualization({ isActive = true }) {
  const [nodes] = useState([
    { id: "A", x: 100, y: 150 },
    { id: "B", x: 250, y: 80 },
    { id: "C", x: 400, y: 150 },
    { id: "D", x: 250, y: 250 },
    { id: "E", x: 550, y: 150 },
    { id: "F", x: 700, y: 250 },
  ]);
  const [edges] = useState([
    { from: "A", to: "B", weight: 4 },
    { from: "A", to: "D", weight: 2 },
    { from: "B", to: "C", weight: 3 },
    { from: "B", to: "D", weight: 1 },
    { from: "C", to: "E", weight: 2 },
    { from: "D", to: "C", weight: 5 },
    { from: "D", to: "E", weight: 3 },
    { from: "E", to: "F", weight: 4 },
    { from: "C", to: "F", weight: 6 },
  ]);

  const [routingTable, setRoutingTable] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [shortestPath, setShortestPath] = useState([]);
  const [finalDistance, setFinalDistance] = useState(0);
  const [tableFilled, setTableFilled] = useState(false);
  const [log, setLog] = useState([]);
  const [paused, setPaused] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;
    const distances = { A: 0 };
    const previous = {};
    const unvisited = new Set(nodes.map(n => n.id));
    nodes.forEach(n => {
      if (n.id !== "A") distances[n.id] = Infinity;
    });
    const steps = [];
    while (unvisited.size > 0) {
      const current = Array.from(unvisited).reduce(
        (min, node) => (distances[node] < distances[min] ? node : min)
      );
      unvisited.delete(current);
      edges.forEach(edge => {
        if (edge.from === current && unvisited.has(edge.to)) {
          const nd = distances[current] + edge.weight;
          if (nd < distances[edge.to]) {
            distances[edge.to] = nd;
            previous[edge.to] = current;
          }
        }
        if (edge.to === current && unvisited.has(edge.from)) {
          const nd = distances[current] + edge.weight;
          if (nd < distances[edge.from]) {
            distances[edge.from] = nd;
            previous[edge.from] = current;
          }
        }
      });
      steps.push({
        currentNode: current,
        distances: { ...distances },
        previous: { ...previous },
      });
    }
    const path = ["F"];
    let c = "F";
    while (previous[c]) {
      c = previous[c];
      path.unshift(c);
    }
    setRoutingTable(steps);
    setShortestPath(path);
    setFinalDistance(distances["F"]);
    setStepIndex(0);
    setTableFilled(false);
    setLog([`Ready. Press Play to start the simulation.`]);
    setPaused(true);
    clearInterval(intervalRef.current);
  }, [isActive]);

  useEffect(() => {
    if (!routingTable.length) return;
    clearInterval(intervalRef.current);
    if (!paused && stepIndex < routingTable.length) {
      intervalRef.current = setInterval(() => {
        setStepIndex(prev => {
          if (prev < routingTable.length - 1) {
            const next = prev + 1;
            const step = routingTable[next];
            setLog(logs => [
              ...logs,
              `Step ${next + 1}: Visiting ${step.currentNode}. Distances: ${Object.entries(
                step.distances
              ).map(([k, v]) => `${k}:${v === Infinity ? "∞" : v}`).join(', ')}. Previous: ${Object.entries(
                step.previous
              ).map(([k, v]) => `${k}←${v}`).join(', ')}`
            ]);
            return next;
          } else {
            setTableFilled(true);
            clearInterval(intervalRef.current);
            setLog(logs => [
              ...logs,
              `Simulation complete. Final path: ${shortestPath.join(
                " → "
              )}, Total Distance: ${finalDistance}`,
            ]);
            return prev;
          }
        });
      }, 1200);
    }
    return () => clearInterval(intervalRef.current);
  }, [routingTable, paused, stepIndex, shortestPath, finalDistance]);

  const handlePauseResume = () => setPaused((v) => !v);
  const handleReset = () => {
    clearInterval(intervalRef.current);
    setStepIndex(0);
    setTableFilled(false);
    setPaused(true);
    setLog([`Ready. Press Play to start the simulation.`]);
  };

  const currentStep = routingTable[stepIndex] || {};
  const playLabel =
    paused && stepIndex === 0
      ? "Play Simulation"
      : paused
      ? "Resume Simulation"
      : "Pause Simulation";
  const showFinalPath = tableFilled;

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #22253b, #232a32 84%)",
        borderRadius: 20,
        minHeight: "100vh",
        padding: 30,
        fontFamily: "Segoe UI, Arial, sans-serif",
      }}
    >
      <div style={{ marginBottom: 30, display: "flex", gap: 18 }}>
        <button
          onClick={handlePauseResume}
          style={{
            background: paused ? "#ff83a3" : "#fc7ea6",
            color: "#fff",
            fontWeight: 600,
            border: "none",
            borderRadius: 8,
            fontSize: 17,
            padding: "12px 38px",
            boxShadow: "0 2px 8px #0007",
            cursor: "pointer",
          }}
        >
          {playLabel}
        </button>
        <button
          onClick={handleReset}
          style={{
            background: "#333",
            color: "#ddd",
            border: "none",
            borderRadius: 8,
            fontSize: 17,
            padding: "12px 38px",
            cursor: "pointer",
          }}
        >
          Reset
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: 32,
          maxWidth: 1080,
          margin: "0 auto",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "rgba(30,30,30,0.8)",
            borderRadius: 16,
            padding: "24px 10px 10px 10px",
            minWidth: 680,
          }}
        >
          <h2
            style={{
              color: "#fff",
              textAlign: "center",
              marginBottom: 15,
              fontWeight: 700,
              fontSize: 22,
            }}
          >
            Dijkstra's Algorithm Visualization
          </h2>
          <div
            style={{
              background: "#222",
              borderRadius: 16,
              width: 680,
              height: 340,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <svg width="100%" height="100%" viewBox="0 0 800 340">
              {/* Edges */}
              {edges.map((edge, i) => {
                const fromNode = nodes.find((n) => n.id === edge.from);
                const toNode = nodes.find((n) => n.id === edge.to);
                let isFinalEdge = false;
                if (showFinalPath) {
                  const fp = shortestPath;
                  for (let k = 1; k < fp.length; k++) {
                    if (
                      (fp[k - 1] === edge.from && fp[k] === edge.to) ||
                      (fp[k] === edge.from && fp[k - 1] === edge.to)
                    ) {
                      isFinalEdge = true;
                      break;
                    }
                  }
                }
                return (
                  <g key={i}>
                    <line
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke={isFinalEdge ? "#19fc98" : "#bbb"}
                      strokeWidth={isFinalEdge ? "4" : "2"}
                      opacity={isFinalEdge ? 1 : 0.55}
                    />
                    <text
                      x={(fromNode.x + toNode.x) / 2}
                      y={(fromNode.y + toNode.y) / 2 - 8}
                      textAnchor="middle"
                      fill="#fff"
                      fontSize="16"
                      fontWeight={700}
                    >
                      {edge.weight}
                    </text>
                  </g>
                );
              })}
              {/* Nodes */}
              {nodes.map((node) => {
                let isOnFinalPath = false;
                if (showFinalPath && shortestPath.includes(node.id)) {
                  isOnFinalPath = true;
                }
                const isCurrent = node.id === currentStep.currentNode;
                const fill = isOnFinalPath
                  ? "#19fc98"
                  : isCurrent
                  ? "#ffd54a"
                  : "#42e2c4";
                return (
                  <g key={node.id}>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="28"
                      fill={fill}
                      stroke="#fff"
                      strokeWidth="3"
                      style={{
                        filter: isCurrent
                          ? "drop-shadow(0 0 10px #ffd54a55)"
                          : "",
                      }}
                    />
                    <text
                      x={node.x}
                      y={node.y + 8}
                      textAnchor="middle"
                      fill="#fff"
                      fontSize="21"
                      fontWeight="bold"
                    >
                      {node.id}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div
            style={{
              color: "#fff",
              textAlign: "center",
              marginTop: 18,
              fontSize: "19px",
              fontWeight: 500,
            }}
          >
            Step: <span style={{ fontWeight: 700 }}>{stepIndex + 1}</span>/
            {routingTable.length}
          </div>

          {tableFilled && (
            <div
              style={{
                margin: "16px 0 0 0",
                color: "#19fc98",
                textAlign: "center",
                fontWeight: 600,
                fontSize: 18,
              }}
            >
              Final Shortest Path Result <br />
              <span style={{ fontWeight: 700 }}>
                Shortest Path from A to F: {shortestPath.join(" → ")}
              </span>
              <br />
              <span style={{ fontWeight: 700 }}>
                Total Distance: {finalDistance}
              </span>
            </div>
          )}

          <div
            style={{
              background: "#192026",
              borderRadius: 7,
              padding: "14px 24px",
              marginTop: 22,
              minHeight: 70,
              color: "#aad6ff",
              fontSize: 16,
              fontFamily: "monospace",
              maxHeight: 160,
              overflowY: "auto",
            }}
          >
            {log.slice(Math.max(0, log.length - 7)).map((l, idx) => (
              <div key={idx}>• {l}</div>
            ))}
          </div>
        </div>

        {/* Routing Table (show only rows up to and including stepIndex) */}
        <div
          style={{
            background: "rgba(20,20,20,0.8)",
            borderRadius: 16,
            padding: "14px 8px",
            minWidth: 340,
            maxHeight: 500,
            overflowY: "auto",
          }}
        >
          <h3
            style={{
              color: "#fff",
              fontSize: 17,
              fontWeight: 700,
              marginBottom: 10,
              marginTop: 8,
              textAlign: "center",
            }}
          >
            Routing Table (Step-by-Step)
          </h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 15,
              color: "#f3f8fc",
            }}
          >
            <thead>
              <tr style={{ background: "#222", fontWeight: 700 }}>
                <th style={{ padding: 7, border: "1px solid #333" }}>
                  Current Node
                </th>
                <th style={{ padding: 7, border: "1px solid #333" }}>
                  Distances
                </th>
                <th style={{ padding: 7, border: "1px solid #333" }}>
                  Previous
                </th>
              </tr>
            </thead>
            <tbody>
              {routingTable
                .slice(0, stepIndex + 1)
                .map((step, idx) => (
                  <tr
                    key={idx}
                    style={{
                      background:
                        idx === stepIndex ? "#27284a" : "transparent",
                    }}
                  >
                    <td
                      style={{
                        padding: 7,
                        border: "1px solid #333",
                        fontWeight: 600,
                      }}
                    >
                      {step.currentNode}
                    </td>
                    <td style={{ padding: 7, border: "1px solid #333" }}>
                      {Object.entries(step.distances)
                        .map(
                          ([node, dist]) =>
                            `${node}:${dist === Infinity ? "∞" : dist}`
                        )
                        .join(", ")}
                    </td>
                    <td style={{ padding: 7, border: "1px solid #333" }}>
                      {Object.entries(step.previous)
                        .map(([node, prev]) => `${node}←${prev}`)
                        .join(", ")}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Theory */}
      <div
        style={{
          marginTop: 35,
          background: "#222",
          color: "#eee",
          padding: 20,
          borderRadius: 10,
          maxWidth: 900,
          fontFamily: "monospace",
          fontSize: 15,
          marginLeft: "auto",
          marginRight: "auto",
          whiteSpace: "pre-wrap",
          boxShadow: "0 1px 8px #0003",
        }}
      >
        <b>Theory of Dijkstra’s Algorithm Experiment</b>
        <br />
        <br />
        Dijkstra’s Algorithm finds the shortest path from a source node to all
        other nodes in a weighted graph by relaxing edges and selecting the node
        with the least tentative distance at each step.
        <br />
        <ul>
          <li>Initialize distances (source 0, others ∞).</li>
          <li>Pick the unvisited node with minimum distance.</li>
          <li>Relax all its outgoing/incoming edges.</li>
          <li>Repeat until all nodes are visited.</li>
        </ul>
        Applications include OSPF routing and GPS navigation.
      </div>
    </div>
  );
}

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
      <div style={{}}>
        <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', background: '#222', color: '#eee', padding: 16, borderRadius: 8, marginTop: '1vh' }}>{`A deterministic finite automaton (DFA) is a theoretical model used to recognize patterns or languages. Formally, a DFA consists of a finite set of states, an input alphabet, a transition function that uniquely determines the next state given a current state and input symbol, a designated start state, and a set of accepting (final) states. The machine reads an input string symbol by symbol, deterministically moving between states according to the transition function. If after processing the entire input, the machine ends in an accepting state, the input is accepted; otherwise, it is rejected.

For the DFA parsing experiment on strings that start with A and end with B, the process is:

1. The DFA begins in the start state S0, which is highlighted for 5 seconds to indicate the initial setup before reading input.

2. When a string is input, the DFA reads one symbol at a time, transitioning between states based on the defined transition function: it moves from S0 to S1 on reading 'A', shifts among S1, S2, or Dead states depending on subsequent characters.

3. Each state the DFA moves into is highlighted to show progress, with real-time updates in a transition log detailing the current state, input symbol, and next state.

4. This visual and textual feedback helps users track how the DFA processes the input step-by-step within an interactive 3D environment that supports rotation and zooming.

5. After processing all characters, the DFA checks if the final state is accepting (S2), and whether the final character is 'B'. Depending on this, it logs either "ACCEPTED" in green or "REJECTED" in red.

This experiment illustrates the practical working of a DFA, combining theoretical definition with clear, interactive parsing steps.`}</pre>
      </div>
    </div>
  );
}
export default experiments;
