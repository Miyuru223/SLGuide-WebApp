import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API, { getImageUrl } from '../utils/api';

const CATEGORIES = ['All', 'Luxury', 'Boutique', 'Budget', 'Resort', 'Guesthouse', 'Heritage'];

export default function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [stars, setStars] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category !== 'All') params.category = category;
    if (stars !== 'All') params.stars = stars;
    API.get('/hotels', { params })
      .then(res => setHotels(res.data))
      .finally(() => setLoading(false));
  }, [search, category, stars]);

  return (
    <>
      <Navbar />
      <div className="page-header">
        <h1>Hotels & Accommodation</h1>
        <p>From luxury resorts to charming boutique stays across Sri Lanka</p>
      </div>

      <div className="section" style={{ paddingTop: '3rem' }}>
        <div className="search-bar">
          <input
            className="search-input"
            placeholder="🔍 Search hotels..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="search-select" value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select className="search-select" value={stars} onChange={e => setStars(e.target.value)}>
            <option value="All">All Stars</option>
            {[5, 4, 3, 2, 1].map(s => <option key={s} value={s}>{s} ★</option>)}
          </select>
        </div>

        {loading ? (
          <div className="loader"><div className="spinner" /></div>
        ) : hotels.length === 0 ? (
          <div className="empty-state">
            <h3>No hotels found</h3>
            <p>Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: '0.85rem', color: '#6b6b6b', marginBottom: '1.5rem' }}>
              Showing {hotels.length} hotel{hotels.length !== 1 ? 's' : ''}
            </p>
            <div className="cards-grid">
              {hotels.map(h => (
                <div className="card" key={h._id} onClick={() => navigate(`/hotels/${h._id}`)}>
                  <div className="card-img">
                    {h.photos?.[0]
                      ? <img src={getImageUrl(h.photos[0])} alt={h.name} />
                      : '🏨'}
                  </div>
                  <div className="card-body">
                    {h.featured && <div className="featured-banner">⭐ Featured</div>}
                    <span className="card-tag">{h.category}</span>
                    <div className="stars">
                      {'★'.repeat(h.starRating)}{'☆'.repeat(5 - h.starRating)}
                      <span style={{ color: '#6b6b6b', fontSize: '0.75rem', marginLeft: '0.3rem' }}>{h.starRating} Star</span>
                    </div>
                    <div className="card-title">{h.name}</div>
                    <div className="card-location">📍 {h.location}, {h.district}</div>
                    <p className="card-desc">{h.description}</p>
                    <div style={{ marginTop: '0.8rem' }}>
                      <span className="price-badge">💰 {h.priceRange}</span>
                    </div>
                    {h.moreDetailsLink && (
                      <div style={{ marginTop: '0.8rem' }}>
                        <a
                          href={h.moreDetailsLink}
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
