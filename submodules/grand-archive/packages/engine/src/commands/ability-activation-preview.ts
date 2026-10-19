import {
  previewGrandArchiveAbilityCost,
  type GrandArchiveCostPreviewStep,
} from "../procedures/activation/costs.ts";
import type { GrandArchiveMatchProgram } from "../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../game/model.ts";
import type { GrandArchivePlayerId } from "../game/identity.ts";
import type { GrandArchiveCommand } from "./commands.ts";
import { listGrandArchiveLegalMoves } from "./legal-commands.ts";
import { GrandArchiveMatchRuntime } from "../procedures/game-flow/runtime.ts";
import { grandArchiveObjectCurrentCharacteristics } from "../rules/state/continuous.ts";
import { grandArchiveMasterySourceSubtypes } from "../game/mastery.ts";
import { grandArchiveActiveMasteryAbilities, grandArchivePlayerMastery } from "../game/mastery.ts";
import { grandArchiveObjectActiveAbilities } from "../rules/abilities/intrinsic-keywords.ts";
import { projectGrandArchiveViewerState } from "../projection/view.ts";
import { GrandArchiveUnsupportedRuleError } from "../procedures/effects/evaluation.ts";
import {
  collectGrandArchiveModeTargets,
  assertGrandArchiveAbilityActivationAuthority,
  declareGrandArchiveModes,
  getGrandArchiveAnnouncementModes,
  grandArchiveAbilityActivationCascade,
  grandArchiveAbilityActivationEvaluation,
  grandArchiveTargetingContext,
  resolveGrandArchiveAbilityActivationSource,
  prepareGrandArchiveAbilityActivationPayment,
  validateGrandArchiveChosenVariables,
} from "../procedures/activation/activation.ts";
import {
  previewGrandArchiveAnnouncement,
  type GrandArchiveAnnouncementPreviewStep,
} from "./announcement-preview.ts";

type AbilityCommand = Extract<GrandArchiveCommand, { readonly move: "activate-ability" }>;
export interface GrandArchiveAbilityActivationOrigin {
  readonly command: AbilityCommand;
  readonly label: string;
  readonly stateVersion: number;
}

function visibleSourceIds(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
) {
  const viewer = projectGrandArchiveViewerState(program, state, playerId);
  return new Set(
    viewer.players.flatMap((player) =>
      Object.values(player.zones).flatMap((zone) =>
        (zone.visibility === "visible" ? zone.objects : zone.revealedObjects).map(
          (object) => object.id,
        ),
      ),
    ),
  );
}

/** Complete viewer-visible live source inventory, not proven payable activations.
 * A caller must obtain a ready preview before submitting a declaration. */
export function listGrandArchiveAbilityActivationOrigins(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
): readonly GrandArchiveAbilityActivationOrigin[] {
  if (!listGrandArchiveLegalMoves(state, playerId).includes("activate-ability")) return [];
  const candidates: GrandArchiveAbilityActivationOrigin[] = [];
  const visible = visibleSourceIds(program, state, playerId);
  const mastery = grandArchivePlayerMastery(state, playerId);
  if (mastery)
    for (const ability of grandArchiveActiveMasteryAbilities(program, state, playerId)) {
      if (ability.kind === "activated")
        candidates.push({
          command: { move: "activate-ability", masteryName: mastery.name, abilityId: ability.id },
          label: `Activate ${mastery.name} — ${ability.text}`,
          stateVersion: state.stateVersion,
        });
    }
  for (const source of Object.values(state.objects)) {
    const identity: AbilityCommand = {
      move: "activate-ability",
      sourceId: source.id,
      abilityId: "",
    };
    if (!visible.has(source.id)) continue;
    for (const ability of grandArchiveObjectActiveAbilities(program, state, source)) {
      if (ability.kind !== "activated") continue;
      const command: AbilityCommand = { ...identity, abilityId: ability.id };
      try {
        resolveGrandArchiveAbilityActivationSource(program, state, playerId, command);
      } catch (failure) {
        if (failure instanceof Error && failure.constructor === Error) continue;
        throw failure;
      }
      candidates.push({
        command,
        label: `Activate ${grandArchiveObjectCurrentCharacteristics(program, state, source).names.join(" / ")} — ${ability.text}`,
        stateVersion: state.stateVersion,
      });
    }
  }
  return candidates;
}
interface PreviewBase {
  readonly stateVersion: number;
  readonly steps: readonly GrandArchiveAnnouncementPreviewStep[];
  readonly ignoredInputIds: readonly string[];
  readonly paymentSteps: readonly GrandArchiveCostPreviewStep[];
}
export type GrandArchiveAbilityActivationPreview = PreviewBase &
  (
    | { readonly status: "incomplete" | "invalid"; readonly message?: string }
    | { readonly status: "unavailable"; readonly message: string }
    | { readonly status: "ready"; readonly command: AbilityCommand }
  );

/** Native partial declarations do not depend on finding a complete command for a bot.
 * Announcement choices precede a sequential native payment form. A ready command
 * still requires canonical runtime validation of all declarations and costs. */
export function previewGrandArchiveAbilityActivation(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  request: {
    readonly playerId: GrandArchivePlayerId;
    readonly expectedStateVersion: number;
    readonly command: AbilityCommand;
  },
): GrandArchiveAbilityActivationPreview {
  const base: PreviewBase = {
    stateVersion: state.stateVersion,
    steps: [],
    ignoredInputIds: [],
    paymentSteps: [],
  };
  const unavailable = (message: string): GrandArchiveAbilityActivationPreview => ({
    ...base,
    status: "unavailable",
    message,
  });
  if (request.expectedStateVersion !== state.stateVersion)
    return unavailable("The match changed; refresh the activation");
  if (!listGrandArchiveLegalMoves(state, request.playerId).includes("activate-ability"))
    return unavailable("This player cannot begin an ability activation now");
  // Do not inspect an opponent's nonpublic source, even if a caller guesses its id.
  if (
    request.command.sourceId &&
    !visibleSourceIds(program, state, request.playerId).has(request.command.sourceId)
  )
    return unavailable("This ability source is not available to this player");
  try {
    const resolved = resolveGrandArchiveAbilityActivationSource(
      program,
      state,
      request.playerId,
      request.command,
    );
    const { ability, source } = resolved;
    assertGrandArchiveAbilityActivationAuthority(
      program,
      resolved.state,
      request.playerId,
      ability,
      grandArchiveAbilityActivationEvaluation(
        program,
        resolved.state,
        request.playerId,
        resolved.command,
        ability,
        source,
      ),
    );
    if (ability.cascade && ability.cascade.advanceOn !== "activation")
      return unavailable("Activated Cascade must advance on activation");
    const evaluate = (variables: AbilityCommand["variables"]) =>
      grandArchiveAbilityActivationEvaluation(
        program,
        resolved.state,
        request.playerId,
        { ...resolved.command, variables },
        ability,
        source,
      ).evaluation;
    const { cascadeModes } = grandArchiveAbilityActivationCascade(
      resolved.state,
      request.playerId,
      ability,
      source,
    );
    const modesFor = (evaluation: ReturnType<typeof evaluate>) =>
      ability.cascade
        ? undefined
        : getGrandArchiveAnnouncementModes(ability.modes, ability.effect, evaluation);
    const preview = previewGrandArchiveAnnouncement({
      state: resolved.state,
      draft: request.command,
      variables: ability.variables ?? [],
      evaluate,
      context: (variables) => {
        const evaluation = evaluate(variables);
        return { evaluation, modeDeclaration: modesFor(evaluation), automaticModes: cascadeModes };
      },
      targets: (modes, evaluation) => ({
        declarations: collectGrandArchiveModeTargets(ability.targets, modes),
        evaluation: {
          ...evaluation,
          targeting: grandArchiveTargetingContext(
            "activated-ability",
            source.kind === "object"
              ? grandArchiveObjectCurrentCharacteristics(program, resolved.state, source.object)
                  .subtypes
              : grandArchiveMasterySourceSubtypes(program, { name: source.mastery.name }),
            [ability.effect, ...modes.map((mode) => mode.effect)],
          ),
        },
      }),
      validate: (declaration) => {
        const evaluation = evaluate(declaration.variables);
        const selected = declareGrandArchiveModes(
          modesFor(evaluation),
          declaration.modeIds,
          evaluation,
        );
        validateGrandArchiveChosenVariables(
          ability.variables,
          [...cascadeModes, ...selected.modes],
          evaluation,
        );
      },
    });
    if (preview.status !== "ready") return { ...base, ...preview };
    const {
      variables: _variables,
      modeIds: _modeIds,
      targets: _targets,
      ...identityAndPayment
    } = request.command;
    const command: AbilityCommand = { ...identityAndPayment, ...preview.declaration };
    if ((command.paymentContributions?.length ?? 0) > 0)
      return unavailable("Payment contribution previews require their own declaration context");
    const prepared = prepareGrandArchiveAbilityActivationPayment(
      program,
      resolved.state,
      request.playerId,
      resolved.command.sourceId
        ? { ...command, sourceId: resolved.command.sourceId, masteryName: undefined }
        : command,
      ability,
      source,
    );
    const payment = previewGrandArchiveAbilityCost(
      prepared.totalAbilityCost,
      command,
      prepared.paymentEvaluation,
      visibleSourceIds(program, resolved.state, request.playerId),
    );
    const described = {
      ...base,
      steps: preview.steps,
      ignoredInputIds: preview.ignoredInputIds,
      paymentSteps: payment.steps,
    };
    if (payment.status === "unavailable")
      return {
        ...described,
        status: "unavailable",
        message: payment.message ?? "Payment preview unavailable",
      };
    if (payment.status !== "ready")
      return {
        ...described,
        status: payment.status,
        ...(payment.message ? { message: payment.message } : {}),
      };
    // Probe the original state and identity: source preparation must happen exactly
    // once on commit, including Lineage Release's tentative base separation.
    const result = new GrandArchiveMatchRuntime(program, state).probe(command, {
      playerId: request.playerId,
      expectedStateVersion: state.stateVersion,
    });
    if (!result.ok) return { ...described, status: "invalid", message: result.message };
    return { ...described, status: "ready", command };
  } catch (failure) {
    if (failure instanceof GrandArchiveUnsupportedRuleError) return unavailable(failure.message);
    if (failure instanceof Error && failure.constructor === Error)
      return unavailable(failure.message);
    throw failure;
  }
}
