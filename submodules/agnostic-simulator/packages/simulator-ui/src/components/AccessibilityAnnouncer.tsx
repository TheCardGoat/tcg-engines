import { useEffect, useState } from "react";

export interface AccessibilityAnnouncerProps {
  /** Viewer-safe text supplied by the host after a meaningful state change. */
  message?: string;
  priority?: "polite" | "assertive";
  /** Change this value to announce repeated text for a new event. */
  announcementId?: string | number;
}

export function AccessibilityAnnouncer({
  message = "",
  priority = "polite",
  announcementId,
}: AccessibilityAnnouncerProps = {}) {
  const [announcement, setAnnouncement] = useState({ text: "", priority });
  useEffect(() => {
    // Clear first so identical text from a later event is a new live-region update.
    setAnnouncement({ text: "", priority });
    if (!message) return;
    const timer = setTimeout(() => setAnnouncement({ text: message, priority }), 50);
    return () => clearTimeout(timer);
  }, [message, priority, announcementId]);
  return (
    <>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement.priority === "polite" ? announcement.text : ""}
      </div>
      <div className="sr-only" role="alert" aria-live="assertive" aria-atomic="true">
        {announcement.priority === "assertive" ? announcement.text : ""}
      </div>
      <style>{`.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}`}</style>
    </>
  );
}
