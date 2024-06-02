import { useState } from 'react';

function App() {
  const [url, setUrl] = useState('');

  const handleSetUrl = (event) => {
    setUrl(event.target.value)
  }

  const downloadVideo = () => {
    console.log("this downloads video as mp4")
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
      <button>Dub to French</button>
    </div>
  );
}

export default App;
