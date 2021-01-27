import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as Colors from './Constants/Colors';
import githubLogo from './Images/github-white.png'

ReactDOM.render(
  <React.StrictMode>
    <header>
      <div className="header-title">
        <span style={{color:Colors.RED }}>COVID </span>+62
      </div>
    </header>
    <App />
    <footer>
      <div className="info-link">more info at <a href="http://covid19.go.id/">covid19.go.id</a></div>
      <a href="https://github.com/jasonowen-s/covid62">
        <img src={githubLogo} alt="github-logo" style={{
          marginTop:"4rem",
          marginBottom:"1rem",
          width:"5rem"
        }}/>
      </a>
    </footer>
  </React.StrictMode>,
  document.getElementById('root')
);
