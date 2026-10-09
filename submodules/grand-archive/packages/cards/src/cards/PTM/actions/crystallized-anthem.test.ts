import { describe, expect, it } from "vitest";
import { crystallizedAnthem } from "./crystallized-anthem.ts";
import { pyroclasticFlow } from "../../MRC/actions/pyroclastic-flow.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { fracturedMemoriesFixture } from "../../../testing/fractured-memories-fixture.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers XfAJlQt9hH-a1 */
describe("Crystallized Anthem prevention", () => {
  it("uses independent buffers and awards mastery sheen only for prevented damage", () => {
    const { game, p, q, hero, foe, pay } = fracturedMemoriesFixture([
      crystallizedAnthem,
      pyroclasticFlow,
      pyroclasticFlow,
    ]);
    p.activate(crystallizedAnthem, { reservePayment: pay(2) });
    passEffectsStack(game);
    for (let hit = 1; hit <= 2; hit++) {
      p.activate(p.cards(pyroclasticFlow, { zone: "hand" })[0]!, { reservePayment: pay(4) });
      passEffectsStack(game);
      expect(game.state.objects[hero.objectId]!.damage).toBe((hit - 1) * 2);
      expect(game.state.objects[p.card(giantTortoise).objectId]!.damage).toBe((hit - 1) * 2);
      expect(game.state.objects[foe.objectId]!.damage).toBe(hit * 2);
      expect(game.state.objects[q.card(giantTortoise).objectId]!.damage).toBe(hit * 2);
      expect(game.state.players[p.id]!.mastery?.counters["named:sheen"]).toBe(4);
    }
  });
});
