import { useState } from 'react';
import axios from 'axios';
// import ReactPlayer from 'react-player';

function App() {
  const [url, setUrl] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

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
        <video controls width="600">
          <source src="http://localhost:5001/stream" type="video/mp4" />
        </video>
      ) : (
        <h2>Press the stream button to start streaming.</h2>
      )}
    </div>
  );
}

export default App;
