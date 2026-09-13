import * as Popover from "@radix-ui/react-popover";
import { Swords } from "lucide-react";
import { useRef, useState } from "react";

export function weaponAttacksRemainingLabel(
  weaponName: string,
  remaining: number,
  total: number,
): string {
  return `${weaponName}: ${remaining} of ${total} attacks remaining this turn`;
}

export function FabWeaponAttacksLeft({
  weaponName,
  remaining,
  total,
  side,
}: {
  readonly weaponName: string;
  readonly remaining: number;
  readonly total: number;
  readonly side: "top" | "bottom";
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const suppressFocusOpenRef = useRef(false);
  const escapeDismissedRef = useRef(false);

  if (total <= 1) return null;

  const accessibleLabel = weaponAttacksRemainingLabel(weaponName, remaining, total);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          ref={triggerRef}
          type="button"
          className="fab-weapon-attacks-left"
          data-testid="fab-weapon-attacks-left"
          data-remaining={remaining}
          data-side={side}
          aria-label={accessibleLabel}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => event.stopPropagation()}
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") setOpen(true);
          }}
          onFocus={() => {
            if (!suppressFocusOpenRef.current) setOpen(true);
          }}
        >
          <span className="fab-weapon-attacks-left-pip" aria-hidden="true">
            <Swords size={13} strokeWidth={2.2} />
            <strong>{remaining}</strong>
          </span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="fab-weapon-attacks-left-popover"
          side={side === "top" ? "bottom" : "top"}
          sideOffset={8}
          collisionPadding={12}
          aria-label={`${weaponName} attack activations`}
          onEscapeKeyDown={() => {
            escapeDismissedRef.current = true;
            window.setTimeout(() => {
              suppressFocusOpenRef.current = true;
              triggerRef.current?.focus({ preventScroll: true });
              queueMicrotask(() => {
                suppressFocusOpenRef.current = false;
              });
            });
          }}
          onCloseAutoFocus={(event) => {
            if (!escapeDismissedRef.current) return;
            event.preventDefault();
            escapeDismissedRef.current = false;
            suppressFocusOpenRef.current = true;
            triggerRef.current?.focus({ preventScroll: true });
            queueMicrotask(() => {
              suppressFocusOpenRef.current = false;
            });
          }}
          onPointerDownOutside={() => {
            escapeDismissedRef.current = false;
          }}
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") setOpen(true);
          }}
          onPointerLeave={(event) => {
            if (event.pointerType === "mouse") setOpen(false);
          }}
        >
          <header>
            <strong>{weaponName}</strong>
            <span>This turn</span>
          </header>
          <p>
            <Swords aria-hidden="true" size={16} strokeWidth={1.8} />
            <span>
              <strong>Attacks remaining</strong>
              <small>
                {remaining} of {total} left this turn
              </small>
            </span>
          </p>
          <Popover.Arrow className="fab-weapon-attacks-left-popover-arrow" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
