import { useCallback, useRef, useState } from "react";

interface KeyboardNavigatorProps {
  selector?: string;
  orientation?: "horizontal" | "vertical" | "grid";
  loop?: boolean;
  onActivate?: (entityId: string) => void;
  onFocusChange?: (entityId: string | null) => void;
  children: React.ReactNode;
}

export function KeyboardNavigator({
  selector = "[data-entity-id]",
  orientation = "horizontal",
  loop = false,
  onActivate,
  onFocusChange,
  children,
}: KeyboardNavigatorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const getFocusables = (): HTMLElement[] => {
    if (!containerRef.current) return [];
    return Array.from(containerRef.current.querySelectorAll(selector)).filter(
      (el): el is HTMLElement =>
        el instanceof HTMLElement && el.tabIndex >= -1 && !el.hasAttribute("disabled"),
    );
  };

  const focusEntity = (entityId: string) => {
    const el = containerRef.current?.querySelector<HTMLElement>(
      `${selector}[data-entity-id="${entityId}"]`,
    );
    if (el) {
      el.focus();
      setActiveId(entityId);
      onFocusChange?.(entityId);
    }
  };

  const handleKeydown = useCallback(
    (event: React.KeyboardEvent) => {
      const focusables = getFocusables();
      if (focusables.length === 0) return;

      const currentIndex = activeId
        ? focusables.findIndex((el) => el.getAttribute("data-entity-id") === activeId)
        : -1;

      let nextIndex = currentIndex;

      switch (event.key) {
        case "ArrowRight":
          if (orientation === "horizontal" || orientation === "grid") {
            event.preventDefault();
            nextIndex = currentIndex + 1;
          }
          break;
        case "ArrowLeft":
          if (orientation === "horizontal" || orientation === "grid") {
            event.preventDefault();
            nextIndex = currentIndex - 1;
          }
          break;
        case "ArrowDown":
          if (orientation === "vertical" || orientation === "grid") {
            event.preventDefault();
            nextIndex = currentIndex + 1;
          }
          break;
        case "ArrowUp":
          if (orientation === "vertical" || orientation === "grid") {
            event.preventDefault();
            nextIndex = currentIndex - 1;
          }
          break;
        case "Home":
          event.preventDefault();
          nextIndex = 0;
          break;
        case "End":
          event.preventDefault();
          nextIndex = focusables.length - 1;
          break;
        case "Enter":
        case " ":
          if (activeId) {
            event.preventDefault();
            onActivate?.(activeId);
          }
          return;
        default:
          return;
      }

      if (loop) {
        nextIndex = ((nextIndex % focusables.length) + focusables.length) % focusables.length;
      } else {
        nextIndex = Math.max(0, Math.min(nextIndex, focusables.length - 1));
      }

      const nextEl = focusables[nextIndex];
      if (nextEl) {
        const entityId = nextEl.getAttribute("data-entity-id");
        if (entityId) focusEntity(entityId);
      }
    },
    [activeId, loop, orientation, onActivate, onFocusChange],
  );

  return (
    <div
      ref={containerRef}
      className="keyboard-navigator"
      onKeyDown={handleKeydown}
      tabIndex={0}
      role="application"
      aria-label="Card board"
      aria-activedescendant={activeId ? `entity-${activeId}` : undefined}
    >
      {children}
    </div>
  );
}
