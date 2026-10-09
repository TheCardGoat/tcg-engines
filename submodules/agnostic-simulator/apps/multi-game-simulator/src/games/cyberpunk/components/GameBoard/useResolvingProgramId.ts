import { useEngineOptional } from "../../engine";
import { useMoveSelection } from "./MoveSelectionContext";

export function useResolvingProgramId(): string | undefined {
  const engine = useEngineOptional();
  const moveSelection = useMoveSelection();
  const resolvingProgramId = engine
    ? (resolvingProgramIdFromPrompt(engine.prompts.player.choice) ??
      resolvingProgramIdFromPrompt(engine.prompts.opponent.choice) ??
      (moveSelection.selection?.moveId === "playCard" &&
      moveSelection.selection.sourceCardType === "program"
        ? moveSelection.selection.sourceCardId
        : undefined))
    : undefined;
  return resolvingProgramId;
}

function resolvingProgramIdFromPrompt(
  choice: NonNullable<ReturnType<typeof useEngineOptional>>["prompts"]["player"]["choice"],
): string | undefined {
  if (
    choice?.type === "chooseTarget" &&
    choice.payload.type === "effectTarget" &&
    choice.payload.source?.cardId
  ) {
    return choice.payload.source.cardId;
  }
  return undefined;
}
