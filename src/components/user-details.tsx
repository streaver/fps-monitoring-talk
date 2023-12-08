"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import React from "react";

type UserDetailsProps = {
  user: {
    name: string;
    avatar: string;
    initials: string;
  };
};

const UserDetails: React.FC<UserDetailsProps> = ({
  user,
}: UserDetailsProps) => {
  return (
    <div className="flex flex-col space-y-1.5">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={user.avatar} suppressHydrationWarning />
          <AvatarFallback suppressHydrationWarning>
            {user.initials}
          </AvatarFallback>
        </Avatar>

        <div>
          <p
            className="text-sm font-medium leading-none"
            suppressHydrationWarning
          >
            {user.name}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
