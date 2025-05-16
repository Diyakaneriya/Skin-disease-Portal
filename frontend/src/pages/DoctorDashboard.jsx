import { useState, useEffect } from 'react';
import { authService } from '../services/api';
import api from '../services/api';

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users/patients');
        setPatients(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError('Failed to load patients. Please try again later.');
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    setSelectedImage(null);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  // Styles
  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '80px auto 20px',
    },
    header: {
      fontSize: '2rem',
      marginBottom: '20px',
      color: '#333',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '300px 1fr',
      gap: '20px',
      height: 'calc(100vh - 150px)',
    },
    patientList: {
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      overflow: 'auto',
      backgroundColor: '#f9f9f9',
      height: '100%',
    },
    patientItem: {
      padding: '15px',
      borderBottom: '1px solid #e0e0e0',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    patientItemActive: {
      padding: '15px',
      borderBottom: '1px solid #e0e0e0',
      cursor: 'pointer',
      backgroundColor: '#e3f2fd',
      transition: 'background-color 0.2s',
    },
    patientName: {
      fontWeight: 'bold',
      fontSize: '1.1rem',
      marginBottom: '5px',
    },
    patientEmail: {
      color: '#666',
      fontSize: '0.9rem',
    },
    patientCount: {
      color: '#666',
      fontSize: '0.9rem',
      marginTop: '5px',
    },
    detailsContainer: {
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '20px',
      backgroundColor: 'white',
      height: '100%',
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column',
    },
    noSelection: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      color: '#999',
      fontSize: '1.2rem',
    },
    imagesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '15px',
      marginTop: '20px',
    },
    imageCard: {
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
    },
    imageCardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
    },
    imagePreview: {
      width: '100%',
      height: '150px',
      objectFit: 'cover',
    },
    imageInfo: {
      padding: '10px',
    },
    imageDate: {
      fontSize: '0.8rem',
      color: '#666',
    },
    selectedImageContainer: {
      marginTop: '20px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '20px',
      backgroundColor: '#f9f9f9',
    },
    selectedImageHeader: {
      fontSize: '1.5rem',
      marginBottom: '15px',
      color: '#333',
    },
    selectedImageContent: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
    },
    imageFullSize: {
      width: '100%',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
    featuresContainer: {
      backgroundColor: 'white',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
    featureTitle: {
      fontSize: '1.2rem',
      marginBottom: '10px',
      color: '#333',
    },
    featureItem: {
      marginBottom: '8px',
      padding: '8px',
      backgroundColor: '#f5f5f5',
      borderRadius: '4px',
    },
    featureLabel: {
      fontWeight: 'bold',
      marginRight: '5px',
    },
    featureValue: {
      color: '#666',
    },
    gradCamContainer: {
      marginTop: '20px',
    },
    gradCamTitle: {
      fontSize: '1.2rem',
      marginBottom: '10px',
      color: '#333',
    },
    gradCamImage: {
      width: '100%',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
    diagnosisContainer: {
      marginTop: '20px',
      backgroundColor: 'white',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
    diagnosisTitle: {
      fontSize: '1.2rem',
      marginBottom: '10px',
      color: '#333',
    },
    predictionItem: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '8px',
      marginBottom: '8px',
      backgroundColor: '#f5f5f5',
      borderRadius: '4px',
    },
    predictionLabel: {
      fontWeight: 'bold',
    },
    predictionConfidence: {
      backgroundColor: '#e3f2fd',
      padding: '2px 8px',
      borderRadius: '4px',
    },
    recommendationsContainer: {
      marginTop: '20px',
      backgroundColor: 'white',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
    recommendationsTitle: {
      fontSize: '1.2rem',
      marginBottom: '10px',
      color: '#333',
    },
    recommendationText: {
      lineHeight: '1.6',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
    },
    errorContainer: {
      color: 'red',
      textAlign: 'center',
      padding: '20px',
    },
  };

  // Render loading state
  if (loading) {
    return (
      <div style={styles.container}>
        <h1 style={styles.header}>Doctor Dashboard</h1>
        <div style={styles.loadingContainer}>
          <p>Loading patients data...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div style={styles.container}>
        <h1 style={styles.header}>Doctor Dashboard</h1>
        <div style={styles.errorContainer}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Doctor Dashboard</h1>
      <div style={styles.grid}>
        {/* Patient List */}
        <div style={styles.patientList}>
          {patients.length === 0 ? (
            <div style={{ padding: '15px' }}>
              <p>No patients found.</p>
            </div>
          ) : (
            patients.map((patient) => (
              <div
                key={patient.id}
                style={selectedPatient?.id === patient.id ? styles.patientItemActive : styles.patientItem}
                onClick={() => handlePatientClick(patient)}
              >
                <div style={styles.patientName}>{patient.name}</div>
                <div style={styles.patientEmail}>{patient.email}</div>
                <div style={styles.patientCount}>
                  {patient.images?.length || 0} image{patient.images?.length !== 1 ? 's' : ''}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Patient Details */}
        <div style={styles.detailsContainer}>
          {!selectedPatient ? (
            <div style={styles.noSelection}>
              <p>Select a patient to view their details</p>
            </div>
          ) : (
            <>
              <h2>{selectedPatient.name}'s Images</h2>
              <p>Email: {selectedPatient.email}</p>
              <p>Joined: {new Date(selectedPatient.created_at).toLocaleDateString()}</p>

              {selectedPatient.images?.length === 0 ? (
                <p>No images uploaded by this patient.</p>
              ) : (
                <>
                  <div style={styles.imagesGrid}>
                    {selectedPatient.images.map((image) => (
                      <div
                        key={image.id}
                        style={styles.imageCard}
                        onClick={() => handleImageClick(image)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-5px)';
                          e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'none';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <img src={image.imageUrl} alt="Patient skin" style={styles.imagePreview} />
                        <div style={styles.imageInfo}>
                          <div style={styles.imageDate}>
                            {new Date(image.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedImage && (
                    <div style={styles.selectedImageContainer}>
                      <h3 style={styles.selectedImageHeader}>Image Analysis</h3>
                      <div style={styles.selectedImageContent}>
                        <div>
                          <img src={selectedImage.imageUrl} alt="Patient skin" style={styles.imageFullSize} />
                        </div>
                        <div>
                          {selectedImage.features ? (
                            <div style={styles.featuresContainer}>
                              <h4 style={styles.featureTitle}>Skin Lesion Features</h4>
                              {Object.entries(JSON.parse(selectedImage.features)).map(([key, value]) => (
                                <div key={key} style={styles.featureItem}>
                                  <span style={styles.featureLabel}>{key.replace(/_/g, ' ')}:</span>
                                  <span style={styles.featureValue}>{value}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p>No feature data available for this image.</p>
                          )}
                        </div>
                      </div>

                      {selectedImage.classification && (
                        <>
                          {selectedImage.classification.grad_cam_url && (
                            <div style={styles.gradCamContainer}>
                              <h4 style={styles.gradCamTitle}>Grad-CAM Visualization</h4>
                              <img 
                                src={`${window.location.protocol}//${window.location.host}/${selectedImage.classification.grad_cam_url}`} 
                                alt="Grad-CAM visualization" 
                                style={styles.gradCamImage} 
                              />
                            </div>
                          )}

                          {selectedImage.classification.predictions && (
                            <div style={styles.diagnosisContainer}>
                              <h4 style={styles.diagnosisTitle}>Diagnosis Predictions</h4>
                              {selectedImage.classification.predictions.map((prediction, index) => (
                                <div key={index} style={styles.predictionItem}>
                                  <span style={styles.predictionLabel}>{prediction.label}</span>
                                  <span style={styles.predictionConfidence}>
                                    {(prediction.confidence * 100).toFixed(2)}%
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {selectedImage.classification.recommendations && (
                            <div style={styles.recommendationsContainer}>
                              <h4 style={styles.recommendationsTitle}>Medical Recommendations</h4>
                              <p style={styles.recommendationText}>
                                {selectedImage.classification.recommendations}
                              </p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
