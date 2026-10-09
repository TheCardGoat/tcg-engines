import { cancelFrame, frame } from "motion";
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

  const pendingRef = useRef<(() => void) | null>(null);
  const cancelScroll = useCallback(() => {
    pendingRef.current?.();
    pendingRef.current = null;
  }, []);

  const scrollToBottom = useCallback(() => {
    cancelScroll();
    const el = scrollRef.current;
    if (!el) return;
    let height = 0;
    const write = () => {
      if (scrollRef.current === el) el.scrollTop = height;
      pendingRef.current = null;
    };
    const read = () => {
      height = el.scrollHeight;
      frame.render(write);
    };
    // Share Motion's read/write phases instead of forcing layout inside React's
    // commit, between the board's DOM mutations and geometry measurements.
    pendingRef.current = () => {
      cancelFrame(read);
      cancelFrame(write);
    };
    frame.read(read);
  }, [cancelScroll]);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    stuckRef.current = always || distance <= thresholdPx;
    if (!stuckRef.current) cancelScroll();
  }, [always, cancelScroll, thresholdPx]);

  useLayoutEffect(() => {
    if (always || stuckRef.current) {
      scrollToBottom();
    }
    return cancelScroll;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [always, cancelScroll, scrollToBottom, ...deps]);

  return { scrollRef, onScroll, scrollToBottom };
}
