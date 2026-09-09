import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import RightSidebar from "./components/RightSidebar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";

import "./App.css";

function MainLayout() {
  const [createPostTrigger, setCreatePostTrigger] = useState(0);

  const handleCreatePostClick = () => {
    setCreatePostTrigger((current) => current + 1);
  };

  return (
    <div className="app">
      <Sidebar onCreatePost={handleCreatePostClick} />

      <div className="app-main">
        <Navbar />

        <div className="content-layout">
          <main className="feed">
            <Home createPostTrigger={createPostTrigger} />
          </main>

          <aside className="right-panel">
            <RightSidebar />
          </aside>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;