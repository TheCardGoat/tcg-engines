import { describe } from "vitest";
import { cordeliaAurousKaiser } from "./cordelia-aurous-kaiser.ts";
import { automatonDrone } from "../../ALC/tokens/automaton-drone.ts";
import { proveSummonOnEnter } from "../../../testing/summon-on-enter.ts";
/** @covers 4mwrg35j36-a1 */
describe("cordeliaAurousKaiser", () => {
  proveSummonOnEnter({
    card: cordeliaAurousKaiser,
    token: automatonDrone,
    cost: 5,
    count: 2,
    abilityId: "4mwrg35j36-a1",
  });
});

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { reposition } from "../../ALC/actions/reposition.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { silvershine } from "../../ALC/tokens/silvershine.ts";
/** @covers 4mwrg35j36-a2 */
describe("Cordelia — token Reservable grant", () => {
  for (const matching of [false, true])
    for (const token of [automatonDrone, silvershine])
      it(`pays with ${token.slug}, matching=${matching}`, () => {
        const champion = createClassBonusTestChampion(
          cordeliaAurousKaiser,
          matching,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [cordeliaAurousKaiser, token, woodlandSquirrels],
              hand: [reposition, reposition],
            },
          },
          playerTwo: { champion, zones: { field: [token] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          target = p.card(champion),
          actions = p.cards(reposition, { zone: "hand" });
        const options = (objectId: typeof target.objectId) => ({
          reservePayment: [{ kind: "reservable" as const, objectId }],
          targets: { "target-1": [target.objectId] },
        });
        const before = game.state;
        for (const ref of [p.card(woodlandSquirrels), q.card(token)]) {
          expect(() => p.activate(actions[0]!, options(ref.objectId))).toThrow();
          expect(game.state).toEqual(before);
        }
        const source = p.card(token);
        if (!matching) {
          expect(() => p.activate(actions[0]!, options(source.objectId))).toThrow();
          expect(game.state).toEqual(before);
          return;
        }
        p.activate(actions[0]!, options(source.objectId));
        expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(true);
        const after = game.state;
        expect(() => p.activate(actions[1]!, options(source.objectId))).toThrow();
        expect(game.state).toEqual(after);
      });
});
