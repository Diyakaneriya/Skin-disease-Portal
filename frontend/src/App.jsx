import React from "react";
import Background from "../components/Background";
import NavBar from "../components/NavBar";

const App = () => {
  return (
    <div>
      <Background/>
      <NavBar/>
      <div style={{ padding: "20px", color: "white", position: "relative", zIndex: 1 }}>
        <h2>Welcome to Skin Disease Portal</h2>
        <p>Get insights and information about skin conditions.</p>
      </div>
    </div>
  );
};

export default App;
