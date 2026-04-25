import { useState, useEffect, useRef } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import API, { getImageUrl } from '../utils/api';
import { showToast } from '../components/Toast';

const CATEGORIES = ['Luxury', 'Boutique', 'Budget', 'Resort', 'Guesthouse', 'Heritage'];
const COMMON_AMENITIES = ['WiFi', 'Swimming Pool', 'Restaurant', 'Spa', 'Gym', 'Bar', 'Room Service', 'Parking', 'Airport Transfer', 'Air Conditioning', 'Sea View', 'Garden View'];

const emptyForm = {
  name: '', location: '', district: '', category: 'Boutique', starRating: 3,
  description: '', priceRange: '', contactPhone: '', contactEmail: '', website: '', moreDetailsLink: '', featured: false
};

export default function AdminHotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [amenities, setAmenities] = useState([]);
  const [customAmenity, setCustomAmenity] = useState('');
  const [photos, setPhotos] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const fileRef = useRef();

  const load = () => {
    setLoading(true);
    API.get('/hotels')
      .then(res => setHotels(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setAmenities([]);
    setPhotos([]);
    setExistingPhotos([]);
    setShowModal(true);
  };

  const openEdit = (h) => {
    setEditing(h._id);
    setForm({
      name: h.name, location: h.location, district: h.district,
      category: h.category, starRating: h.starRating,
      description: h.description, priceRange: h.priceRange,
      contactPhone: h.contactPhone || '', contactEmail: h.contactEmail || '',
      website: h.website || '', moreDetailsLink: h.moreDetailsLink || '', featured: h.featured || false
    });
    setAmenities(h.amenities || []);
    setExistingPhotos(h.photos || []);
    setPhotos([]);
    setShowModal(true);
  };

  const toggleAmenity = (a) => {
    setAmenities(prev =>
      prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]
    );
  };

  const addCustomAmenity = () => {
    if (customAmenity.trim() && !amenities.includes(customAmenity.trim())) {
      setAmenities(prev => [...prev, customAmenity.trim()]);
      setCustomAmenity('');
    }
  };

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(prev => [...prev, ...files]);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.location || !form.district || !form.description || !form.priceRange) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('amenities', JSON.stringify(amenities));
      fd.append('existingPhotos', JSON.stringify(existingPhotos));
      photos.forEach(p => fd.append('photos', p));

      if (editing) {
        await API.put(`/hotels/${editing}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showToast('Hotel updated successfully!');
      } else {
        await API.post('/hotels', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showToast('Hotel added successfully!');
      }
      setShowModal(false);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save hotel', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await API.delete(`/hotels/${id}`);
      showToast('Hotel deleted');
      load();
    } catch {
      showToast('Failed to delete', 'error');
    }
  };

  const filtered = hotels.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.district.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <div className="admin-topbar">
          <h1>Hotels</h1>
          <input
            className="search-input"
            placeholder="Search hotels..."
            style={{ width: 260 }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-content">
          <div className="admin-table-wrap">
            <div className="admin-table-header">
              <h2>All Hotels ({filtered.length})</h2>
              <button className="btn-add" onClick={openAdd}>+ Add Hotel</button>
            </div>

            {loading ? (
              <div className="loader"><div className="spinner" /></div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#6b6b6b' }}>
                {search ? 'No results found' : 'No hotels yet. Click "Add Hotel" to get started.'}
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th style={{ width: 60 }}>Photo</th>
                    <th>Name</th>
                    <th>Stars</th>
                    <th>Category</th>
                    <th>District</th>
                    <th>Price Range</th>
                    <th>Featured</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(h => (
                    <tr key={h._id}>
                      <td>
                        <div className="table-img">
                          {h.photos?.[0] ? <img src={getImageUrl(h.photos[0])} alt="" /> : '🏨'}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{h.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6b6b6b' }}>📍 {h.location}</div>
                      </td>
                      <td style={{ color: '#c9a84c' }}>{'★'.repeat(h.starRating)}</td>
                      <td><span className="card-tag">{h.category}</span></td>
                      <td style={{ color: '#6b6b6b' }}>{h.district}</td>
                      <td style={{ fontSize: '0.85rem' }}>{h.priceRange}</td>
                      <td>{h.featured ? '⭐ Yes' : '—'}</td>
                      <td>
                        <button className="btn-edit" onClick={() => openEdit(h)}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDelete(h._id, h.name)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2>{editing ? 'Edit Hotel' : 'Add New Hotel'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Hotel Name *</label>
                  <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Heritance Kandalama" />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-control" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input className="form-control" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Dambulla, Central Province" />
                </div>
                <div className="form-group">
                  <label className="form-label">District *</label>
                  <input className="form-control" value={form.district} onChange={e => setForm({ ...form, district: e.target.value })} placeholder="e.g. Matale" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Star Rating *</label>
                  <select className="form-control" value={form.starRating} onChange={e => setForm({ ...form, starRating: parseInt(e.target.value) })}>
                    {[1, 2, 3, 4, 5].map(s => <option key={s} value={s}>{s} Star{s > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Price Range *</label>
                  <input className="form-control" value={form.priceRange} onChange={e => setForm({ ...form, priceRange: e.target.value })} placeholder="e.g. USD 150 - 350/night" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea className="form-control" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the hotel and its highlights..." />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-control" value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })} placeholder="+94 11 234 5678" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-control" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} placeholder="info@hotel.com" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Website</label>
                <input className="form-control" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} placeholder="https://www.hotel.com" />
              </div>
              <div className="form-group">
                <label className="form-label">More Details Link</label>
                <input className="form-control" value={form.moreDetailsLink} onChange={e => setForm({ ...form, moreDetailsLink: e.target.value })} placeholder="https://example.com/hotel" type="url" />
              </div>

              {/* Amenities */}
              <div className="form-group">
                <label className="form-label">Amenities</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.7rem' }}>
                  {COMMON_AMENITIES.map(a => (
                    <button key={a} type="button" onClick={() => toggleAmenity(a)}
                      style={{
                        padding: '0.3rem 0.7rem', borderRadius: 20, border: '1.5px solid',
                        borderColor: amenities.includes(a) ? '#1a5c38' : '#e8e0d0',
                        background: amenities.includes(a) ? '#e8f5ee' : 'white',
                        color: amenities.includes(a) ? '#1a5c38' : '#6b6b6b',
                        fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                        fontWeight: amenities.includes(a) ? 600 : 400
                      }}>
                      {amenities.includes(a) ? '✓ ' : ''}{a}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input className="form-control" value={customAmenity} onChange={e => setCustomAmenity(e.target.value)}
                    placeholder="Add custom amenity..." onKeyDown={e => e.key === 'Enter' && addCustomAmenity()} />
                  <button type="button" className="btn-add" onClick={addCustomAmenity} style={{ whiteSpace: 'nowrap' }}>Add</button>
                </div>
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>⭐ Mark as Featured (shown on homepage)</span>
                </label>
              </div>

              {/* Photos */}
              <div className="form-group">
                <label className="form-label">Photos</label>
                <div className="photo-upload-area" onClick={() => fileRef.current.click()}>
                  <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleFiles} />
                  <div className="upload-icon">📷</div>
                  <div className="upload-text">Click to upload hotel photos</div>
                  <div className="upload-hint">JPG, PNG, WebP — Max 10MB each</div>
                </div>
                {(existingPhotos.length > 0 || photos.length > 0) && (
                  <div className="preview-photos" style={{ marginTop: '1rem' }}>
                    {existingPhotos.map((p, i) => (
                      <div key={`ex-${i}`} className="preview-photo">
                        <img src={getImageUrl(p)} alt="" />
                        <button className="remove-photo" onClick={() => setExistingPhotos(prev => prev.filter((_, idx) => idx !== i))}>✕</button>
                      </div>
                    ))}
                    {photos.map((p, i) => (
                      <div key={`new-${i}`} className="preview-photo">
                        <img src={URL.createObjectURL(p)} alt="" />
                        <button className="remove-photo" onClick={() => setPhotos(prev => prev.filter((_, idx) => idx !== i))}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-save" onClick={handleSubmit} disabled={saving}>
                {saving ? 'Saving...' : editing ? 'Update Hotel' : 'Add Hotel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
