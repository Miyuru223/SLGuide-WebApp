import { useState, useEffect, useRef } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import API, { getImageUrl } from '../utils/api';
import { showToast } from '../components/Toast';

const CATEGORIES = ['Ancient City', 'Temple', 'Natural Wonder', 'Beach', 'Fort', 'Museum', 'Cultural Site', 'Wildlife'];

const emptyForm = {
  name: '', location: '', district: '', category: 'Temple',
  description: '', history: '', entryFee: '', openingHours: '', bestTimeToVisit: '', moreDetailsLink: '', featured: false
};

export default function AdminDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [photos, setPhotos] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const fileRef = useRef();

  const load = () => {
    setLoading(true);
    API.get('/destinations')
      .then(res => setDestinations(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setPhotos([]);
    setExistingPhotos([]);
    setShowModal(true);
  };

  const openEdit = (d) => {
    setEditing(d._id);
    setForm({
      name: d.name, location: d.location, district: d.district,
      category: d.category, description: d.description, history: d.history || '',
      entryFee: d.entryFee || '', openingHours: d.openingHours || '',
      bestTimeToVisit: d.bestTimeToVisit || '', moreDetailsLink: d.moreDetailsLink || '', featured: d.featured || false
    });
    setExistingPhotos(d.photos || []);
    setPhotos([]);
    setShowModal(true);
  };

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(prev => [...prev, ...files]);
  };

  const removeNewPhoto = (i) => setPhotos(prev => prev.filter((_, idx) => idx !== i));
  const removeExistingPhoto = (i) => setExistingPhotos(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async () => {
    if (!form.name || !form.location || !form.district || !form.description) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('existingPhotos', JSON.stringify(existingPhotos));
      photos.forEach(p => fd.append('photos', p));

      if (editing) {
        await API.put(`/destinations/${editing}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showToast('Destination updated successfully!');
      } else {
        await API.post('/destinations', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showToast('Destination added successfully!');
      }
      setShowModal(false);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save destination', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await API.delete(`/destinations/${id}`);
      showToast('Destination deleted');
      load();
    } catch {
      showToast('Failed to delete', 'error');
    }
  };

  const filtered = destinations.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.district.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <div className="admin-topbar">
          <h1>Destinations</h1>
          <input
            className="search-input"
            placeholder="Search destinations..."
            style={{ width: 260 }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-content">
          <div className="admin-table-wrap">
            <div className="admin-table-header">
              <h2>All Destinations ({filtered.length})</h2>
              <button className="btn-add" onClick={openAdd}>+ Add Destination</button>
            </div>

            {loading ? (
              <div className="loader"><div className="spinner" /></div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#6b6b6b' }}>
                {search ? 'No results found' : 'No destinations yet. Click "Add Destination" to get started.'}
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th style={{ width: 60 }}>Photo</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>District</th>
                    <th>Entry Fee</th>
                    <th>Featured</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(d => (
                    <tr key={d._id}>
                      <td>
                        <div className="table-img">
                          {d.photos?.[0] ? <img src={getImageUrl(d.photos[0])} alt="" /> : '🏛️'}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{d.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6b6b6b' }}>📍 {d.location}</div>
                      </td>
                      <td><span className="card-tag">{d.category}</span></td>
                      <td style={{ color: '#6b6b6b' }}>{d.district}</td>
                      <td style={{ fontSize: '0.85rem' }}>{d.entryFee || 'Free'}</td>
                      <td>{d.featured ? '⭐ Yes' : '—'}</td>
                      <td>
                        <button className="btn-edit" onClick={() => openEdit(d)}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDelete(d._id, d.name)}>Delete</button>
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
              <h2>{editing ? 'Edit Destination' : 'Add New Destination'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Sigiriya Rock Fortress" />
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
                  <input className="form-control" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Matale District" />
                </div>
                <div className="form-group">
                  <label className="form-label">District *</label>
                  <input className="form-control" value={form.district} onChange={e => setForm({ ...form, district: e.target.value })} placeholder="e.g. Matale" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea className="form-control" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description for tourists..." />
              </div>
              <div className="form-group">
                <label className="form-label">Historical Background</label>
                <textarea className="form-control" value={form.history} onChange={e => setForm({ ...form, history: e.target.value })} placeholder="Historical context and background..." />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Entry Fee</label>
                  <input className="form-control" value={form.entryFee} onChange={e => setForm({ ...form, entryFee: e.target.value })} placeholder="e.g. USD 30 / Free" />
                </div>
                <div className="form-group">
                  <label className="form-label">Opening Hours</label>
                  <input className="form-control" value={form.openingHours} onChange={e => setForm({ ...form, openingHours: e.target.value })} placeholder="e.g. 7:00 AM - 5:30 PM" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Best Time to Visit</label>
                <input className="form-control" value={form.bestTimeToVisit} onChange={e => setForm({ ...form, bestTimeToVisit: e.target.value })} placeholder="e.g. December to April" />
              </div>
              <div className="form-group">
                <label className="form-label">More Details Link</label>
                <input className="form-control" value={form.moreDetailsLink} onChange={e => setForm({ ...form, moreDetailsLink: e.target.value })} placeholder="e.g. https://example.com/destination" type="url" />
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>⭐ Mark as Featured (shown on homepage)</span>
                </label>
              </div>

              {/* Photo upload */}
              <div className="form-group">
                <label className="form-label">Photos</label>
                <div className="photo-upload-area" onClick={() => fileRef.current.click()}>
                  <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleFiles} />
                  <div className="upload-icon">📷</div>
                  <div className="upload-text">Click to upload photos</div>
                  <div className="upload-hint">JPG, PNG, WebP — Max 10MB each</div>
                </div>

                {(existingPhotos.length > 0 || photos.length > 0) && (
                  <div className="preview-photos" style={{ marginTop: '1rem' }}>
                    {existingPhotos.map((p, i) => (
                      <div key={`ex-${i}`} className="preview-photo">
                        <img src={getImageUrl(p)} alt="" />
                        <button className="remove-photo" onClick={() => removeExistingPhoto(i)}>✕</button>
                      </div>
                    ))}
                    {photos.map((p, i) => (
                      <div key={`new-${i}`} className="preview-photo">
                        <img src={URL.createObjectURL(p)} alt="" />
                        <button className="remove-photo" onClick={() => removeNewPhoto(i)}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-save" onClick={handleSubmit} disabled={saving}>
                {saving ? 'Saving...' : editing ? 'Update Destination' : 'Add Destination'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
