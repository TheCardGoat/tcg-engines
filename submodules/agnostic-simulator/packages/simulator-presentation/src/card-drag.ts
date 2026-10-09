import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import type { DomCardPose } from "./DomCardMotion";

export interface CardDragSpace {
  left: number;
  top: number;
  width: number;
  height: number;
}
/** Convert client coordinates into unscaled board units; preserve the pointer's grab offset. */
export function cardDragPose(
  start: DomCardPose,
  grab: { x: number; y: number },
  pointer: { x: number; y: number },
  space: CardDragSpace,
  size: { width: number; height: number },
): DomCardPose {
  return {
    ...start,
    left: ((pointer.x - space.left) * size.width) / space.width - grab.x,
    top: ((pointer.y - space.top) * size.height) / space.height - grab.y,
  };
}
export function pointInsideCardSpace(point: { x: number; y: number }, space: CardDragSpace) {
  return (
    point.x >= space.left &&
    point.x <= space.left + space.width &&
    point.y >= space.top &&
    point.y <= space.top + space.height
  );
}
/** Pointer capture retains ownership outside the card. R3F consumes the pose ref, not React state. */
export function usePresentationCardDrag({
  board,
  pose,
  enabled,
  onDrop,
  onCancel,
  size = { width: 1280, height: 650 },
}: {
  board: RefObject<HTMLDivElement | null>;
  pose: DomCardPose;
  enabled: boolean;
  onDrop: (pose: DomCardPose, pointer: { x: number; y: number }) => void;
  onCancel: (pose: DomCardPose) => void;
  size?: { width: number; height: number };
}) {
  const dragPose = useRef<DomCardPose | undefined>(undefined);
  const session = useRef<
    | { id: number; grab: { x: number; y: number }; start: DomCardPose; node: HTMLDivElement }
    | undefined
  >(undefined);
  const [dragging, setDragging] = useState(false);
  const latest = useRef({ onCancel });
  latest.current = { onCancel };
  const cancel = () => {
    const current = session.current;
    if (!current) return;
    session.current = undefined;
    const release = dragPose.current ?? current.start;
    dragPose.current = undefined;
    if (current.node.hasPointerCapture(current.id)) current.node.releasePointerCapture(current.id);
    setDragging(false);
    latest.current.onCancel(release);
  };
  useEffect(() => {
    const hide = () => {
      if (document.hidden) cancel();
    };
    window.addEventListener("blur", cancel);
    document.addEventListener("visibilitychange", hide);
    return () => {
      window.removeEventListener("blur", cancel);
      document.removeEventListener("visibilitychange", hide);
    };
  }, []);
  const update = (event: ReactPointerEvent<HTMLDivElement>) => {
    const active = session.current,
      element = board.current;
    if (!active || !element || active.id !== event.pointerId) return;
    const rect = element.getBoundingClientRect();
    const next = cardDragPose(
      active.start,
      active.grab,
      { x: event.clientX, y: event.clientY },
      rect,
      size,
    );
    dragPose.current = next;
    return next;
  };
  return {
    dragPose,
    dragging,
    bindings: {
      onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => {
        if (!enabled || session.current || !event.isPrimary || event.button !== 0 || !board.current)
          return;
        event.preventDefault();
        const rect = board.current.getBoundingClientRect();
        session.current = {
          id: event.pointerId,
          node: event.currentTarget,
          start: pose,
          grab: {
            x: ((event.clientX - rect.left) * size.width) / rect.width - pose.left,
            y: ((event.clientY - rect.top) * size.height) / rect.height - pose.top,
          },
        };
        dragPose.current = pose;
        event.currentTarget.setPointerCapture(event.pointerId);
        setDragging(true);
      },
      onPointerMove: update,
      onPointerUp: (event: ReactPointerEvent<HTMLDivElement>) => {
        const current = session.current;
        if (!current || current.id !== event.pointerId) return;
        const release = update(event) ?? current.start;
        session.current = undefined;
        dragPose.current = undefined;
        if (current.node.hasPointerCapture(current.id))
          current.node.releasePointerCapture(current.id);
        setDragging(false);
        onDrop(release, { x: event.clientX, y: event.clientY });
      },
      onPointerCancel: cancel,
      onLostPointerCapture: cancel,
    },
  };
}
