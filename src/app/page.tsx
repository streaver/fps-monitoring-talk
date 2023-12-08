"use client";

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

import { useEffect, useState } from "react";

type User = {
  name: string;
  avatar: string;
  initials: string;
};

export default function Home() {
  const [user, setUser] = useState<User>();

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
    return () => {
      fpsSampler.stop();
    };
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center justify-center h-screen">
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

            <PerformanceProblems />

            <Separator />

            <h2 className="text-lg font-semibold">Animations</h2>

            <Animations />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
