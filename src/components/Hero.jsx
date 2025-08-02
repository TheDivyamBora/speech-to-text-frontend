import React, { useState, useRef } from 'react';

const Hero = () => {

    const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('record');
  const [copied, setCopied] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);

  const sendAudioToBackend = async (audioFile) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('audio', audioFile);
      const response = await fetch('https://divyam-speech-to-text-backend.onrender.com/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setTranscript(data.transcription || 'No transcription received.');
    } catch (error) {
      console.error('Upload error:', error);
      setTranscript('Error transcribing audio.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      await sendAudioToBackend(file);
    }
  };

  const handleRecord = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (e) => {
          audioChunksRef.current.push(e.data);
        };

        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          await sendAudioToBackend(audioBlob);
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Recording error:', error);
        alert('Could not start recording.');
      }
    } else {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleCopy = () => {
    if (transcript) {
      navigator.clipboard.writeText(transcript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="home" className="flex flex-col justify-between items-center px-4 sm:px-6 lg:px-8 pt-22 pb-16 container mx-auto">
      <div className="text-center my-12 max-w-3xl">
    <h1 className="text-4xl font-bold text-purple-700"> Feel The Aura In Your Speech </h1>
    <p className="text-gray-600 mt-3 text-lg">Record your voice or upload an audio file to generate accurate transcriptions instantly.</p>
  </div>
    <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl p-10">
      {/* Toggle Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded-md font-semibold transition ${
            activeTab === 'record'
              ? 'bg-purple-700 text-white'
              : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
          }`}
          onClick={() => setActiveTab('record')}
        >
          Record Audio
        </button>
        <button
          className={`px-4 py-2 rounded-md font-semibold transition ${
            activeTab === 'upload'
              ? 'bg-purple-700 text-white'
              : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
          }`}
          onClick={() => setActiveTab('upload')}
        >
         Upload File
        </button>
      </div>

      {/* Record Panel */}
      {activeTab === 'record' && (
        <div className="border-2 border-dashed border-purple-400 rounded-xl p-6 text-center shadow-md">
          <div className="text-purple-700 text-4xl mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Start Recording</h2>
          <p className="text-gray-600 mb-4">
            Click the record button to begin capturing your voice.
          </p>
          <button
            onClick={handleRecord}
            className={`px-6 py-3 rounded-lg text-white font-semibold transition duration-300 ${
              isRecording
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {isRecording ? ' Stop Recording' : 'Start Recording'}
          </button>
        </div>
      )}

      {/* Upload Panel */}
      {activeTab === 'upload' && (
        <div className="border-2 border-dashed border-purple-400 rounded-xl p-6 text-center shadow-md">
          <div className="text-purple-700 text-4xl mb-4">📁</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Upload Your Audio File</h2>
          <p className="text-gray-600 mb-4">
            Choose a file and get it transcribed instantly.
          </p>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            ref={fileInputRef}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Choose File
          </button>
        </div>
      )}

      {/* Transcription Output */}
      <div className="bg-gray-100 p-4 rounded-xl shadow-inner max-h-60 overflow-y-auto relative mt-6">
        <h2 className="text-lg font-semibold text-purple-700 mb-2"> Transcribed Text</h2>
        {loading ? (
          <p className="text-purple-600 animate-pulse">Transcribing audio...</p>
        ) : (
          <p className="text-gray-700 whitespace-pre-wrap mb-4">
            {transcript || 'No transcription yet.'}
          </p>
        )}
        {!loading && transcript && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 text-sm text-purple-600 border border-purple-400 px-3 py-1 rounded hover:bg-purple-100"
          >
            {copied ? '✅ Copied!' : ' Copy'}
          </button>
        )}
      </div>
    </div>
    </section>
  );
};

export default Hero