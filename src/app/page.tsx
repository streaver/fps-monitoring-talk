"use client";

import FPSSampler from "@/utils/fps-sampler/FPSSampler";
import { useEffect } from "react";

function fibonacci(n: number): number {
  if (n <= 1) {
    return 1;
  }

  return fibonacci(n - 1) + fibonacci(n - 2);
}

export default function Home() {
  useEffect(() => {
    const sampler = new FPSSampler();

    console.log(sampler);

    sampler.start();

    return () => {
      sampler.stop();
    };
  }, []);

  return (
    <div>
      {/* add button to calculate fibonacci sequence to n */}

      <button
        onClick={() => {
          const n = 40;
          console.log(`Calculating Fibonacci sequence to ${n}...`);
          const result = fibonacci(n);
          console.log(`Result: ${result}`);
        }}
      >
        Calculate Fibonacci Sequence
      </button>
    </div>
  );
}
