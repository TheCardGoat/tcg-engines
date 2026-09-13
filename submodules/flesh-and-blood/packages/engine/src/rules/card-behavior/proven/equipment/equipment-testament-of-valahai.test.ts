/**
 * MPG004 Testament of Valahai — Guardian Off-Hand d1 guardwell.
 * Printed: If you control three or more Seismic Surge tokens, this gets
 * +2{d}. If you control six or more, instead this gets +4{d}.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine, type FabFixtureCardEntry } from "../../../../index.ts";
import { buildFabRulesView } from "../../../state-rules-view.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { fabToken } from "../../../../testing/test-fixtures.ts";
import { testamentOfValahai } from "../../../../../../cards/src/cards/equipment/testament-of-valahai.ts";

function valahaiDefense(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
): number | undefined {
  const state = game.getState();
  const instanceId = state.containers.zonesByPlayerId[playerId]?.weapon2.find(
    (id) => state.objects[id]?.canonicalId === testamentOfValahai.canonicalId,
  );
  if (!instanceId) return undefined;
  return buildFabRulesView(state).object({
    instanceId,
    incarnation: state.objects[instanceId]!.incarnation,
  })?.current.numeric.defense;
}

function setup(
  arena: readonly FabFixtureCardEntry[] | undefined,
): ReturnType<typeof FabTestEngine.start> {
  return FabTestEngine.start(
    { hero: bravo, weapon2: [testamentOfValahai], arena, deck: 6 },
    { hero: dash, deck: 6 },
    { autoPassPriority: false },
  );
}

const surge = () => fabToken("seismic-surge");

describe("testament-of-valahai (MPG004)", () => {
  it("AAA: three Seismic Surge tokens → +2 defense (d1 → d3)", () => {
    const game = setup([surge(), surge(), surge()]);
    expect(valahaiDefense(game, game.as(bravo).id)).toBe(3);
  });

  it("AAA: six Seismic Surge tokens → +4 INSTEAD of +2 (d1 → d5)", () => {
    const game = setup([surge(), surge(), surge(), surge(), surge(), surge()]);
    expect(valahaiDefense(game, game.as(bravo).id)).toBe(5);
  });

  it("boundary: two or fewer tokens → no bonus (d1)", () => {
    const game = setup([surge(), surge()]);
    expect(valahaiDefense(game, game.as(bravo).id)).toBe(1);
  });
});
