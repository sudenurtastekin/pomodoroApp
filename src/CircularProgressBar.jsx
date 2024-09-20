function CircularProgressBar({ percentage, time, isActive, onToggle, strokeColor }) {
  const radius = 150; 
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="progress-container">
      <svg className="progress-ring" width="380" height="360">
        <circle
          className="progress-background"
          stroke="#161932"
          fill="transparent"
          r={radius}
          cx="164"
          cy="176"
        />
        <circle
          className="progress-ring__circle"
          stroke={strokeColor}
          strokeLinecap="round"
          strokeWidth="15"
          fill="transparent"
          r={radius}
          cx="160"
          cy="180"
          style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
        />
      </svg>
      <div className="progress-content">
        <h1>{Math.floor(time / 60)}:{('0' + (time % 60)).slice(-2)}</h1>
        <button className="progress-button" onClick={onToggle}>
          {isActive ? 'PAUSE' : 'START'}
        </button>
      </div>
    </div>
  );
}

export default CircularProgressBar;