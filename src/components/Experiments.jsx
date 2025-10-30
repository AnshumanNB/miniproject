import { div } from "framer-motion/client";
import React, { useRef, useEffect, useState } from "react";
import * as THREE from 'three';
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
      <StopAndWaitARQ />
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

    const createLabels = (labelText, position) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      ctx.font = "Bold 24px Arial";
      ctx.fillStyle = "white";
      ctx.fillText(labelText, 0, 24);
      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(6, 3, 3);
      sprite.position.copy(position);
      scene.add(sprite);
      return sprite;
    };

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
            createLabels("Node " + i, node.position.clone().add(new THREE.Vector3(0, 0, 0)));
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
            createLabels("Node " + i, node.position.clone().add(new THREE.Vector3(0, 0, 0)));
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
            createLabels("Node " + i, node.position.clone().add(new THREE.Vector3(0, 0, 0)));
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
            createLabels("Node " + i, node.position.clone().add(new THREE.Vector3(0, 0, 0)));
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

function StopAndWaitARQ() {
  const [frameNumber, setFrameNumber] = useState(0); // 0 or 1 sequence number
  const [status, setStatus] = useState("Ready to send Frame 0");
  const [animating, setAnimating] = useState(false);
  const [waitingAck, setWaitingAck] = useState(false);
  const timeoutRef = useRef(null);

  // Probability to simulate ACK loss (20%)
  const ACK_LOSS_PROBABILITY = 0.2;

  const sendFrame = () => {
    if (animating) return; // Prevent double send during animation
    setAnimating(true);
    setStatus(`Sending Frame ${frameNumber}`);

    // Start animation by setting class - handled by CSS animation
    setTimeout(() => {
      setStatus(`Frame ${frameNumber} received, sending ACK`);
      setWaitingAck(true);
      animateAckBack();
    }, 2000); // Frame travel time simulated 2 seconds

    // Setup timeout for ACK wait (simulate delayed/lost ACK)
    timeoutRef.current = setTimeout(() => {
      if (waitingAck) {
        setStatus(`Timeout! Retransmitting Frame ${frameNumber}`);
        setWaitingAck(false);
        setAnimating(false);
        sendFrame(); // Retransmit frame
      }
    }, 6000); // Wait 6 seconds max for ACK
  };

  const animateAckBack = () => {
    // Simulate if ACK lost or not
    const ackLost = Math.random() < ACK_LOSS_PROBABILITY;

    setTimeout(() => {
      if (ackLost) {
        setStatus("ACK lost! Waiting for timeout...");
        // Don't clear waitingAck, timeout handler will retransmit
      } else {
        setStatus(`ACK received for Frame ${frameNumber}`);
        setWaitingAck(false);
        clearTimeout(timeoutRef.current);
        setAnimating(false);
        // Advance to next frame number (0 or 1)
        setFrameNumber((prev) => (prev === 0 ? 1 : 0));
        setTimeout(() => {
          setStatus(`Ready to send Frame ${frameNumber === 0 ? 1 : 0}`);
        }, 1000);
      }
    }, 1500); // ACK travel time simulated 1.5 seconds
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif", background: "#111", color: "#eee", minHeight: "600px" }}>
      <h2>Stop-and-Wait ARQ Protocol Simulation</h2>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", marginTop: 20 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 80, height: 80, backgroundColor: "#2e7d32",
            borderRadius: "50%", lineHeight: "80px", fontWeight: "bold"
          }}>Sender</div>
        </div>

        <div style={{ position: "relative", width: "60%" }}>
          {/* Frame indicator */}
          <div
            className={`frame ${animating ? "animate-frame" : ""}`}
            style={{
              position: "absolute",
              top: 30,
              left: 0,
              width: 40,
              height: 40,
              borderRadius: 6,
              backgroundColor: "#2196f3",
              color: "#fff",
              textAlign: "center",
              lineHeight: "40px",
              fontWeight: "bold",
              transition: "left 2s linear",
              left: animating ? "calc(100% - 40px)" : 0
            }}
          >
            {frameNumber}
          </div>

          {/* ACK indicator */}
          {waitingAck && (
            <div
              className="ack animate-ack"
              style={{
                position: "absolute",
                top: 80,
                left: "calc(100% - 40px)",
                width: 24,
                height: 24,
                borderRadius: "50%",
                backgroundColor: "#fbc02d",
                color: "#000",
                textAlign: "center",
                lineHeight: "24px",
                fontWeight: "bold",
                animation: "ackBack 1.5s linear forwards"
              }}
            >
              ✓
            </div>
          )}
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 80, height: 80, backgroundColor: "#c62828",
            borderRadius: "50%", lineHeight: "80px", fontWeight: "bold"
          }}>Receiver</div>
        </div>
      </div>

      <div style={{
        marginTop: 40,
        backgroundColor: "#222",
        padding: 16,
        borderRadius: 6,
        minHeight: 60,
        fontSize: 16,
      }}>{status}</div>

      <button
        onClick={sendFrame}
        disabled={animating || waitingAck}
        style={{
          marginTop: 30,
          padding: "10px 20px",
          fontSize: 16,
          cursor: animating || waitingAck ? "not-allowed" : "pointer",
          backgroundColor: animating || waitingAck ? "#555" : "#1976d2",
          color: "#fff",
          border: "none",
          borderRadius: 4
        }}
      >
        Send Frame
      </button>

      <pre
        style={{
          marginTop: 40,
          background: "#222",
          color: "#eee",
          padding: 16,
          borderRadius: 8,
          whiteSpace: "pre-wrap",
          fontFamily: "monospace",
          lineHeight: 1.5
        }}
      >{`Experiment Explanation - Stop-and-Wait ARQ Protocol

Stop-and-Wait ARQ (Automatic Repeat reQuest) is a simple yet fundamental error control method used in data communication.

How it works:

- The sender transmits one frame at a time and waits for an acknowledgment (ACK) from the receiver before sending the next frame.
- The receiver sends an ACK back to the sender when it correctly receives a frame.
- If the sender does not receive an ACK within a certain timeout period, it retransmits the frame.
- This method ensures reliable delivery of frames over an unreliable or noisy communication channel.

Key Features:

- Sequence numbers (usually 0 and 1) are alternated for each new frame to differentiate retransmissions from new frames.
- Only one frame is outstanding at any point, so sender and receiver are synchronized in send-receive steps.
- Timeout mechanism triggers retransmission when ACK is lost or delayed.

Advantages:

- Simple to implement.
- Guarantees reliable and ordered delivery of data frames.

Limitations:

- Inefficient for long-distance or high-delay networks since the sender is idle while waiting for ACK.
- Throughput decreases significantly with higher delays or loss rates.

This experiment visually simulates the core concepts by animating frames moving from sender to receiver, ACKs moving back, and retransmissions upon timeout, helping you understand the timing and flow control in Stop-and-Wait ARQ.`}</pre>

      <style>{`
        @keyframes ackBack {
          0% { left: calc(100% - 40px); }
          100% { left: 0; }
        }
      `}</style>
    </div>
  );
}

function DijkstraVisualization() {
  const containerRef = useRef(null);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [graphData, setGraphData] = useState(null); // store nodes/edges

  // Define initial graph structure
  const nodes = [
    { id: 0, label: "A", position: [0, 0, 0] },
    { id: 1, label: "B", position: [4, 0, 0] },
    { id: 2, label: "C", position: [2, 3, 0] },
    { id: 3, label: "D", position: [6, 3, 0] },
    { id: 4, label: "E", position: [8, 0, 0] }
  ];

  const edges = [
    { from: 0, to: 1, weight: 4 },
    { from: 0, to: 2, weight: 2 },
    { from: 1, to: 2, weight: 1 },
    { from: 1, to: 3, weight: 5 },
    { from: 2, to: 3, weight: 8 },
    { from: 2, to: 4, weight: 10 },
    { from: 3, to: 4, weight: 2 }
  ];

  // Generate the steps of Dijkstra's Algorithm
  const runDijkstra = () => {
    const distances = Array(nodes.length).fill(Infinity);
    const visited = Array(nodes.length).fill(false);
    const prev = Array(nodes.length).fill(null);
    const stepsLog = [];

    distances[0] = 0; // start at node 0 (A)

    for (let i = 0; i < nodes.length; i++) {
      // Find unvisited node with smallest distance
      let minDist = Infinity;
      let u = -1;
      for (let v = 0; v < nodes.length; v++) {
        if (!visited[v] && distances[v] < minDist) {
          minDist = distances[v];
          u = v;
        }
      }
      if (u === -1) break; // All visited or unreachable

      visited[u] = true;
      stepsLog.push(`Visit node ${nodes[u].label} (${u}) with current shortest distance ${distances[u]}`);

      // Update neighboring nodes
      for (const edge of edges) {
        let v = -1;
        if (edge.from === u) v = edge.to;
        else if (edge.to === u) v = edge.from;
        else continue;

        if (!visited[v]) {
          const newDist = distances[u] + edge.weight;
          if (newDist < distances[v]) {
            distances[v] = newDist;
            prev[v] = u;
            stepsLog.push(`Update distance of node ${nodes[v].label} (${v}) to ${newDist}`);
          }
        }
      }
    }

    // Create a step-wise path update report
    const pathSteps = nodes.map((node, index) => ({
      node: node.label,
      distance: distances[index],
      path: reconstructPath(prev, index, nodes)
    }));

    setSteps(stepsLog);
  };

  const reconstructPath = (prev, target, nodes) => {
    const path = [];
    for (let u = target; u !== null; u = prev[u]) {
      path.unshift(nodes[u].label);
    }
    return path.join(" -> ");
  };

  // Initialize graph data for rendering
  useEffect(() => {
    setGraphData({ nodes, edges });
  }, []);

  // Handle animation step-by-step
  const handleNext = () => {
    if (currentStep + 1 < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStart = () => {
    if (!isRunning) {
      runDijkstra();
      setCurrentStep(0);
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsRunning(false);
    setSteps([]);
  };

  // Rendering the 3D scene with Three.js (simplified mock-up)
  // For a real scene, you'd replace this with actual Three.js WebGL rendering
  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif", background: "#111", color: "#eee" }}>
      <h2>Dijkstra's Algorithm Visualization</h2>

      {/* Graph visualization Placeholder */}
      <div style={{ display: "flex", justifyContent: "center", margin: "20px 0", height: 300, border: "1px solid #444", position: "relative" }}>
        {graphData && graphData.nodes.map(node => (
          <div key={node.id} style={{
            position: "absolute",
            top: node.position[1] + 150,
            left: node.position[0] + 150,
            width: 30,
            height: 30,
            backgroundColor: "skyblue",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: "bold"
          }}>
            {node.label}
          </div>
        ))}
        {/* Edges as lines */}
        {graphData && graphData.edges.map((edge, index) => {
          const fromNode = graphData.nodes[edge.from];
          const toNode = graphData.nodes[edge.to];
          return (
            <line
              key={index}
              x1={fromNode.position[0] + 150}
              y1={fromNode.position[1] + 150}
              x2={toNode.position[0] + 150}
              y2={toNode.position[1] + 150}
              stroke="#999"
              strokeWidth={2}
            />
          );
        })}
      </div>

      {/* Controls */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={handleStart} disabled={isRunning} style={{ marginRight: 10, padding: "8px 12px" }}>Start</button>
        <button onClick={handleNext} disabled={!isRunning || currentStep >= steps.length - 1} style={{ marginRight: 10, padding: "8px 12px" }}>Next Step</button>
        <button onClick={handleReset} style={{ padding: "8px 12px" }}>Reset</button>
      </div>

      {/* Step log */}
      <div style={{ background: "#222", padding: 10, borderRadius: 4, minHeight: 150, overflowY: "auto" }}>
        <h3>Step Log:</h3>
        {steps.slice(0, currentStep + 1).map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div>

      {/* Theory Section */}
      <pre
        style={{
          marginTop: 30,
          background: "#222",
          color: "#eee",
          padding: 20,
          borderRadius: 8,
          fontFamily: "monospace",
          maxWidth: 800,
          lineHeight: 1.5
        }}
      >
{`Theory of Dijkstra’s Algorithm:

Dijkstra's Algorithm is a greedy method used to find the shortest path from a source node to all other nodes in a weighted graph with non-negative weights.

Steps:
1. Initialize distances from source to all nodes as infinity, except for source=0.
2. Mark all nodes as unvisited.
3. Select the unvisited node with the smallest tentative distance.
4. For the selected node, update the distances of its neighbors if a shorter path is found.
5. Repeat until all nodes are visited or the shortest paths are finalized.

Key Concepts:
- The algorithm maintains a set of nodes for which the shortest path is known.
- Uses a priority queue (or similar structure) to efficiently pick the next node.
- Guarantees shortest path in graphs with non-negative weights.

Applications:
- Routing protocols (OSPF)
- Pathfinding in maps and GPS systems
- Network optimization and resource allocation

This visualization demonstrates how the algorithm explores nodes step-by-step, updating shortest paths and eventually determining the minimum distance from the start node to all others.`}
      </pre>
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
