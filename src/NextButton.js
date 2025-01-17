import React, { useState } from 'react';
import NewTenses from './NewTenses';

function NextButton({ setIsHidden, id }) {
  const [hasStarted, setHasStarted] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const user_id = localStorage.getItem('user_id');

  const handleNextClick = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/generate_sentences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, user_id: user_id }), // Use the passed id here
      });

      if (response.ok) {
        const blob = await response.blob();
        const contentDisposition = response.headers.get('Content-Disposition');
        const filename = contentDisposition
          ? contentDisposition.split('filename=')[1].replace(/['"]/g, '')
          : 'audio_file.mp3';

        const audioFileURL = URL.createObjectURL(blob);
        setAudioFile({ url: audioFileURL, name: filename });
        setHasStarted(true);
        setIsHidden(true); // Hide the API response when the next audio starts
      } else {
        console.error('Failed to fetch audio file');
      }
    } catch (error) {
      console.error('Error fetching audio file:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!hasStarted ? (
        <div>
          <div className="mb-8 w-full"></div>

          {loading ? (
            <p className="text-lg font-semibold text-blue-500">
              Redirecting to the next audio, Please wait...
            </p>
          ) : (
            <button
              onClick={handleNextClick}
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg text-lg"
            >
              Next
            </button>
          )}
        </div>
      ) : (
        audioFile ? (
          <NewTenses audioFile={audioFile} />
        ) : (
          <p className="text-lg font-semibold text-blue-500">Loading audio...</p>
        )
      )}
    </div>
  );
}

export default NextButton;
