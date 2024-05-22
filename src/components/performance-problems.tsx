"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import FPSSampler from "@/lib/fps-sampler/FPSSampler";
import { fibonacci } from "@/lib/utils";

import { useEffect, useState } from "react";

import React from "react";
import { toast } from "sonner";

const PerformanceProblems: React.FC<{ sampler: FPSSampler | null }> = ({
  sampler,
}) => {
  const [number, setNumber] = useState([30]);
  const [worker, setWorker] = useState<Worker | null>(null);

  const startRef = React.useRef<number | null>(null);

  useEffect(() => {
    const newWorker = new Worker(new URL("@/lib/worker.ts", import.meta.url));

    newWorker.onmessage = (e: MessageEvent) => {
      const end = performance.now();

      toast(
        <div className="flex flex-col space-y-1">
          <span className="font-bold">Result without worker</span>
          <span>Result: {e.data}</span>
          <span>Time: {(end - startRef.current!).toFixed(2)}ms</span>
          <span>Lost frames: 0</span>
        </div>
      );
    };

    setWorker(newWorker);

    return () => {
      newWorker.terminate();
    };
  }, []);

  const handleNonWorkerClick = () => {
    sampler?.sendEvent("fibonacci-without-worker", number[0]);

    const start = performance.now();
    const result = fibonacci(number[0]);
    const end = performance.now();

    toast(
      <div className="flex flex-col space-y-1">
        <span className="font-bold">Result without worker</span>
        <span>Result: {result}</span>
        <span>Time: {(end - start).toFixed(2)}ms</span>
        <span>Lost frames: {parseInt(((end - start) / 16).toString())}</span>
      </div>
    );
  };

  const handleWorkerClick = () => {
    if (worker) {
      sampler?.sendEvent("fibonacci-with-worker", number[0]);

      startRef.current = performance.now();
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

      <div className="flex space-x-5">
        <Button onClick={handleNonWorkerClick}>Compute without worker</Button>
        <Button onClick={handleWorkerClick}>Compute with worker</Button>
      </div>
    </div>
  );
};

export default PerformanceProblems;
