import { useCallback, useMemo, useState } from "react";
import { Board, InteractionPanel } from "@tcg/simulator-ui";

import {
  useGundamSimulatorSnapshot,
  useSubmitGundamSimulatorInteraction,
} from "../game/simulator-snapshot.ts";
import { SetupPromptContainer } from "./containers/index.ts";
import { SubmitErrorToast } from "./ui/SubmitErrorToast.tsx";
import { VsAiControls } from "./ui/VsAiControls.tsx";

type InteractionSelection = Parameters<ReturnType<typeof useSubmitGundamSimulatorInteraction>>[1];

const EMPTY_SELECTION: InteractionSelection = {
  entityIds: [],
  optionIds: [],
  orderedIds: [],
  paymentIds: [],
};

export function GundamSimulatorShell() {
  const snapshot = useGundamSimulatorSnapshot();
  const submitInteraction = useSubmitGundamSimulatorInteraction();
  const [actionsOpen, setActionsOpen] = useState(false);
  const primaryAction = useMemo(
    () =>
      snapshot.interactions.find(
        (interaction) =>
          interaction.input.kind === "action" &&
          /^(pass|cancel|confirm|submit)/i.test(interaction.label),
      ),
    [snapshot.interactions],
  );

  const submitEntityInteraction = useCallback(
    (entityId: string) => {
      const interaction = snapshot.interactions.find((candidate) =>
        candidate.input.candidateEntityIds.includes(entityId),
      );
      const sourceInteraction =
        interaction ??
        snapshot.interactions.find((candidate) => candidate.sourceEntityId === entityId);
      if (!sourceInteraction) return;

      const selection: InteractionSelection = {
        ...EMPTY_SELECTION,
        entityIds:
          sourceInteraction.input.kind === "single-target" ||
          sourceInteraction.input.kind === "multi-target" ||
          sourceInteraction.input.kind === "drag-drop-target"
            ? [entityId]
            : [],
        orderedIds: sourceInteraction.input.kind === "ordering" ? [entityId] : [],
        paymentIds: sourceInteraction.input.kind === "payment" ? [entityId] : [],
      };
      submitInteraction(
        sourceInteraction.id,
        interaction ? selection : { ...EMPTY_SELECTION, entityIds: [entityId] },
      );
    },
    [snapshot.interactions, submitInteraction],
  );

  const handleBoardClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const entityElement = target.closest<HTMLElement>("[data-entity-id]");
      const entityId = entityElement?.dataset.entityId;
      if (!entityId) return;
      submitEntityInteraction(entityId);
    },
    [submitEntityInteraction],
  );

  const eventLog = snapshot.eventLog ?? [];
  const prettySeatLabel = (seatId: string | undefined) => {
    const seat = snapshot.table.seats.find((candidate) => candidate.id === seatId);
    if (seat?.perspective === "bottom") return "You";
    if (seat?.perspective === "top") return "Opponent";
    return seat?.label ?? seatId ?? "System";
  };
  const prettyMessage = (message: string) =>
    snapshot.table.seats.reduce(
      (current, seat) => current.split(seat.id).join(prettySeatLabel(seat.id)),
      message,
    );

  return (
    <main
      className="simulator-shell relative min-h-svh w-full overflow-x-hidden bg-[var(--surface-soft)] text-[var(--text)]"
      data-game="gundam"
      data-theme="light"
      data-testid="gundam-shared-simulator-shell"
    >
      <div data-sim-board onClick={handleBoardClick}>
        <Board table={snapshot.table} entities={snapshot.entities} layout={snapshot.boardLayout} />
      </div>
      {primaryAction && (
        <button
          type="button"
          className="absolute right-4 top-4 z-20 rounded-md bg-[var(--game-accent)] px-4 py-2 text-sm font-black text-white shadow-[var(--shadow)]"
          data-testid="primary-action"
          onClick={() => submitInteraction(primaryAction.id, EMPTY_SELECTION)}
        >
          {primaryAction.label}
        </button>
      )}
      {snapshot.interactions.length > 0 && (
        <div className="absolute bottom-4 right-4 z-20 max-h-[min(520px,calc(100svh-2rem))] w-[min(420px,calc(100vw-2rem))] overflow-auto rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
          <button
            type="button"
            aria-label="Open match panel"
            className="w-full cursor-pointer select-none rounded-md px-3 py-2 text-left text-sm font-black text-[var(--text)]"
            onClick={() => setActionsOpen((open) => !open)}
          >
            Actions / Log
          </button>
          {actionsOpen && (
            <div className="grid gap-3 p-2 pt-0">
              <VsAiControls />
              <InteractionPanel fixture={snapshot} onSubmitInteraction={submitInteraction} />
              <section
                aria-label="Comms log"
                className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-3"
                role="log"
              >
                {eventLog.length > 0 ? (
                  <ol className="grid gap-2">
                    {eventLog.map((entry) => (
                      <li key={entry.id} className="text-sm leading-snug text-[var(--muted)]">
                        {entry.seatId && (
                          <>
                            <span className="font-black text-[var(--text)]">
                              {prettySeatLabel(entry.seatId)}
                            </span>{" "}
                          </>
                        )}
                        {prettyMessage(entry.message)}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-sm text-[var(--muted)]">No events yet.</p>
                )}
              </section>
            </div>
          )}
        </div>
      )}
      <SetupPromptContainer />
      <SubmitErrorToast />
    </main>
  );
}
