"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import FPSSampler from "@/utils/fps-sampler/FPSSampler";
import { faker } from "@faker-js/faker";
import { motion } from "framer-motion";

import { useEffect, useState } from "react";

function fibonacci(n: number): number {
  if (n <= 1) {
    return 1;
  }

  return fibonacci(n - 1) + fibonacci(n - 2);
}

export default function Home() {
  const [user] = useState(() => {
    const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
    const initials = name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("");

    return {
      initials,
      name: `${faker.person.firstName()} ${faker.person.lastName()}`,
      avatar: faker.image.avatar(),
    };
  });

  const [n, setN] = useState([30]);

  useEffect(() => {
    const fpsSampler = new FPSSampler();

    fpsSampler.start();
    return () => {
      fpsSampler.stop();
    };
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Demo</CardTitle>
          <CardDescription>
            This is to a small app to test the setup and do some basic actions
            to affect the performance of the app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <h2 className="text-lg font-semibold">User details</h2>

            <div className="flex flex-col space-y-1.5">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.initials}</AvatarFallback>
                </Avatar>

                <div>
                  <p className="text-sm font-medium leading-none">
                    {user.name}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <h2 className="text-lg font-semibold">Performance Problems</h2>

            <div className="flex flex-col space-y-5">
              <Label htmlFor="name">Fibonacci of {n[0]}</Label>
              <Slider
                min={20}
                max={40}
                step={1}
                value={n}
                onValueChange={setN}
              />

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

            <Separator />

            <h2 className="text-lg font-semibold">Animations</h2>

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

            <Label>CSS</Label>
            <div className="mx-auto w-20 h-20 bg-primary m-5 rounded-md animate-spin" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
