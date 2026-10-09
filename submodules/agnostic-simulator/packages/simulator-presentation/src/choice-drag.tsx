import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import {
  placeChoice,
  type ChoiceAssignments,
  type ChoiceSlot,
  type ChoiceToken,
} from "./choice-drag-model";
import "./choice-drag.css";
export * from "./choice-drag-model";
interface DragContextValue {
  tokens: readonly ChoiceToken[];
  slots: readonly ChoiceSlot[];
  value: ChoiceAssignments;
  scope: string;
  active: string | null;
  locked: boolean;
  select: (id: string | null) => void;
  drop: (slot: string, before?: string, token?: string) => void;
  start: (id: string, event: React.PointerEvent<HTMLElement>) => void;
}
const DragContext = createContext<DragContextValue | null>(null);
function useDrag() {
  const ctx = useContext(DragContext);
  if (!ctx) throw new Error("ChoiceDragProvider is required");
  return ctx;
}
/** Controlled input layer shared by DOM trays and projected R3F board hit areas. */
export function ChoiceDragProvider({
  tokens,
  slots,
  value,
  onChange,
  onReject,
  locked = false,
  children,
}: {
  tokens: readonly ChoiceToken[];
  slots: readonly ChoiceSlot[];
  value: ChoiceAssignments;
  onChange: (value: ChoiceAssignments) => void;
  onReject?: (token: string, destination: string | null) => void;
  locked?: boolean;
  children: ReactNode;
}) {
  const scope = useId();
  const [active, select] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const ghost = useRef<HTMLDivElement>(null);
  const session = useRef<{
    id: string;
    pointer: number;
    x: number;
    y: number;
    moved: boolean;
  } | null>(null);
  const latest = useRef({ slots, value, onChange, onReject, locked });
  latest.current = { slots, value, onChange, onReject, locked };
  const cancel = () => {
    session.current = null;
    setDragging(false);
    select(null);
  };
  const drop = (slot: string, before?: string, token = active ?? undefined) => {
    if (!token || latest.current.locked) return;
    const next = placeChoice(latest.current.slots, latest.current.value, token, slot, before);
    if (next !== latest.current.value) {
      latest.current.onChange(next);
      select(null);
    } else {
      latest.current.onReject?.(token, slot);
    }
  };
  useEffect(() => {
    const move = (event: PointerEvent) => {
      const current = session.current;
      if (!current || current.pointer !== event.pointerId) return;
      if (Math.hypot(event.clientX - current.x, event.clientY - current.y) > 5)
        current.moved = true;
      if (ghost.current)
        ghost.current.style.transform = `translate3d(${event.clientX + 14}px,${event.clientY - 24}px,0)`;
    };
    const up = (event: PointerEvent) => {
      const current = session.current;
      if (!current || current.pointer !== event.pointerId) return;
      session.current = null;
      setDragging(false);
      if (!current.moved) return;
      const target = document
        .elementFromPoint(event.clientX, event.clientY)
        ?.closest<HTMLElement>("[data-choice-slot]");
      if (target?.dataset.choiceScope === scope && !latest.current.locked) {
        const next = placeChoice(
          latest.current.slots,
          latest.current.value,
          current.id,
          target.dataset.choiceSlot!,
          target.dataset.choiceBefore,
        );
        if (next !== latest.current.value) latest.current.onChange(next);
        else latest.current.onReject?.(current.id, target.dataset.choiceSlot ?? null);
      } else if (!latest.current.locked) {
        latest.current.onReject?.(current.id, null);
      }
      select(null);
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") cancel();
    };
    const hidden = () => {
      if (document.hidden) cancel();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", cancel);
    window.addEventListener("blur", cancel);
    window.addEventListener("keydown", key);
    document.addEventListener("visibilitychange", hidden);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", cancel);
      window.removeEventListener("blur", cancel);
      window.removeEventListener("keydown", key);
      document.removeEventListener("visibilitychange", hidden);
    };
  }, []);
  useEffect(() => {
    if (locked) cancel();
  }, [locked]);
  const token = tokens.find((t) => t.id === active);
  return (
    <DragContext.Provider
      value={{
        scope,
        tokens,
        slots,
        value,
        active,
        locked,
        select,
        drop,
        start: (id, event) => {
          if (locked || event.button !== 0) return;
          event.preventDefault();
          event.currentTarget.setPointerCapture?.(event.pointerId);
          select(id);
          setDragging(true);
          session.current = {
            id,
            pointer: event.pointerId,
            x: event.clientX,
            y: event.clientY,
            moved: false,
          };
        },
      }}
    >
      {children}
      <span className="choice-sr" role="status">
        {active ? `${token?.label}. Choose a destination. Escape cancels.` : "Ready for a choice."}
      </span>
      {dragging &&
        token &&
        createPortal(
          <div
            ref={ghost}
            className="choice-ghost"
            style={{
              transform: `translate3d(${(session.current?.x ?? 0) + 14}px,${(session.current?.y ?? 0) - 24}px,0)`,
            }}
          >
            {token.imageUrl && <img src={token.imageUrl} alt="" />}
            {token.label}
          </div>,
          document.body,
        )}
    </DragContext.Provider>
  );
}
export function ChoiceDraggable({
  id,
  children,
  style,
  className = "",
}: {
  id: string;
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
}) {
  const ctx = useDrag();
  const token = ctx.tokens.find((t) => t.id === id);
  if (!token) return null;
  return (
    <button
      type="button"
      className={`choice-token ${className}`}
      style={style}
      disabled={ctx.locked}
      aria-label={`Pick up ${token.label}`}
      aria-pressed={ctx.active === id}
      onPointerDown={(e) => ctx.start(id, e)}
      onClick={(e) => {
        if (e.detail === 0) ctx.select(ctx.active === id ? null : id);
      }}
    >
      {children ?? (
        <>
          {token.imageUrl && <img src={token.imageUrl} alt="" draggable={false} />}
          <span>{token.label}</span>
          {token.detail && <small>{token.detail}</small>}
        </>
      )}
    </button>
  );
}
export function ChoiceDropSlot({
  id,
  before,
  children,
  style,
  className = "",
}: {
  id: string;
  before?: string;
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
}) {
  const ctx = useDrag();
  const slot = ctx.slots.find((s) => s.id === id);
  if (!slot) return null;
  const eligible =
    !!ctx.active &&
    slot.accepts.includes(ctx.active) &&
    ((ctx.value[id]?.length ?? 0) < slot.max || !!ctx.value[id]?.includes(ctx.active));
  return (
    <button
      type="button"
      className={`choice-slot ${className}`}
      style={style}
      data-choice-scope={ctx.scope}
      data-choice-slot={id}
      data-choice-before={before}
      data-eligible={eligible}
      disabled={ctx.locked}
      aria-label={`Place in ${slot.label}${before ? " before this card" : ""}`}
      onClick={() => ctx.drop(id, before)}
    >
      {children ?? (
        <>
          <strong>{slot.label}</strong>
          <span>
            {ctx.value[id]?.length ?? 0} / {slot.max}
          </span>
        </>
      )}
    </button>
  );
}

/** Accessible bounded amount input. Uses native pointer, touch and keyboard behavior. */
export function ChoiceValueControl({
  label,
  value,
  min,
  max,
  onChange,
  disabled = false,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  return (
    <label className="choice-value">
      {label}: <output>{value}</output>
      <input
        aria-label={label}
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Math.min(max, Math.max(min, Number(event.target.value))))}
      />
      <span>
        {min} minimum · {max} maximum
      </span>
    </label>
  );
}
