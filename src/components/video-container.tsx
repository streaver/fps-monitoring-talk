"use client";

import React, { useEffect, useRef } from "react";

const VideoContainer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Request access to the camera
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Error accessing the camera: ", err);
        });
    }
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      className="mx-auto w-40 h-40 bg-primary m-5 rounded-md object-cover"
    />
  );
};

export default VideoContainer;
