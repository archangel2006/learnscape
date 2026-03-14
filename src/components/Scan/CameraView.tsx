"use client";

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export interface CameraViewHandle {
  getFrame: () => string | null;
}

export const CameraView = forwardRef<CameraViewHandle>((props, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useImperativeHandle(ref, () => ({
    getFrame: () => {
      if (!videoRef.current) return null;
      
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      
      if (!ctx) return null;
      
      ctx.drawImage(videoRef.current, 0, 0);
      return canvas.toDataURL("image/jpeg", 0.8);
    }
  }));

  useEffect(() => {
    async function setupCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Camera access was denied or is unavailable. Please check permissions.");
      }
    }

    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
      {error ? (
        <div className="p-6 max-w-md z-50">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Camera Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
    </div>
  );
});

CameraView.displayName = "CameraView";
