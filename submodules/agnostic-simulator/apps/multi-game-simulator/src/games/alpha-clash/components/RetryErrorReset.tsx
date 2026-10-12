import { useEffect, useRef } from "react";
import { useInteractionDraft } from "@tcg/simulator-ui";

/** A rejected payment message belongs to the draft that produced it. */
export function RetryErrorReset({ onClear }: { onClear: () => void }) {
  const { submissionRejected } = useInteractionDraft();
  const wasRejected = useRef(false);
  useEffect(() => {
    if (wasRejected.current && !submissionRejected) onClear();
    wasRejected.current = submissionRejected === true;
  }, [submissionRejected, onClear]);
  return null;
}
