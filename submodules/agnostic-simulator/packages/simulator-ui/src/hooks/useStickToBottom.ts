import { useCallback, useLayoutEffect, useRef } from "react";

export interface UseStickToBottomOptions {
  thresholdPx?: number;
  /** Keep new content anchored to the newest row even after manual scrolling. */
  always?: boolean;
}

const DEFAULT_STICK_THRESHOLD_PX = 24;

export function useStickToBottom<T extends HTMLElement>(
  deps: ReadonlyArray<unknown>,
  options: UseStickToBottomOptions = {},
) {
  const thresholdPx = options.thresholdPx ?? DEFAULT_STICK_THRESHOLD_PX;
  const always = options.always ?? false;
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
    stuckRef.current = always || distance <= thresholdPx;
  }, [always, thresholdPx]);

  useLayoutEffect(() => {
    if (always || stuckRef.current) {
      scrollToBottom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [always, scrollToBottom, ...deps]);

  return { scrollRef, onScroll, scrollToBottom };
}
