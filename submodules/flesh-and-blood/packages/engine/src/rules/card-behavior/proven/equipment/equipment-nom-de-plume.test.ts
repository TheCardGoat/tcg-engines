/**
 * TCC051 Nom de Plume — Bard Head d0.
 *
 * Printed:
 *   Action - Destroy this: Each hero draws a card. Go again
 *
 * Reasoning (hand-authored):
 * 1. Action destroy-self cost removes head to GY.
 * 2. player:"each" draws 1 for both seats (1v1 = controller + sole opponent).
 * 3. layerKeywords go again refunds the spent action point.
 * 4. 0 AP illegal; second activate after destroy illegal.
 * 5. d0 seat-only — no defend path.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { nomDePlume } from "../../../../../../cards/src/cards/equipment/nom-de-plume.ts";

describe("nom-de-plume (TCC051)", () => {
  it("core mechanic: Action destroy-self → each hero draws 1 + go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [nomDePlume],
        hand: [],
        actionPoints: 1,
        // Top = last element — controller draw identity.
        deck: [nimblismBlue, nimblismBlue, snatchRed],
      },
      {
        hero: dash,
        hand: [],
        deck: [nimblismBlue, nimblismBlue, snatchRed],
      },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    expect(Bravo.zone("hand").length).toBe(0);
    expect(Dash.zone("hand").length).toBe(0);

    Bravo.activate(nomDePlume);
    game.passBoth();

    expect(Bravo.zone("head")).not.toContain(nomDePlume.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(nomDePlume.canonicalId);
    // Each hero drew their deck top.
    expect(Bravo.zone("hand")).toEqual([snatchRed.canonicalId]);
    expect(Dash.zone("hand")).toEqual([snatchRed.canonicalId]);
    // Go again refunds the AP spent to activate.
    expect(Bravo.actionPoints()).toBe(1);
  });

  it("boundaries: 0 AP illegal; destroyed not re-activatable; model destroy-self each draw", () => {
    const noAp = FabTestEngine.start(
      {
        hero: bravo,
        head: [nomDePlume],
        hand: [],
        actionPoints: 0,
        deck: 4,
      },
      { hero: dash, hand: [], deck: 4 },
      { autoPassPriority: false },
    );
    const rejected = noAp.as(bravo).expectFailure({
      move: "activate",
      payload: { instanceId: noAp.as(bravo).card(nomDePlume) },
    });
    expect(rejected.accepted).toBe(false);

    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [nomDePlume],
        hand: [],
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, hand: [], deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    Bravo.activate(nomDePlume);
    game.passBoth();
    expect(() => Bravo.activate(nomDePlume)).toThrow();

    const a1 = nomDePlume.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("action");
    expect(a1.cost).toMatchObject({ class: "effect", type: "destroy-self" });
    expect(a1.effect).toMatchObject({
      type: "draw",
      count: 1,
      player: "each",
    });
    expect(a1.layerKeywords).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "go-again" })]),
    );
    expect(nomDePlume.base.numeric.defense).toBe(0);
  });
});
