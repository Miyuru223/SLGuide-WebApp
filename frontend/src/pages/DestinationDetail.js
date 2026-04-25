import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API, { getImageUrl } from '../utils/api';

export default function DestinationDetail() {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    API.get(`/destinations/${id}`)
      .then(res => setDestination(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <>
      <Navbar />
      <div className="loader" style={{ marginTop: '70px', minHeight: '60vh' }}>
        <div className="spinner" />
        <p>Loading destination...</p>
      </div>
    </>
  );

  if (!destination) return (
    <>
      <Navbar />
      <div className="empty-state" style={{ marginTop: '70px', minHeight: '60vh' }}>
        <h3>Destination not found</h3>
        <Link to="/destinations" style={{ color: '#1a5c38' }}>← Back to destinations</Link>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="detail-page">
        {/* Main photo */}
        <div className="detail-photos">
          {destination.photos?.length > 0 ? (
            <img
              src={getImageUrl(destination.photos[activePhoto])}
              alt={destination.name}
            />
          ) : (
            <div style={{ fontSize: '6rem', color: '#1a5c38' }}>🏛️</div>
          )}
        </div>

        {/* Photo thumbnails */}
        {destination.photos?.length > 1 && (
          <div style={{ background: '#111', padding: '0.5rem', display: 'flex', gap: '0.4rem', overflowX: 'auto' }}>
            {destination.photos.map((p, i) => (
              <img
                key={i}
                src={getImageUrl(p)}
                alt=""
                onClick={() => setActivePhoto(i)}
                style={{
                  width: 80, height: 60, objectFit: 'cover', borderRadius: 4, cursor: 'pointer',
                  opacity: activePhoto === i ? 1 : 0.5, border: activePhoto === i ? '2px solid #c9a84c' : 'none',
                  transition: 'opacity 0.2s', flexShrink: 0
                }}
              />
            ))}
          </div>
        )}

        <div className="detail-content">
          <div className="breadcrumb">
            <Link to="/">Home</Link> / <Link to="/destinations">Destinations</Link> / {destination.name}
          </div>

          {destination.featured && <div className="featured-banner">⭐ Featured Destination</div>}
          <div className="detail-tag">{destination.category} · {destination.district}</div>
          <h1 className="detail-title">{destination.name}</h1>
          <div className="card-location" style={{ fontSize: '1rem', marginBottom: '1rem' }}>
            📍 {destination.location}
          </div>

          {/* Meta info */}
          <div className="detail-meta">
            <div className="meta-item">
              <span className="meta-label">Entry Fee</span>
              <span className="meta-value">🎟️ {destination.entryFee || 'Free'}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Opening Hours</span>
              <span className="meta-value">🕐 {destination.openingHours || 'N/A'}</span>
            </div>
            {destination.bestTimeToVisit && (
              <div className="meta-item">
                <span className="meta-label">Best Time to Visit</span>
                <span className="meta-value">📅 {destination.bestTimeToVisit}</span>
              </div>
            )}
            <div className="meta-item">
              <span className="meta-label">District</span>
              <span className="meta-value">🗺️ {destination.district}</span>
            </div>
          </div>

          {/* Description */}
          <div className="detail-section">
            <h3>About This Destination</h3>
            <p>{destination.description}</p>
          </div>

          {/* History */}
          {destination.history && (
            <div className="detail-section">
              <h3>Historical Background</h3>
              <p>{destination.history}</p>
            </div>
          )}

          {/* More Details Link */}
          {destination.moreDetailsLink && (
            <div className="detail-section">
              <a
                href={destination.moreDetailsLink}
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

          {/* Photo gallery */}
          {destination.photos?.length > 1 && (
            <div className="detail-section">
              <h3>Photo Gallery</h3>
              <div className="photo-gallery">
                {destination.photos.map((p, i) => (
                  <img
                    key={i}
                    src={getImageUrl(p)}
                    alt={`${destination.name} ${i + 1}`}
                    onClick={() => setActivePhoto(i)}
                  />
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: '2rem' }}>
            <Link to="/destinations" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              color: '#1a5c38', fontWeight: 600, fontSize: '0.9rem'
            }}>
              ← Back to All Destinations
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
