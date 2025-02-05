import React, { useState, useEffect } from "react";

const images = [
  "./images1.jpeg",
  "./images2.jpeg",
  "./images3.jpeg"
];

const Background = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: `url(${images[currentImage]}) center/cover no-repeat`,
        transition: "background 1s ease-in-out",
        zIndex: -1
      }}
    />
  );
};

export default Background;
