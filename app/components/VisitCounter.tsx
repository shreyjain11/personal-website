"use client";
import { useEffect, useState } from "react";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { EncryptedText } from "./ui/encrypted-text";

export function VisitCounter() {
  const [visits, setVisits] = useState<number>(100);
  const [isLoaded, setIsLoaded] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // Set initial message index immediately
    const storedIndex = localStorage.getItem("shreyJainMessageIndex");
    const currentIndex = storedIndex ? parseInt(storedIndex, 10) : 0;
    setMessageIndex(currentIndex);

    const fetchVisitCount = async () => {
      try {
        // Fetch from the API endpoint with cache busting
        const response = await fetch('/api/counter', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        
        if (data.error) {
          console.error('API Error:', data.error);
        }
        
        setVisits(data.count || 100);
        
        // Update message index
        const nextIndex = (currentIndex + 1) % 20;
        localStorage.setItem("shreyJainMessageIndex", nextIndex.toString());
        setMessageIndex(nextIndex);
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to fetch visit count:', error);
        // Still show the counter with fallback
        setIsLoaded(true);
      }
    };

    // Show counter immediately with default value, then update
    setIsLoaded(true);
    fetchVisitCount();
  }, []);

  // Always show the counter, don't wait for loading
  if (!isLoaded) {
    return (
      <div className="fixed bottom-8 right-8 z-50">
        <div className="text-xs font-mono text-black dark:text-black opacity-60">
          loading...
        </div>
      </div>
    );
  }

  const messages = [
    { before: "exactly", after: "curious minds have decoded this portfolio" },
    { before: "", after: "pixels have been blessed by your presence" },
    { before: "you are visitor number", after: "to witness this digital journey" },
    { before: "", after: "humans have stumbled into shrey's corner of the web" },
    { before: "join", after: "others who've explored this creative space" },
    { before: "you're one of", after: "brave souls navigating this site" },
    { before: "", after: "wanderers have discovered this hidden gem" },
    { before: "congratulations, you're the", after: "th person to find this portfolio" },
    { before: "", after: "visitors have admired these projects" },
    { before: "welcome! you're explorer #", after: "of this digital realm" },
    { before: "", after: "people have experienced shrey's vision" },
    { before: "you join", after: "others in this computational journey" },
    { before: "", after: "individuals have clicked through these pages" },
    { before: "visitor", after: "has entered the matrix" },
    { before: "", after: "curious developers have inspected this code" },
    { before: "you are the", after: "th witness to this creation" },
    { before: "", after: "minds have connected through this interface" },
    { before: "human #", after: "has accessed the mainframe" },
    { before: "", after: "explorers have navigated these digital waters" },
    { before: "welcome, visitor", after: "to shrey's universe" }
  ];

  const currentMessage = messages[messageIndex];

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="text-xs font-mono text-black dark:text-black opacity-60 hover:opacity-100 transition-all duration-300 cursor-default">
        {currentMessage.before && (
          <>
            <EncryptedText 
              text={currentMessage.before}
              className="inline-block"
              revealDelayMs={120}
              flipDelayMs={80}
            />
            <span> </span>
          </>
        )}
        <NumberTicker 
          value={visits} 
          className="inline-block text-xs font-mono text-black dark:text-black"
          delay={0.5}
        />
        {currentMessage.after && (
          <>
            <span> </span>
            <EncryptedText 
              text={currentMessage.after}
              className="inline-block"
              revealDelayMs={120}
              flipDelayMs={80}
            />
          </>
        )}
      </div>
    </div>
  );
}
