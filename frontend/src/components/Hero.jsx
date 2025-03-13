import { useState, useEffect } from "react";
import { imageService, authService } from "../services/api";

const images = [
  "./images3.jpeg",
  "./images1.jpeg",
  "./images2.jpeg",
];

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const user = authService.getCurrentUser();
    setIsLoggedIn(!!user);

    // Image carousel
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      if (["jpg", "jpeg", "png"].includes(fileExtension)) {
        setSelectedFile(file);
        setSelectedImage(URL.createObjectURL(file));
        setUploadStatus('');
      } else {
        alert("Please upload an image with .jpg, .jpeg, or .png extension.");
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select an image first');
      return;
    }

    if (!isLoggedIn) {
      setUploadStatus('Please login to upload images');
      return;
    }

    setUploading(true);
    setUploadStatus('Uploading...');

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await imageService.uploadImage(formData);
      
      setUploadStatus('Image uploaded successfully!');
      // Clear the selected file after successful upload
      setSelectedFile(null);
      setTimeout(() => {
        setSelectedImage(null);
      }, 2000);
    } catch (error) {
      setUploadStatus(`Upload failed: ${error.response?.data?.message || 'Unknown error'}`);
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleButtonClick = () => {
    document.getElementById("file-upload").click();
  };

  const styles = {
    // Your existing styles...
    // Add these new styles:
    uploadButton: {
      display: "inline-flex",
      alignItems: "center",
      padding: "12px 24px",
      backgroundColor: "#4a5568",
      color: "white",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
      fontSize: "1rem",
      marginLeft: "10px"
    },
    previewContainer: {
      marginTop: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    },
    previewImage: {
      maxWidth: "300px",
      maxHeight: "200px",
      borderRadius: "8px",
      marginBottom: "10px"
    },
    statusMessage: {
      marginTop: "10px",
      color: uploadStatus.includes('failed') ? "#e53e3e" : 
             uploadStatus.includes('success') ? "#38a169" : "#4a5568"
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.imageContainer}>
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index + 1}`}
            style={{
              ...styles.image,
              opacity: index === currentImage ? 1 : 0
            }}
          />
        ))}
        <div style={styles.overlay} />
      </div>
      <div style={styles.content}>
        <div style={styles.box}>
          <h1 style={styles.heading}>Skin Disease Detection</h1>
          <p style={styles.text}>
            Upload your skin image for instant analysis using our advanced AI
            technology. Get quick and accurate assessments to help identify
            potential skin conditions.
          </p>
          
          <div>
            <button style={styles.button} onClick={handleButtonClick}>
              <i className="fa-solid fa-file-import"></i> Select Image
            </button>
            
            {selectedFile && (
              <button 
                style={styles.uploadButton} 
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload Image'}
              </button>
            )}
            
            <input
              type="file"
              id="file-upload"
              accept=".jpg,.jpeg,.png"
              style={styles.fileInput}
              onChange={handleFileChange}
            />
          </div>
          
          {selectedImage && (
            <div style={styles.previewContainer}>
              <img src={selectedImage} alt="Preview" style={styles.previewImage} />
              <p>Selected: {selectedFile.name}</p>
            </div>
          )}
          
          {uploadStatus && (
            <p style={styles.statusMessage}>{uploadStatus}</p>
          )}
          
          {!isLoggedIn && (
            <p style={{marginTop: "15px", color: "#e53e3e"}}>
              Please login to upload and analyze images
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;