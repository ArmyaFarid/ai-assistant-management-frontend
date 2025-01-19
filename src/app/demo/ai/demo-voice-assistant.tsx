'use client'
import {useEffect, useRef, useState} from "react";
import SessionControls from "./SessionControls";

export default function DemoVoiceAssistant() {
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [events, setEvents] = useState([]);
    const [dataChannel, setDataChannel] = useState(null);
    const peerConnection = useRef(null);
    const audioElement = useRef(null);

    async function startSession() {
        // Get an ephemeral key from the Fastify server
        const tokenResponse = await fetch("http://127.0.0.1:3000/token");
        const data = await tokenResponse.json();
        const EPHEMERAL_KEY = data.client_secret.value;

        // Create a peer connection
        const pc = new RTCPeerConnection();

        // Set up to play remote audio from the model
        audioElement.current = document.createElement("audio");
        audioElement.current.autoplay = true;
        pc.ontrack = (e) => (audioElement.current.srcObject = e.streams[0]);

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
        };
        await pc.setRemoteDescription(answer);

        peerConnection.current = pc;
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
    function sendClientEvent(message) {
        if (dataChannel) {
            message.event_id = message.event_id || crypto.randomUUID();
            dataChannel.send(JSON.stringify(message));
            setEvents((prev) => [message, ...prev]);
        } else {
            console.error(
                "Failed to send message - no data channel available",
                message,
            );
        }
    }

    // Send a text message to the model
    function sendTextMessage(message) {
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

    // Attach event listeners to the data channel when a new one is created
    useEffect(() => {
        if (dataChannel) {
            // Append new server events to the list
            dataChannel.addEventListener("message", (e) => {
                setEvents((prev) => [JSON.parse(e.data), ...prev]);
            });

            // Set session active when the data channel is opened
            dataChannel.addEventListener("open", () => {
                setIsSessionActive(true);
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
