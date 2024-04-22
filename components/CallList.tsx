"use client";
import { useGetCalls } from "@/hooks/useGetCalls";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import MeetingCard from "./MeetingCard";
import Loader from "./Loader";
import { useToast } from "./ui/use-toast";

const CallList = ({ type }: { type: "ended" | "upcoming" | "recordings" }) => {
  const { callRecordings, endedCalls, isLoading, upcomingCalls } =
    useGetCalls();
  const router = useRouter();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);

  const { toast } = useToast();

  const getCalls = () => {
    switch (type) {
      case "ended":
        return endedCalls;
      case "upcoming":
        return upcomingCalls;
      case "recordings":
        return recordings;
      default:
        return [];
    }
  };

  const getNoCallsMessage = () => {
    switch (type) {
      case "ended":
        return "No Previus Calls";
      case "upcoming":
        return "No Upcomings Calls";
      case "recordings":
        return "No Recordings";
      default:
        return "";
    }
  };

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();

  useEffect(() => {
    const fetchRecordings = async function name() {
      try {
        const callData = await Promise.all(
          callRecordings.map((meeting) => meeting.queryRecordings())
        );

        const recordings = callData
          .filter((call) => call.recordings.length > 0)
          .flatMap((call) => call.recordings);

        setRecordings(recordings);
      } catch (error) {
        toast({ title: "Try Again Later" });
      }
    };
    if (type === "recordings") fetchRecordings();
  }, [type, callRecordings]);

  if (!calls?.length) return <Loader />;

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => {
          const meetingCall = meeting as Call;
          const callRecording = meeting as CallRecording;

          return (
            <MeetingCard
              key={meetingCall.id}
              icon={
                type === "ended"
                  ? "/icons/previous.svg"
                  : type === "upcoming"
                  ? "/icons/upcoming.svg"
                  : "/icons/recordings.svg"
              }
              title={
                meetingCall.state?.custom?.description.substring(0, 26) ||
                callRecording.filename.substring(0, 20) ||
                "No description"
              }
              date={
                meetingCall?.state?.startsAt?.toLocaleString() ||
                callRecording?.start_time?.toString()
              }
              isPreviousMeeting={type === "ended"}
              buttonIcon1={
                type === "recordings" ? "/icons/play.svg" : undefined
              }
              handleClick={
                type === "recordings"
                  ? () => router.push(`${callRecording.url}`)
                  : () => router.push(`meeting/${meetingCall.id}`)
              }
              link={
                type === "recordings"
                  ? callRecording.url
                  : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingCall.id}`
              }
              buttonText={type === "recordings" ? "Play" : "Start"}
            />
          );
        })
      ) : (
        <h1>{noCallsMessage}</h1>
      )}
    </div>
  );
};

export default CallList;
