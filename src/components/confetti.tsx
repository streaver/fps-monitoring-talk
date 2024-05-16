import React from "react";
import ReactConfetti from "react-confetti";
import useMeasure from "react-use/lib/useMeasure";

const Confetti: React.FC = () => {
  const [ref, { x, y, width, height, top, right, bottom, left }] =
    useMeasure<HTMLDivElement>();

  return (
    <div ref={ref} className="mx-auto w-40 h-40 m-5 rounded-md relative">
      <ReactConfetti
        width={width}
        height={height}
        numberOfPieces={100}
        gravity={0.1}
      />
    </div>
  );
};

export default Confetti;
