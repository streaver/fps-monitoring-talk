"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";

const AudioContainer: React.FC = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const volume = useMotionValue(0);

  const scale = useTransform(volume, [0, 10], [1, 2]); // Map volume from 0-10 to scale 1-2

  const setupAudioContext = useCallback(async () => {
    if (navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        const average =
          dataArray.reduce((sum, value) => sum + value) / dataArray.length;

        // Normalize and amplify the volume value using logarithmic scale
        const normalizedVolume = (Math.log1p(average) / Math.log1p(256)) * 10;

        volume.set(normalizedVolume);

        requestAnimationFrame(updateVolume);
      };

      updateVolume();
    }
  }, [volume]);

  useEffect(() => {
    setupAudioContext();
  }, [setupAudioContext]);

  return (
    <motion.div
      className="w-3 h-3 bg-red-500 rounded-full absolute bottom-2 right-2 z-10"
      style={{ scale }}
    />
  );
};

export default AudioContainer;
