/**
 * Fluent Act surface for {@link FabPlayerHandle}.
 *
 *   Bravo.must.pitch(heartOfFyendal).playAttack(snatchRed);
 *   const attack = Bravo.must.playAttack(snatchRed); // FabCardInstanceRef
 *   Dash.must.defend(nimblismBlue);
 *
 * Every verb throws {@link FabMoveFailedError} (raised by the harness exec
 * path) when the underlying production move is rejected. Verbs are pure sugar
 * over the 7 production moves — no rules logic lives here.
 *
 * Option vocabulary follows the decomposed play-option shapes
 * (`play-options.ts`): each verb accepts only the narrow shapes that its
 * production path can meaningfully consume — attack verbs take attack-flow
 * shapes, reaction verbs take modal shapes, arsenal plays take the generic
 * base shape.
 */

import {
  makeFabInstanceRef,
  resolveFabCardRef,
  type FabCardInstanceRef,
  type FabCardRefFilter,
  type FabFluentCardRef,
} from "./card-ref.ts";
import type {
  FabAttackFlowPlayOptions,
  FabBasePlayOptions,
  FabCrankPlayOptions,
  FabModalAssassinPlayOptions,
  FabModalPlayOptions,
  FabPlayOptions,
  FabScrapPlayOptions,
} from "./play-options.ts";
import type { FabPlayerHandle } from "./test-engine.ts";

/** Option shapes accepted by the attack verbs (`playAttack`, `playInstant`). */
export type FabFluentAttackOptions = FabAttackFlowPlayOptions;

/** Option shapes accepted by `playReaction` (modal choice + assassin cost). */
export type FabFluentReactionOptions = FabModalPlayOptions | FabModalAssassinPlayOptions;

/** Option shapes accepted by `playFromArsenal` (generic play options only). */
export type FabFluentArsenalOptions = FabBasePlayOptions | FabScrapPlayOptions;

/** An instance ref returned by a verb, chainable back into the fluent surface. */
export type FabFluentRefResult = FabCardInstanceRef & { readonly and: FabFluentMust };

export interface FabFluentMust {
  /** Play an attack action from hand (`begin-play`). Returns the played card's ref. */
  playAttack(card: FabFluentCardRef, opts?: FabFluentAttackOptions): FabFluentRefResult;
  /** Play a non-attack card from hand (`begin-play`) — items, auras, actions. */
  play(card: FabFluentCardRef, opts?: FabBasePlayOptions | FabCrankPlayOptions): FabFluentRefResult;
  /** Play an instant from hand (`begin-play`). Returns the played card's ref. */
  playInstant(card: FabFluentCardRef, opts?: FabFluentAttackOptions): FabFluentRefResult;
  /** Play an attack/defense reaction with explicit mode selection. */
  playReaction(card: FabFluentCardRef, opts?: FabFluentReactionOptions): FabFluentRefResult;
  /** Play a card from arsenal (`begin-play` with `from: "arsenal"`). */
  playFromArsenal(card: FabFluentCardRef, opts?: FabFluentArsenalOptions): FabFluentRefResult;
  /** Declare defending cards (`defend`). Call with no args to decline blocking. */
  defend(...cards: readonly FabFluentCardRef[]): FabFluentMust;
  /**
   * Stage explicit pitch cards for the next play verb (feeds the existing
   * `FabBasePlayOptions.pitch` payment path — there is no standalone pitch move).
   */
  pitch(...cards: readonly FabFluentCardRef[]): FabFluentMust;
  /** Activate a card's activated ability (`activate`). */
  activate(card: FabFluentCardRef): FabFluentMust;
  /** Pass priority, or declare no defenders while defense declaration is pending. */
  passPriority(): FabFluentMust;
  /** End the turn (`end-turn`). */
  endTurn(): FabFluentMust;
  /** Concede the game (`concede`). */
  concede(): FabFluentMust;
}

/** Attach staged pitch to play options, then clear the staging. */
function consumeStagedPitch(
  staged: FabFluentCardRef[],
  opts: FabPlayOptions | undefined,
  from: "hand" | "arsenal",
): FabPlayOptions {
  const base: FabPlayOptions = from === "arsenal" ? { ...opts, from } : (opts ?? {});
  if (staged.length === 0) return base;
  const stagedCards = staged.splice(0, staged.length);
  const explicit = base.pitch;
  const explicitList =
    explicit === undefined ? [] : Array.isArray(explicit) ? explicit : [explicit];
  return { ...base, pitch: [...stagedCards, ...explicitList] };
}

/**
 * Create the `must` verb surface for a player handle. Exposed as
 * `handle.must` on {@link FabPlayerHandle}.
 */
export function createFabFluentMust(handle: FabPlayerHandle): FabFluentMust {
  const stagedPitch: FabFluentCardRef[] = [];

  const state = () => handle.getState();

  const resolveIn = (card: FabFluentCardRef, filter?: FabCardRefFilter): FabCardInstanceRef =>
    resolveFabCardRef(state(), handle.id, card, filter);

  const asResult = (ref: FabCardInstanceRef): FabFluentRefResult => ({ ...ref, and: must });

  const playVerb = (
    card: FabFluentCardRef,
    opts: FabPlayOptions | undefined,
    from: "hand" | "arsenal",
  ): FabFluentRefResult => {
    const resolved = resolveIn(card, { zone: from });
    handle.playInstance(resolved.instanceId, consumeStagedPitch(stagedPitch, opts, from));
    return asResult(makeFabInstanceRef(state(), handle.id, resolved.instanceId));
  };

  const must: FabFluentMust = {
    playAttack(card, opts) {
      return playVerb(card, opts, "hand");
    },

    play(card, opts) {
      return playVerb(card, opts, "hand");
    },

    playInstant(card, opts) {
      return playVerb(card, opts, "hand");
    },

    playReaction(card, opts) {
      return playVerb(card, opts, "hand");
    },

    playFromArsenal(card, opts) {
      return playVerb(card, opts, "arsenal");
    },

    defend(...cards) {
      const cardIds = cards.map((card) => resolveIn(card).instanceId);
      handle.exec({ move: "defend", payload: { instanceIds: cardIds } });
      return must;
    },

    pitch(...cards) {
      stagedPitch.push(...cards);
      return must;
    },

    activate(card) {
      const cardId = resolveIn(card).instanceId;
      handle.exec({ move: "activate", payload: { instanceId: cardId } });
      return must;
    },

    passPriority() {
      handle.pass();
      return must;
    },

    endTurn() {
      handle.endTurn();
      return must;
    },

    concede() {
      handle.concede();
      return must;
    },
  };

  return must;
}
