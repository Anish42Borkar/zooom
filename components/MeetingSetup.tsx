"use client";
import {
  DeviceSettings,
  VideoPreview,
  useCall,
} from "@stream-io/video-react-sdk";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";

const MeetingSetup = ({
  setIsSettupComplete,
}: {
  setIsSettupComplete: (value: boolean) => void;
}) => {
  const [isMicCamToggledOn, setisMicCamToggledOn] = useState(false);
  const call = useCall();

  // if (!call) {
  //   throw new Error("useCall must be used withIn StreamCall component");
  // }

  useEffect(() => {
    console.log(call, " use");
    if (isMicCamToggledOn) {
      call?.microphone?.disable();
      call?.camera?.disable();
    } else {
      call?.microphone?.enable();
      call?.camera.enable();
    }
  }, [isMicCamToggledOn, call]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-3 text-white">
      <h1 className="text-2xl font-bold">Setup</h1>
      {call && <VideoPreview />}
      <div className="flex h-16 items-center justify-center gap-3">
        <label className="flex items-center justify-center gap-2 font-medium ">
          <input
            type="checkbox"
            name=""
            checked={isMicCamToggledOn}
            id=""
            onChange={(e) => {
              setisMicCamToggledOn(e.target.checked);
            }}
          />
          Join with mic and camera off
        </label>
        <DeviceSettings />
        {call && (
          <Button
            className="rounded-md bg-green-500 px-4 py-2.5"
            onClick={(e) => {
              call?.join();
              setIsSettupComplete(true);
            }}
          >
            Join Meeting
          </Button>
        )}
      </div>
    </div>
  );
};

export default MeetingSetup;
