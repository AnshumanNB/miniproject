import React from 'react';
import { NavLink } from 'react-router-dom';
import experiments from './Experiments';

const Sidebar = () => {

  return (
    <div className="d-flex flex-column vh-100 p-3 bg-dark rounded">
      <h5 className="text-purple mb-3" style={{ color: '#9b59b6' }}>Experiments</h5>
      <ul className="nav nav-pills flex-column gap-2">
        {experiments.map(exp => (
          <li key={exp.id} className="nav-item">
            <NavLink to={exp.path} className={({ isActive }) => `nav-link rounded ${isActive ? 'active text-white' : 'text-light'}`}>
              {exp.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
