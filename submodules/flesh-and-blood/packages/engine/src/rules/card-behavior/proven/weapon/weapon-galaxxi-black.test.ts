/**
 * CHN003 Galaxxi Black — Shadow Runeblade Sword 2H — power 1, arcane 1.
 *
 * Printed:
 *   a1: Once per Turn Action - {r}: Attack
 *   a2: If you have played a card from your banished zone this turn, Galaxxi
 *       Black gains +2{p} until end of turn.
 *   a3: If Galaxxi Black hits a hero, deal 1 arcane damage to that hero.
 *
 * Reasoning (hand-authored):
 * 1. a1 (1{r} 1{p} attack) + a3 (on-hit 1 arcane, blocked-boundary) are
 *    already proven @ weapon-pilots2 (galaxxi-black section). This file
 *    proves ONLY the missing a2 clause.
 * 2. a2 rides the NEW engine fact `playerPlayedFromBanishedThisTurn`
 *    (play events carry the origin zone) + has-status branch
 *    `played-from-banished-this-turn` (cycle-1 fact pattern).
 * 3. Playing from banished requires a migrated permission (legality-quotes
 *    line ~650); the deterministic grant used here is Iris of the Blossom
 *    (ASR003): Instant {t}+discard → search deck for Whirling Mist Blossom
 *    (the only copy) → banish → optional play it. The played WMB (2{p}
 *    go-again attack) is the granted instance (object-scoped permission).
 * 4. Happy: Snatch hits (iris's hit-this-turn condition) → iris banishes
 *    WMB → play WMB from banished (stamp) → Galaxxi attacks at 1+2 = 3
 *    physical + 1 arcane (a3) = 4. Boundary: no banished play → 1+1 = 2.
 *
 * Status: ✅ a2 +2{p} after playing from banished proven; no-play boundary
 * (a1/a3 @ weapon-pilots2).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";

import { galaxxiBlack } from "../../../../../../cards/src/cards/weapons/galaxxi-black.ts";
import { irisOfTheBlossom } from "../../../../../../cards/src/cards/equipment/iris-of-the-blossom.ts";
import { whirlingMistBlossomYellow } from "../../../../../../cards/src/cards/actions/whirling-mist-blossom.ts";

const LIFE = 40;

/** Walk to quiescence; entity picks take the first candidate, booleans true
 * (accept the iris optional play). */
function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 64; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: true },
        },
      });
      continue;
    }
    if (decision?.kind === "ordering") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "ordering", orderedIds: decision.entries.map((entry) => entry.id) },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      const pick = decision.candidates[0];
      if (!pick && (decision.min ?? 1) > 0) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: pick ? [pick.instanceId] : [] },
        },
      });
      continue;
    }
    if (decision && game.answerForcedDecision()) continue;
    if (decision) break;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("galaxxi-black (CHN003) a2", () => {
  it("a2: played a card from banished this turn → Galaxxi attacks at 1+2 = 3{p} + 1 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [galaxxiBlack],
        head: [irisOfTheBlossom],
        hand: [snatchRed, nimblismBlue],
        deck: [
          whirlingMistBlossomYellow,
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
        ],
        resourcePoints: 2,
        actionPoints: 3,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    // 1. Snatch hits (iris condition "you've hit this turn"): 4 damage.
    Bravo.attackWith(snatchRed);
    drain(game);
    expect(Opp.life()).toBe(lifeBefore - 4);

    // 2. Iris: Instant {t}+discard → search deck → banish WMB → accept the
    //    optional play (drain answers booleans true).
    Bravo.activate(irisOfTheBlossom);
    drain(game);
    expect(Bravo.zone("banished")).toContain(whirlingMistBlossomYellow.canonicalId);

    // 3. Play the granted WMB from banished (2{p} go-again attack): 2 more
    //    damage + stamps played-from-banished-this-turn.
    Bravo.play(whirlingMistBlossomYellow, { from: "banished" });
    drain(game);
    expect(Opp.life()).toBe(lifeBefore - 6);

    // 4. Galaxxi: 1 + 2 (a2) = 3 physical + 1 arcane (a3 on hit) = 4.
    Bravo.activate(galaxxiBlack);
    game.helpers.resolveRestOfCombat();
    expect(Opp.life()).toBe(lifeBefore - 10);
  });

  it("a2 boundary: no banished play this turn → Galaxxi attacks at 1{p} + 1 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [galaxxiBlack],
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    Bravo.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(Opp.life()).toBe(lifeBefore - 4);

    // No banished play → no +2. 1 physical + 1 arcane = 2.
    Bravo.activate(galaxxiBlack);
    game.helpers.resolveRestOfCombat();
    expect(Opp.life()).toBe(lifeBefore - 6);
  });
});
