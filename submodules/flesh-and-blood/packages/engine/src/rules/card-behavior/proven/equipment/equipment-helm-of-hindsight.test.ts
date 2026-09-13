/**
 * SUP211 Helm of Hindsight — Generic Head d0.
 *
 * Printed:
 *   Instant - {r}{r}{r}, destroy this: Put target attack action card from your
 *   graveyard on top of your deck.
 *
 * Reasoning (hand-authored):
 * 1. Instant mixed cost: 3 resources + destroy-self.
 * 2. Target AAC in GY (on-stack declaration) → deck top.
 * 3. Filter types Action + subtypes Attack is correct AAC.
 * 4. Low RP / no AAC in GY illegal.
 * 5. d0 seat only.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { helmOfHindsight } from "../../../../../../cards/src/cards/equipment/helm-of-hindsight.ts";

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 48; safety += 1) {
    const decision = game.getState().decision;
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
    if (decision?.kind === "entity-target") {
      const aacPick = decision.candidates.find(
        (c) => game.getState().objects[c.instanceId]?.canonicalId === snatchRed.canonicalId,
      );
      const pick = aacPick ?? decision.candidates[0];
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

describe("helm-of-hindsight (SUP211)", () => {
  it("core mechanic: Instant 3{r} destroy → GY AAC to deck top", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [helmOfHindsight],
        graveyard: [snatchRed, nimblismBlue],
        resourcePoints: 3,
        hand: [],
        deck: [nimblismBlue, nimblismBlue],
      },
      { hero: dash, hand: [], deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    expect(Bravo.zone("graveyard")).toContain(snatchRed.canonicalId);

    Bravo.activate(helmOfHindsight);
    drain(game);

    expect(Bravo.zone("head")).not.toContain(helmOfHindsight.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(helmOfHindsight.canonicalId);
    expect(Bravo.resourcePoints()).toBe(0);
    // AAC left GY and sits on deck top (last index).
    expect(Bravo.zone("graveyard")).not.toContain(snatchRed.canonicalId);
    expect(Bravo.zone("deck").at(-1)).toBe(snatchRed.canonicalId);
  });

  it("boundaries: low RP / no AAC in GY illegal; model Instant GY AAC top", () => {
    const poor = FabTestEngine.start(
      {
        hero: bravo,
        head: [helmOfHindsight],
        graveyard: [snatchRed],
        resourcePoints: 2,
        hand: [],
        deck: 4,
      },
      { hero: dash, hand: [], deck: 4 },
      { autoPassPriority: false },
    );
    expect(() => poor.as(bravo).activate(helmOfHindsight)).toThrow();
    expect(poor.as(bravo).zone("head")).toContain(helmOfHindsight.canonicalId);

    const noAac = FabTestEngine.start(
      {
        hero: bravo,
        head: [helmOfHindsight],
        graveyard: [nimblismBlue], // blue non-attack only
        resourcePoints: 3,
        hand: [],
        deck: 4,
      },
      { hero: dash, hand: [], deck: 4 },
      { autoPassPriority: false },
    );
    expect(() => noAac.as(bravo).activate(helmOfHindsight)).toThrow();

    const a1 = helmOfHindsight.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated" || !a1.effect || a1.effect.type !== "move-card") return;
    expect(a1.abilityType).toBe("instant");
    expect(a1.cost).toMatchObject({
      class: "mixed",
      type: "all",
      costs: expect.arrayContaining([
        expect.objectContaining({ class: "asset", type: "resources", amount: 3 }),
        expect.objectContaining({ class: "effect", type: "destroy-self" }),
      ]),
    });
    expect(a1.effect.target).toMatchObject({
      selector: "object",
      zones: ["graveyard"],
      filter: { typeBox: { types: ["Action"], subtypes: ["Attack"] } },
      count: 1,
    });
    expect(a1.effect.to).toMatchObject({ zone: "deck", position: "top" });
    expect(helmOfHindsight.base.numeric.defense).toBe(0);
  });
});
