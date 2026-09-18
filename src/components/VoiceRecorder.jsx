import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, CheckCircle2, RefreshCw, Play, Square, Edit3 } from 'lucide-react';
import { translations } from '../lib/translations';

export default function VoiceRecorder({ lang = 'en', onTranscribed, placeholderText }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioPlayerRef = useRef(null);
  const t = translations[lang] || translations.en;

  useEffect(() => {
    // Initialize Web Speech API for live exact speech-to-text
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;

      // Set regional speech language
      if (lang === 'ml') rec.lang = 'ml-IN';
      else if (lang === 'hi') rec.lang = 'hi-IN';
      else rec.lang = 'en-IN';

      rec.onresult = (event) => {
        let finalStr = '';
        let interimStr = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const trans = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalStr += trans + ' ';
          } else {
            interimStr += trans;
          }
        }
        if (finalStr) {
          setTranscript(prev => {
            const updated = (prev + ' ' + finalStr).trim();
            onTranscribed?.(updated);
            return updated;
          });
        }
        setInterimText(interimStr);
      };

      rec.onerror = (err) => {
        console.warn('Speech recognition status:', err.error);
      };

      rec.onend = () => {
        setInterimText('');
      };

      recognitionRef.current = rec;
    }
  }, [lang]);

  // Audio Wave Animation during recording
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setAudioLevel(Math.floor(Math.random() * 80) + 20);
      }, 100);
    } else {
      setAudioLevel(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = async () => {
    setInterimText('');
    setIsRecording(true);

    // 1. Start Speech Recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {}
    }

    // 2. Start MediaRecorder for actual voice audio recording playback
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
        };

        mediaRecorder.start();
      } catch (e) {
        console.warn('Microphone permission not granted for raw audio recording:', e);
      }
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop(); } catch (e) {}
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleClear = () => {
    setTranscript('');
    setInterimText('');
    setAudioUrl(null);
    onTranscribed?.('');
  };

  const handlePlayVoice = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audioPlayerRef.current = audio;
      setIsPlayingAudio(true);
      audio.play();
      audio.onended = () => setIsPlayingAudio(false);
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.topRow}>
        <div style={styles.iconBadge}>
          <Volume2 size={20} color="#C1602C" />
        </div>
        <div>
          <h4 style={styles.title}>{t.voiceRecordTitle || "Speak & Record Product Details"}</h4>
          <p style={styles.subtitle}>
            Speak into your mic in <strong>{lang === 'ml' ? 'Malayalam' : lang === 'hi' ? 'Hindi' : 'English'}</strong>. Your exact spoken words will appear live.
          </p>
        </div>
      </div>

      {/* Mic Trigger & Live Wave Animation */}
      <div style={styles.recordSection}>
        <button
          onClick={toggleRecording}
          type="button"
          style={{
            ...styles.micButton,
            backgroundColor: isRecording ? '#C1602C' : '#FAF3E7',
            borderColor: isRecording ? '#C1602C' : '#E8D9C5',
            boxShadow: isRecording ? '0 0 24px rgba(193, 96, 44, 0.4)' : '0 4px 14px rgba(0,0,0,0.06)'
          }}
        >
          {isRecording ? (
            <Square size={24} color="#FFFFFF" fill="#FFFFFF" />
          ) : (
            <Mic size={28} color="#C1602C" />
          )}
        </button>

        {/* Live Audio Visualizer Bars */}
        <div style={styles.waveVisualizer}>
          {[35, 75, 50, 90, 60, 100, 40, 80, 25].map((h, i) => (
            <div
              key={i}
              style={{
                ...styles.waveBar,
                height: isRecording ? `${Math.max(10, (audioLevel * h) / 100)}px` : '8px',
                backgroundColor: isRecording ? '#C1602C' : '#E8D9C5'
              }}
            />
          ))}
        </div>

        <span style={styles.statusLabel}>
          {isRecording ? '🔴 Recording Live Speech... Speak now!' : transcript ? '✅ Voice Recorded' : 'Tap Mic to Start Live Recording'}
        </span>
      </div>

      {/* Live Interim Speech Stream Output */}
      {interimText && (
        <div style={styles.interimBox}>
          <span style={styles.interimText}>Listening: "{interimText}"...</span>
        </div>
      )}

      {/* Exact Transcribed Text Output Field */}
      <div style={styles.resultBox}>
        <div style={styles.resultHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} color="#7C8A5A" />
            <span style={styles.resultTitle}>Recorded Spoken Text (Exact Audio):</span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {audioUrl && (
              <button
                type="button"
                onClick={handlePlayVoice}
                style={styles.smallActionBtn}
              >
                <Play size={12} />
                <span>{isPlayingAudio ? 'Playing...' : 'Play Audio'}</span>
              </button>
            )}
            {transcript && (
              <button
                type="button"
                onClick={handleClear}
                style={styles.smallActionBtn}
              >
                <RefreshCw size={12} />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        <textarea
          rows="3"
          value={transcript}
          onChange={(e) => {
            setTranscript(e.target.value);
            onTranscribed?.(e.target.value);
          }}
          placeholder={placeholderText || "Your exact live voice recording transcript will appear here. You can also edit or type directly..."}
          style={styles.transcriptInput}
        />
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E8D9C5',
    borderRadius: '18px',
    padding: '20px',
    boxShadow: '0 4px 18px rgba(59, 42, 30, 0.05)'
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px'
  },
  iconBadge: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    backgroundColor: '#F8ECE4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.15rem',
    color: '#3B2A1E'
  },
  subtitle: {
    fontSize: '0.82rem',
    color: '#6E5B4D'
  },
  recordSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    padding: '18px 0',
    backgroundColor: '#FAF3E7',
    borderRadius: '14px',
    border: '1px dashed #E8D9C5'
  },
  micButton: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
  },
  waveVisualizer: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    height: '36px'
  },
  waveBar: {
    width: '4px',
    borderRadius: '4px',
    transition: 'height 0.1s ease'
  },
  statusLabel: {
    fontSize: '0.88rem',
    fontWeight: '700',
    color: '#3B2A1E'
  },
  interimBox: {
    marginTop: '10px',
    padding: '8px 14px',
    backgroundColor: '#FAF2DF',
    borderRadius: '8px',
    border: '1px solid #E5B24E'
  },
  interimText: {
    fontSize: '0.85rem',
    color: '#C1602C',
    fontStyle: 'italic',
    fontWeight: '600'
  },
  resultBox: {
    marginTop: '16px',
    backgroundColor: '#F8F3EA',
    border: '1px solid #E8D9C5',
    borderRadius: '12px',
    padding: '14px'
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  resultTitle: {
    fontSize: '0.82rem',
    fontWeight: '700',
    color: '#3B2A1E'
  },
  smallActionBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    background: '#FFFFFF',
    border: '1px solid #E8D9C5',
    borderRadius: '12px',
    padding: '3px 10px',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#3B2A1E',
    cursor: 'pointer'
  },
  transcriptInput: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #E8D9C5',
    fontSize: '0.92rem',
    color: '#3B2A1E',
    backgroundColor: '#FFFFFF',
    resize: 'none',
    lineHeight: '1.5'
  }
};
