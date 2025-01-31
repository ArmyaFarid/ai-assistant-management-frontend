import { useState } from "react";
import {CloudLightning, CloudOff, MessageSquare, PhoneCall} from "lucide-react";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

function SessionStopped({ startSession } : any) {
  const [isActivating, setIsActivating] = useState(false);

  function handleStartSession() {
    if (isActivating) return;

    setIsActivating(true);
    try {
        startSession()
            .then((peerConnection : any) => {
                console.log("Session started successfully", peerConnection);
                // You can now interact with the peerConnection object
            })
            .catch((error: any) => {
                console.error("Error starting session:", error.message);
                setIsActivating(false);
                // Handle the error gracefully (e.g., show an error message to the user)
            });

    }catch (e) {
        setIsActivating(false);
    }

  }

  return (
    <div className="flex items-center justify-center w-full h-full">
      <Button onClick={handleStartSession}
              // className={isActivating ? "bg-gray-600" : ""}
              className={
                  cn("text-white px-6 py-2 rounded-lg flex items-center gap-4 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none" ,
                      isActivating && "bg-gray-600"
                      )
              }
      >
          {
              isActivating &&
              <PhoneCall
                  height={16}
                  className="transition-all duration-300 animate-pulse"
              />
          }

          <div>{isActivating ? "Initialisation..." : "Appeler"}</div>
      </Button>
    </div>
  );
}

function SessionActive({ stopSession } : any) {
  return (
    <div className="">
      <Button onClick={stopSession}
              className={
                  cn("bg-red-600 text-white px-6 py-2 rounded-lg flex items-center gap-4 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-red-500 active:scale-95 focus:outline-none")
              }
      >
          <PhoneCall
              height={16}
              className="transition-all duration-700 animate-pulse"
          />
          <div>Déconnecter</div>
      </Button>
    </div>
  );
}

export default function SessionControls({
  startSession,
  stopSession,
  isSessionActive,
} : any) {
  return (
    <div className="flex gap-4 h-full">
      {isSessionActive ? (
        <SessionActive
          stopSession={stopSession}
        />
      ) : (
        <SessionStopped startSession={startSession} />
      )}
    </div>
  );
}
