import React, { useState } from 'react';

export default function ReportModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    carMakeModel: '',
    licensePlate: '',
    incidentDescription: '',
    images: []
  });

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      images: Array.from(e.target.files)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Package data to send to Node/Express backend
    const submissionData = new FormData();
    submissionData.append('fullName', formData.fullName);
    submissionData.append('phone', formData.phone);
    submissionData.append('carMakeModel', formData.carMakeModel);
    submissionData.append('licensePlate', formData.licensePlate);
    submissionData.append('incidentDescription', formData.incidentDescription);
    
    formData.images.forEach((file) => {
      submissionData.append('images', file);
    });

    console.log('Submitting Report:', Object.fromEntries(submissionData));
    
    // Example API call to backend route:
    /*
    fetch('/api/reports', {
      method: 'POST',
      body: submissionData
    })
    .then(res => res.json())
    .then(data => console.log('Success:', data))
    .catch(err => console.error('Error:', err));
    */

    alert('Report submitted successfully!');
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2>File Incident Report</h2>
          <button onClick={onClose} style={styles.closeBtn}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* User Details */}
          <div style={styles.fieldGroup}>
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="e.g. John Doe"
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+968 9000 0000"
              style={styles.input}
            />
          </div>

          {/* Car Details */}
          <div style={styles.fieldGroup}>
            <label>Car Make & Model</label>
            <input
              type="text"
              name="carMakeModel"
              required
              value={formData.carMakeModel}
              onChange={handleInputChange}
              placeholder="e.g. Toyota Camry"
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label>License Plate Number</label>
            <input
              type="text"
              name="licensePlate"
              required
              value={formData.licensePlate}
              onChange={handleInputChange}
              placeholder="e.g. 12345 A"
              style={styles.input}
            />
          </div>

          {/* Photo Upload */}
          <div style={styles.fieldGroup}>
            <label>Upload Incident Pictures</label>
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              style={styles.fileInput}
            />
          </div>

          <button type="submit" style={styles.submitBtn}>
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '450px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  input: {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  fileInput: {
    marginTop: '4px',
  },
  submitBtn: {
    marginTop: '12px',
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  }
};