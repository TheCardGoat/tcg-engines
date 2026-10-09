import { CardInspectionDialog } from "./CardInspectionDialog";
import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  type HTMLAttributes,
} from "react";
import type { SimulatorEntity } from "@tcg/simulator-contract";
import { CardFace } from "./CardFace";
import { projectSimulatorEntityForFace } from "./entity-visibility";
import classes from "./CardDetailSheet.module.css";

export interface CardDetailSheetProps {
  entity: SimulatorEntity;
  open: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  /** Compose the trigger onto one existing interactive child instead of nesting buttons. */
  asChild?: boolean;
  /** Optional trigger. Omit when a game provides its own action control. */
  children?: React.ReactNode;
}

export function CardDetailSheet({
  entity: sourceEntity,
  open,
  onClose,
  onOpen,
  asChild = false,
  children,
}: CardDetailSheetProps) {
  const entity = projectSimulatorEntityForFace(sourceEntity);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const longPressOpened = useRef(false);
  const handlePointerDown = useCallback(() => {
    clearTimeout(longPressTimer.current);
    longPressOpened.current = false;
    longPressTimer.current = setTimeout(() => {
      longPressOpened.current = true;
      onOpen?.();
    }, 500);
  }, [onOpen]);
  const clearLongPress = useCallback(() => clearTimeout(longPressTimer.current), []);
  useEffect(() => clearLongPress, [clearLongPress]);
  const triggerProps: HTMLAttributes<HTMLElement> = {
    onClick: () => {
      if (!longPressOpened.current) onOpen?.();
      longPressOpened.current = false;
    },
    onPointerDown: handlePointerDown,
    onPointerUp: clearLongPress,
    onPointerLeave: clearLongPress,
    onPointerCancel: clearLongPress,
    "aria-haspopup": "dialog",
    "aria-expanded": open,
  };
  const childTrigger =
    asChild && isValidElement<HTMLAttributes<HTMLElement>>(children)
      ? cloneElement(children, {
          ...triggerProps,
          onClick: (event) => {
            children.props.onClick?.(event);
            if (!event.defaultPrevented) triggerProps.onClick?.(event);
          },
          onPointerDown: (event) => {
            children.props.onPointerDown?.(event);
            if (!event.defaultPrevented) handlePointerDown();
          },
          onPointerUp: (event) => {
            children.props.onPointerUp?.(event);
            clearLongPress();
          },
          onPointerLeave: (event) => {
            children.props.onPointerLeave?.(event);
            clearLongPress();
          },
          onPointerCancel: (event) => {
            children.props.onPointerCancel?.(event);
            clearLongPress();
          },
        })
      : null;
  return (
    <>
      {asChild ? (
        childTrigger
      ) : children ? (
        <button type="button" className="card-detail-trigger inline-block" {...triggerProps}>
          {children}
        </button>
      ) : null}
      <CardInspectionDialog
        opened={open}
        onClose={() => onClose?.()}
        title={`${entity.face === "hidden" ? "Hidden card" : entity.title} details`}
        size={420}
        centered
        classNames={{ inner: classes.inner, content: classes.content }}
        closeButtonProps={{
          "aria-label": "Close card details",
          style: { minWidth: 44, minHeight: 44 },
        }}
      >
        <div className="max-h-[calc(85vh-24px)] overflow-y-auto p-4 md:max-h-[calc(80vh-24px)] md:p-6">
          <div className="mx-auto max-w-[280px]">
            <CardFace entity={entity} density="full" />
          </div>
          <div className="mt-4 grid gap-3">
            {entity.face !== "hidden" && entity.states.length > 0 && (
              <section>
                <h4 className="text-[11px] font-black uppercase tracking-normal text-[var(--board-muted)]">
                  States
                </h4>
                <div className="mt-1 flex flex-wrap gap-1">
                  {entity.states.map((state) => (
                    <span
                      key={state}
                      className="inline-flex min-h-6 items-center rounded-full border border-[var(--pill-border)] bg-[var(--pill-bg)] px-2 py-1 text-[11px] font-extrabold leading-none text-[var(--pill-text)]"
                    >
                      {state}
                    </span>
                  ))}
                </div>
              </section>
            )}
            {entity.face !== "hidden" && entity.stats.length > 0 && (
              <section>
                <h4 className="text-[11px] font-black uppercase tracking-normal text-[var(--board-muted)]">
                  Stats
                </h4>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  {entity.stats.map((stat) => (
                    <span
                      key={`${stat.label}:${stat.value}`}
                      className="inline-grid gap-0.5 rounded-md border border-[var(--board-border)] bg-[var(--board-surface-soft)] px-3 py-2"
                    >
                      <span className="text-[11px] font-extrabold uppercase leading-none text-[var(--board-muted)]">
                        {stat.label}
                      </span>
                      <strong className="text-base leading-none text-[var(--board-text)]">
                        {stat.value}
                      </strong>
                    </span>
                  ))}
                </div>
              </section>
            )}
            {entity.face !== "hidden" && entity.traits.length > 0 && (
              <section>
                <h4 className="text-[11px] font-black uppercase tracking-normal text-[var(--board-muted)]">
                  Traits
                </h4>
                <div className="mt-1 flex flex-wrap gap-1">
                  {entity.traits.map((trait) => (
                    <span
                      key={trait}
                      className="inline-flex min-h-6 items-center rounded-full border border-[var(--pill-border)] bg-[var(--pill-bg)] px-2 py-1 text-[11px] font-extrabold leading-none text-[var(--pill-text)]"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
          <button
            className="mt-4 min-h-11 w-full rounded-md bg-[var(--game-accent)]/20 py-2.5 text-sm font-black text-[var(--game-accent)] transition-colors hover:bg-[var(--game-accent)]/30"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </CardInspectionDialog>
    </>
  );
}
