import { useCallback, useEffect, useRef, useState } from "react";

export function AccessibilityAnnouncer() {
  const [politeMessage, setPoliteMessage] = useState("");
  const [assertiveMessage, setAssertiveMessage] = useState("");
  const queueRef = useRef<{ text: string; assertive: boolean }[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const processQueue = useCallback(() => {
    clearTimeout(timerRef.current);
    const item = queueRef.current.shift();
    if (!item) return;
    if (item.assertive) {
      setAssertiveMessage(item.text);
      setPoliteMessage("");
    } else {
      setPoliteMessage(item.text);
      setAssertiveMessage("");
    }
    timerRef.current = setTimeout(() => {
      setPoliteMessage("");
      setAssertiveMessage("");
      processQueue();
    }, 150);
  }, []);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {politeMessage}
      </div>
      <div className="sr-only" role="alert" aria-live="assertive" aria-atomic="true">
        {assertiveMessage}
      </div>
      <style>{`.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}`}</style>
    </>
  );
}
