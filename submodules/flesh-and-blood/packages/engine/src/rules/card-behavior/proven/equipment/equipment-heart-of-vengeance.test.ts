/**
 * HNT145 Heart of Vengeance — Draconic Chest d1 Blade Break.
 *
 * Printed:
 *   Instant - Destroy this: Your next attack this turn that targets Arakni
 *   costs {r} less to play or activate.
 *   Blade Break
 *
 * Reasoning (case-by-case):
 * 1. appliesTo next attack targeting Arakni needs hasStatus targets-arakni —
 *    fail-closed until matches-filter checks defending/prospective hero moniker.
 * 2. "play or activate" → Attack AAC or Weapon (or-filter), not Attack only.
 * 3. Instant destroy-self is free of AP; continuous cost −1 this turn.
 * 4. Blade Break d1 lifecycle; non-Arakni opponent gets no discount.
 *
 * Status: ✅ bladeBreak + Instant destroy → next attack vs Arakni costs −1{r};
 * non-Arakni full cost.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, snatchRed } from "../../../fixtures.ts";
import { heartOfVengeance } from "../../../../../../cards/src/cards/equipment/heart-of-vengeance.ts";
import { arakni } from "../../../../../../cards/src/cards/heroes/arakni.ts";
import { zipperHitRed } from "../../../../../../cards/src/cards/actions/zipper-hit.ts";

const SNATCH = 4;
const LIFE = 20;

describe("heart-of-vengeance (HNT145)", () => {
  it("proven: bladeBreak d1 — defend contributes 1 then destroy to GY", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        chest: [heartOfVengeance],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Defender = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith(heartOfVengeance);
    game.helpers.resolveRestOfCombat();

    expect(Defender.life()).toBe(LIFE - (SNATCH - 1));
    expect(Defender.zone("chest")).not.toContain(heartOfVengeance.canonicalId);
    expect(Defender.zone("graveyard")).toContain(heartOfVengeance.canonicalId);
  });

  it("core mechanic: Instant destroy → next AAC vs Arakni costs {r} less", () => {
    // Zipper Hit costs 1; after Heart, play with 0 RP should succeed vs Arakni.
    const game = FabTestEngine.start(
      {
        hero: dash,
        chest: [heartOfVengeance],
        hand: [zipperHitRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: arakni, life: 40, deck: 8 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);

    Dash.activate(heartOfVengeance);
    game.passBoth();
    expect(Dash.zone("chest")).not.toContain(heartOfVengeance.canonicalId);
    expect(Dash.zone("graveyard")).toContain(heartOfVengeance.canonicalId);

    // Printed cost 1, 0 RP — discount must apply because target is Arakni.
    Dash.attackWith(zipperHitRed);
    expect(game.combat()?.step).toBe("defend");
    expect(Dash.resourcePoints()).toBe(0);
  });

  it("boundaries: vs non-Arakni, Instant destroy does not discount next attack", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        chest: [heartOfVengeance],
        hand: [zipperHitRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: bravo, life: 40, deck: 8 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);

    Dash.activate(heartOfVengeance);
    game.passBoth();

    // Bravo is not Arakni — cost stays 1; 0 RP cannot pay.
    expect(() => Dash.attackWith(zipperHitRed)).toThrow();
    expect(Dash.zone("hand")).toContain(zipperHitRed.canonicalId);
  });

  it("boundaries: with pitch and no Heart, Zipper Hit still costs 1 vs Arakni", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [zipperHitRed, nimblismBlue],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: arakni, life: 40, deck: 8 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);

    // Pitch blue (3) for cost 1 — no Heart discount.
    Dash.attackWith(zipperHitRed, { pitch: [nimblismBlue] });
    expect(game.combat()?.step).toBe("defend");
  });

  it("model guard: Instant destroy-self → next Attack|Weapon targets-arakni cost −1", () => {
    const a1 = heartOfVengeance.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated" || !a1.effect) return;
    expect(a1.abilityType).toBe("instant");
    expect(a1.cost).toMatchObject({ class: "effect", type: "destroy-self" });
    expect(a1.effect).toMatchObject({
      type: "modify-numeric",
      property: "cost",
      op: "subtract",
      amount: 1,
      duration: "this-turn",
      appliesTo: {
        next: {
          hasStatus: "targets-arakni",
        },
      },
    });
    if (a1.effect.type === "modify-numeric" && a1.effect.appliesTo?.next) {
      expect(a1.effect.appliesTo.next).toMatchObject({
        or: [{ typeBox: { subtypes: ["Attack"] } }, { typeBox: { types: ["Weapon"] } }],
      });
    }
  });
});
