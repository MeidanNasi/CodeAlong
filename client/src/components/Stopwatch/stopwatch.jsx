import React from "react";
import Timer from "react-compound-timer";
import "./stopwatch.css";

const Stopwatch = props => {
  return (
    <div className="stopwatch-container">
      <Timer startImmediately={false}>
        {({ start, pause, reset }) => (
          <React.Fragment>
            <div className="stopwatch-text">
              <Timer.Hours />:
              <Timer.Minutes />:
              <Timer.Seconds />
            </div>
            <br />
            <div className="stopwatch-btns">
              <button className="stopwatch-btn" onClick={start}>
                Start
              </button>
              <button className="stopwatch-btn" onClick={pause}>
                Pause
              </button>
              <button className="stopwatch-btn" onClick={reset}>
                Reset
              </button>
            </div>
          </React.Fragment>
        )}
      </Timer>
    </div>
  );
};

export default Stopwatch;
