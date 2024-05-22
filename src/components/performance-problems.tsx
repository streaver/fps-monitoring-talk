"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import FPSSampler from "@/lib/fps-sampler/FPSSampler";
import { fibonacci } from "@/lib/utils";

import { useEffect, useState } from "react";

import React from "react";

const PerformanceProblems: React.FC<{ sampler: FPSSampler | null }> = ({
  sampler,
}) => {
  const [number, setNumber] = useState([30]);
  const [result, setResult] = useState<number | null>(null);
  const [worker, setWorker] = useState<Worker | null>(null);

  useEffect(() => {
    const newWorker = new Worker(new URL("@/lib/worker.ts", import.meta.url));

    newWorker.onmessage = (e: MessageEvent) => {
      setResult(e.data);
    };

    setWorker(newWorker);

    return () => {
      newWorker.terminate();
    };
  }, []);

  const handleNonWorkerClick = () => {
    sampler?.sendEvent("fibonacci-without-worker", number[0]);

    const result = fibonacci(number[0]);

    setResult(result);
  };

  const handleWorkerClick = () => {
    if (worker) {
      sampler?.sendEvent("fibonacci-with-worker", number[0]);
      worker.postMessage(number);
    }
  };

  return (
    <div className="flex flex-col space-y-5">
      <Label htmlFor="name">Fibonacci of {number[0]}</Label>
      <Slider
        min={20}
        max={40}
        step={1}
        value={number}
        onValueChange={setNumber}
      />

      <div className="flex justify-between">
        <Button onClick={handleNonWorkerClick}>Compute without worker</Button>
        <Button onClick={handleWorkerClick}>Compute with worker</Button>

        {/* Show result */}
        <div>{result !== null && <p>Result: {result}</p>}</div>
      </div>
    </div>
  );
};

export default PerformanceProblems;
