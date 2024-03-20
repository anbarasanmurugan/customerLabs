import { useState } from "react";
import SegmentFloater from "./segmentFloater";
import "./App.css";

const App = () => {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className="app">
      <button className="saveSchemaBtn" onClick={togglePopup}>
        Save Segment
      </button>
      {showPopup && (
        <div className="popup-background">
          <SegmentFloater handleClose={togglePopup} />
        </div>
      )}
    </div>
  );
};

export default App;
