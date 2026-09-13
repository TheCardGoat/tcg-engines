/** PEN265 Rippling Wave — Cloaked Mystic Arms. */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { snatchBlue } from "../../../../../../cards/src/cards/actions/snatch.ts";
import { ripplingWave } from "../../../../../../cards/src/cards/equipment/rippling-wave.ts";

function answerAbility(game: ReturnType<typeof FabTestEngine.start>, accept: boolean): void {
  for (let safety = 0; safety < 64; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: accept },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      const pick = decision.candidates[0];
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
    if (decision) return;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const priority = game.getState().priority?.holderPlayerId;
    if (!priority) return;
    game.exec({ move: "pass", actorId: priority, payload: {} });
  }
}

function passToDefender(game: ReturnType<typeof FabTestEngine.start>, defenderId: string): void {
  for (let safety = 0; safety < 16; safety += 1) {
    if (
      game.combat()?.step === "reaction" &&
      game.getState().priority?.holderPlayerId === defenderId
    ) {
      return;
    }
    const priority = game.getState().priority?.holderPlayerId;
    if (!priority) throw new Error("combat priority did not advance");
    game.exec({ move: "pass", actorId: priority, payload: {} });
  }
  throw new Error("defender never received reaction priority");
}

function setupCombat(defendingCard: typeof snatchBlue) {
  const game = FabTestEngine.start(
    { hero: bravo, hand: [snatchRed], deck: 0, actionPoints: 1 },
    {
      hero: dash,
      arms: [ripplingWave],
      hand: [defendingCard],
      deck: 0,
      chiPoints: 3,
    },
    { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
  );
  const Defender = game.as(dash);
  game.as(bravo).attackWith(snatchRed);
  Defender.defendWith(defendingCard);
  passToDefender(game, Defender.id);
  return { game, Defender };
}

describe("rippling-wave (PEN265)", () => {
  it("core mechanic: Instant 3 chi + face-up returns a defending blue attack action", () => {
    const { game, Defender } = setupCombat(snatchBlue);
    const waveId = Defender.findCardInZone("arms", ripplingWave);

    Defender.activate(ripplingWave);
    answerAbility(game, true);

    expect(game.objectState(waveId)?.faceDown).toBe(false);
    expect(game.getState().players[Defender.id]!.chiPoints).toBe(0);
    expect(Defender.zone("hand")).toContain(snatchBlue.canonicalId);
    expect(Defender.zone("arms")).toContain(ripplingWave.canonicalId);
  });

  it("boundaries: decline and wrong-color defenders stay out of hand; cost gates hold", () => {
    const declined = setupCombat(snatchBlue);
    declined.Defender.activate(ripplingWave);
    answerAbility(declined.game, false);
    declined.game.helpers.resolveRestOfCombat();
    expect(declined.Defender.zone("hand")).not.toContain(snatchBlue.canonicalId);
    expect(declined.Defender.zone("graveyard")).toContain(snatchBlue.canonicalId);

    const wrongColor = setupCombat(snatchRed);
    wrongColor.Defender.activate(ripplingWave);
    answerAbility(wrongColor.game, true);
    wrongColor.game.helpers.resolveRestOfCombat();
    expect(wrongColor.Defender.zone("hand")).not.toContain(snatchRed.canonicalId);
    expect(wrongColor.Defender.zone("graveyard")).toContain(snatchRed.canonicalId);

    const noChi = FabTestEngine.start(
      { hero: bravo, deck: 0 },
      { hero: dash, arms: [ripplingWave], deck: 0 },
      { autoPassPriority: false },
    );
    expect(() => noChi.as(dash).activate(ripplingWave)).toThrow();
    const alreadyFaceUp = FabTestEngine.start(
      { hero: bravo, deck: 0 },
      {
        hero: dash,
        arms: [{ card: ripplingWave, state: { faceDown: false } }],
        deck: 0,
        chiPoints: 3,
      },
      { autoPassPriority: false },
    );
    expect(() => alreadyFaceUp.as(dash).activate(ripplingWave)).toThrow();
  });
});
