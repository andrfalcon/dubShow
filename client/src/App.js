import { useState, useRef } from 'react';
import axios from 'axios';
// import ReactPlayer from 'react-player';

function App() {
  const [url, setUrl] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // State to hold the current time
  const videoRef = useRef(null);

  // Function to update the current time when the video playback position changes
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime); // Update the current time state
    }
  };

  const handleSetUrl = (event) => {
    setUrl(event.target.value)
  }

  const createDub = async () => {
    const response = await axios.post('http://localhost:5001/create-dub', {
      url: url
    });
    console.log(response);
  }

  const fetchDub = async () => {
    const response = (await axios.post('http://localhost:5001/fetch-dub', {
      message: "hello, world"
    }));
    console.log(response);
  }

  return (
    <div>
      <h1>Dubshow</h1>
      <input
        type="text"
        value={url}
        onChange={handleSetUrl}
        placeholder="Enter YouTube video URL"
      />
      <button onClick={createDub}>Create Dub</button>
      <button onClick={fetchDub}>Fetch Dub</button>
      <button onClick={() => setIsStreaming(true)}>Stream Dubbed Video</button>
      {isStreaming ? (
        <div>
          <video controls width="600" ref={videoRef} onTimeUpdate={handleTimeUpdate}>
            <source src="http://localhost:5001/stream" type="video/mp4" />
          </video>
          <h1>{currentTime.toFixed(2)}</h1>
        </div>
      ) : (
        <h2>Press the stream button to start streaming.</h2>
      )}
    </div>
  );
}

export default App;
