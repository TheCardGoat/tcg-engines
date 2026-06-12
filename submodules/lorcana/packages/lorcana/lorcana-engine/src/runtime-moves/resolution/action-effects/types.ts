import type { CardInstanceId, MoveExecutionContext, MoveInput } from "#core";
import type { Amount, LorcanaCard } from "@tcg/lorcana-types";
import type {
  LorcanaG,
  PendingActionEffect,
  PendingActionEffectContinuation,
  ReplacementTriggerContext,
} from "../../../types";
import type { DynamicAmountEventSnapshot } from "../../../types/domain-events";
import type { PlayerId } from "#core";
import type { TargetSelectionInput } from "../../../targeting/runtime";
import type { SlottedTargetInput } from "../../../targeting/slotted-targets";

type PlayCardExecutionContext = Pick<
  MoveExecutionContext<MoveInput<unknown>>,
  "G" | "playerId" | "query" | "framework" | "cards"
>;

type ActionResolutionInput = {
  targets?: TargetSelectionInput;
  /**
   * Structured selections for multi-slot effects (move-damage, shift-and-choose,
   * banish-and-play, etc.). When set, slot-aware resolvers read from this field
   * directly instead of relying on positional `targets` ordering. `targets` is
   * still populated (flattened from slots) for generic consumers that only need
   * an id list. See `targeting/slotted-targets.ts`.
   */
  slottedTargets?: SlottedTargetInput;
  currentTargets?: TargetSelectionInput;
  contextTargets?: TargetSelectionInput;
  targetSelectionResolved?: boolean;
  amount?: Amount;
  namedCard?: string;
  resolveOptional?: boolean;
  enterPlayExerted?: boolean;
  choiceIndex?: number;
  preventAutoResolveTriggeredEffects?: boolean;
  destinations?: { zone: string; cards: CardInstanceId | CardInstanceId[] }[];
  eventSnapshot?: DynamicAmountEventSnapshot;
  triggerContext?: ReplacementTriggerContext;
  /**
   * The id of the player whose choice is currently being resolved when the
   * effect was reached through an `optional` whose `chooser` was not the
   * controller (e.g. OPPONENT chooser on Chernabog — Unnatural Force's
   * nested "play from discard for free"). Inner resolvers that default a
   * source/destination player to `cardPlayed.playerId` should prefer this
   * id when set. Effects with an explicit `target: "OPPONENT" / "SELF"`
   * etc. must continue to resolve relative to the original controller.
   */
  chooserPlayerId?: PlayerId;
};

export type { ActionResolutionInput, PlayCardExecutionContext };

export type { CardPlayedPayload } from "../../../types";

type ResolvedActionEffect = {
  status: "resolved";
};

type SuspendedActionEffect = {
  status: "suspended";
  pendingEffect: PendingActionEffect;
};

type ActionResolutionResult = ResolvedActionEffect | SuspendedActionEffect;

type ActionEffectResolutionOptions = {
  allowPromptForExistingChosenTargets?: boolean;
  continuation?: PendingActionEffectContinuation;
  sourceAbilityIndex?: number;
  /**
   * Activated abilities keep a pending target-selection shell even when no
   * candidates exist yet (validation / explicit bad-target rejection).
   * Bag and on-play resolution omit this so mandatory triggers fizzle instead.
   */
  allowSuspendWithZeroTargetCandidates?: boolean;
};

export type {
  ActionEffectResolutionOptions,
  ActionResolutionResult,
  PendingActionEffectContinuation,
};
