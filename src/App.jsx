import { useState } from "react";
import axios from "axios";
import { serverUrl } from "./global/server";

const App = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState(null);

  const fetchVideoInfo = async () => {
    if (!videoUrl.trim()) {
      alert("Please enter a video URL!");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${serverUrl}/get-video-url/send-format?url=${videoUrl}`
      );
      setVideoData(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching video info:", error);
      if (error.response && error.response.data && error.response.data.msg) {
        alert(`Error: ${error.response.data.msg}`);
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    }
    setLoading(false);
  };

  const handleDownload = (itag) => {
    window.open(
      `${serverUrl}/download?url=${encodeURIComponent(
        videoUrl
      )}&itag=${itag}`,
      "_blank"
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold text-wrap mb-[78px]">YouTube Video Downloader</h1>
      
      <div className="flex items-center mb-[32px] flex-wrap gap-4">
        <input
          type="text"
          placeholder="Paste your video link"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="w-80 p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchVideoInfo}
          disabled={loading}
          className={`px-4 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Loading..." : "Download Video"}
        </button>
      </div>

      {videoData && (
        <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
          <img
            src={videoData.thumbnail}
            alt="Thumbnail"
            className="w-80 rounded-lg mb-4"
          />
          <h3 className="text-xl font-semibold">{videoData.title}</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {videoData.formats.map((format, index) => (
              <button
                key={index}
                onClick={() => handleDownload(format.itag)}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-medium transition"
              >
                {format.quality}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
