import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import API from '../utils/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ destinations: 0, hotels: 0, featured_dest: 0, featured_hotels: 0 });
  const [recentDest, setRecentDest] = useState([]);
  const [recentHotels, setRecentHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/destinations'),
      API.get('/hotels'),
    ]).then(([dRes, hRes]) => {
      const dests = dRes.data;
      const hotels = hRes.data;
      setStats({
        destinations: dests.length,
        hotels: hotels.length,
        featured_dest: dests.filter(d => d.featured).length,
        featured_hotels: hotels.filter(h => h.featured).length,
      });
      setRecentDest(dests.slice(0, 5));
      setRecentHotels(hotels.slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <div className="admin-topbar">
          <h1>Dashboard</h1>
          <span style={{ fontSize: '0.85rem', color: '#6b6b6b' }}>Welcome back, Admin 👋</span>
        </div>

        <div className="admin-content">
          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon green">🏛️</div>
              <div className="stat-info">
                <h3>{stats.destinations}</h3>
                <p>Total Destinations</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">🏨</div>
              <div className="stat-info">
                <h3>{stats.hotels}</h3>
                <p>Total Hotels</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon gold">⭐</div>
              <div className="stat-info">
                <h3>{stats.featured_dest}</h3>
                <p>Featured Destinations</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon gold">✨</div>
              <div className="stat-info">
                <h3>{stats.featured_hotels}</h3>
                <p>Featured Hotels</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <Link to="/admin/destinations" style={{
              background: 'linear-gradient(135deg, #1a5c38, #2d8a58)',
              borderRadius: 12, padding: '1.5rem', color: 'white',
              display: 'flex', alignItems: 'center', gap: '1rem', transition: 'opacity 0.2s'
            }}>
              <span style={{ fontSize: '2rem' }}>🏛️</span>
              <div>
                <div style={{ fontWeight: 700, fontFamily: 'Playfair Display, serif', fontSize: '1.05rem' }}>Manage Destinations</div>
                <div style={{ opacity: 0.75, fontSize: '0.8rem', marginTop: '0.2rem' }}>Add, edit, or remove historical sites</div>
              </div>
            </Link>
            <Link to="/admin/hotels" style={{
              background: 'linear-gradient(135deg, #92700c, #c9a84c)',
              borderRadius: 12, padding: '1.5rem', color: 'white',
              display: 'flex', alignItems: 'center', gap: '1rem'
            }}>
              <span style={{ fontSize: '2rem' }}>🏨</span>
              <div>
                <div style={{ fontWeight: 700, fontFamily: 'Playfair Display, serif', fontSize: '1.05rem' }}>Manage Hotels</div>
                <div style={{ opacity: 0.75, fontSize: '0.8rem', marginTop: '0.2rem' }}>Add, edit, or remove accommodations</div>
              </div>
            </Link>
          </div>

          {/* Recent entries */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Recent Destinations */}
            <div className="admin-table-wrap">
              <div className="admin-table-header">
                <h2>Recent Destinations</h2>
                <Link to="/admin/destinations" style={{ fontSize: '0.8rem', color: '#1a5c38', fontWeight: 600 }}>View All →</Link>
              </div>
              {loading ? (
                <div className="loader" style={{ minHeight: 150 }}><div className="spinner" /></div>
              ) : recentDest.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#6b6b6b', fontSize: '0.875rem' }}>
                  No destinations yet
                </div>
              ) : (
                <table>
                  <tbody>
                    {recentDest.map(d => (
                      <tr key={d._id}>
                        <td style={{ width: 50 }}>
                          <div className="table-img">
                            {d.photos?.[0] ? <img src={`http://localhost:5000${d.photos[0]}`} alt="" /> : '🏛️'}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{d.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#6b6b6b' }}>{d.category}</div>
                        </td>
                        <td style={{ fontSize: '0.75rem', color: '#6b6b6b' }}>{d.district}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Recent Hotels */}
            <div className="admin-table-wrap">
              <div className="admin-table-header">
                <h2>Recent Hotels</h2>
                <Link to="/admin/hotels" style={{ fontSize: '0.8rem', color: '#1a5c38', fontWeight: 600 }}>View All →</Link>
              </div>
              {loading ? (
                <div className="loader" style={{ minHeight: 150 }}><div className="spinner" /></div>
              ) : recentHotels.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#6b6b6b', fontSize: '0.875rem' }}>
                  No hotels yet
                </div>
              ) : (
                <table>
                  <tbody>
                    {recentHotels.map(h => (
                      <tr key={h._id}>
                        <td style={{ width: 50 }}>
                          <div className="table-img">
                            {h.photos?.[0] ? <img src={`http://localhost:5000${h.photos[0]}`} alt="" /> : '🏨'}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{h.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#6b6b6b' }}>{'★'.repeat(h.starRating)}</div>
                        </td>
                        <td style={{ fontSize: '0.75rem', color: '#6b6b6b' }}>{h.district}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
