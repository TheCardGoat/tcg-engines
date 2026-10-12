import { useEffect } from "react";
import { finishMatchIntro } from "@tcg/shared/match-intro";

/** Each game signals its own rendered board/preparation/error state, after lazy loading. */
export function useMatchIntroReady(ready: boolean): void {
  useEffect(() => {
    if (ready) finishMatchIntro();
  }, [ready]);
}
