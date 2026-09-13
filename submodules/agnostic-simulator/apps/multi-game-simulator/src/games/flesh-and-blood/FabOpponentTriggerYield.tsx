import * as Popover from "@radix-ui/react-popover";
import { SkipForward } from "lucide-react";
import { useState } from "react";

export interface FabOpponentTriggerYieldAction {
  readonly sourceInstanceId: string;
  readonly cardName: string;
  readonly onConfirm: () => void;
}

/** Card-scoped confirmation for yielding this and future opposing triggers. */
export function FabOpponentTriggerYieldControl({
  action,
}: {
  readonly action: FabOpponentTriggerYieldAction;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="fab-opponent-trigger-yield__trigger"
          data-testid="fab-opponent-trigger-yield-trigger"
          aria-label={`Always yield priority to opposing triggers from ${action.cardName}`}
          title={`Always yield to ${action.cardName}`}
          aria-expanded={open}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => event.stopPropagation()}
        >
          <SkipForward size={15} aria-hidden="true" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="fab-opponent-trigger-yield__popover"
          side="left"
          align="center"
          sideOffset={8}
          collisionPadding={12}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => event.stopPropagation()}
        >
          <strong>{action.cardName}</strong>
          <span>
            Pass this priority window and future windows when this opponent trigger is on top.
          </span>
          <div className="fab-opponent-trigger-yield__actions">
            <Popover.Close asChild>
              <button type="button">Cancel</button>
            </Popover.Close>
            <button
              type="button"
              data-testid="fab-opponent-trigger-yield-confirm"
              onClick={() => {
                action.onConfirm();
                setOpen(false);
              }}
            >
              Always yield
            </button>
          </div>
          <Popover.Arrow className="fab-opponent-trigger-yield__arrow" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
