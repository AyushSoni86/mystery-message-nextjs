"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiResponse";
import { useCompletion } from "@ai-sdk/react";
import * as z from "zod";
import { messageSchema } from "@/schemas/messageSchema";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split("||");
};

const fallbackMessages = [
  "What's your favorite movie?",
  "Do you have any pets?",
  "What's your dream job?",
];

const SendMessage = () => {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();

  const initialMessageString =
    "What's your favorite movie?||Do you have any pets?||What's your dream job?";

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: "/api/suggest-messages",
    initialCompletion: initialMessageString,
  });

  const safeMessages =
    completion && parseStringMessages(completion).length > 0
      ? parseStringMessages(completion)
      : fallbackMessages;

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    try {
      setIsLoading(true);
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      });
      if (response.data.success) {
        toast.success("Message sent successfully");
        form.reset({ ...form.getValues(), content: "" });
      } else {
        toast.error("Failed to send message.");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message || "Error in accepting messages";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch("content");

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const fetchSuggestedMessages = async () => {
    try {
      await complete("");
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isLoading || !messageContent}
              className="cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Send It"
              )}
            </Button>
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={fetchSuggestedMessages}
            className="my-4 cursor-pointer"
            disabled={isSuggestLoading}
          >
            {isSuggestLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Generating...
              </>
            ) : (
              "Suggest Messages"
            )}
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {error ? (
              <p className="text-red-500">{error.message}</p>
            ) : completion ? (
              safeMessages.map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2 cursor-pointer"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            ) : (
              <p className="text-muted-foreground">
                No suggested messages available yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      {!session && status !== "loading" && (
        <>
          <Separator className="my-6" />
          <div className="text-center">
            <p className="mb-4 text-muted-foreground">
              Want your own message board?
            </p>
            <Link href="/sign-up">
              <Button className="cursor-pointer">Create Your Account</Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default SendMessage;
