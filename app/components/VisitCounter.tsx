"use client";
import { useEffect, useState } from "react";
import { NumberTicker } from "@/components/magicui/number-ticker";

export function VisitCounter() {
  const [visits, setVisits] = useState<number>(100);
  const [isLoaded, setIsLoaded] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // Get current visit count from localStorage
    const currentVisits = localStorage.getItem("shreyJainVisits");
    let visitCount = currentVisits ? parseInt(currentVisits, 10) : 100;
    
    // Only increment if this is a returning visitor
    if (currentVisits) {
      visitCount += 1;
    }
    
    // Save back to localStorage
    localStorage.setItem("shreyJainVisits", visitCount.toString());
    
    // Get or set message index
    const storedIndex = localStorage.getItem("shreyJainMessageIndex");
    const currentIndex = storedIndex ? parseInt(storedIndex, 10) : 0;
    const nextIndex = (currentIndex + 1) % 20;
    localStorage.setItem("shreyJainMessageIndex", nextIndex.toString());
    
    setVisits(visitCount);
    setMessageIndex(nextIndex);
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return null;
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
        {currentMessage.before && <span>{currentMessage.before} </span>}
        <NumberTicker 
          value={visits} 
          className="inline-block text-xs font-mono text-black dark:text-black"
          delay={0.5}
        />
        {currentMessage.after && <span> {currentMessage.after}</span>}
      </div>
    </div>
  );
}
