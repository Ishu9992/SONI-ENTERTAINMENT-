"use client";

import { useEffect, useRef, useState } from "react";

// Custom adaptive player: HLS via hls.js (native HLS on Safari/iOS),
// resolution switching, skip-intro, and speed control.
export default function VideoPlayer({ stream, title }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [levels, setLevels] = useState([]); // available resolutions
  const [currentLevel, setCurrentLevel] = useState(-1); // -1 = Auto
  const [speed, setSpeed] = useState(1);
  const [showSkipIntro, setShowSkipIntro] = useState(false);

  useEffect(() => {
    if (!stream?.hlsUrl || !videoRef.current) return;
    let hls;

    async function setup() {
      const video = videoRef.current;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Native HLS (Safari / iOS) — resolution switching is handled by the OS.
        video.src = stream.hlsUrl;
      } else {
        const HlsMod = (await import("hls.js")).default;
        if (HlsMod.isSupported()) {
          hls = new HlsMod();
          hlsRef.current = hls;
          hls.loadSource(stream.hlsUrl);
          hls.attachMedia(video);
          hls.on(HlsMod.Events.MANIFEST_PARSED, (_, data) => {
            setLevels(data.levels.map((l, i) => ({ index: i, height: l.height })));
          });
        }
      }
    }
    setup();

    return () => hls?.destroy();
  }, [stream?.hlsUrl]);

  function changeLevel(index) {
    setCurrentLevel(index);
    if (hlsRef.current) hlsRef.current.currentLevel = index;
  }

  function changeSpeed(rate) {
    setSpeed(rate);
    if (videoRef.current) videoRef.current.playbackRate = rate;
  }

  function handleTimeUpdate() {
    const t = videoRef.current?.currentTime || 0;
    if (stream?.introStart != null && stream?.introEnd != null) {
      setShowSkipIntro(t >= stream.introStart && t < stream.introEnd);
    }
  }

  function skipIntro() {
    if (videoRef.current && stream?.introEnd != null) {
      videoRef.current.currentTime = stream.introEnd;
    }
  }

  return (
    <div className="relative w-full bg-black">
      <video
        ref={videoRef}
        controls
        autoPlay
        onTimeUpdate={handleTimeUpdate}
        className="w-full aspect-video"
        aria-label={title}
      >
        {stream?.subtitles?.map((s) => (
          <track key={s.lang} kind="subtitles" src={s.url} srcLang={s.lang} label={s.label} />
        ))}
      </video>

      {showSkipIntro && (
        <button
          onClick={skipIntro}
          className="absolute bottom-20 right-6 bg-castle-ink/90 text-castle-bg font-semibold px-4 py-2 rounded hover:bg-white transition-colors"
        >
          Skip Intro ⏭
        </button>
      )}

      <div className="flex flex-wrap items-center gap-4 bg-castle-surface px-4 py-2 text-xs">
        {levels.length > 0 && (
          <label className="flex items-center gap-2">
            Quality
            <select
              value={currentLevel}
              onChange={(e) => changeLevel(parseInt(e.target.value, 10))}
              className="bg-castle-surface2 rounded px-2 py-1"
            >
              <option value={-1}>Auto</option>
              {levels.map((l) => (
                <option key={l.index} value={l.index}>
                  {l.height}p
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="flex items-center gap-2">
          Speed
          <select
            value={speed}
            onChange={(e) => changeSpeed(parseFloat(e.target.value))}
            className="bg-castle-surface2 rounded px-2 py-1"
          >
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((r) => (
              <option key={r} value={r}>
                {r}x
              </option>
            ))}
          </select>
        </label>

        {stream?.audioTracks?.length > 0 && (
          <span className="text-castle-muted">
            Audio: {stream.audioTracks.map((a) => a.label).join(" · ")}
          </span>
        )}
        {stream?.subtitles?.length > 0 && (
          <span className="text-castle-muted">
            Subtitles: {stream.subtitles.map((s) => s.label).join(" · ")}
          </span>
        )}
      </div>
    </div>
  );
}
