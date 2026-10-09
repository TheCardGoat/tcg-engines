import { describe, expect, it } from "vitest";
import { moltenEcho } from "./molten-echo.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { fracturedMemoriesFixture } from "../../../testing/fractured-memories-fixture.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers p7FWS3DA4a-a2 */
describe("Molten Echo mastery counter", () => {
  for (const own of [false, true])
    for (const ally of [false, true])
      it(`damages a unit and increments own mastery, own=${own}, ally=${ally}`, () => {
        const { game, p, q, hero, foe, pay } = fracturedMemoriesFixture([moltenEcho]);
        const target = ally ? (own ? p : q).card(giantTortoise) : own ? hero : foe;
        p.activate(moltenEcho, {
          reservePayment: pay(2),
          targets: { "target-1": [target.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.damage).toBe(1);
        expect(game.state.players[p.id]!.mastery?.counters["named:sheen"]).toBe(1);
        expect(game.state.players[q.id]!.mastery).toBeUndefined();
      });
});

import { proveChampionEphemerate } from "../../../testing/champion-ephemerate.ts";
/** @covers p7FWS3DA4a-a3 */
describe("Molten Echo Ephemerate", () =>
  proveChampionEphemerate(moltenEcho, "Merlin", 2, "damage"));
