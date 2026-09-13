/**
 * BOL005 Halo of Illumination — Light Head d0 spellvoid 2.
 *
 * Printed:
 *   Instant - {r}, destroy this: Put a card from your hand into your hero's
 *   soul. If it's a Light card, draw a card. Spellvoid 2
 *
 * Model:
 *   Instant mixed {r}+destroy-self → hand→soul (bind it) → if Light draw
 *
 * Reasoning:
 * 1. Light is a talent supertype (types:["Light",…] → typeBox.supertypes).
 * 2. Soul put is move-card to zone soul (not charge — no charge event).
 * 3. Conditional draw is binding-matches on the soul card.
 * 4. 0 RP or empty hand fails the Instant cost/effect path.
 * 5. Spellvoid 2 is keyword path (covered by spellvoid suite); not required
 *    for Instant ability AAA.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue } from "../../../fixtures.ts";
import { haloOfIllumination } from "../../../../../../cards/src/cards/equipment/halo-of-illumination.ts";
import { invigoratingLightYellow } from "../../../../../../cards/src/cards/actions/invigorating-light.ts";

function drain(game: ReturnType<typeof FabTestEngine.start>, preferCanonicalId?: string): void {
  for (let safety = 0; safety < 40; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "entity-target") {
      const pick =
        (preferCanonicalId
          ? decision.candidates.find(
              (c) => game.getState().objects[c.instanceId]?.canonicalId === preferCanonicalId,
            )
          : undefined) ?? decision.candidates[0];
      if (!pick) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: [pick.instanceId] },
        },
      });
      continue;
    }
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: false },
        },
      });
      continue;
    }
    if (decision?.kind === "payment") {
      const cand = decision.candidates[0];
      if (!cand) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "payment", instanceIds: [cand.instanceId] },
        },
      });
      continue;
    }
    if (decision) break;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("halo-of-illumination (BOL005)", () => {
  it("core mechanic: Instant {r}+destroy → Light hand to soul → draw", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [haloOfIllumination],
        hand: [invigoratingLightYellow],
        resourcePoints: 1,
        actionPoints: 0,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const deckBefore = Bravo.zone("deck").length;
    const handBefore = Bravo.zone("hand").length;

    Bravo.activate(haloOfIllumination);
    drain(game, invigoratingLightYellow.canonicalId);

    expect(Bravo.zone("head")).not.toContain(haloOfIllumination.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(haloOfIllumination.canonicalId);
    expect(Bravo.zone("soul")).toContain(invigoratingLightYellow.canonicalId);
    expect(Bravo.zone("hand")).not.toContain(invigoratingLightYellow.canonicalId);
    // Light → draw 1: hand size -1 put +1 draw = start hand size.
    expect(Bravo.zone("deck").length).toBe(deckBefore - 1);
    expect(Bravo.zone("hand").length).toBe(handBefore); // -1 soul +1 draw
  });

  it("boundaries: non-Light to soul does not draw", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [haloOfIllumination],
        hand: [nimblismBlue],
        resourcePoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue],
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const deckBefore = Bravo.zone("deck").length;

    Bravo.activate(haloOfIllumination);
    drain(game, nimblismBlue.canonicalId);

    expect(Bravo.zone("soul")).toContain(nimblismBlue.canonicalId);
    expect(Bravo.zone("deck").length).toBe(deckBefore);
    expect(Bravo.zone("hand")).not.toContain(nimblismBlue.canonicalId);
  });

  it("boundaries: 0 RP and no pitch fodder cannot pay Instant cost", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [haloOfIllumination],
        // Empty hand: cannot pitch for the {r} cost.
        hand: [],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    expect(() => Bravo.activate(haloOfIllumination)).toThrow();
    expect(Bravo.zone("head")).toContain(haloOfIllumination.canonicalId);
  });
});
