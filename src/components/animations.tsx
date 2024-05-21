"use client";

import AudioContainer from "@/components/audio-container";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import Confetti from "./confetti";
import VideoContainer from "./video-container";

const Animations: React.FC = () => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="text-center">
        <Label>requestAnimationFrame</Label>
        <motion.div
          className="mx-auto w-20 h-20 bg-primary m-5 rounded-md"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
        />
      </div>

      <div className="text-center">
        <Label>CSS</Label>
        <div className="mx-auto w-20 h-20 bg-primary m-5 rounded-md animate-spin" />
      </div>

      <div className="text-center">
        <Label>Live Video</Label>
        <div className="mx-auto w-20 h-20 m-5 rounded-md bg-primary relative">
          <VideoContainer />
          <AudioContainer />
        </div>
      </div>

      <div className="text-center">
        <Label>Confetti</Label>
        <Confetti />
      </div>
    </div>
  );
};

export default Animations;
