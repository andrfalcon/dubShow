import { useState, useRef } from 'react';
import axios from 'axios';
// import ReactPlayer from 'react-player';

function App() {
  const [url, setUrl] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // State to hold the current time
  const videoRef = useRef(null);

  const sourceTranscriptionRef = useRef(null);
  const targetTranscriptionRef = useRef(null);

  const [displayedSource, setDisplayedSource] = useState('');
  const [displayedTarget, setDisplayedTarget] = useState('');

  // Function to update the current time when the video playback position changes
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const timestamps = Object.keys(sourceTranscriptionRef.current).filter(value => value <= currentTime);
      const currentTimestamp = timestamps[timestamps.length - 1];
      console.log(currentTimestamp);
      setCurrentTime(currentTime); // Update the current time state
      setDisplayedSource(sourceTranscriptionRef.current[currentTimestamp]);
      setDisplayedTarget(targetTranscriptionRef.current[currentTimestamp]);
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
    sourceTranscriptionRef.current = response.data.sourceTranscription;
    targetTranscriptionRef.current = response.data.targetTranscription;
    setDisplayedSource(sourceTranscriptionRef.current[0]);
    setDisplayedTarget(targetTranscriptionRef.current[0]);
    console.log(sourceTranscriptionRef);
  }

  // function handleSourceTranscription () {

  // }

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
          <h2>{displayedSource}</h2>
          <h2>{displayedTarget}</h2>
        </div>
      ) : (
        <h2>Press the stream button to start streaming.</h2>
      )}
    </div>
  );
}

export default App;
