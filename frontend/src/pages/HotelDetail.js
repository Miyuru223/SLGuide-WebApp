import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API, { getImageUrl } from '../utils/api';

export default function HotelDetail() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    API.get(`/hotels/${id}`)
      .then(res => setHotel(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <>
      <Navbar />
      <div className="loader" style={{ marginTop: '70px', minHeight: '60vh' }}>
        <div className="spinner" /><p>Loading hotel...</p>
      </div>
    </>
  );

  if (!hotel) return (
    <>
      <Navbar />
      <div className="empty-state" style={{ marginTop: '70px', minHeight: '60vh' }}>
        <h3>Hotel not found</h3>
        <Link to="/hotels" style={{ color: '#1a5c38' }}>← Back to hotels</Link>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="detail-page">
        <div className="detail-photos">
          {hotel.photos?.length > 0
            ? <img src={getImageUrl(hotel.photos[activePhoto])} alt={hotel.name} />
            : <div style={{ fontSize: '6rem', color: '#1a5c38' }}>🏨</div>}
        </div>

        {hotel.photos?.length > 1 && (
          <div style={{ background: '#111', padding: '0.5rem', display: 'flex', gap: '0.4rem', overflowX: 'auto' }}>
            {hotel.photos.map((p, i) => (
              <img key={i} src={getImageUrl(p)} alt="" onClick={() => setActivePhoto(i)}
                style={{
                  width: 80, height: 60, objectFit: 'cover', borderRadius: 4, cursor: 'pointer',
                  opacity: activePhoto === i ? 1 : 0.5,
                  border: activePhoto === i ? '2px solid #c9a84c' : 'none',
                  transition: 'opacity 0.2s', flexShrink: 0
                }}
              />
            ))}
          </div>
        )}

        <div className="detail-content">
          <div className="breadcrumb">
            <Link to="/">Home</Link> / <Link to="/hotels">Hotels</Link> / {hotel.name}
          </div>

          {hotel.featured && <div className="featured-banner">⭐ Featured Hotel</div>}
          <div className="detail-tag">{hotel.category} · {hotel.district}</div>
          <div className="stars" style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
            {'★'.repeat(hotel.starRating)}{'☆'.repeat(5 - hotel.starRating)}
            <span style={{ color: '#6b6b6b', fontSize: '0.85rem', marginLeft: '0.5rem', fontFamily: 'DM Sans, sans-serif' }}>{hotel.starRating}-Star Hotel</span>
          </div>
          <h1 className="detail-title">{hotel.name}</h1>
          <div className="card-location" style={{ fontSize: '1rem', marginBottom: '1rem' }}>
            📍 {hotel.location}
          </div>

          <div className="detail-meta">
            <div className="meta-item">
              <span className="meta-label">Price Range</span>
              <span className="meta-value">💰 {hotel.priceRange}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Category</span>
              <span className="meta-value">🏷️ {hotel.category}</span>
            </div>
            {hotel.contactPhone && (
              <div className="meta-item">
                <span className="meta-label">Phone</span>
                <span className="meta-value">📞 {hotel.contactPhone}</span>
              </div>
            )}
            {hotel.contactEmail && (
              <div className="meta-item">
                <span className="meta-label">Email</span>
                <span className="meta-value">✉️ {hotel.contactEmail}</span>
              </div>
            )}
            {hotel.website && (
              <div className="meta-item">
                <span className="meta-label">Website</span>
                <a href={hotel.website} target="_blank" rel="noreferrer"
                  style={{ color: '#1a5c38', fontWeight: 600, fontSize: '0.95rem' }}>
                  🌐 Visit Website
                </a>
              </div>
            )}
          </div>

          <div className="detail-section">
            <h3>About This Hotel</h3>
            <p>{hotel.description}</p>
          </div>

          {hotel.amenities?.length > 0 && (
            <div className="detail-section">
              <h3>Amenities & Facilities</h3>
              <div className="amenities-list">
                {hotel.amenities.map((a, i) => (
                  <span key={i} className="amenity-tag">✓ {a}</span>
                ))}
              </div>
            </div>
          )}
          {/* More Details Link */}
          {hotel.moreDetailsLink && (
            <div className="detail-section">
              <a
                href={hotel.moreDetailsLink}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-block',
                  padding: '0.8rem 1.5rem',
                  background: '#1a5c38',
                  color: 'white',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.target.style.background = '#155032'}
                onMouseLeave={e => e.target.style.background = '#1a5c38'}
              >
                🔗 More Details
              </a>
            </div>
          )}
          {hotel.photos?.length > 1 && (
            <div className="detail-section">
              <h3>Photo Gallery</h3>
              <div className="photo-gallery">
                {hotel.photos.map((p, i) => (
                  <img key={i} src={getImageUrl(p)} alt={`${hotel.name} ${i + 1}`}
                    onClick={() => setActivePhoto(i)} />
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: '2rem' }}>
            <Link to="/hotels" style={{ color: '#1a5c38', fontWeight: 600, fontSize: '0.9rem' }}>
              ← Back to All Hotels
            </Link>
          </div>
        </div>
      </div>

      <footer>
        <p>© 2024 <span style={{ color: '#c9a84c' }}>SLGuide</span> — Discover the Pearl of the Indian Ocean 🇱🇰</p>
      </footer>
    </>
  );
}
