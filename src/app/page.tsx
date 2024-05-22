"use client";
import { ExpandIcon, ShrinkIcon } from "lucide-react";

import Animations from "@/components/animations";
import PerformanceProblems from "@/components/performance-problems";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import UserDetails from "@/components/user-details";
import FPSSampler from "@/utils/fps-sampler/FPSSampler";
import { faker } from "@faker-js/faker";
import AnimatedCursor from "react-animated-cursor";

import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";

type User = {
  name: string;
  avatar: string;
  initials: string;
};

export default function Home() {
  const [sampler, setSampler] = useState<FPSSampler | null>(null);
  const [user, setUser] = useState<User>();
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
    const initials = name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("");

    const user = {
      initials,
      name: `${faker.person.firstName()} ${faker.person.lastName()}`,
      avatar: faker.image.avatar(),
    };

    setUser(user);

    const fpsSampler = new FPSSampler(user.name);

    fpsSampler.start();

    setSampler(fpsSampler);

    return () => {
      fpsSampler.stop();
    };
  }, []);

  const toggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <AnimatedCursor
        innerSize={8}
        outerSize={8}
        color="193, 11, 111"
        outerAlpha={0.2}
        innerScale={0.7}
        outerScale={5}
      />

      <div className="absolute bottom-5 right-5">
        <Button onClick={toggleFullScreen} variant="ghost">
          {isFullScreen ? (
            <ShrinkIcon className="h-4 w-4" />
          ) : (
            <ExpandIcon className="h-4 w-4" />
          )}
        </Button>
      </div>
      <Card className="w-4/5">
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

            <UserDetails user={user} />

            <Separator />

            <h2 className="text-lg font-semibold">Performance Problems</h2>

            <PerformanceProblems sampler={sampler} />

            <Separator />

            <h2 className="text-lg font-semibold">Animations</h2>

            <Animations />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
