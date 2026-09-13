/**
 * SUP011 Plate of Tough Love — Revered Guardian Chest d1 Blade Break.
 *
 * Printed:
 *   If you control a Confidence and a Toughness token, this gets +2{d}.
 *   Blade Break
 *
 * Reasoning (case-by-case):
 * 1. Continuous while-condition: both Confidence and Toughness tokens controlled.
 * 2. MODEL was English residue name:"Confidence And A Toughness" (never matches)
 *    + duration this-turn (wrong for continuous while-control). Remodeled to
 *    and of two control-object gates + duration permanent.
 * 3. Alone Confidence or alone Toughness → base d1; both → d3.
 * 4. Blade Break: defend at d3 → −? BB destroys equipment after defend when
 *    defense was used… actually BB destroys when it defends (regardless of d).
 *    Prove BB path at d1 bare and buffed d3 blocks more.
 *
 * Status: ✅ both tokens +2{d}; alone each d1; BB; remodel and-control.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { fabToken } from "../../../../testing/test-fixtures.ts";
import { plateOfToughLove } from "../../../../../../cards/src/cards/equipment/plate-of-tough-love.ts";
import { buildFabRulesView } from "../../../state-rules-view.ts";

const LIFE = 20;
const SNATCH = 4;
const BASE_D = 1;
const BUFF_D = 3;

function chestDefense(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
): number | undefined {
  const state = game.getState();
  const instanceId = state.containers.zonesByPlayerId[playerId]?.chest.find(
    (id) => state.objects[id]?.canonicalId === plateOfToughLove.canonicalId,
  );
  if (!instanceId) return undefined;
  const view = buildFabRulesView(state);
  return view.object({
    instanceId,
    incarnation: state.objects[instanceId]!.incarnation,
  })?.current.numeric.defense;
}

describe("plate-of-tough-love (SUP011)", () => {
  it("core mechanic: Confidence + Toughness tokens → +2{d} (d3)", () => {
    const both = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        chest: [plateOfToughLove],
        arena: [fabToken("confidence"), fabToken("toughness")],
        life: LIFE,
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = both.as(bravo);
    expect(chestDefense(both, Defender.id)).toBe(BUFF_D);

    both.as(dash).attackWith(snatchRed);
    Defender.defendWith(plateOfToughLove);
    both.helpers.resolveRestOfCombat();

    // Snatch 4 − d3 = 1 damage; Blade Break → GY.
    expect(Defender.life()).toBe(LIFE - (SNATCH - BUFF_D));
    expect(Defender.zone("graveyard")).toContain(plateOfToughLove.canonicalId);
    expect(Defender.zone("chest")).not.toContain(plateOfToughLove.canonicalId);
  });

  it("boundaries: alone Confidence or Toughness stay d1; model and-control; BB bare", () => {
    const confOnly = FabTestEngine.start(
      {
        hero: bravo,
        chest: [plateOfToughLove],
        arena: [fabToken("confidence")],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(chestDefense(confOnly, confOnly.as(bravo).id)).toBe(BASE_D);

    const toughOnly = FabTestEngine.start(
      {
        hero: bravo,
        chest: [plateOfToughLove],
        arena: [fabToken("toughness")],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(chestDefense(toughOnly, toughOnly.as(bravo).id)).toBe(BASE_D);

    const bare = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: LIFE,
        chest: [plateOfToughLove],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    expect(chestDefense(bare, bare.as(bravo).id)).toBe(BASE_D);
    bare.as(dash).attackWith(snatchRed);
    bare.as(bravo).defendWith(plateOfToughLove);
    bare.helpers.resolveRestOfCombat();
    // Snatch 4 − d1 = 3; BB destroys.
    expect(bare.as(bravo).life()).toBe(LIFE - (SNATCH - BASE_D));
    expect(bare.as(bravo).zone("graveyard")).toContain(plateOfToughLove.canonicalId);

    const a1 = plateOfToughLove.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static" || !a1.effect) return;
    expect(a1.staticKind).toBe("continuous");
    expect(a1.condition).toMatchObject({
      type: "and",
      conditions: [
        {
          type: "control-object",
          filter: { name: "Confidence", typeBox: { metatypes: ["Token"] } },
        },
        {
          type: "control-object",
          filter: { name: "Toughness", typeBox: { metatypes: ["Token"] } },
        },
      ],
    });
    expect(a1.effect).toMatchObject({
      type: "modify-numeric",
      property: "defense",
      op: "add",
      amount: 2,
      target: { selector: "self" },
      duration: "permanent",
    });
    expect(plateOfToughLove.base.keywords?.some((k) => k.name === "blade-break")).toBe(true);
    expect(plateOfToughLove.base.numeric.defense).toBe(1);
  });
});
