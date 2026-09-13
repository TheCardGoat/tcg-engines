/**
 * SUP073 Strong Stomach for Adversity — Reviled Guardian Chest d1 Blade Break.
 *
 * Printed:
 *   If you control a Confidence and a Might token, this gets +2{d}.
 *   Blade Break
 *
 * Reasoning (case-by-case — SUP011 sibling):
 * 1. Continuous while-condition: Confidence and Might tokens controlled.
 * 2. MODEL: English residue name "Confidence And A Might" + this-turn duration
 *    → and of two control-object + permanent (plate-of-tough-love fix).
 * 3. Alone each token → d1; both → d3; BB on defend.
 *
 * Status: ✅ both tokens +2{d}; alone d1; BB; remodel.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { fabToken } from "../../../../testing/test-fixtures.ts";
import { strongStomachForAdversity } from "../../../../../../cards/src/cards/equipment/strong-stomach-for-adversity.ts";
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
    (id) => state.objects[id]?.canonicalId === strongStomachForAdversity.canonicalId,
  );
  if (!instanceId) return undefined;
  const view = buildFabRulesView(state);
  return view.object({
    instanceId,
    incarnation: state.objects[instanceId]!.incarnation,
  })?.current.numeric.defense;
}

describe("strong-stomach-for-adversity (SUP073)", () => {
  it("core mechanic: Confidence + Might tokens → +2{d} (d3)", () => {
    const both = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        chest: [strongStomachForAdversity],
        arena: [fabToken("confidence"), fabToken("might")],
        life: LIFE,
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = both.as(bravo);
    expect(chestDefense(both, Defender.id)).toBe(BUFF_D);

    both.as(dash).attackWith(snatchRed);
    Defender.defendWith(strongStomachForAdversity);
    both.helpers.resolveRestOfCombat();

    expect(Defender.life()).toBe(LIFE - (SNATCH - BUFF_D));
    expect(Defender.zone("graveyard")).toContain(strongStomachForAdversity.canonicalId);
  });

  it("boundaries: alone Confidence or Might stay d1; model and-control", () => {
    const confOnly = FabTestEngine.start(
      {
        hero: bravo,
        chest: [strongStomachForAdversity],
        arena: [fabToken("confidence")],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(chestDefense(confOnly, confOnly.as(bravo).id)).toBe(BASE_D);

    const mightOnly = FabTestEngine.start(
      {
        hero: bravo,
        chest: [strongStomachForAdversity],
        arena: [fabToken("might")],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(chestDefense(mightOnly, mightOnly.as(bravo).id)).toBe(BASE_D);

    const a1 = strongStomachForAdversity.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static" || !a1.effect) return;
    expect(a1.condition).toMatchObject({
      type: "and",
      conditions: [
        {
          type: "control-object",
          filter: { name: "Confidence", typeBox: { metatypes: ["Token"] } },
        },
        { type: "control-object", filter: { name: "Might", typeBox: { metatypes: ["Token"] } } },
      ],
    });
    expect(a1.effect).toMatchObject({
      type: "modify-numeric",
      property: "defense",
      op: "add",
      amount: 2,
      duration: "permanent",
    });
    expect(strongStomachForAdversity.base.keywords?.some((k) => k.name === "blade-break")).toBe(
      true,
    );
  });
});
