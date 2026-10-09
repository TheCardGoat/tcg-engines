import { describe } from "vitest";

import { proveFixedDamageAction } from "../../../testing/fixed-damage-action.ts";
import { flaredIridescence } from "./flared-iridescence.ts";

/** @covers t2lW0Q5KJS-a1 */
describe("Flared Iridescence — fixed damage", () => {
  proveFixedDamageAction({
    card: flaredIridescence,
    cost: 2,
    damage: 4,
    targetKind: "unit",
  });
});

import { proveSheenEphemerate } from "../../../testing/sheen-ephemerate.ts";
/** @covers t2lW0Q5KJS-a2 */
describe("Flared Iridescence — Merlin and Sheen 10 Ephemerate", () =>
  proveSheenEphemerate(flaredIridescence, 10, 2, true));

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import {
  enableAllTestElements,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
/** @covers t2lW0Q5KJS-a3 */
describe("Flared Iridescence — separate Merlin level 5 Ephemerate permission", () => {
  for (const named of [false, true])
    for (const level of [4, 5, 6])
      for (const zone of ["hand", "graveyard", "banishment"] as const)
        it(`Merlin=${named}, level=${level}, zone=${zone}`, () => {
          const champion = enableAllTestElements(
              grantTestChampionLevel(lineageTestChampion(named ? "Merlin" : "Other", 0), level),
            ),
            foe = lineageTestChampion("Opponent", 0);
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  ...(zone === "hand" ? [flaredIridescence] : []),
                  woodlandSquirrels,
                  woodlandSquirrels,
                  woodlandSquirrels,
                ],
                graveyard: zone === "graveyard" ? [flaredIridescence] : [],
                banishment: zone === "banishment" ? [flaredIridescence] : [],
              },
            },
            playerTwo: { champion: foe },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = p.card(flaredIridescence),
            activate = (cost: number, method = zone !== "hand") =>
              p.activate(source, {
                ...(method ? { activationMethod: "ephemerate" as const } : {}),
                reservePayment: p
                  .cards(woodlandSquirrels, { zone: "hand" })
                  .slice(0, cost)
                  .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
                targets: { "target-1": [q.card(foe).objectId] },
              });
          expect(game.state.players[p.id]!.mastery).toBeUndefined();
          const before = game.state;
          if (zone === "banishment" || (zone === "graveyard" && (!named || level < 5))) {
            expect(() => activate(2)).toThrow();
            expect(game.state).toEqual(before);
            return;
          }
          for (const cost of [1, 3]) {
            expect(() => activate(cost)).toThrow();
            expect(game.state).toEqual(before);
          }
          expect(() => activate(2, zone === "hand")).toThrow();
          expect(game.state).toEqual(before);
          activate(2);
          expect(game.state.objects[source.objectId]!.states.has("ephemeral")).toBe(
            zone === "graveyard",
          );
          passEffectsStack(game);
          expect(game.state.objects[q.card(foe).objectId]!.damage).toBe(4);
          expect(game.state.objects[source.objectId]!.zone).toBe(
            zone === "hand" ? "graveyard" : "banishment",
          );
        });
});
