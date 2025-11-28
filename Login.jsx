// LoginRegisterPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Put your backend URL here or use an env variable
const API_BASE = 'https://miniprojectapi-a6s4.onrender.com'; // backend on Render

async function registerUser({ username, email, password }) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Registration failed');
  }

  return res.json(); // { user, token }
}

async function loginUser({ email, password }) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Login failed');
  }

  return res.json(); // { user, token }
}

export default function LoginRegisterPage() {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // for redirect after auth

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let data;
      if (mode === 'register') {
        data = await registerUser({
          username: form.username,
          email: form.email,
          password: form.password,
        });
      } else {
        data = await loginUser({
          email: form.email,
          password: form.password,
        });
      }

      const { user, token } = data;

      // Persist auth (simple version)
      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(user));

      // Redirect to labs (change path if needed)
      navigate('/labs', { replace: true });
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid" style={{ paddingTop: '70px', backgroundColor: '#121212', height:'100vh'}}>
      <div className="row gx-0">
        <main className="col-9 text-white" style={{ padding: '1.5rem' }}>
          <div style={{ maxWidth: 420, margin: '0 auto' }}>
            <h2>{mode === 'login' ? 'Log in' : 'Register'}</h2>

            <div style={{ marginBottom: 16 }}>
              <button
                type="button"
                onClick={() => setMode('login')}
                disabled={mode === 'login'}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                disabled={mode === 'register'}
                style={{ marginLeft: 8 }}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {mode === 'register' && (
                <div>
                  <label>
                    Username
                    <input
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      required
                    />
                  </label>
                </div>
              )}

              <div>
                <label>
                  Email
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>

              <div>
                <label>
                  Password
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                </label>
              </div>

              {error && <p style={{ color: 'red' }}>{error}</p>}

              <button type="submit" disabled={loading}>
                {loading ? 'Please wait…' : mode === 'login' ? 'Login' : 'Register'}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
