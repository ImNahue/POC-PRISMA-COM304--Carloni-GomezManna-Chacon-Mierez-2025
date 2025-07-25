import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx'; // Esta línea es la que falla

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export interface Category {
  id: number;
  name: string;
  description?: string;
}