"use client";

import React, { useState } from "react";
import { useCompletion } from "ai/react";

const specialChar = "||";

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: "/api/suggest-messages",
    initialCompletion: initialMessageString,
  });

  const fetchSuggestedMessages = async () => {
    try {
      complete("");
    } catch (error) {
      console.error("Error fetching messages:", error);
      // Handle error appropriately
    }
  };

  return (
    <div className="space-y-4 my-8">
      <div className="space-y-2">
        <button
          onClick={fetchSuggestedMessages}
          className="my-4"
          disabled={isSuggestLoading}
        >
          Suggest Messages
        </button>
        <p>Click on any message below to select it.</p>
      </div>
      <div>
        <div>
          <h3 className="text-xl font-semibold">Messages</h3>
        </div>
        <div className="flex flex-col space-y-4">
          {error ? (
            <p className="text-red-500">{error.message}</p>
          ) : (
            parseStringMessages(completion).map((message, index) => (
              <button key={index} className="mb-2">
                {message}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
