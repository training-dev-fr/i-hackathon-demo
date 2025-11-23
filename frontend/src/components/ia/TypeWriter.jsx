import { useEffect, useState, useRef } from "react";

export default function TypeWriter({ text, speed = 25, fluidContainerRef }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!text) return;
    setDisplayedText("");

    let i = -1;
    const chars = text.split("");
    let interval = null;
      interval = setInterval(() => {
        if (i < chars.length - 1) {
          i++
          setDisplayedText((prev) => prev + chars[i]);
          

          // 🔹 scroll automatique fluide vers le bas
          if (fluidContainerRef.current) {
            const parent = fluidContainerRef.current
            if (parent) {
              parent.scrollTo({
                top: parent.scrollHeight,
                behavior: "smooth",
              });
            }
          }
        } else {
          clearInterval(interval);
        }
      }, speed);


    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <div className="whitespace-pre-line ">
      {displayedText}

    </div>
  );
}