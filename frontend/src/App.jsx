import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Register from './pages/Register';
import PostApplication from './pages/PostApplication';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getUser } from './store/slices/userSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

function App() { 

  const dispatch = useDispatch();

 useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch(getUser()); 
    }
  }, [dispatch]);

  return (
    <>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/post/application/:jobId"
          element={<PostApplication />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
     <ToastContainer position="top-right" theme="dark" />
    </Router>
  </>

  );
}

export default App

