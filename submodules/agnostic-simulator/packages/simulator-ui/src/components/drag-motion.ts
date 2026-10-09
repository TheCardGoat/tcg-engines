/** A drag owns one visual until it returns or hands its pose to a committed move. */
export interface DragMotionSession<T> {
  readonly source: T;
  readonly rect: { left: number; top: number; width: number; height: number };
  readonly phase: "dragging" | "pending" | "returning";
  readonly offset: { x: number; y: number };
}

export function createDragMotion<T>() {
  let session: DragMotionSession<T> | null = null;
  let frame: number | null = null;
  const listeners = new Set<() => void>();
  const publish = () => {
    for (const listener of listeners) listener();
  };
  const cancelFrame = () => {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
  };
  const finish = () => {
    cancelFrame();
    session = null;
    publish();
  };
  return {
    getSnapshot: () => session,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    begin(source: T, rect: DragMotionSession<T>["rect"]) {
      cancelFrame();
      session = { source, rect, phase: "dragging", offset: { x: 0, y: 0 } };
      publish();
    },
    move(x: number, y: number) {
      if (!session || session.phase !== "dragging") return;
      // Position is transient. Frame subscribers update without rerendering the board.
      session.offset.x = x;
      session.offset.y = y;
      publish();
    },
    release() {
      if (!session) return;
      session = { ...session, phase: "pending" };
      publish();
    },
    returnToSource(duration = 180) {
      if (!session) return;
      cancelFrame();
      if (duration === 0) {
        finish();
        return;
      }
      session = { ...session, phase: "returning" };
      const start = { ...session.offset };
      const started = performance.now();
      publish();
      const tick = (now: number) => {
        if (!session) return;
        const progress = Math.min(1, (now - started) / duration);
        const remaining = (1 - progress) ** 3;
        session.offset.x = start.x * remaining;
        session.offset.y = start.y * remaining;
        publish();
        if (progress === 1) finish();
        else frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    },
    finish,
  };
}
export type DragMotion<T> = ReturnType<typeof createDragMotion<T>>;
