import { describe } from "vitest";
import { automatonForgewarden } from "./automaton-forgewarden.ts";
import { proveTokenCountStats } from "../../../testing/token-count-stats.ts";
/** @covers XOfDNzX4ck-a1 */
describe("Automaton Forgewarden — capped token stats", () =>
  proveTokenCountStats(automatonForgewarden, false));

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { powercell } from "../../MRC/tokens/powercell.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { firetunedAutomaton } from "../../ALC/allies/firetuned-automaton.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
describe("Automaton Forgewarden — damage and token-loss survival", () => {
  for (const matching of [false, true])
    for (const count of [3, 4]) {
      it(`class=${matching}, tokens=${count}`, () => {
        const champion = grantTestChampionLevel(
          enableAllTestElements(
            createClassBonusTestChampion(automatonForgewarden, matching, "activation-discount"),
          ),
          matching ? 3 : 0,
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [
                automatonForgewarden,
                firetunedAutomaton,
                ...Array.from({ length: count }, () => powercell),
              ],
              hand: [fireball, ...Array.from({ length: 8 }, () => woodlandSquirrels)],
            },
          },
          playerTwo: { champion },
        });
        const p = game.player("player-one"),
          source = p.card(automatonForgewarden);
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        p.activate(fireball, {
          reservePayment: pay(4),
          targets: { "target-1": [source.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.damage).toBe(matching ? 4 : 1);
        expect(game.state.objects[source.objectId]!.zone).toBe("field");
        let remaining = count;
        for (const cell of p.cards(powercell, { zone: "field" })) {
          p.activateAbility(cell, "qzzadf9q1v-a1", {
            reservePayment: pay(1),
            targets: { "target-1": [p.card(firetunedAutomaton).objectId] },
          });
          remaining--;
          expect(game.state.objects[source.objectId]!.zone).toBe(
            matching && remaining < 3 ? "graveyard" : "field",
          );
          passEffectsStack(game);
        }
      });
    }
});
