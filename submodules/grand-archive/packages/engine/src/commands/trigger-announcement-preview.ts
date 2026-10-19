import type { GrandArchiveMatchProgram } from "../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../game/model.ts";
import type { GrandArchivePlayerId } from "../game/identity.ts";
import type { GrandArchiveCommand } from "./commands.ts";
import {
  collectGrandArchiveModeTargets,
  grandArchiveTargetingContext,
  grandArchiveTriggerAnnouncementContext,
  grandArchiveTriggerAnnouncementEvaluation,
} from "../procedures/activation/activation.ts";
import {
  declareGrandArchiveTriggerAnnouncement,
  type GrandArchiveTriggerAnnouncement,
} from "../procedures/activation/trigger-announcement.ts";
import {
  previewGrandArchiveAnnouncement,
  type GrandArchiveAnnouncementPreviewStep,
} from "./announcement-preview.ts";
export type GrandArchiveTriggerPreviewStep = GrandArchiveAnnouncementPreviewStep;
interface PreviewBase {
  readonly decisionId: string;
  readonly stateVersion: number;
  readonly steps: readonly GrandArchiveTriggerPreviewStep[];
  /** Values from an earlier mode/branch that are not part of the normalized command. */
  readonly ignoredInputIds: readonly string[];
}
export type GrandArchiveTriggerAnnouncementPreview = PreviewBase &
  (
    | { readonly status: "incomplete" | "invalid"; readonly message?: string }
    | { readonly status: "unavailable"; readonly message: string }
    | {
        readonly status: "ready";
        readonly command: Omit<
          Extract<GrandArchiveCommand, { readonly move: "answer-decision" }>,
          "answer"
        > & { readonly answer: GrandArchiveTriggerAnnouncement };
      }
  );

/** Describes a partial announcement without probing combinations or changing the match.
 * Random results are deliberately never sampled or disclosed by a draft preview.
 * The returned command contains only declarations active in the selected branch. */
export function previewGrandArchiveTriggerAnnouncement(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  request: {
    readonly playerId: GrandArchivePlayerId;
    readonly decisionId: string;
    readonly expectedStateVersion: number;
    readonly draft: GrandArchiveTriggerAnnouncement;
  },
): GrandArchiveTriggerAnnouncementPreview {
  const steps: GrandArchiveTriggerPreviewStep[] = [];
  const ignoredInputIds: string[] = [];
  const base = {
    decisionId: request.decisionId,
    stateVersion: state.stateVersion,
    steps,
    ignoredInputIds,
  };
  const unavailable = (message: string): GrandArchiveTriggerAnnouncementPreview => ({
    ...base,
    status: "unavailable",
    message,
  });
  if (request.expectedStateVersion !== state.stateVersion)
    return unavailable("The match changed; refresh the declaration");
  const decision = state.decision;
  if (
    decision?.kind !== "announce-triggered-ability" ||
    decision.id !== request.decisionId ||
    decision.playerId !== request.playerId
  )
    return unavailable("This player has no matching trigger announcement");
  const pending = state.pendingTriggers.find((trigger) => trigger.id === decision.pendingTriggerId);
  if (!pending) return unavailable("The pending trigger no longer exists");
  const preview = previewGrandArchiveAnnouncement({
    state,
    draft: request.draft,
    variables: pending.ability.variables ?? [],
    evaluate: (variables) =>
      grandArchiveTriggerAnnouncementEvaluation(program, state, pending, variables),
    context: (variables) => {
      const context = grandArchiveTriggerAnnouncementContext(program, state, pending, variables);
      return { ...context, automaticModes: context.cascadeModes };
    },
    targets: (modes, evaluation) => {
      const context = grandArchiveTriggerAnnouncementContext(
        program,
        state,
        pending,
        evaluation.variables,
      );
      return {
        declarations: collectGrandArchiveModeTargets(
          context.cascade ? undefined : pending.ability.targets,
          modes,
        ),
        evaluation: {
          ...evaluation,
          targeting: grandArchiveTargetingContext(
            "triggered-ability",
            context.sourceSubtypes,
            [pending.ability.effect, ...modes.map((mode) => mode.effect)],
            "resolutionAs" in pending.ability && pending.ability.resolutionAs === "spell",
          ),
        },
      };
    },
    validate: (answer) => {
      declareGrandArchiveTriggerAnnouncement(program, state, pending, answer);
    },
  });
  if (preview.status !== "ready") return { ...base, ...preview };
  return {
    ...base,
    steps: preview.steps,
    ignoredInputIds: preview.ignoredInputIds,
    status: "ready",
    command: {
      move: "answer-decision",
      decisionId: decision.id,
      stateVersion: decision.stateVersion,
      answer: preview.declaration,
    },
  };
}
