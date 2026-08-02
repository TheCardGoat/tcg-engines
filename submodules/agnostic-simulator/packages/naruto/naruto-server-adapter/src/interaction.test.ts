import { describe, expect, it } from "vite-plus/test";
import { buildInteractionSubmission } from "@tcg/protocol";
import type { InteractionAction, InteractionSubmission } from "@tcg/protocol";
import {
  buildDeck,
  createInitialState,
  newCharacter,
  playableLeaders,
  type GameState,
  type PendingChoice,
} from "@tcg-engines/naruto-engine";
import type { DispatchContext } from "@tcg/shared/game-engine";

import { NarutoServerEngine, narutoCreateServerEngine } from "./engine.js";
import { narutoSubmissionToAction } from "./interaction.js";
import { narutoServerAdapter } from "./adapter.js";

const PLAYER_1 = "alice";
const PLAYER_2 = "bob";
const CONTEXT: DispatchContext = { gameId: "naruto-interaction-test", sourceAuthority: "server" };

function leaders() {
  const all = playableLeaders();
  const first = all[0];
  const second = all[1] ?? all[0];
  if (!first || !second) throw new Error("no leaders");
  return { first, second };
}

async function createEngine(): Promise<NarutoServerEngine> {
  const { first, second } = leaders();
  const maps = narutoServerAdapter.buildCardInstances([
    { owner: PLAYER_1, deck: toEntries(buildDeck(first.id)) },
    { owner: PLAYER_2, deck: toEntries(buildDeck(second.id)) },
  ]);
  const engine = await narutoCreateServerEngine({
    gameSlug: "naruto",
    seed: "interaction-seed",
    player1Id: PLAYER_1,
    player2Id: PLAYER_2,
    cardsMaps: maps,
  });
  if (!(engine instanceof NarutoServerEngine)) throw new Error("wrong engine type");
  return engine;
}

function toEntries(deck: { leaderId: string; cardIds: readonly string[] }) {
  const counts = new Map<string, number>();
  for (const cardId of deck.cardIds) counts.set(cardId, (counts.get(cardId) ?? 0) + 1);
  return [
    { cardId: deck.leaderId, qty: 1 },
    ...[...counts.entries()].map(([cardId, qty]) => ({ cardId, qty })),
  ];
}

/** Turn-3 main-phase state with p1 active and two ready p1 characters. */
function craftedState(): GameState {
  const { first, second } = leaders();
  const state = createInitialState({
    decks: { p1: buildDeck(first.id), p2: buildDeck(second.id) },
    seed: 11,
    firstPlayer: "p1",
    names: { p1: PLAYER_1, p2: PLAYER_2 },
  });
  state.awaitingMulligan = null;
  state.turn = 3;
  state.phase = "main";
  state.players.p1.characters[0] = newCharacter("p1-c-0", "N-010", 1);
  state.players.p1.characters[1] = newCharacter("p1-c-1", "N-013", 1);
  return state;
}

function craftedEngine(state: GameState): NarutoServerEngine {
  return new NarutoServerEngine({ state, seats: { p1: PLAYER_1, p2: PLAYER_2 } });
}

function submit(
  engine: NarutoServerEngine,
  actorId: string,
  action: InteractionAction,
  values: InteractionSubmission["values"],
  stateVersion?: number,
): InteractionSubmission {
  const view = engine.getInteractionView(actorId);
  return buildInteractionSubmission({
    view: { ...view, stateVersion: stateVersion ?? view.stateVersion },
    action,
    values,
  });
}

function requireAction(
  engine: NarutoServerEngine,
  actorId: string,
  actionId: string,
): InteractionAction {
  const view = engine.getInteractionView(actorId);
  const action = view.actions.find((candidate) => candidate.id === actionId);
  if (!action) {
    throw new Error(
      `action "${actionId}" not in view (have: ${view.actions.map((a) => a.id).join(", ")})`,
    );
  }
  return action;
}

describe("naruto interaction view", () => {
  it("mulligan: only the awaiting player gets a ready view with a boolean keep input", async () => {
    const engine = await createEngine();
    const awaiting = engine.getRawState().awaitingMulligan;
    if (!awaiting) throw new Error("expected mulligan window");
    const awaitingActor = awaiting === "p1" ? PLAYER_1 : PLAYER_2;
    const otherActor = awaiting === "p1" ? PLAYER_2 : PLAYER_1;

    const view = engine.getInteractionView(awaitingActor);
    expect(view.gameSlug).toBe("naruto");
    expect(view.status).toBe("ready");
    expect(view.stateVersion).toBe(0);
    const mulligan = view.actions.find((a) => a.id === "mulligan");
    expect(mulligan?.intent).toBe("mulligan");
    expect(mulligan?.inputs[0]?.kind).toBe("boolean");
    expect(mulligan?.requestId).toBe("naruto:0:mulligan");

    expect(engine.getInteractionView(otherActor).status).toBe("waiting");
    expect(engine.getInteractionView(otherActor).actions).toEqual([]);
    expect(engine.getInteractionView("spectator").status).toBe("idle");
  });

  it("mulligan submit flows through the protocol and bumps the version", async () => {
    const engine = await createEngine();
    const awaiting = engine.getRawState().awaitingMulligan;
    const actor = awaiting === "p1" ? PLAYER_1 : PLAYER_2;
    const action = requireAction(engine, actor, "mulligan");
    const submission = submit(engine, actor, action, { keep: false });
    const result = engine.submitInteraction(actor, submission, CONTEXT);
    expect(result.success).toBe(true);
    expect(engine.getStateID()).toBe(1);
    expect(engine.getRawState().awaitingMulligan).toBeNull();
  });

  it("rejects a stale submission with stale_interaction", async () => {
    const engine = await createEngine();
    const awaiting = engine.getRawState().awaitingMulligan;
    const actor = awaiting === "p1" ? PLAYER_1 : PLAYER_2;
    const action = requireAction(engine, actor, "mulligan");
    const submission = submit(engine, actor, action, { keep: true });
    expect(engine.submitInteraction(actor, submission, CONTEXT).success).toBe(true);

    // Replay the same (now stale) submission.
    const stale = engine.submitInteraction(actor, submission, CONTEXT);
    expect(stale.success).toBe(false);
    if (!stale.success) expect(stale.errorCode).toBe("stale_interaction");
  });

  it("main phase: exposes the full action set with disabled reasons", () => {
    // Craft a turn-1 main-phase state (attacks/recovery still locked).
    const { first, second } = leaders();
    const state = createInitialState({
      decks: { p1: buildDeck(first.id), p2: buildDeck(second.id) },
      seed: 3,
      firstPlayer: "p1",
      names: { p1: PLAYER_1, p2: PLAYER_2 },
    });
    state.awaitingMulligan = null;
    state.phase = "main";
    const engine = craftedEngine(state);

    const view = engine.getInteractionView(PLAYER_1);
    expect(view.status).toBe("ready");
    const ids = view.actions.map((a) => a.id);
    for (const expected of [
      "summon",
      "set-support",
      "activate-support",
      "activate-support-from-hand",
      "activate-character",
      "recovery",
      "declare-attack",
      "end-turn",
    ]) {
      expect(ids).toContain(expected);
    }

    // Turn 1: recovery is locked with a reason.
    const recovery = view.actions.find((a) => a.id === "recovery");
    expect(recovery?.enabled).toBe(false);
    expect(recovery?.disabledText?.key).toBe("naruto.block.tooEarly");

    // Turn 1: attacks are locked; every attacker candidate carries a reason.
    const attack = view.actions.find((a) => a.id === "declare-attack");
    expect(attack?.enabled).toBe(false);
    const attackerInput = attack?.inputs.find((i) => i.id === "attackerUid");
    expect(attackerInput?.kind).toBe("entity-selection");
    if (attackerInput?.kind === "entity-selection") {
      expect(attackerInput.candidates.every((c) => !c.enabled)).toBe(true);
      expect(attackerInput.candidates[0]?.disabledText?.key).toBe("naruto.block.tooEarly");
    }

    // p2 is waiting with no actions.
    expect(engine.getInteractionView(PLAYER_2).status).toBe("waiting");
  });

  it("declare-attack: two entity selections drive the counter step", () => {
    const engine = craftedEngine(craftedState());
    const view = engine.getInteractionView(PLAYER_1);
    const attack = view.actions.find((a) => a.id === "declare-attack");
    expect(attack?.enabled).toBe(true);
    expect(attack?.intent).toBe("attack");

    const attackerInput = attack?.inputs.find((i) => i.id === "attackerUid");
    const targetInput = attack?.inputs.find((i) => i.id === "targetUid");
    if (attackerInput?.kind !== "entity-selection" || targetInput?.kind !== "entity-selection") {
      throw new Error("declare-attack inputs must be entity selections");
    }
    const attackerIds = attackerInput.candidates
      .filter((c) => c.enabled)
      .map((c) => c.entity.instanceId);
    expect(attackerIds).toContain("p1-c-0");
    expect(attackerIds).toContain("leader:p1");
    const targetIds = targetInput.candidates.map((c) => c.entity.instanceId);
    expect(targetIds).toContain("leader:p2");

    const submission = submit(engine, PLAYER_1, attack, {
      attackerUid: "p1-c-0",
      targetUid: "leader:p2",
    });
    const result = engine.submitInteraction(PLAYER_1, submission, CONTEXT);
    expect(result.success).toBe(true);

    const state = engine.getRawState();
    expect(state.step).toBe("counter");
    expect(state.pendingAttack).toMatchObject({
      attackerUid: "p1-c-0",
      attackerKind: "character",
      targetKind: "leader",
      targetUid: null,
    });

    // Defender sees the counter-step prompt; attacker waits.
    const defenderView = engine.getInteractionView(PLAYER_2);
    expect(defenderView.status).toBe("ready");
    expect(defenderView.actions.map((a) => a.id)).toContain("pass-counter");
    expect(engine.getInteractionView(PLAYER_1).status).toBe("waiting");

    const pass = defenderView.actions.find((a) => a.id === "pass-counter");
    if (!pass) throw new Error("missing pass-counter");
    const passResult = engine.submitInteraction(
      PLAYER_2,
      submit(engine, PLAYER_2, pass, {}),
      CONTEXT,
    );
    expect(passResult.success).toBe(true);
    // Empty chain → the attack resolves immediately.
    expect(engine.getRawState().pendingAttack).toBeNull();
  });

  it("EX summon routes through the resolve-choice flow", () => {
    const state = craftedState();
    state.players.p1.hand.push({ uid: "p1-ex-0", cardId: "N-022" }); // Manda (EX)
    const engine = craftedEngine(state);

    // The EX card is an enabled summon candidate (requirements are payable).
    const summon = requireAction(engine, PLAYER_1, "summon");
    const summonInput = summon.inputs[0];
    if (summonInput?.kind !== "entity-selection") throw new Error("summon input kind");
    const exCandidate = summonInput.candidates.find((c) => c.entity.instanceId === "p1-ex-0");
    expect(exCandidate?.enabled).toBe(true);

    const summoned = engine.submitInteraction(
      PLAYER_1,
      submit(engine, PLAYER_1, summon, { handUid: "p1-ex-0" }),
      CONTEXT,
    );
    expect(summoned.success).toBe(true);

    // Two valid requirement candidates → the choice is NOT auto-resolved.
    const choice = engine.getRawState().pendingChoice;
    expect(choice?.effect).toBe("exRequirement");

    const view = engine.getInteractionView(PLAYER_1);
    expect(view.status).toBe("choosing");
    const resolve = view.actions.find((a) => a.id === "resolve-choice");
    expect(resolve?.intent).toBe("choose-targets");
    const keyInput = resolve?.inputs[0];
    if (keyInput?.kind !== "entity-selection") throw new Error("resolve-choice input kind");
    expect(keyInput.min).toBe(1);
    const optionIds = keyInput.candidates.map((c) => c.entity.instanceId);
    expect(optionIds).toEqual(expect.arrayContaining(["p1-c-0", "p1-c-1"]));

    const resolved = engine.submitInteraction(
      PLAYER_1,
      submit(engine, PLAYER_1, resolve!, { key: "p1-c-0" }),
      CONTEXT,
    );
    expect(resolved.success).toBe(true);

    const after = engine.getRawState();
    expect(after.pendingChoice).toBeNull();
    // Fodder went to trash; Manda is on board.
    expect(after.players.p1.trash.some((c) => c.uid === "p1-c-0")).toBe(true);
    expect(after.players.p1.characters.some((c) => c?.cardId === "N-022")).toBe(true);
  });

  it("non-cancellable choice cannot be cancelled via the protocol", () => {
    const state = craftedState();
    state.players.p1.hand.push({ uid: "p1-ex-0", cardId: "N-022" });
    const engine = craftedEngine(state);
    const summon = requireAction(engine, PLAYER_1, "summon");
    engine.submitInteraction(
      PLAYER_1,
      submit(engine, PLAYER_1, summon, { handUid: "p1-ex-0" }),
      CONTEXT,
    );
    const choice = engine.getRawState().pendingChoice;
    expect(choice?.cancellable).toBe(false);

    // Omitting the key means "cancel" — but this choice is non-cancellable,
    // so the submission is rejected by the protocol (min 1)...
    const resolve = requireAction(engine, PLAYER_1, "resolve-choice");
    const cancelled = engine.submitInteraction(
      PLAYER_1,
      submit(engine, PLAYER_1, resolve, {}),
      CONTEXT,
    );
    expect(cancelled.success).toBe(false);
    if (!cancelled.success) {
      expect(cancelled.errorCode).toBe("invalid_interaction_submission");
    }
    expect(engine.getRawState().pendingChoice).not.toBeNull();
  });

  it("cancellable choice: omitted key translates to RESOLVE_CHOICE key null", () => {
    const state = craftedState();
    const choice: PendingChoice = {
      effect: "koTarget",
      source: "N-021",
      player: "p1",
      promptKey: "choice.koTarget",
      options: [
        { zone: "character", key: "p1-c-0", owner: "p1", cardId: "N-010", index: 0 },
        { zone: "character", key: "p1-c-1", owner: "p1", cardId: "N-013", index: 1 },
      ],
      cancellable: true,
      data: {},
    };
    state.pendingChoice = choice;
    const engine = craftedEngine(state);

    const view = engine.getInteractionView(PLAYER_1);
    expect(view.status).toBe("choosing");
    const resolve = view.actions.find((a) => a.id === "resolve-choice");
    const keyInput = resolve?.inputs[0];
    if (keyInput?.kind !== "entity-selection") throw new Error("input kind");
    expect(keyInput.min).toBe(0); // cancellable → optional

    // Translation unit-check: omitted key → key: null.
    const submission = submit(engine, PLAYER_1, resolve!, {});
    const action = narutoSubmissionToAction({ submission, state, player: "p1" });
    expect(action).toEqual({ type: "RESOLVE_CHOICE", player: "p1", key: null });

    // And the engine accepts the cancel through the full protocol path.
    const result = engine.submitInteraction(PLAYER_1, submission, CONTEXT);
    expect(result.success).toBe(true);
    expect(engine.getRawState().pendingChoice).toBeNull();
  });

  it("game-over view has the game-over status and no actions", () => {
    const state = craftedState();
    state.winner = "p2";
    const engine = craftedEngine(state);
    const view = engine.getInteractionView(PLAYER_1);
    expect(view.status).toBe("game-over");
    expect(view.actions).toEqual([]);
  });
});
