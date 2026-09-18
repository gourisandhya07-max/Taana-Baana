import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, RefreshCw, CheckCircle2, Upload } from 'lucide-react';

export default function CameraCaptureModal({ onClose, onCapturePhoto }) {
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'user' | 'environment'
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const startCamera = async () => {
    stopCamera();
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: facingMode }, width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } else {
        setCameraError('Live camera stream not supported on this browser. Use file upload fallback.');
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      setCameraError('Unable to access device camera. Please allow camera permissions or upload photo.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleTakeSnap = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(dataUrl);
      stopCamera();
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapturePhoto(capturedImage);
      onClose();
    }
  };

  const handleFileFallbackSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onCapturePhoto(event.target.result);
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button style={styles.closeBtn} onClick={onClose}>
          <X size={20} color="#FFFFFF" />
        </button>

        <h3 style={styles.title}>Take Craft Photo</h3>

        <div style={styles.viewportContainer}>
          {capturedImage ? (
            <img src={capturedImage} alt="Captured craft" style={styles.previewImage} />
          ) : cameraError ? (
            <div style={styles.errorBox}>
              <Camera size={36} color="#C1602C" />
              <p style={styles.errorText}>{cameraError}</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-primary"
                style={{ marginTop: '10px' }}
              >
                <Upload size={16} /> Choose Photo from File
              </button>
            </div>
          ) : (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={styles.videoStream}
              />
              <div style={styles.viewfinderGuide} />
            </div>
          )}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>

        {/* Action Controls Row */}
        <div style={styles.controlsRow}>
          {capturedImage ? (
            <>
              <button type="button" onClick={handleRetake} className="btn btn-outline" style={{ flex: 1 }}>
                <RefreshCw size={16} /> Retake Photo
              </button>
              <button type="button" onClick={handleConfirm} className="btn btn-primary" style={{ flex: 1 }}>
                <CheckCircle2 size={16} /> Confirm Photo
              </button>
            </>
          ) : !cameraError ? (
            <>
              <button
                type="button"
                onClick={() => setFacingMode(facingMode === 'user' ? 'environment' : 'user')}
                className="btn btn-outline"
                title="Switch Camera"
              >
                <RefreshCw size={18} /> Switch Camera
              </button>

              <button
                type="button"
                onClick={handleTakeSnap}
                style={styles.shutterBtn}
                title="Take Photo"
              >
                <div style={styles.shutterInner} />
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-outline"
                title="Upload Photo File"
              >
                <Upload size={18} /> Upload File
              </button>
            </>
          ) : null}

          {/* Hidden File Picker Fallback */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileFallbackSelect}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    zIndex: 999999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px'
  },
  modal: {
    backgroundColor: '#3B2A1E',
    borderRadius: '24px',
    maxWidth: '540px',
    width: '100%',
    padding: '24px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'rgba(255, 255, 255, 0.15)',
    border: 'none',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 10
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.3rem',
    color: '#FAF3E7',
    marginBottom: '16px'
  },
  viewportContainer: {
    width: '100%',
    height: '360px',
    borderRadius: '16px',
    backgroundColor: '#000000',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #C1602C'
  },
  videoStream: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  viewfinderGuide: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    right: '10%',
    bottom: '10%',
    border: '2px stroke rgba(217, 164, 65, 0.6)',
    borderRadius: '12px',
    pointerEvents: 'none'
  },
  previewImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  errorBox: {
    padding: '24px',
    textAlign: 'center',
    color: '#FAF3E7',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  },
  errorText: {
    fontSize: '0.88rem',
    color: '#E8D9C5'
  },
  controlsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: '20px',
    gap: '12px'
  },
  shutterBtn: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: '#C1602C',
    border: '4px solid #FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(193, 96, 44, 0.5)'
  },
  shutterInner: {
    width: '46px',
    height: '46px',
    borderRadius: '50%',
    backgroundColor: '#FFFFFF'
  }
};
