import { useCallback, useRef, useState } from "react";

interface KeyboardNavigatorProps {
  selector?: string;
  orientation?: "horizontal" | "vertical" | "grid";
  loop?: boolean;
  onActivate?: (entityId: string) => void;
  onFocusChange?: (entityId: string | null) => void;
  children: React.ReactNode;
}

const ENTITY_ID_ATTRIBUTE = "data-sim-entity-id";

export function KeyboardNavigator({
  selector = `[${ENTITY_ID_ATTRIBUTE}]`,
  orientation = "horizontal",
  loop = false,
  onActivate,
  onFocusChange,
  children,
}: KeyboardNavigatorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeNodeId, setActiveNodeId] = useState<string>();

  const getFocusables = (): HTMLElement[] => {
    if (!containerRef.current) return [];
    return Array.from(containerRef.current.querySelectorAll(selector)).filter(
      (el): el is HTMLElement =>
        el instanceof HTMLElement &&
        (el.tabIndex >= 0 || el.hasAttribute("tabindex")) &&
        !el.hasAttribute("disabled"),
    );
  };

  const focusEntity = (entityId: string) => {
    const el = containerRef.current?.querySelector<HTMLElement>(
      `${selector}[${ENTITY_ID_ATTRIBUTE}="${cssAttributeValue(entityId)}"]`,
    );
    if (el) {
      el.focus();
    }
  };

  const handleKeydown = useCallback(
    (event: React.KeyboardEvent) => {
      const focusables = getFocusables();
      if (focusables.length === 0) return;

      const currentIndex = activeId
        ? focusables.findIndex((el) => el.getAttribute(ENTITY_ID_ATTRIBUTE) === activeId)
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
        const entityId = nextEl.getAttribute(ENTITY_ID_ATTRIBUTE);
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
      onFocusCapture={(event) => {
        const node = event.target instanceof Element ? event.target.closest(selector) : null;
        const entityId = node?.getAttribute(ENTITY_ID_ATTRIBUTE);
        if (entityId) {
          setActiveId(entityId);
          setActiveNodeId(node?.id || undefined);
          onFocusChange?.(entityId);
        }
      }}
      tabIndex={0}
      role="application"
      aria-label="Card board"
      aria-activedescendant={activeNodeId}
    >
      {children}
    </div>
  );
}

function cssAttributeValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\A ");
}
