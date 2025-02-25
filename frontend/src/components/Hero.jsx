import { useState, useEffect } from "react";

const images = [
  "./images3.jpeg",
  "./images1.jpeg",
  "./images2.jpeg",
];

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
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
        setSelectedImage(URL.createObjectURL(file)); // Optionally display the selected image
      } else {
        alert("Please upload an image with .jpg, .jpeg, or .png extension.");
      }
    }
  };

  const handleButtonClick = () => {
    document.getElementById("file-upload").click();
  };

  const styles = {
    container: {
      position: "relative",
      height: "100vh",
      width: "100%",
      overflow: "hidden"
    },
    imageContainer: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%"
    },
    image: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "opacity 1s ease-in-out"
    },
    overlay: {
      position: "absolute",
      inset: 0,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      backdropFilter: "blur(4px)"
    },
    content: {
      position: "relative",
      zIndex: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%"
    },
    box: {
      maxWidth: "42rem",
      margin: "0 auto",
      padding: "32px",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(8px)",
      borderRadius: "16px",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      textAlign: "center"
    },
    heading: {
      fontSize: "2.25rem",
      fontWeight: "bold",
      color: "#111827",
      marginBottom: "16px"
    },
    text: {
      fontSize: "1.125rem",
      color: "#374151",
      marginBottom: "32px"
    },
    button: {
      display: "inline-flex",
      alignItems: "center",
      padding: "12px 24px",
      backgroundColor: "#111827",
      color: "white",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
      fontSize: "1rem"
    },
    fileInput: {
      display: "none"
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
          <button style={styles.button} onClick={handleButtonClick}>
            <i className="fa-solid fa-file-import"> </i>
            Upload Image
          </button>
          <input
            type="file"
            id="file-upload"
            accept=".jpg,.jpeg,.png"
            style={styles.fileInput}
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
