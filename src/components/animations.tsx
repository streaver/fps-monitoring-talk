"use client";

import AudioContainer from "@/components/audio-container";
import { Label } from "@/components/ui/label";
import VideoContainer from "@/components/video-container";
import { motion } from "framer-motion";
import Confetti from "./confetti";

const Animations: React.FC = () => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="text-center">
        <Label>requestAnimationFrame</Label>
        <motion.div
          className="mx-auto w-40 h-40 bg-primary m-5 rounded-md"
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
        <div className="mx-auto w-40 h-40 bg-primary m-5 rounded-md animate-spin" />
      </div>

      <div className="text-center">
        <Label>Live Video</Label>
        <VideoContainer />
        <AudioContainer />
      </div>

      <div className="text-center">
        <Label>Confetti</Label>
        <Confetti />
      </div>
    </div>
  );
};

export default Animations;
