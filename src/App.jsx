import { useState, useEffect, useRef } from 'react';
import CircularProgressBar from './CircularProgressBar.jsx';
import Settings from './assets/img/Settings.png'
import './App.css';

export default function Counter() {
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef(null);
  const [isModal, setIsModal] = useState(null);
  const [mode, setMode] = useState('pomodoro');
  const [pomodoroCount, setPomodoroCount] = useState(0);

  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [shortBreakTime, setShortBreakTime] = useState(5 * 60);
  const [longBreakTime, setLongBreakTime] = useState(15 * 60);

  const [pomodoroInput, setPomodoroInput] = useState('');
  const [shortBreakInput, setShortBreakInput] = useState('');
  const [longBreakInput, setLongBreakInput] = useState('');
  
  const [font, setFont] = useState('font1');
  const [buttonLabel, setButtonLabel] = useState('Start');
  const [themeColor, setThemeColor] = useState('#F87070');


  const timeSettings = {
    pomodoro: pomodoroInput * 60,
    shortBreak: shortBreakInput * 60,
    longBreak: longBreakInput * 60
  };
  
  const totalTime = timeSettings[mode] || 0;
  const percentage = (count / totalTime) * 100;

  useEffect(() => {
    if (isActive && count > 0) {
      intervalRef.current = setInterval(() => {
        setCount(c => (c > 0 ? c - 1 : 0));
      }, 1000);
    } else if (!isActive) {
      clearInterval(intervalRef.current);
    }

    if (count === 0 && isActive) {
      handleModeSwitch();
    }

    return () => clearInterval(intervalRef.current);
  }, [count, isActive]);

  const handleModeSwitch = () => {
    if (mode === 'pomodoro') {
      setPomodoroCount(prev => prev + 1);
      if (pomodoroCount % 4 === 0) {
        setMode('shortBreak');
        setCount(shortBreakTime);
      } else {
        setMode('longBreak');
        setCount(longBreakTime);
      }
    } else {
      setMode('pomodoro');
      setCount(pomodoroTime);
    }
    setIsActive(false);
    setButtonLabel('Start');
  };

  const handleSetTime = () => {
    const pomodoroMinutes = parseInt(pomodoroInput);
    const shortBreakMinutes = parseInt(shortBreakInput);
    const longBreakMinutes = parseInt(longBreakInput);

    if (count > 0) {
      setIsActive(true);
      setButtonLabel('Restart');
    }
    setIsModal(false);

    if (!isNaN(pomodoroMinutes) && pomodoroMinutes > 0) {
      setPomodoroTime(pomodoroMinutes * 60);
      if (mode === 'pomodoro') setCount(pomodoroMinutes * 60);
    }
    if (!isNaN(shortBreakMinutes) && shortBreakMinutes > 0) {
      setShortBreakTime(shortBreakMinutes * 60);
      if (mode === 'shortBreak') setCount(shortBreakMinutes * 60);
    }
    if (!isNaN(longBreakMinutes) && longBreakMinutes > 0) {
      setLongBreakTime(longBreakMinutes * 60);
      if (mode === 'longBreak') setCount(longBreakMinutes * 60);
    }
  };

  const handleTabSwitch = (newMode) => {
    setMode(newMode);
    if (newMode === 'pomodoro') {
      setCount(pomodoroTime);
    } else if (newMode === 'shortBreak') {
      setCount(shortBreakTime);
    } else if (newMode === 'longBreak') {
      setCount(longBreakTime);
    }
    setIsActive(false);
    setButtonLabel('Start');
  };

  const handleToggle = () => {
    if (isActive) {
      setIsActive(false);
      setButtonLabel('Start');
    } else {
      if (count === 0) {
        setCount(totalTime);
      }
      setIsActive(true);
      setButtonLabel('Restart');
    }
  };

  function openModal() {
    setIsModal(true);
  }

  function closeModal() {
    setIsModal(false);     
  }

  return (
    <div className={`container ${font}`} >
      <h1>pomodoro</h1>
      <div className={`tabs ${font}`}>
        <button 
          onClick={() => handleTabSwitch('pomodoro')} 
          className={mode === 'pomodoro' ? 'active' : ''} 
          style={{
            backgroundColor: mode === 'pomodoro' ? themeColor : 'transparent',
            color: mode === 'pomodoro' ? '#fff' : '#D7E0FF',
            border: mode === 'pomodoro' ? '#fff' : '#D7E0FF'
          }}
        >
          Pomodoro
        </button>
        
        <button 
          onClick={() => handleTabSwitch('shortBreak')} 
          className={mode === 'shortBreak' ? 'active' : ''} 
          style={{
            backgroundColor: mode === 'shortBreak' ? themeColor : 'transparent',
            color: mode === 'shortBreak' ? '#fff' : '#D7E0FF',
            border: mode === 'shortBreak' ? '#fff' : '#D7E0FF'
          }}
        >
          Short Break
        </button>
        
        <button 
          onClick={() => handleTabSwitch('longBreak')} 
          className={mode === 'longBreak' ? 'active' : ''} 
          style={{
            backgroundColor: mode === 'longBreak' ? themeColor : 'transparent',
            color: mode === 'longBreak' ? '#fff' : '#D7E0FF',
            border: mode === 'shortBreak' ? '#fff' : '#D7E0FF'
          }}
        >
          Long Break
        </button>
      </div>

      <CircularProgressBar
        percentage={percentage}
        time={count}
        isActive={isActive}
        onToggle={handleToggle}
        strokeColor={themeColor}
      />

      <button onClick={openModal} style={{background: 'unset', border: 'unset'}}><img src={Settings} /></button>
      {isModal && (
        <div className={`ModalOverlay ${font}`} onClick={closeModal}>
          <div className="ModalContent" onClick={(e) => e.stopPropagation()}>
            <h1>SETTINGS</h1>
            <hr />
            <h2>TIME (MINUTES)</h2> 
            <div className="SetTimeItems">
              <div className="SetTimeItem">
                <h5>Pomodoro</h5>
                <input
                  type="number"
                  placeholder="Süreyi girin (dk)"
                  value={pomodoroInput}
                  onChange={(e) => setPomodoroInput(e.target.value)}
                />
              </div>
              <div className="SetTimeItem">
                <h5>Short Break</h5>
                <input
                  type="number"
                  placeholder="Süreyi girin (dk)"
                  value={shortBreakInput}
                  onChange={(e) => setShortBreakInput(e.target.value)}
                />
              </div>
              <div className="SetTimeItem">
                <h5>Long Break</h5>
                <input
                  type="number"
                  placeholder="Süreyi girin (dk)"
                  value={longBreakInput}
                  onChange={(e) => setLongBreakInput(e.target.value)}
                />
              </div>
            </div>

            <hr />

            <Fonts font={font} setFont={setFont} />

            <hr />

            <Colors themeColor={themeColor} setThemeColor={setThemeColor} />

            <button onClick={handleSetTime} className='ApplyBtn'>Apply</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Fonts({ font, setFont }) {
  return (
    <div className="Fonts">
      <h2>FONT</h2>
      <div className="Btns">
        <button onClick={() => setFont('font1')} className={font === 'font1' ? 'active' : ''}>Aa</button>
        <button onClick={() => setFont('font2')} className={font === 'font2' ? 'active' : ''}>Aa</button>
        <button onClick={() => setFont('font3')} className={font === 'font3' ? 'active' : ''}>Aa</button>
      </div>
    </div>
  );
}

function Colors({themeColor, setThemeColor}) {
  return(
    <div className="Colors">
      <h2>COLOR</h2>
      <div className="Btns">
        <button
          onClick={() => setThemeColor('#F87070')}
          style={{ backgroundColor: '#F87070', color: '#F87070', border: `2px solid ${themeColor === '#F87070' ? '#F87070' : 'transparent'}` }}
        ></button>
        <button
          onClick={() => setThemeColor('#70F3F8')}
          style={{ backgroundColor: '#70F3F8', color: '#70F3F8', border: `2px solid ${themeColor === '#70F3F8' ? '#70F3F8' : 'transparent'}` }}
        ></button>
        <button
          onClick={() => setThemeColor('#D881F8')}
          style={{ backgroundColor: '#D881F8', color: '#D881F8', border: `2px solid ${themeColor === '#D881F8' ? '#D881F8' : 'transparent'}` }}
        ></button>
      </div>
    </div>
  )
}