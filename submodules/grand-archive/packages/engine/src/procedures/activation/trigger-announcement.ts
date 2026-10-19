import type { GrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState, GrandArchivePendingTrigger } from "../../game/model.ts";
import type { GrandArchiveTargetId } from "../../game/identity.ts";
import {
  collectGrandArchiveModeTargets,
  declareGrandArchiveModes,
  declareGrandArchiveTargetsWithRandom,
  grandArchiveTargetingContext,
  grandArchiveTriggerAnnouncementContext,
  validateGrandArchiveChosenVariables,
} from "./activation.ts";

export interface GrandArchiveTriggerAnnouncement {
  readonly modeIds?: readonly string[];
  readonly targets?: Readonly<Record<string, readonly GrandArchiveTargetId[]>>;
  readonly variables?: Readonly<Partial<Record<"X" | "Y" | "Z", number>>>;
}

/** Pure declaration validation shared by previews and the committing decision handler. */
export function declareGrandArchiveTriggerAnnouncement(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  pending: GrandArchivePendingTrigger,
  announcement: GrandArchiveTriggerAnnouncement,
) {
  const { evaluation, sourceSubtypes, modeDeclaration, cascade, cascadeModes } =
    grandArchiveTriggerAnnouncementContext(program, state, pending, announcement.variables);
  if (cascade && (announcement.modeIds?.length ?? 0) > 0) {
    throw new Error("A Cascade mode is selected automatically and cannot be declared");
  }
  const modes = declareGrandArchiveModes(modeDeclaration, announcement.modeIds, evaluation);
  const chosen = new Set(
    [
      ...(pending.ability.variables ?? []),
      ...modes.modes.flatMap((mode) => mode.variables ?? []),
    ].flatMap((variable) => (variable.kind === "chosen" ? [variable.symbol] : [])),
  );
  for (const symbol of ["X", "Y", "Z"] as const) {
    const value = announcement.variables?.[symbol];
    if (value !== undefined && !chosen.has(symbol) && value !== pending.variables[symbol]) {
      throw new Error(`Variable ${symbol} is not a chosen variable of this triggered ability`);
    }
  }
  validateGrandArchiveChosenVariables(pending.ability.variables, modes.modes, evaluation);
  const selectedModes = [...cascadeModes, ...modes.modes];
  const declaration = declareGrandArchiveTargetsWithRandom(
    collectGrandArchiveModeTargets(cascade ? undefined : pending.ability.targets, selectedModes),
    announcement.targets,
    {
      ...evaluation,
      ...(modes.random ? { state: { ...state, random: modes.random } } : {}),
      targeting: grandArchiveTargetingContext(
        "triggered-ability",
        sourceSubtypes,
        [pending.ability.effect, ...selectedModes.map((mode) => mode.effect)],
        "resolutionAs" in pending.ability && pending.ability.resolutionAs === "spell",
      ),
    },
  );
  return {
    modes,
    targets: declaration.targets,
    random: declaration.random ?? modes.random,
    variables: { ...pending.variables, ...announcement.variables },
  };
}
