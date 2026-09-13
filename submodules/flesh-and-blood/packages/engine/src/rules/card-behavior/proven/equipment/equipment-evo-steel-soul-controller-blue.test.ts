/**
 * EVO028 Evo Steel Soul Controller (blue) — Mechanologist Action Evo Base Arms d3.
 *
 * Printed:
 *   If you have base arms equipped, transform it into this, then equip this.
 *   When this transforms from or into an Evo with a different name, you may put
 *   an attack action card with 6{p} from your graveyard into your deck fifth
 *   from the top. If that Evo is a hero, instead this triggers twice.
 *   Temper
 *
 * Reasoning (hand-authored; case-by-case; EVO026/027 siblings):
 * 1. Prior a1: transform self into this + fake has-status base-arms-equipped.
 *    Printed requires Base+Arms and transform *it* (the base seat).
 * 2. Remodel a1: equipped-count Base+Arms; transform object equipment-arms.
 * 3. Temper (CR 8.3.10): d3 first defend stays seated at d2; destroy at d1.
 * 4. a2 optional GY p6 AAC → deck fifth; ×2 if hero Evo — needs transform event.
 * 5. Play transform+equip blocked on under-zone / non-self transform (§7 OPEN).
 *
 * Status: 🟡 temper + model correct; transform/equip + GY tuck blocked on §7.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, throttleRed } from "../../../fixtures.ts";
import { evoSteelSoulControllerBlue } from "../../../../../../cards/src/cards/actions/evo-steel-soul-controller.ts";
import { evoBetaBaseArmsBlue } from "../../../../../../cards/src/cards/actions/evo-beta-base-arms.ts";
import { buildFabRulesView } from "../../../state-rules-view.ts";

const SNATCH = 4;
const LIFE = 20;

function drain(game: ReturnType<typeof FabTestEngine.start>, acceptOptional = false): void {
  game.helpers.resolveUntilIdle({
    optionalBoolean: acceptOptional,
    entityTargets: "minimum",
  });
}

function armsDefense(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
): number | undefined {
  const state = game.getState();
  const instanceId = state.containers.zonesByPlayerId[playerId]?.arms.find(
    (id) => state.objects[id]?.canonicalId === evoSteelSoulControllerBlue.canonicalId,
  );
  if (!instanceId) return undefined;
  const view = buildFabRulesView(state);
  return view.object({
    instanceId,
    incarnation: state.objects[instanceId]!.incarnation,
  })?.current.numeric.defense;
}

describe("evo-steel-soul-controller-blue (EVO028)", () => {
  it("proven: temper d3 — first defend contributes 3, stays seated at d2", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        arms: [evoSteelSoulControllerBlue],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Defender = game.as(dash);
    expect(armsDefense(game, Defender.id)).toBe(3);

    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith(evoSteelSoulControllerBlue);
    game.helpers.resolveRestOfCombat();

    // snatch 4 − defense 3 = 1 damage; temper −1, still equipped.
    expect(Defender.life()).toBe(LIFE - (SNATCH - 3));
    expect(Defender.zone("arms")).toContain(evoSteelSoulControllerBlue.canonicalId);
    expect(armsDefense(game, Defender.id)).toBe(2);
  });

  it("proven: temper destroy when effective defense is 1 after counters", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, snatchRed, snatchRed],
        actionPoints: 3,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        arms: [evoSteelSoulControllerBlue],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    // Defend 1: d3 → d2
    Attacker.attackWith(snatchRed);
    Defender.defendWith(evoSteelSoulControllerBlue);
    game.helpers.resolveRestOfCombat();
    expect(armsDefense(game, Defender.id)).toBe(2);

    // Defend 2: d2 → d1
    Attacker.attackWith(snatchRed);
    Defender.defendWith(evoSteelSoulControllerBlue);
    game.helpers.resolveRestOfCombat();
    expect(Defender.zone("arms")).toContain(evoSteelSoulControllerBlue.canonicalId);
    expect(armsDefense(game, Defender.id)).toBe(1);

    // Defend 3: d1 temper destroys (CR 8.3.10).
    Attacker.attackWith(snatchRed);
    Defender.defendWith(evoSteelSoulControllerBlue);
    game.helpers.resolveRestOfCombat();
    expect(Defender.zone("arms")).not.toContain(evoSteelSoulControllerBlue.canonicalId);
    expect(Defender.zone("graveyard")).toContain(evoSteelSoulControllerBlue.canonicalId);
  });

  it("model guard: a1 requires Base+Arms and transforms the base seat into this", () => {
    const a1 = evoSteelSoulControllerBlue.base.abilities?.[0];
    expect(a1?.kind).toBe("resolution");
    if (a1?.kind !== "resolution" || !a1.effect) return;

    expect(a1.condition).toMatchObject({
      type: "equipped-count",
      filter: { typeBox: { types: ["Equipment"], subtypes: ["Base", "Arms"] } },
      comparison: { op: "gte", value: 1 },
    });

    expect(a1.effect).toMatchObject({
      type: "sequence",
      steps: [
        {
          type: "transform",
          into: "this",
          target: {
            selector: "object",
            player: "controller",
            zones: ["equipment-arms"],
            filter: { typeBox: { types: ["Equipment"], subtypes: ["Base", "Arms"] } },
            count: 1,
          },
        },
        {
          type: "equip",
          target: { selector: "self" },
        },
      ],
    });
  });

  it("model guard: a2 transform different-name → optional GY p6 AAC deck fifth (×2 if hero)", () => {
    const a2 = evoSteelSoulControllerBlue.base.abilities?.[1];
    expect(a2?.kind).toBe("static");
    if (a2?.kind !== "static" || !a2.effect) return;
    expect(a2.staticKind).toBe("triggered");
    expect(a2.trigger).toMatchObject({
      event: {
        name: "transform",
        filter: { typeBox: { subtypes: ["Evo"] }, hasStatus: "different-name" },
      },
    });
    expect(a2.effect).toMatchObject({
      type: "repeat",
      effect: {
        type: "optional",
        effect: {
          type: "move-card",
          target: {
            zones: ["graveyard"],
            filter: {
              typeBox: {
                types: ["Action"],
                subtypes: ["Attack"],
              },
              power: { op: "eq", value: 6 },
            },
          },
          to: {
            zone: "deck",
            position: { index: 5 },
          },
        },
      },
    });
    expect(evoSteelSoulControllerBlue.base.keywords).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "temper" })]),
    );
  });

  it("AAA production: play with a base arms equipped → transform base under Evo, equip this", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arms: [evoBetaBaseArmsBlue],
        hand: [evoSteelSoulControllerBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      { autoPassPriority: false },
    );
    const Dash = game.as(dash);
    const baseArmsId = Dash.findCardInZone("arms", evoBetaBaseArmsBlue);
    const evoId = Dash.findCardInZone("hand", evoSteelSoulControllerBlue);
    Dash.play(evoSteelSoulControllerBlue);
    drain(game);

    expect(Dash.zone("arms")).toEqual([evoSteelSoulControllerBlue.canonicalId]);
    expect(Dash.zone("arms")).not.toContain(evoBetaBaseArmsBlue.canonicalId);
    expect(game.getState().containers.subcardsByHostId[evoId]).toContain(baseArmsId);
  });

  it("AAA a2 reproof: different-name transform moves a real 6-power AAC from graveyard into the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arms: [evoBetaBaseArmsBlue],
        hand: [evoSteelSoulControllerBlue],
        graveyard: [throttleRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { hero: bravo, deck: 6 },
      { autoPassPriority: false },
    );
    const Dash = game.as(dash);
    Dash.play(evoSteelSoulControllerBlue);
    drain(game, true);
    expect(Dash.zone("graveyard")).not.toContain(throttleRed.canonicalId);
    expect(Dash.zone("deck")).toContain(throttleRed.canonicalId);
  });
});
