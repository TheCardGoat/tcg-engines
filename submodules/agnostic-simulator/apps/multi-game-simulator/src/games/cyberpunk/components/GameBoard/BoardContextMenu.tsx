import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";
import { useFloatingPointMenu } from "./useFloatingPointMenu";
import classes from "./BoardContextMenu.module.css";

export interface BoardContextMenuAction {
  id: string;
  label: string;
  disabled?: boolean;
  run: () => void;
}

interface BoardContextMenuProps {
  x: number;
  y: number;
  actions: BoardContextMenuAction[];
  onClose: () => void;
}

export function BoardContextMenu({ x, y, actions, onClose }: BoardContextMenuProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const position = useFloatingPointMenu(ref, { x, y, align: "start", offset: 8, padding: 8 });

  useEffect(() => {
    const onPointerDown = (ev: PointerEvent) => {
      if (ref.current && !ref.current.contains(ev.target as Node)) onClose();
    };
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") onClose();
    };
    const onContext = (ev: MouseEvent) => {
      // Allow nested right-click to reopen elsewhere — close current first.
      if (ref.current && !ref.current.contains(ev.target as Node)) onClose();
    };
    window.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("contextmenu", onContext, true);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("contextmenu", onContext, true);
    };
  }, [onClose]);

  const stop = (ev: ReactPointerEvent<HTMLDivElement>) => ev.stopPropagation();

  return createPortal(
    <div
      ref={ref}
      className={classes.menu}
      style={{
        left: `${position.left}px`,
        top: `${position.top}px`,
      }}
      role="menu"
      aria-label="Board actions"
      data-testid="board-context-menu"
      data-side={position.side}
      onPointerDown={stop}
      onContextMenu={(ev) => ev.preventDefault()}
    >
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          className={classes.item}
          role="menuitem"
          disabled={action.disabled}
          data-testid={`board-action-${action.id}`}
          onClick={(ev) => {
            ev.stopPropagation();
            onClose();
            action.run();
          }}
        >
          {action.label}
        </button>
      ))}
    </div>,
    document.body,
  );
}
