"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { fibonacci } from "@/lib/utils";

import { useState } from "react";

import React from "react";

const PerformanceProblems: React.FC = () => {
  const [n, setN] = useState([30]);
  return (
    <div className="flex flex-col space-y-5">
      <Label htmlFor="name">Fibonacci of {n[0]}</Label>
      <Slider min={20} max={40} step={1} value={n} onValueChange={setN} />

      <div className="flex justify-between">
        <Button
          onClick={() => {
            const result = fibonacci(n[0]);
          }}
        >
          Compute
        </Button>
      </div>
    </div>
  );
};

export default PerformanceProblems;
