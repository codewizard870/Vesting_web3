import React from 'react';
import ReactDOM from 'react-dom';
import "./tailwind.output.css"
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { SessionProvider } from 'contexts';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <SessionProvider>
        <App />
      </SessionProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
