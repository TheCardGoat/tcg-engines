import * as Popover from "@radix-ui/react-popover";
import { Layers3, X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { FabCombatStackEntryView } from "./combatChainView";
import { FabBoardCardFace } from "./FabBoardCardFace";
import { useFabCardPreview } from "./FabCardPreview";
import "./FabMobileStackPopover.css";
import {
  FabOpponentTriggerYieldControl,
  type FabOpponentTriggerYieldAction,
} from "./FabOpponentTriggerYield";

export function FabMobileStackPopover({
  stack,
  viewerId,
  opponentYieldAction,
}: {
  stack: readonly FabCombatStackEntryView[];
  viewerId: string;
  opponentYieldAction?: FabOpponentTriggerYieldAction;
}) {
  const { pin, hide, clearHover } = useFabCardPreview();
  const inspectedId = useRef<string | null>(null);
  const hidePreviewRef = useRef(hide);
  hidePreviewRef.current = hide;
  useEffect(
    () => () => {
      if (inspectedId.current) hidePreviewRef.current();
    },
    [],
  );
  useEffect(() => {
    if (inspectedId.current && !stack.some((entry) => entry.entity.id === inspectedId.current)) {
      const staleId = inspectedId.current;
      inspectedId.current = null;
      clearHover(staleId);
    }
  }, [clearHover, stack]);

  if (stack.length === 0) return null;

  return (
    <Popover.Root
      onOpenChange={(open) => {
        if (!open && inspectedId.current) {
          inspectedId.current = null;
          hide();
        }
      }}
    >
      <Popover.Trigger asChild>
        <button
          type="button"
          className="fab-mobile-stack-trigger"
          aria-label={`Open stack, ${stack.length} pending ${stack.length === 1 ? "effect" : "effects"}`}
        >
          <Layers3 size={16} aria-hidden="true" />
          <span>Stack</span>
          <strong>{stack.length}</strong>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="fab-mobile-stack-popover"
          side="bottom"
          align="start"
          sideOffset={6}
          collisionPadding={8}
          aria-label="Stack"
          onInteractOutside={(event) => {
            if (event.target instanceof Element && event.target.closest(".fab-card-preview")) {
              event.preventDefault();
            }
          }}
        >
          <header>
            <div>
              <strong>Stack · {stack.length}</strong>
              <span>Top effect resolves next</span>
            </div>
            <Popover.Close asChild>
              <button type="button" aria-label="Close stack">
                <X size={18} aria-hidden="true" />
              </button>
            </Popover.Close>
          </header>
          <ol aria-label="Pending effects, next to last">
            {stack.map((entry) => {
              const owner = entry.entity.ownerId === viewerId ? "You" : "Opponent";
              return (
                <li
                  key={entry.entity.id}
                  data-resolves-next={entry.order === 1 ? "true" : undefined}
                >
                  <button
                    type="button"
                    className="fab-mobile-stack-entry"
                    aria-label={`Inspect stack layer ${entry.order}: ${entry.entity.title}, ${owner}, ${entry.order === 1 ? "resolves next" : `resolves after layer ${entry.order - 1}`}`}
                    onClick={() => {
                      inspectedId.current = entry.entity.id;
                      pin(entry.entity);
                    }}
                  >
                    <span className="fab-mobile-stack-art" aria-hidden="true">
                      <FabBoardCardFace
                        entity={entry.entity}
                        density="mini"
                        fill
                        frameBadges="hide"
                        preview={false}
                      />
                    </span>
                    <span className="fab-mobile-stack-copy">
                      <small>
                        {entry.order === 1 ? "Resolves next" : `Then ${entry.order}`} · {owner}
                      </small>
                      <strong>{entry.entity.title}</strong>
                    </span>
                  </button>
                  {entry.order === 1 &&
                  opponentYieldAction?.sourceInstanceId ===
                    (entry.sourceInstanceId ?? entry.entity.id) ? (
                    <FabOpponentTriggerYieldControl action={opponentYieldAction} />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
