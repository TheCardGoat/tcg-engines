/**
 * PEN058 mBrio Base Vizier — Mechanologist Base Head d0 AB1.
 *
 * Printed:
 *   If you would be dealt arcane damage, you may remove a steam counter from a
 *   Hyper Driver you control to prevent 1 of that damage.
 *   Arcane Barrier 1
 *
 * Reasoning (hand-authored):
 * 1. Continuous while-in-arena prevention 1 arcane with optionalCost
 *    remove-counters steam from name Hyper Driver (multi-fire).
 * 2. Catalog had duration while-condition (no condition AST) — fixed to
 *    while-in-arena; optional remove-steam was unsupported (only discard Instant
 *    / banish-self). Engine now asks the defender whether to apply it and,
 *    if accepted, which eligible Hyper Driver pays the cost.
 * 3. Hyper Driver token needed printed name for name-filter matching.
 * 4. Without steam: AB1 can still pay {r}; with 0 RP full arcane.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { mbrioBaseVizier } from "../../../../../../cards/src/cards/equipment/mbrio-base-vizier.ts";
import { hyperDriver } from "../../../../../../cards/src/cards/tokens/hyper-driver.ts";
import { hyperDriverYellow } from "../../../../../../cards/src/cards/actions/hyper-driver.ts";

const LIFE = 20;

const arcaneBolt2 = {
  canonicalId: "trainer-arcane-bolt-pen058",
  types: ["Wizard", "Action"],
  cost: 0,
  arcane: 2,
  keywords: [] as const,
};

function steamCount(game: ReturnType<typeof FabTestEngine.start>, instanceId: string): number {
  const obj = game.getState().objects[instanceId];
  return obj?.counters.find((c) => c.kind === "named" && c.name === "steam")?.count ?? 0;
}

describe("mbrio-base-vizier (PEN058)", () => {
  it("core mechanic: remove steam from Hyper Driver → prevent 1 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [hyperDriverYellow],
        head: [mbrioBaseVizier],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        hand: [arcaneBolt2],
        life: LIFE,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    // Play the real Hyper Driver so its enter-arena replacement supplies steam.
    Dash.play(hyperDriverYellow);
    game.passBoth();
    const hdId = Dash.findCardInZone("arena", hyperDriverYellow);
    expect(steamCount(game, hdId)).toBe(2);

    // Hand the turn to Bravo for the opposing arcane-damage event.
    game.endTurn(Dash.id);
    game.as(bravo).play(arcaneBolt2, { target: Dash.id });
    game.passBoth();
    const choice = Dash.expectDecision("option");
    const steamPrevention = choice.options.find((option) =>
      option.id.endsWith(":MLfgFRDKbTbWj8fBgMrjJ:ifWouldBeDealtArcaneDamageMayRemoveSteam"),
    );
    expect(steamPrevention).toBeDefined();
    Dash.chooseOptions(steamPrevention!.id);
    Dash.chooseTargets(hyperDriverYellow);

    // 2 arcane − 1 steam prevent = 1 damage; steam 2 → 1.
    expect(Dash.life()).toBe(LIFE - 1);
    expect(steamCount(game, hdId)).toBe(1);
    expect(Dash.zone("head")).toContain(mbrioBaseVizier.canonicalId);
  });

  it("boundaries: no steam + 0 RP → full arcane; AB1 pays when no steam; model", () => {
    const noSteam = FabTestEngine.start(
      {
        hero: bravo,
        hand: [arcaneBolt2],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [mbrioBaseVizier],
        arena: [hyperDriver],
        resourcePoints: 0,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    // Hyper Driver with 0 steam — optional steam path unavailable; 0 RP → no AB.
    noSteam.as(bravo).play(arcaneBolt2, { target: noSteam.as(dash).id });
    noSteam.passBoth();
    noSteam.passBoth();
    expect(noSteam.as(dash).life()).toBe(LIFE - 2);

    const ab = FabTestEngine.start(
      {
        hero: bravo,
        hand: [arcaneBolt2],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [mbrioBaseVizier],
        resourcePoints: 1,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    // No Hyper Driver: steam path off; AB1 pays 1 → prevent 1 of 2.
    ab.as(bravo).play(arcaneBolt2, { target: ab.as(dash).id });
    ab.passBoth();
    const abChoice = ab.as(dash).expectDecision("option");
    const arcaneBarrier = abChoice.options.find((option) => option.id.endsWith(":arcane-barrier"));
    expect(arcaneBarrier).toBeDefined();
    ab.as(dash).chooseOptions(arcaneBarrier!.id);
    expect(ab.as(dash).life()).toBe(LIFE - 1);
    expect(ab.as(dash).resourcePoints()).toBe(0);
    expect(ab.as(dash).zone("head")).toContain(mbrioBaseVizier.canonicalId);

    const a1 = mbrioBaseVizier.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static") return;
    expect(a1.effect).toMatchObject({
      type: "prevention",
      amount: 1,
      damageType: "arcane",
      duration: "while-in-arena",
      optionalCost: {
        type: "remove-counters",
        counter: { kind: "named", name: "steam" },
        count: 1,
        filter: { name: "Hyper Driver" },
      },
    });
    expect(
      mbrioBaseVizier.base.keywords?.some(
        (k) => k.name === "arcane-barrier" && (k as { value?: number }).value === 1,
      ),
    ).toBe(true);
  });
});
