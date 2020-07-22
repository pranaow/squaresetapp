import React from 'react';
import './App.css';
import SquareSet from './SquareSet.js';
import ClearCache from "react-clear-cache";

function App() {
  return (
    <div className="App">
      <ClearCache>
        {({ isLatestVersion, emptyCacheStorage }) => (
          <div>
            {!isLatestVersion && (
              <p>
                // eslint-disable-next-line 
                <a
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    emptyCacheStorage();
                  }}
                >
                  Update version
                </a>
              </p>
            )}
          </div>
        )}
      </ClearCache>
      <SquareSet debug="1"/>
    </div>
  );
}

export default App;
