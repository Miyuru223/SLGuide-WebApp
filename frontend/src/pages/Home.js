import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API, { getImageUrl } from '../utils/api';

export default function Home() {
  const [destinations, setDestinations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      API.get('/destinations/featured'),
      API.get('/hotels/featured')
    ]).then(([dRes, hRes]) => {
      setDestinations(dRes.data);
      setHotels(hRes.data);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🇱🇰 The Pearl of the Indian Ocean</div>
          <h1>Discover the <em>Wonders</em> of Sri Lanka</h1>
          <p>Explore ancient kingdoms, pristine beaches, misty mountains, and vibrant culture — all in one breathtaking island.</p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => navigate('/destinations')}>
              Explore Destinations
            </button>
            <button className="btn-outline" onClick={() => navigate('/hotels')}>
              Find Hotels
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div style={{ background: '#1a5c38', padding: '2rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
          {[
            { num: '8', label: 'UNESCO World Heritage Sites' },
            { num: '26', label: 'National Parks' },
            { num: '1,600km', label: 'Coastline' },
            { num: '2,500+', label: 'Years of History' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', fontWeight: 800, color: '#c9a84c' }}>{s.num}</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)', marginTop: '0.2rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Destinations */}
      <div className="section">
        <div className="section-header">
          <div className="section-tag">Must Visit</div>
          <h2 className="section-title">Featured Destinations</h2>
        </div>
        {loading ? (
          <div className="loader"><div className="spinner" /></div>
        ) : destinations.length === 0 ? (
          <div className="empty-state">
            <h3>No featured destinations yet</h3>
            <p>Check back soon or browse all destinations</p>
          </div>
        ) : (
          <div className="cards-grid">
            {destinations.map(d => (
              <div className="card" key={d._id} onClick={() => navigate(`/destinations/${d._id}`)}>
                <div className="card-img">
                  {d.photos?.[0]
                    ? <img src={getImageUrl(d.photos[0])} alt={d.name} />
                    : '🏛️'}
                </div>
                <div className="card-body">
                  <span className="card-tag">{d.category}</span>
                  <div className="card-title">{d.name}</div>
                  <div className="card-location">📍 {d.location}, {d.district}</div>
                  <p className="card-desc">{d.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button className="btn-primary" onClick={() => navigate('/destinations')}>
            View All Destinations →
          </button>
        </div>
      </div>

      {/* Featured Hotels */}
      <div style={{ background: '#fdf8f0', padding: '1px 0' }}>
        <div className="section">
          <div className="section-header">
            <div className="section-tag">Stay in Style</div>
            <h2 className="section-title">Featured Hotels</h2>
          </div>
          {loading ? (
            <div className="loader"><div className="spinner" /></div>
          ) : hotels.length === 0 ? (
            <div className="empty-state">
              <h3>No featured hotels yet</h3>
              <p>Check back soon or browse all hotels</p>
            </div>
          ) : (
            <div className="cards-grid">
              {hotels.map(h => (
                <div className="card" key={h._id} onClick={() => navigate(`/hotels/${h._id}`)}>
                  <div className="card-img">
                    {h.photos?.[0]
                      ? <img src={getImageUrl(h.photos[0])} alt={h.name} />
                      : '🏨'}
                  </div>
                  <div className="card-body">
                    <span className="card-tag">{h.category}</span>
                    <div className="stars">{'★'.repeat(h.starRating)}{'☆'.repeat(5 - h.starRating)}</div>
                    <div className="card-title">{h.name}</div>
                    <div className="card-location">📍 {h.location}, {h.district}</div>
                    <span className="price-badge">💰 {h.priceRange}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button className="btn-primary" onClick={() => navigate('/hotels')}>
              View All Hotels →
            </button>
          </div>
        </div>
      </div>

      {/* Why SLGuide */}
      <div className="section">
        <div className="section-header">
          <div className="section-tag">Why SLGuide</div>
          <h2 className="section-title">Your Complete Sri Lanka Travel Guide</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
          {[
            { icon: '🏛️', title: 'Rich Heritage', desc: 'Explore ancient cities, sacred temples, and UNESCO World Heritage Sites.' },
            { icon: '🌿', title: 'Natural Beauty', desc: 'From misty hill country to golden beaches and lush rainforests.' },
            { icon: '🏨', title: 'Best Stays', desc: 'Curated hotels from luxury resorts to charming boutique guesthouses.' },
            { icon: '🗺️', title: 'Easy Navigation', desc: 'All you need to plan the perfect Sri Lanka trip in one place.' },
          ].map(f => (
            <div key={f.title} style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', marginBottom: '0.5rem', color: '#0f3d24' }}>{f.title}</h3>
              <p style={{ fontSize: '0.875rem', color: '#6b6b6b', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <footer>
        <p>© 2024 <span>SLGuide</span> — Discover the Pearl of the Indian Ocean 🇱🇰</p>
      </footer>
    </>
  );
}
