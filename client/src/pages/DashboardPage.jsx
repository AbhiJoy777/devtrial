import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

import Sidebar from '../components/Sidebar';
import LobbyModal from '../components/LobbyModal';
import ToggleSwitch from '../components/ToggleSwitch';
import CodeEditor from '../components/CodeEditor';
import OutputTerminal from '../components/OutputTerminal';
import './DashboardPage.css';

const SESSION_DURATION_CLIENT = 90;

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sessionState, setSessionState] = useState('idle');
  const [sessionData, setSessionData] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [myStream, setMyStream] = useState(null);
  const [peerStream, setPeerStream] = useState(null);
  const [code, setCode] = useState('// Start coding here...');
  const [timeLeft, setTimeLeft] = useState(SESSION_DURATION_CLIENT);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
  const [output, setOutput] = useState('');
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const myVideoRef = useRef();
  const peerVideoRef = useRef();
  const socketRef = useRef();
  const peerRef = useRef();
  const timerIntervalRef = useRef(null);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) setUser(userInfo);
    else navigate('/');
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(e.target) && !e.target.closest('.menu-button')) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  useEffect(() => {
    let localStream;
    let socket;

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        localStream = stream;
        setMyStream(stream);
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
        }

       socket = io(import.meta.env.VITE_API_URL);
        socketRef.current = socket;

        const peer = new Peer({ initiator: false, stream, trickle: false });
        const myPeerId = uuidv4();
        peer.myPeerId = myPeerId;
        peerRef.current = peer;

        socket.emit('register-peer', myPeerId);
        setIsReady(true);
        console.log('[Init] ✅ System ready with Peer ID:', myPeerId);

        peer.on('signal', data => { if (peer.targetPeerId) { socket.emit('signal', { to: peer.targetPeerId, from: peer.myPeerId, data }); } });
        peer.on('stream', stream => setPeerStream(stream));
        peer.on('error', err => console.error('[Peer Error]', err));
        socket.on('connect', () => console.log('[Socket] Connected:', socket.id));
        socket.on('signal-received', ({ from, data }) => {
          if (peerRef.current && peerRef.current.signal) {
            peerRef.current.targetPeerId = from;
            try { peerRef.current.signal(data); } catch (err) { console.warn('[Signal Warning]', err); }
          }
        });
        socket.on('match-found', data => {
          console.log('[Matchmaking] Match Found:', data);
          setSessionState('active');
          setSessionData(data);
          localStorage.setItem('userRole', data.role);
          setUserRole(data.role);
          clearInterval(timerIntervalRef.current);
          setTimeLeft(SESSION_DURATION_CLIENT);
          timerIntervalRef.current = setInterval(() => { setTimeLeft(prev => prev - 1); }, 1000);
          if (data.role === 'interviewer') {
            const newPeer = new Peer({ initiator: true, stream, trickle: false });
            newPeer.myPeerId = myPeerId;
            newPeer.targetPeerId = data.partnerPeerId;
            newPeer.on('signal', sigData => { socket.emit('signal', { to: newPeer.targetPeerId, from: newPeer.myPeerId, data: sigData }); });
            newPeer.on('stream', s => setPeerStream(s));
            peerRef.current.destroy();
            peerRef.current = newPeer;
          } else {
            peerRef.current.targetPeerId = data.partnerPeerId;
          }
        });
        socket.on('code-updated', (updatedCode) => setCode(updatedCode));
        socket.on('session-ended', () => {
          alert('Session over!');
          setSessionState('idle');
          setPeerStream(null);
          clearInterval(timerIntervalRef.current);
          if (peerRef.current) peerRef.current.destroy();
          const freshPeer = new Peer({ initiator: false, stream, trickle: false });
          freshPeer.myPeerId = uuidv4();
          peerRef.current = freshPeer;
          socket.emit('register-peer', freshPeer.myPeerId);
        });
      })
      .catch(err => {
        console.error('Media init failed:', err);
        alert('Could not access camera/mic. Check permissions and refresh.');
      });

    return () => {
      if (socket) socket.disconnect();
      if (peerRef.current) peerRef.current.destroy();
      if (localStream) localStream.getTracks().forEach(track => track.stop());
      clearInterval(timerIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (peerVideoRef.current && peerStream) {
      peerVideoRef.current.srcObject = peerStream;
    }
  }, [peerStream]);

  const handleStartSession = () => setSessionState('waiting');
  const handleCancelSearch = () => { if (socketRef.current) socketRef.current.emit('cancel-match'); setSessionState('idle'); };
  const handleSelectRole = (role) => { if (socketRef.current && isReady) { socketRef.current.emit('request-match', { role, user }); } };
  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (socketRef.current && sessionData && userRole === 'candidate') {
      socketRef.current.emit('code-change', { roomId: sessionData.roomId, code: newCode });
    }
  };
  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput("Executing...");
    setIsTerminalOpen(true);
    try {
        const { data } = await axios.post('http://localhost:5000/api/execute', { code });
        setOutput(data.output);
    } catch (error) {
        setOutput(error.response?.data?.message || "An error occurred.");
    } finally {
        setIsRunning(false);
    }
  };
  const formatTime = (seconds) => {
    if (seconds < 0) seconds = 0;
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  const toggleCamera = () => { if (myStream) { const track = myStream.getVideoTracks()[0]; track.enabled = !track.enabled; setCameraEnabled(track.enabled); } };
  const toggleMic = () => { if (myStream) { const track = myStream.getAudioTracks()[0]; track.enabled = !track.enabled; setMicEnabled(track.enabled); } };

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={isSidebarOpen} user={user} sidebarRef={sidebarRef} />
      {sessionState === 'waiting' && <LobbyModal onSelectRole={handleSelectRole} onClose={handleCancelSearch} />}
      <div className="main-content">
        <header className="main-header">
          <div className="header-left">
            <button onClick={() => setIsSidebarOpen(true)} className="menu-button">☰ Menu</button>
            <h1 className="header-title">Welcome to <span>DevTrial</span></h1>
          </div>
        </header>
        <div className="dashboard-body-correct">
          <div className="video-area-fixed">
            <div className="video-container">
              <div className="video-header">
                <h3>Your Camera</h3>
                <div className="video-controls">
                  <span className="control-icon">📷</span><ToggleSwitch isOn={cameraEnabled} onToggle={toggleCamera} />
                  <span className="control-icon">🎤</span><ToggleSwitch isOn={micEnabled} onToggle={toggleMic} />
                </div>
              </div>
              <div className="video-wrapper"><video playsInline muted ref={myVideoRef} autoPlay /></div>
            </div>
            <div className="video-container">
              <div className="video-header"><h3>Peer's Camera</h3></div>
              <div className="video-wrapper"><video playsInline ref={peerVideoRef} autoPlay /></div>
            </div>
          </div>
          <div className={`right-panel-container ${sessionState === 'active' ? 'active-view' : 'idle-view'}`}>
            {sessionState === 'active' ? (
              <>
                <div className="question-panel">
                  <h2>{sessionData?.question?.title}</h2>
                  <p>{sessionData?.question?.description}</p>
                  <div className="question-details">
                    <span><strong>Category:</strong> {sessionData?.question?.category}</span>
                    <span><strong>Difficulty:</strong> {sessionData?.question?.difficulty}</span>
                  </div>
                </div>
                <div className="editor-wrapper">
                  <div className="editor-main-area">
                    <CodeEditor value={code} onChange={handleCodeChange} readOnly={userRole === 'interviewer'} />
                  </div>
                  <OutputTerminal output={output} isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
                </div>
                <div className="editor-footer">
                  <button onClick={() => setIsTerminalOpen(!isTerminalOpen)} className="console-button">
                    Console
                  </button>
                  <button onClick={handleRunCode} className="run-button" disabled={isRunning}>
                    {isRunning ? 'Running…' : '▶ Run Code'}
                  </button>
                </div>
                <div className="timer-panel">
                  <span>Timer: {formatTime(timeLeft)}</span>
                </div>
              </>
            ) : (
              <div className="idle-content-wrapper">
                <h2>Your Interview Dashboard</h2>
                <p>This is where your past sessions and stats will appear.</p>
                <div className="start-session-card">
                  <h3>Ready for a challenge?</h3>
                  <p>{!isReady ? "Initializing connections, please wait..." : "Click below to find a partner."}</p>
                  <button className="start-button" onClick={handleStartSession} disabled={!isReady}>Start a New Session</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;