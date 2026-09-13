import { proposeGrandArchiveAttackDeclaration } from "../../combat/combat.ts";
import type {
  GrandArchiveCommandFailure,
  GrandArchiveCommandSuccess,
  GrandArchiveCommandTransition,
} from "../../../kernel/command-results.ts";
import type { GrandArchiveCommandFor } from "../../../commands/command-router.ts";
import type { GrandArchiveCommandHandlerContext } from "../../../commands/handler-context.ts";
import type { GrandArchiveProposedEvent } from "../../../kernel/events.ts";
import { GrandArchiveUnsupportedRuleError } from "../../effects/evaluation.ts";
import type { GrandArchivePlayerId } from "../../../game/identity.ts";
import { GrandArchiveDecisionAnswerCodec } from "../answer-codec.ts";
import type { GrandArchiveDecisionFor, GrandArchiveDecisionResolver } from "../types.ts";

class GrandArchiveCombatDeclarationDecisionHandler {
  public constructor(private readonly context: GrandArchiveCommandHandlerContext) {}

  get #program() {
    return this.context.getProgram();
  }

  get #state() {
    return this.context.getState();
  }

  get #answers(): GrandArchiveDecisionAnswerCodec {
    return new GrandArchiveDecisionAnswerCodec(this.context);
  }

  #commit(events: readonly GrandArchiveProposedEvent[]): GrandArchiveCommandSuccess {
    return this.context.commit(events);
  }

  #failure(code: GrandArchiveCommandFailure["code"], message: string): GrandArchiveCommandFailure {
    return this.context.failure(code, message);
  }

  #activationFailure(error: unknown): GrandArchiveCommandFailure {
    if (error instanceof GrandArchiveUnsupportedRuleError) {
      return this.#failure("not-implemented", error.message);
    }
    if (error instanceof Error) return this.#failure("illegal-command", error.message);
    throw error;
  }

  public resolveDeclaredAttack(
    decision: GrandArchiveDecisionFor<"declare-resolved-attack">,
    command: GrandArchiveCommandFor<"answer-decision">,
    playerId: GrandArchivePlayerId,
  ): GrandArchiveCommandTransition {
    const answer = command.answer;
    if (typeof answer !== "object" || answer === null || Array.isArray(answer)) {
      return this.#failure("illegal-command", "Attack declaration answer must be an object");
    }
    const submittedTargetIds = "targetIds" in answer ? answer.targetIds : undefined;
    const keys = Object.keys(answer);
    if (
      keys.some(
        (key) =>
          key !== "attackerId" &&
          key !== "targetIds" &&
          key !== "weaponIds" &&
          key !== "delegatePlayerId" &&
          key !== "cleavePlayerId" &&
          key !== "reservePayment" &&
          key !== "costSelections" &&
          key !== "costPaymentOrders" &&
          key !== "costOptionIndex" &&
          key !== "payOptionalCost",
      ) ||
      !("attackerId" in answer) ||
      submittedTargetIds === undefined ||
      typeof answer.attackerId !== "string" ||
      !Array.isArray(submittedTargetIds) ||
      submittedTargetIds.some((value) => typeof value !== "string") ||
      ("cleavePlayerId" in answer &&
        answer.cleavePlayerId !== undefined &&
        typeof answer.cleavePlayerId !== "string") ||
      ("delegatePlayerId" in answer &&
        answer.delegatePlayerId !== undefined &&
        typeof answer.delegatePlayerId !== "string") ||
      ("weaponIds" in answer &&
        answer.weaponIds !== undefined &&
        (!Array.isArray(answer.weaponIds) ||
          answer.weaponIds.some((value) => typeof value !== "string")))
    ) {
      return this.#failure("illegal-command", "Attack declaration answer is malformed");
    }
    const attackerId = decision.attackerCandidates.find(
      (candidate) => candidate === answer.attackerId,
    );
    const targetIds = decision.targetCandidates.filter((candidate) =>
      submittedTargetIds.includes(candidate),
    );
    const cleavePlayerId =
      "cleavePlayerId" in answer && typeof answer.cleavePlayerId === "string"
        ? decision.cleavePlayerCandidates.find((candidate) => candidate === answer.cleavePlayerId)
        : undefined;
    const delegatePlayerId =
      "delegatePlayerId" in answer && typeof answer.delegatePlayerId === "string"
        ? decision.cleavePlayerCandidates.find((candidate) => candidate === answer.delegatePlayerId)
        : undefined;
    const submittedWeaponIds =
      "weaponIds" in answer && Array.isArray(answer.weaponIds) ? answer.weaponIds : [];
    const weaponIds = decision.weaponCandidates.filter((candidate) =>
      submittedWeaponIds.includes(candidate),
    );
    const paymentAnswer: Record<string, unknown> = {};
    if ("reservePayment" in answer) paymentAnswer.reservePayment = answer.reservePayment;
    if ("costSelections" in answer) paymentAnswer.costSelections = answer.costSelections;
    if ("costPaymentOrders" in answer) {
      paymentAnswer.costPaymentOrders = answer.costPaymentOrders;
    }
    if ("costOptionIndex" in answer) paymentAnswer.costOptionIndex = answer.costOptionIndex;
    if ("payOptionalCost" in answer) paymentAnswer.payOptionalCost = answer.payOptionalCost;
    const payment = this.#answers.parseCostPaymentAnswer(paymentAnswer);
    if (
      !attackerId ||
      new Set(submittedTargetIds).size !== submittedTargetIds.length ||
      targetIds.length !== submittedTargetIds.length ||
      ("cleavePlayerId" in answer && answer.cleavePlayerId !== undefined && !cleavePlayerId) ||
      ("delegatePlayerId" in answer &&
        answer.delegatePlayerId !== undefined &&
        !delegatePlayerId) ||
      new Set(submittedWeaponIds).size !== submittedWeaponIds.length ||
      weaponIds.length !== submittedWeaponIds.length ||
      !payment
    ) {
      return this.#failure("illegal-command", "Attack declaration contains an invalid choice");
    }
    try {
      return this.#commit([
        {
          type: "decision-cleared",
          decisionId: decision.id,
          actorId: playerId,
          cause: { kind: "command", move: "answer-decision" },
        },
        ...proposeGrandArchiveAttackDeclaration(
          this.#program,
          this.#state,
          playerId,
          {
            move: "declare-attack",
            attackerId,
            targetIds,
            ...(delegatePlayerId ? { delegatePlayerId } : {}),
            ...(cleavePlayerId ? { cleavePlayerId } : {}),
            attackCardId: decision.intentId,
            weaponIds,
            ...payment,
          },
          { resolvedAttack: true },
        ),
      ]);
    } catch (error) {
      return this.#activationFailure(error);
    }
  }

  public resolveDelegatedDefender(
    decision: GrandArchiveDecisionFor<"choose-delegated-defender">,
    command: GrandArchiveCommandFor<"answer-decision">,
    playerId: GrandArchivePlayerId,
  ): GrandArchiveCommandTransition {
    if (
      typeof command.answer !== "string" ||
      !decision.candidateIds.some((candidate) => candidate === command.answer)
    ) {
      return this.#failure(
        "illegal-command",
        "Delegated defender answer must be a legal candidate id",
      );
    }
    const defenderId = decision.candidateIds.find((candidate) => candidate === command.answer);
    if (!defenderId) {
      return this.#failure("illegal-command", "Delegated defender is no longer legal");
    }
    try {
      return this.#commit([
        {
          type: "decision-cleared",
          decisionId: decision.id,
          actorId: playerId,
          cause: { kind: "command", move: "answer-decision" },
        },
        ...proposeGrandArchiveAttackDeclaration(
          this.#program,
          this.#state,
          decision.attackingPlayerId,
          {
            move: "declare-attack",
            attackerId: decision.attackerId,
            targetIds: [defenderId, ...decision.additionalTargetIds],
            ...(decision.attackCardId ? { attackCardId: decision.attackCardId } : {}),
            weaponIds: decision.weaponIds,
            ...(decision.reservePayment ? { reservePayment: decision.reservePayment } : {}),
            ...(decision.costSelections ? { costSelections: decision.costSelections } : {}),
            ...(decision.costPaymentOrders
              ? { costPaymentOrders: decision.costPaymentOrders }
              : {}),
            ...(decision.costOptionIndex !== undefined
              ? { costOptionIndex: decision.costOptionIndex }
              : {}),
            ...(decision.payOptionalCost !== undefined
              ? { payOptionalCost: decision.payOptionalCost }
              : {}),
          },
          {
            ...(decision.resolvedAttack ? { resolvedAttack: true as const } : {}),
            delegationResolved: true,
          },
        ),
      ]);
    } catch (error) {
      return this.#activationFailure(error);
    }
  }
}

export const resolveGrandArchiveDeclaredAttackDecision: GrandArchiveDecisionResolver<
  "declare-resolved-attack"
> = ({ match, decision, command, playerId }) =>
  new GrandArchiveCombatDeclarationDecisionHandler(match).resolveDeclaredAttack(
    decision,
    command,
    playerId,
  );

export const resolveGrandArchiveDelegatedDefenderDecision: GrandArchiveDecisionResolver<
  "choose-delegated-defender"
> = ({ match, decision, command, playerId }) =>
  new GrandArchiveCombatDeclarationDecisionHandler(match).resolveDelegatedDefender(
    decision,
    command,
    playerId,
  );

export const grandArchiveCombatDeclarationDecisionResolvers = {
  "declare-resolved-attack": resolveGrandArchiveDeclaredAttackDecision,
  "choose-delegated-defender": resolveGrandArchiveDelegatedDefenderDecision,
} satisfies {
  readonly [Kind in
    | "declare-resolved-attack"
    | "choose-delegated-defender"]: GrandArchiveDecisionResolver<Kind>;
};
