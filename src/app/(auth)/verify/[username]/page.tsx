"use client";
import { useParams } from "next/navigation";
import React from "react";

const VerifyEmail = () => {
  const { username } = useParams();
  return (
    <div>
      Verify Your Email
      <p>{username}</p>
    </div>
  );
};

export default VerifyEmail;
