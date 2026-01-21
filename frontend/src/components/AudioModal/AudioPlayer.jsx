import { PauseRounded, PlayArrowRounded } from "@material-ui/icons";
import { useEffect, useRef, useState } from "react";

export function AudioPlayerCustom({ audioUrl, message }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState("0:00");
  const [currentTime, setCurrentTime] = useState("0:00");
  const audioRef = useRef(null);
  const [speed, setSpeed] = useState(1); // Estado para a velocidade de reprodução

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }

    setSpeed(localStorage.getItem("audioSpeed") || 1);
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    setCurrentTime(handleSetTime(audio.currentTime));
    setProgress((audio.currentTime / audio.duration) * 100);
  };

  useEffect(() => {
		const audio = audioRef.current;
    setDuration(handleSetTime(audio.duration ?? 0));
    const newSpeed = localStorage.getItem("audioSpeed");
    if (newSpeed) {
      setSpeed(newSpeed);
    }
  }, []);
	
  useEffect(() => {
		const audio = audioRef.current;
    setDuration(handleSetTime(audio.duration ?? 0));
   }, [audioRef.current]);

  function handleSetTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  const handleProgressChange = (e) => {
    const audio = audioRef.current;
    const newTime = (e.target.value * audio.duration) / 100;
    audio.currentTime = newTime;
    setProgress(e.target.value);
  };

  const handleSpeedChange = (e) => {
    const speeds = ["0.5", "1", "1.5", "2", "2.5"];
    const index = speeds.indexOf(speed.toString());
    const newIndex = (index + 1) % speeds.length;
    const newSpeed = speeds[newIndex];

    setSpeed(Number(newSpeed));
    localStorage.setItem("audioSpeed", newSpeed);
  };

  useEffect(() => {
    audioRef.current.playbackRate = speed; // Define a velocidade de reprodução
  }, [speed]);

  function handleEndPlay() {
    setIsPlaying(false);
    setCurrentTime("0:00");
    setProgress(0);
  }

  return (
    <>
      <div
        className={`flex  ${
          message.fromMe ? "pr-3" : "flex-row-reverse"
        } `}
      >
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEndPlay}
        />
        <div
          className={`rounded-full w-12 h-12 ${
            message.fromMe ? "" : "ml-2"
          } bg-zinc-300 flex items-center justify-center `}
        >
          {isPlaying ? (
            <button
              type="button"
              onClick={handleSpeedChange}
              className="bg-zinc-600 font-medium text-white rounded-full aspect-video h-5 flex items-center justify-center"
            >
              {speed}x
            </button>
          ) : message.fromMe ? (
            <img src="/icon.png" alt="" className="rounded-full" />
          ) : (
            <img
              src={message.contact.profilePicUrl}
              alt=""
              className="rounded-full"
            />
          )}
        </div>
        <div className="flex justify-center flex-col relative flex-1">
          <div className="flex items-center w-full">
            <button onClick={togglePlayPause} className="min-w-9">
              {isPlaying ? (
                <PauseRounded className="text-3xl" />
              ) : (
                <PlayArrowRounded className="text-4xl" />
              )}
            </button>

            <div className="relative ml-1 w-full">
              <input
                type="range"
                min="0"
                max="100"
                className="opacity-0 z-10 top-0 right-0 cursor-pointer relative w-full"
                value={progress}
                onChange={handleProgressChange}
              />
              <div className="absolute w-full h-7  left-0 flex items-center  top-1/2 -translate-y-1/2 rounded-full">
      
                    <div className="h-1 w-full bg-zinc-300 rounded-full"></div>
                    <div
                      className="absolute h-1 rounded-sm top-1/2 -translate-y-1/2 bg-zinc-500 data-[opened=true]:bg-[#30B0E8]"
                      data-opened={message.ack == 5}
                      style={{
                        width: `${progress}%`,
                        transition: "width 0.2s ease-in", // Transição suave
                      }}
                    ></div>
                <div
                  className="absolute h-3 w-3 bg-zinc-500 dark:bg-zinc-300 data-[opened=true]:bg-[#30B0E8] rounded-full top-1/2 "
                  data-opened={message.ack == 5}
                  style={{
                    left: `${progress}%`,
                    transition: "left 0.2s ease-in", // Transição suave

                    transform: `translateY(-50%)`,
                  }}
                ></div>
              </div>
            </div>
          </div>
          <div className="text-[11px]  text-zinc-500 dark:text-zinc-300 absolute left-2 -bottom-2">
            {currentTime} / {duration}
          </div>
        </div>
      </div>
    </>
  );
}
