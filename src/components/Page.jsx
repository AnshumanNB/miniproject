import React from 'react';
import Sidebar from './Sidebar';
import experiments from './Experiments';
import { Route, Routes } from 'react-router-dom';

const Page = () => (
  <div className="container-fluid" style={{ paddingTop: '70px', backgroundColor: '#121212' }}>
    <div className="row gx-0">
      <main className="col-9 text-white" style={{ padding: '1.5rem' }}>
        <Routes>
          <Route path="/" element={<div>Select an experiment</div>} />
          {experiments.map(exp => (
            <Route key={exp.id} path={exp.rpath} element={exp.render} />
          ))}
        </Routes>
      </main>
      <aside className="col-3">
        <Sidebar />
      </aside>
    </div>
  </div>
);

export default Page;
