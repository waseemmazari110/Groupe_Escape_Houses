"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function HeroVideo() {
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

    // Decode any percent-encoded characters in the stored URL (e.g. %2c -> ,)
    const posterLink = decodeURIComponent("https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/luxury-uk-group-holiday-house-exterior%2c-10e76810-20251016181409.jpg");


  useEffect(() => {
    // Delay video loading to prioritize LCP image
    const timer = setTimeout(() => {
      setShouldLoadVideo(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* LCP Priority Image */}
      <Image
        src={posterLink}
        alt="Luxury UK group holiday house"
        fill
        priority
        fetchPriority="high"
        unoptimized={false}
        className={`object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-0' : 'opacity-100'}`}
        sizes="100vw"
        quality={85}
      />

      {shouldLoadVideo && (
        <>
          {/* Desktop Video */}
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            onPlay={() => setVideoLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover hidden md:block transition-opacity duration-1000 ${videoLoaded ? 'opacity-30' : 'opacity-0'}`}
          >
            <source src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/docs-assets/Main%20Horizontal%20(3).mp4" type="video/mp4" />
          </video>

          {/* Mobile Video */}
          <video
            ref={mobileVideoRef}
            autoPlay
            muted
            loop
            playsInline
            onPlay={() => setVideoLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover block md:hidden transition-opacity duration-1000 ${videoLoaded ? 'opacity-30' : 'opacity-0'}`}
          >
            <source src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/docs-assets/0aNew%20Mobile%20Version%20%20(2).mp4" type="video/mp4" />
          </video>
        </>
      )}
    </div>
  );
}
