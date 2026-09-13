/**
 * ENG003 Truths Retold — Mystic Illusionist Head, Cloaked + Ward 1.
 *
 * Printed:
 *   Cloaked
 *   Instant - {r}, turn this face-up: Put an aura from your graveyard on the
 *   bottom of your deck.
 *   Ward 1
 *
 * Model (after fix):
 *   Instant mixed {r} + turn-face-up self → move-card GY Aura (types) → deck bottom
 *   keywords: cloaked, ward(1)
 *
 * Reasoning:
 * 1. Cloaked seats face-down; turn-face-up cost only legal while face-down.
 * 2. Filter was subtypes:["Aura"] — Aura is a type-line type, so nothing matched.
 * 3. Ward 1 on equipment seats works (equipment-seat ward scan).
 * 4. Empty GY aura / already face-up / 0 RP → illegal.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { truthsRetold } from "../../../../../../cards/src/cards/equipment/truths-retold.ts";
import { spectralShield } from "../../../../../../cards/src/cards/tokens/spectral-shield.ts";

function drain(game: ReturnType<typeof FabTestEngine.start>, auraCanonicalId?: string): void {
  for (let safety = 0; safety < 48; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "entity-target") {
      const pick =
        (auraCanonicalId
          ? decision.candidates.find(
              (c) => game.getState().objects[c.instanceId]?.canonicalId === auraCanonicalId,
            )
          : undefined) ?? decision.candidates[0];
      if (!pick && (decision.min ?? 1) > 0) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "entity-target",
            instanceIds: pick ? [pick.instanceId] : [],
          },
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
          answer: {
            kind: "ordering",
            orderedIds: decision.entries.map((e) => e.id),
          },
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

describe("truths-retold (ENG003)", () => {
  it("core mechanic: cloaked face-down → pay {r} turn face-up → aura GY to deck bottom", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [truthsRetold],
        graveyard: [spectralShield, nimblismBlue],
        hand: [],
        deck: [snatchRed, snatchRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        life: 20,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const headId = game.getState().containers.zonesByPlayerId[Bravo.id]!.head[0]!;

    // Cloaked seats face-down.
    expect(game.objectState(headId)?.faceDown).toBe(true);

    const deckBefore = Bravo.zone("deck").length;
    Bravo.activate(truthsRetold);
    drain(game, spectralShield.canonicalId);

    // Turned face-up as cost.
    expect(game.objectState(headId)?.faceDown).not.toBe(true);
    // Still equipped (not destroy-self).
    expect(Bravo.zone("head")).toContain(truthsRetold.canonicalId);
    // Aura to deck bottom; non-aura stays in GY.
    expect(Bravo.zone("graveyard")).not.toContain(spectralShield.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(nimblismBlue.canonicalId);
    expect(Bravo.zone("deck").length).toBe(deckBefore + 1);
    // Deck bottom = first index.
    expect(Bravo.zone("deck")[0]).toBe(spectralShield.canonicalId);
    expect(Bravo.resourcePoints()).toBe(0);
  });

  it("boundaries: already face-up cannot pay turn-face-up cost", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [{ card: truthsRetold, state: { faceDown: false } }],
        graveyard: [spectralShield],
        hand: [],
        deck: 4,
        resourcePoints: 1,
        actionPoints: 1,
        life: 20,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    expect(() => Bravo.activate(truthsRetold)).toThrow();
  });

  it("boundaries: empty GY no-ops deck; 0 RP illegal", () => {
    const emptyGy = FabTestEngine.start(
      {
        hero: bravo,
        head: [truthsRetold],
        graveyard: [],
        hand: [],
        deck: [snatchRed, snatchRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        life: 20,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = emptyGy.as(bravo);
    const deckBefore = Bravo.zone("deck").length;
    Bravo.activate(truthsRetold);
    drain(emptyGy);
    // Cost may still pay (face-up + RP); effect has no aura to move.
    expect(Bravo.zone("deck").length).toBe(deckBefore);
    expect(Bravo.zone("head")).toContain(truthsRetold.canonicalId);

    const noRp = FabTestEngine.start(
      {
        hero: bravo,
        head: [truthsRetold],
        graveyard: [spectralShield],
        hand: [],
        deck: 4,
        resourcePoints: 0,
        actionPoints: 1,
        life: 20,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    expect(() => noRp.as(bravo).activate(truthsRetold)).toThrow();
  });

  it("boundaries: ward 1 prevents 1 of combat damage (equipment-seat ward)", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        head: [{ card: truthsRetold, state: { faceDown: false } }],
        hand: [],
        deck: 6,
        life: 20,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    game.as(dash).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    // Ward 1 destroys head to prevent 1 of snatch 4 → life 17.
    expect(Bravo.zone("head")).not.toContain(truthsRetold.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(truthsRetold.canonicalId);
    expect(Bravo.life()).toBe(20 - (4 - 1));
  });
});
