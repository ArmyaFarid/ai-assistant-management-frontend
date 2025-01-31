'use client'
import {useEffect, useRef, useState} from "react";
import SessionControls from "./SessionControls";
import {CustomApiClient} from "@/lib/services/api/CustomApiClientProvider";
import {API_BASE_URL} from "@/config/environments";

type Props = { assistantSid : string; startMessage : string}
export default function DemoVoiceAssistant( {assistantSid , startMessage} : Props ) {
    const customClient = new CustomApiClient(API_BASE_URL);
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [events, setEvents] = useState([]);
    const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const audioElement = useRef<HTMLAudioElement | null>(null);

    async function startSession() {
        // Get an ephemeral key from the Fastify server
        // const tokenResponse = await fetch("http://localhost:8181/api/demo/call/token");
        // let tokenResponse = null;
        return new Promise<any>(async (resolve, reject) => {
            try {
                const tokenResponse = await customClient.fetch("/demo/call/token", "POST", {assistantSid: assistantSid})
                const data = await tokenResponse.json();
                const EPHEMERAL_KEY = data.client_secret.value;

                // Create a peer connection
                const pc = new RTCPeerConnection();

                // Set up to play remote audio from the model

                audioElement.current = document.createElement("audio");



                //@ts-ignore
                audioElement.current.autoplay = true;
                //@ts-ignore
                pc.ontrack = (e) => (audioElement.current.srcObject = e.streams[0]);

                // if (audioElement.current) {
                //
                //     audioElement.current.autoplay = true;
                //     pc.ontrack = (e) => {
                //         if (audioElement.current) {  // Add another null check here
                //             audioElement.current.srcObject = e.streams[0];
                //         }
                //     };
                // }

                // Add local audio track for microphone input in the browser
                const ms = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                });
                pc.addTrack(ms.getTracks()[0]);

                // Set up data channel for sending and receiving events
                const dc = pc.createDataChannel("oai-events");
                setDataChannel(dc);

                // Start the session using the Session Description Protocol (SDP)
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);

                const baseUrl = "https://api.openai.com/v1/realtime";
                const model = "gpt-4o-realtime-preview-2024-12-17";
                const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
                    method: "POST",
                    body: offer.sdp,
                    headers: {
                        Authorization: `Bearer ${EPHEMERAL_KEY}`,
                        "Content-Type": "application/sdp",
                    },
                });

                const answer = {
                    type: "answer",
                    sdp: await sdpResponse.text(),
                } as RTCSessionDescriptionInit;
                await pc.setRemoteDescription(answer);
                peerConnection.current = pc;
                resolve(pc);
            } catch (e : any) {
                console.error("Error starting session:", e); // Log the actual error
                reject(new Error(`Fail to start session: ${e?.message || e}`)); // Provide more detailed error

            }
        })
    }

    // Stop current session, clean up peer connection and data channel
    function stopSession() {
        if (dataChannel) {
            dataChannel.close();
        }
        if (peerConnection.current) {
            peerConnection.current.close();
        }

        setIsSessionActive(false);
        setDataChannel(null);
        peerConnection.current = null;
    }

    // Send a message to the model
    function sendClientEvent(message : any) {
        if (dataChannel) {
            message.event_id = message.event_id || crypto.randomUUID();
            dataChannel.send(JSON.stringify(message));
            //@ts-ignore
            setEvents((prev) => [message, ...prev]);
        } else {
            console.error(
                "Failed to send message - no data channel available",
                message,
            );
        }
    }

    // Send a text message to the model
    function sendTextMessage(message : any) {
        const event = {
            type: "conversation.item.create",
            item: {
                type: "message",
                role: "user",
                content: [
                    {
                        type: "input_text",
                        text: message,
                    },
                ],
            },
        };

        sendClientEvent(event);
        sendClientEvent({type: "response.create"});
    }

    function sendInitialMessage(welcomeMessage : string) {
        const event = {
            type: "conversation.item.create",
            item: {
                type: "message",
                role: "user",
                content: [
                    {
                        type: "input_text",
                        text: `Start conversation with '${welcomeMessage}'. And ask for the caller information, nom et prenom`
                    },
                ],
            },
        };

        sendClientEvent(event);
        sendClientEvent({type: "response.create"});
    }

    // Attach event listeners to the data channel when a new one is created
    useEffect(() => {
        if (dataChannel) {
            // Append new server events to the list
            dataChannel.addEventListener("message", (e) => {
                //@ts-ignore
                setEvents((prev) => [JSON.parse(e.data), ...prev]);
            });

            // Set session active when the data channel is opened
            dataChannel.addEventListener("open", () => {
                setIsSessionActive(true);
                sendInitialMessage(startMessage)
                setEvents([]);
            });
        }
    }, [dataChannel]);

    return (
        <>
            <main className="">
                <SessionControls
                    startSession={startSession}
                    stopSession={stopSession}
                    isSessionActive={isSessionActive}
                />
            </main>
        </>
    );
}
