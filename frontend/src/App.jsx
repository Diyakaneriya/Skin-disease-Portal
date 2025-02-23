import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import UserModal from './components/UserModal'; // Corrected Import
import { useState } from 'react';

const App = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <BrowserRouter>
            <div>
                <button onClick={() => setIsModalOpen(true)}>User</button>
                <UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} /> {/* Fixed Component Usage */}
                
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="*" element={<div>404 Not Found</div>} />
                </Routes>
            </div>
        </BrowserRouter>
    );
};

export default App;
