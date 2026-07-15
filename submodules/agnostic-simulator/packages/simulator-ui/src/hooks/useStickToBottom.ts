import { useCallback, useEffect, useRef } from "react";

export interface UseStickToBottomOptions {
  thresholdPx?: number;
}

const DEFAULT_STICK_THRESHOLD_PX = 24;

export function useStickToBottom<T extends HTMLElement>(
  deps: ReadonlyArray<unknown>,
  options: UseStickToBottomOptions = {},
) {
  const thresholdPx = options.thresholdPx ?? DEFAULT_STICK_THRESHOLD_PX;
  const scrollRef = useRef<T | null>(null);
  const stuckRef = useRef(true);

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    el.scrollTop = el.scrollHeight;
  }, []);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    stuckRef.current = distance <= thresholdPx;
  }, [thresholdPx]);

  useEffect(() => {
    if (stuckRef.current) {
      scrollToBottom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollToBottom, ...deps]);

  return { scrollRef, onScroll, scrollToBottom };
}
