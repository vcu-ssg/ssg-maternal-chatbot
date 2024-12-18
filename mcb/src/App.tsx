import React from "react";
import MyChatBot from "./MyChatBot";


function App() {
  return (
    <div className="h-screen w-screen bg-gray-200 flex items-center justify-center">
      <div className="bg-white w-[90%] max-w-md aspect-[9/16] rounded-lg shadow-md">
        <MyChatBot />
      </div>
    </div>
  );
}

export default App;
