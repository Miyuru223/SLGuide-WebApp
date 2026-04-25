import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API, { getImageUrl } from '../utils/api';

const CATEGORIES = ['All', 'Ancient City', 'Temple', 'Natural Wonder', 'Beach', 'Fort', 'Museum', 'Cultural Site', 'Wildlife'];

export default function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category !== 'All') params.category = category;
    API.get('/destinations', { params })
      .then(res => setDestinations(res.data))
      .finally(() => setLoading(false));
  }, [search, category]);

  return (
    <>
      <Navbar />
      <div className="page-header">
        <h1>Historical Destinations</h1>
        <p>Uncover Sri Lanka's ancient wonders and breathtaking landscapes</p>
      </div>

      <div className="section" style={{ paddingTop: '3rem' }}>
        {/* Filters */}
        <div className="search-bar">
          <input
            className="search-input"
            placeholder="🔍 Search destinations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="search-select"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              style={{
                padding: '0.4rem 1rem',
                borderRadius: '20px',
                border: '1.5px solid',
                borderColor: category === c ? '#1a5c38' : '#e8e0d0',
                background: category === c ? '#1a5c38' : 'white',
                color: category === c ? 'white' : '#6b6b6b',
                fontSize: '0.8rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'DM Sans, sans-serif'
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loader"><div className="spinner" /></div>
        ) : destinations.length === 0 ? (
          <div className="empty-state">
            <h3>No destinations found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: '0.85rem', color: '#6b6b6b', marginBottom: '1.5rem' }}>
              Showing {destinations.length} destination{destinations.length !== 1 ? 's' : ''}
            </p>
            <div className="cards-grid">
              {destinations.map(d => (
                <div className="card" key={d._id} onClick={() => navigate(`/destinations/${d._id}`)}>
                  <div className="card-img">
                    {d.photos?.[0]
                      ? <img src={getImageUrl(d.photos[0])} alt={d.name} />
                      : '🏛️'}
                  </div>
                  <div className="card-body">
                    {d.featured && <div className="featured-banner">⭐ Featured</div>}
                    <span className="card-tag">{d.category}</span>
                    <div className="card-title">{d.name}</div>
                    <div className="card-location">📍 {d.location}, {d.district}</div>
                    <p className="card-desc">{d.description}</p>
                    {d.entryFee && (
                      <div style={{ marginTop: '0.7rem', fontSize: '0.8rem', color: '#1a5c38', fontWeight: 600 }}>
                        🎟️ Entry: {d.entryFee}
                      </div>
                    )}
                    {d.moreDetailsLink && (
                      <div style={{ marginTop: '0.8rem' }}>
                        <a
                          href={d.moreDetailsLink}
                          target="_blank"
                          rel="noreferrer"
                          onClick={e => e.stopPropagation()}
                          style={{
                            display: 'inline-block',
                            padding: '0.4rem 0.8rem',
                            background: '#1a5c38',
                            color: 'white',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={e => e.target.style.background = '#155032'}
                          onMouseLeave={e => e.target.style.background = '#1a5c38'}
                        >
                          🔗 More Details
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <footer>
        <p>© 2024 <span style={{ color: '#c9a84c' }}>SLGuide</span> — Discover the Pearl of the Indian Ocean 🇱🇰</p>
      </footer>
    </>
  );
}
