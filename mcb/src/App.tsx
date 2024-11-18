import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import ChatBot from 'react-chatbotify';


const MyComponent = () => {
  const settings = {
    isOpen: true,
    general: {
      primaryColor: '#42b0c5',
      secondaryColor: '#491d8d',
      fontFamily: 'Arial, sans-serif',
      embedded: true
    },
    audio: {
      disabled: false,
    },
    chatHistory: {
      storageKey: "concepts_settings"
    }
    // other sections
  };


  return (
    <ChatBot settings={settings} />
  );
};

export default MyComponent;
