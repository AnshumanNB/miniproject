import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Network, Brain, Zap, BookOpen, ArrowRight, Star } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Network,
      title: 'Computer Networks',
      description: 'Interactive 3D network topology visualization with real-time data flow simulation',
      link: '/labs/experiment1',
      color: 'linear-gradient(135deg, #667eea, #764ba2)'
    },
    {
      icon: Brain,
      title: 'Theory of Computation',
      description: 'Finite automata, Turing machines, DFA simulator, and computational complexity visualizations',
      link: '/labs/experiment21',
      color: 'linear-gradient(135deg, #f093fb, #f5576c)'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="home-page">
      <div className="hero-section container d-flex align-items-center justify-content-between">
        <motion.div
          className="hero-content flex-shrink-0"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="hero-badge" variants={itemVariants}>
            <Star size={16} />
            <span>Techlabz Mini Project</span>
          </motion.div>

          <motion.h1 className="hero-title" variants={itemVariants}>
            Welcome to Techlabz
            <br />
            <span className="gradient-text">Interactive Learning Platform</span>
          </motion.h1>

          <motion.p className="hero-description" variants={itemVariants}>
            Explore Computer Networks, Theory of Computation, and DFA concepts with stunning
            visualizations. Learn complex computer science concepts through interactive simulations
            and immersive experiences.
          </motion.p>

          <motion.div className="hero-actions" variants={itemVariants + " d-flex flex-wrap gap-3"}>
            <Link to="/labs/experiment1" className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 rounded-3 fw-semibold">
              <Network size={20} />
              Computer Networks
              <ArrowRight size={16} />
            </Link>
            <Link to="/labs/experiment21" className="btn btn-outline-light d-flex align-items-center gap-2 px-4 py-2 rounded-3 fw-semibold">
              <Brain size={20} />
              Theory of Computation
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-visual d-none d-md-flex"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="floating-elements">
            <div className="element element-1">
              <BookOpen size={40} />
            </div>
            <div className="element element-2">
              <Zap size={32} />
            </div>
            <div className="element element-3">
              <Network size={36} />
            </div>
            <div className="element element-4">
              <Brain size={28} />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="features-section">
        <motion.div
          className="features-container container"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="section-header text-center mb-5">
            <h2>Interactive Learning Modules</h2>
            <p>Choose your learning path and explore computer science concepts</p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="feature-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <div
                    className="feature-icon"
                    style={{ background: feature.color }}
                  >
                    <Icon size={32} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <Link to={feature.link} className="feature-link d-inline-flex align-items-center gap-2">
                    Start Learning
                    <ArrowRight size={16} />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <div className="stats-section">
        <motion.div
          className="stats-container container d-flex justify-content-around text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="stat-item">
            <div className="stat-number">2</div>
            <div className="stat-label">Learning Modules</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">3D</div>
            <div className="stat-label">Interactive Visualizations</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">∞</div>
            <div className="stat-label">Learning Possibilities</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;

