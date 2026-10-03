import { useState } from 'react';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' or 'report'
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus('[PROCESSING] Transmitting report to ROP pipeline...');

    const formData = new FormData(event.target);

    try {
      const response = await fetch('http://localhost:5001/api/report-vehicle', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setStatus('[SUCCESS] Report logged and dispatched successfully.');
        event.target.reset();
      } else {
        setStatus(`[FAILED] ${result.message || 'Unable to log report.'}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('[ERROR] Connection refused. Check if server.js is running on port 5001.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* NAV HEADER */}
      <nav style={styles.nav}>
        <div style={styles.navLogo} onClick={() => setCurrentView('home')}>
          <div style={styles.logoMark}></div>
          <div style={styles.logoText}>Road<span style={{ color: '#FF3E3E' }}>Clear</span></div>
        </div>

        <div style={styles.navLinks}>
          <button 
            style={currentView === 'home' ? styles.activeNavLink : styles.navLink} 
            onClick={() => setCurrentView('home')}
          >
            Home
          </button>
          <button 
            style={currentView === 'report' ? styles.activeNavLink : styles.navLink} 
            onClick={() => setCurrentView('report')}
          >
            Report Vehicle
          </button>
        </div>
      </nav>

      {/* VIEW SWITCHER */}
      {currentView === 'home' ? (
        /* HERO / MAIN SITE VIEW */
        <div style={styles.heroContainer}>
          <div style={styles.heroContent}>
            <div style={styles.sTag}>SYS // 01 · MUSCAT MUNICIPALITY</div>
            <h1 style={styles.heroTitle}>Keep Muscat<br />Roads Clear</h1>
            <p style={styles.heroSubtitle}>
              Report abandoned, wrecked, or obstructing vehicles directly to the urban management and ROP response grid.
            </p>
            <button 
              style={styles.ctaBtn} 
              onClick={() => setCurrentView('report')}
            >
              ⬡ Report an Abandoned Vehicle
            </button>
          </div>
        </div>
      ) : (
        /* REPORT FORM VIEW */
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.sTag}>SYS // 02 · STREET REPORT</div>
            <h1 style={styles.heading}>File Vehicle<br />Report</h1>

            <form onSubmit={handleSubmit}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Full Name // Civil ID</label>
                <input 
                  type="text" 
                  name="fullName"
                  placeholder="e.g. Salim Al-Harthy" 
                  style={styles.input}
                  required 
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="+968 9000 0000" 
                  style={styles.input}
                  required 
                />
              </div>

              {/* NEW FIELD: LOCATION / WILAYAT */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Location // Wilayat</label>
                <input 
                  type="text" 
                  name="location"
                  placeholder="e.g. Al Khuwair, Muscat" 
                  style={styles.input}
                />
              </div>

              {/* NEW FIELD: LICENSE PLATE */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Plate Number</label>
                <input 
                  type="text" 
                  name="licensePlate"
                  placeholder="e.g. 4821 - A" 
                  style={styles.input}
                />
              </div>

              {/* NEW FIELD: INCIDENT NOTES */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Notes // Description</label>
                <textarea 
                  name="notes"
                  placeholder="Describe vehicle condition, blockage, or duration..." 
                  style={styles.textarea}
                  rows="3"
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Photo Evidence</label>
                <input 
                  type="file" 
                  name="photo"
                  accept="image/*" 
                  style={styles.fileInput}
                  required 
                />
              </div>

              <button type="submit" style={styles.button} disabled={isSubmitting}>
                {isSubmitting ? 'Transmitting...' : '⬡ Submit Incident'}
              </button>
            </form>

            {status && <div style={styles.statusBox}>{status}</div>}
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  nav: {
    position: 'fixed',
    top: 0, left: 0, right: 0,
    height: '60px',
    backgroundColor: '#0A0A0B',
    borderBottom: '1px solid #1E1E22',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 2rem',
    zIndex: 100,
  },
  navLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.7rem',
    cursor: 'pointer'
  },
  logoMark: {
    width: '18px',
    height: '18px',
    border: '1.5px solid #FF3E3E',
    backgroundColor: '#FF3E3E',
  },
  logoText: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: '700',
    fontSize: '0.95rem',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: '#FFFFFF',
  },
  navLinks: {
    display: 'flex',
    gap: '1rem'
  },
  navLink: {
    background: 'none',
    border: 'none',
    color: '#888888',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.75rem',
    cursor: 'pointer',
    padding: '0.4rem 0.8rem'
  },
  activeNavLink: {
    background: '#1E1E22',
    border: '1px solid #FF3E3E',
    color: '#FFFFFF',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.75rem',
    cursor: 'pointer',
    padding: '0.4rem 0.8rem'
  },
  heroContainer: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0B',
    fontFamily: "'Space Grotesk', sans-serif",
    padding: '80px 20px',
    textAlign: 'center'
  },
  heroContent: {
    maxWidth: '600px'
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: '1.1',
    margin: '1rem 0'
  },
  heroSubtitle: {
    color: '#888888',
    fontSize: '1.1rem',
    marginBottom: '2rem',
    lineHeight: '1.6'
  },
  ctaBtn: {
    padding: '1.2rem 2.5rem',
    backgroundColor: '#FF3E3E',
    color: '#FFFFFF',
    border: 'none',
    fontSize: '0.85rem',
    fontWeight: '700',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    cursor: 'pointer'
  },
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0B',
    fontFamily: "'Space Grotesk', sans-serif",
    padding: '80px 20px 20px 20px',
    boxSizing: 'border-box'
  },
  card: {
    width: '100%',
    maxWidth: '460px',
    backgroundColor: '#111113',
    color: '#E0E0E0',
    padding: '2.5rem',
    border: '1px solid #1E1E22',
    borderTop: '2px solid #FF3E3E',
    boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
    textAlign: 'left'
  },
  sTag: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.6rem',
    letterSpacing: '0.25em',
    textTransform: 'uppercase',
    color: '#FF3E3E',
    marginBottom: '0.8rem',
  },
  heading: {
    marginTop: 0,
    marginBottom: '2rem',
    fontSize: '2rem',
    fontWeight: '700',
    lineHeight: '1',
    textTransform: 'uppercase',
    letterSpacing: '-0.02em',
    color: '#FFFFFF'
  },
  fieldGroup: {
    marginBottom: '1.5rem'
  },
  label: {
    display: 'block',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.65rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    marginBottom: '0.6rem',
    color: '#888888'
  },
  input: {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#060608',
    border: '1px solid #1E1E22',
    color: '#FFFFFF',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.85rem',
    outline: 'none',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#060608',
    border: '1px solid #1E1E22',
    color: '#FFFFFF',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.85rem',
    outline: 'none',
    boxSizing: 'border-box',
    resize: 'vertical'
  },
  fileInput: {
    width: '100%',
    padding: '0.8rem',
    backgroundColor: '#060608',
    border: '1px dashed #1E1E22',
    color: '#888888',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.75rem',
    boxSizing: 'border-box',
    cursor: 'pointer'
  },
  button: {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#FFFFFF',
    color: '#0A0A0B',
    border: 'none',
    fontSize: '0.75rem',
    fontWeight: '700',
    fontFamily: "'Space Grotesk', sans-serif",
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    marginTop: '0.5rem'
  },
  statusBox: {
    marginTop: '1.5rem',
    padding: '0.8rem',
    backgroundColor: '#060608',
    border: '1px solid #1E1E22',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.65rem',
    letterSpacing: '0.1em',
    color: '#FF3E3E',
  }
};