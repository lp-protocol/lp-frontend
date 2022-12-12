import React, { useState, useRef } from 'react';

export function useAudioHook(path: string, loop: boolean) {
  const [playing, updatePlaying] = useState(false);
  const audio = useRef(new Audio(path));
  audio.current.loop = loop;
  audio.current.addEventListener('play', () => {
    updatePlaying(true);
  });

  audio.current.addEventListener('pause', () => {
    updatePlaying(false);
  });

  return {
    playing,
    play: audio.current.play.bind(audio.current),
    pause: audio.current.pause.bind(audio.current),
  };
}
