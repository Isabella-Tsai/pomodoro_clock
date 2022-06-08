
const App = () =>{

    const [breakLength, setBreakLength] = React.useState(5);
    const [sessionLength, setSessionLength] = React.useState(25);
    // the default time counter is 25 minutes (25*60seconds)
    const [timeLeft, setTimeLeft] = React.useState(25*60);
    // Set the title Session or Break
    const [timingType, setTimingtype] = React.useState("SESSION");
    // For enable/disable button, when the timer is on, user can not change the length of break/session
    const [inactive, setInactive] = React.useState(false);
    // Set the title of the 25 + 5 clock
    const title = timingType === "SESSION" ? "Session" : "Break";
    // Change the status of the button
    const startButton = inactive === false? "Start" : "Pause";

    const handleSessionIncrease = () => {
        if(sessionLength < 60) {
            setSessionLength(sessionLength + 1)
            setTimeLeft(timeLeft + 60)
        }
    }

    const handleSessionDecrease = () =>{
        if(sessionLength > 1) {
            setSessionLength(sessionLength - 1)
            setTimeLeft(timeLeft - 60)
        }
    }

    const timeFormatter = () => {
        const minutes = ("0" + (Math.floor(timeLeft / 60))).slice(-2)
        const seconds = ("0" + timeLeft%60).slice(-2)
        return `${minutes}:${seconds}`;
    }

    const interval = setInterval(() =>{
        if(timeLeft && inactive){
            setTimeLeft(timeLeft - 1)
        }
    },1000)

    const handlePlay = () => {
        clearInterval(interval);
        setInactive(!inactive);
    }

    // changing from session time to break time
    const resetTimer = () => {
        const audio = document.getElementById("beep");
        if(!timeLeft && timingType === "SESSION"){
          setTimeLeft(breakLength * 60)
          setTimingtype("BREAK")
          audio.play()
        }
        if(!timeLeft && timingType === "BREAK"){
          setTimeLeft(sessionLength * 60)
          setTimingtype("SESSION")
          audio.play()
        }
      }

    // Reset all the value including the audio as required in user stories
    const handleReset = () => {
        clearInterval(interval);
        setInactive(false);
        setTimeLeft(25*60);
        setBreakLength(5);
        setSessionLength(25);
        setTimingtype("SESSION");
        const audio = document.getElementById("beep");
        audio.pause()
        audio.currentTime = 0;
    }

    const countDown = () => {
        if(inactive){
          interval
          resetTimer()
        }else {
          clearInterval(interval)
        }
      }

      React.useEffect(() => {
        countDown()
        // returning cleanup function is to avoid memory leaks when component get unmounted
        return () => clearInterval(interval)
      }, [inactive, timeLeft, interval])

    return(
        <div>
            <div className='container text-center'>
                <h1 className ='text-center'> 25 + 5 Clock</h1>
                <div className='row'>
                    <div className='col-6 p-3 text-center'>
                       <h2 id="break-label">Break Length</h2>
                       <button
                            disabled={inactive}
                            onClick={() =>{if (breakLength > 1){setBreakLength(breakLength - 1)}}}
                            className='m-3' id="break-decrement">
                                &darr;
                        </button>
                       <strong className='textSize' id="break-length">{breakLength}</strong>
                       <button
                            disabled={inactive}
                            onClick={()=>{if(breakLength < 60){setBreakLength(breakLength + 1)}}}
                            className='m-3' id="break-increment">
                                &uarr;
                        </button>
                    </div>
                    <div className='col-6 p-3 text-center'>
                        <h2 id="session-label">Session Length</h2>
                        <button
                            disabled={inactive}
                            onClick={handleSessionDecrease} className='m-3' id="session-decrement">
                                &darr;
                        </button>
                        <strong className='textSize' id="session-length">{sessionLength}</strong>
                        <button
                            disabled={inactive}
                            onClick={handleSessionIncrease}
                            className='m-3' id="session-increment">
                                &uarr;
                        </button>
                    </div>
                </div>
                <div className="countDown text-center">
                    <h2 id="timer-label">{title}</h2>
                    <h2 id="time-left">{timeFormatter()}</h2>
                </div>
                <button onClick={handlePlay} className='m-3' id="start_stop">{startButton}</button>
                <button onClick={handleReset} id="reset">Reset</button>
            </div>
            <audio id="beep" preload='auto' src='./system-break.wav'></audio>
        </div>
    )
}

ReactDOM.render(<App/>, document.getElementById('app'))