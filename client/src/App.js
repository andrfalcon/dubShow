import { useState } from 'react';
import axios from 'axios';

function App() {
  const [url, setUrl] = useState('');

  const handleSetUrl = (event) => {
    setUrl(event.target.value)
  }

  const postVideo = async () => {
    const response = await axios.post('http://localhost:5001/dub', {
      url: url
    });
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
      <button onClick={postVideo}>Dub to French</button>
    </div>
  );
}

export default App;
