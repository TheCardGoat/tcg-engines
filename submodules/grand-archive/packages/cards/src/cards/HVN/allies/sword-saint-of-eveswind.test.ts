import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { swordSaintOfEveswind } from "./sword-saint-of-eveswind.ts";
import { sylphsEnvelopment } from "../actions/sylphs-envelopment.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";

/** @covers a7lr70xglo-a1 */
describe("Sword Saint of Eveswind — entry from banishment", () => {
  for (const matching of [false, true])
    for (const initiallyInHand of [false, true])
      it(`checks the entry zone: class=${matching}, hand=${initiallyInHand}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(swordSaintOfEveswind, matching, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: initiallyInHand ? [] : [swordSaintOfEveswind],
              hand: [
                ...(initiallyInHand ? [swordSaintOfEveswind] : []),
                sylphsEnvelopment,
                sylphsEnvelopment,
                ...Array.from({ length: 6 }, () => woodlandSquirrels),
              ],
            },
          },
          playerTwo: { champion },
        });
        const p = game.player("player-one"),
          saint = p.card(swordSaintOfEveswind);
        const payment = () =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 2)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        if (initiallyInHand) {
          p.activate(saint, { reservePayment: payment() });
          passEffectsStack(game);
        }
        expect(game.state.objects[saint.objectId]!.counters.buff ?? 0).toBe(0);
        for (let n = 0; n < 2; n++) {
          const incarnation = game.state.objects[saint.objectId]!.incarnation;
          p.activate(p.cards(sylphsEnvelopment, { zone: "hand" })[0]!, {
            reservePayment: payment(),
            targets: { "target-ally": [saint.objectId] },
          });
          passEffectsStack(game);
          const returned = game.state.objects[saint.objectId]!;
          expect(returned.zone).toBe("field");
          expect(returned.incarnation).toBeGreaterThan(incarnation);
          expect(returned.states.has("rested")).toBe(true);
          expect(returned.counters.buff ?? 0).toBe(matching ? 2 : 0);
          expect(returned.controllerId).toBe(p.id);
        }
      });
});

import { rearingRebound } from "../actions/rearing-rebound.ts";
import { advanceToMain } from "../../../testing/decisions.ts";
for (const matching of [false, true])
  for (const own of [false, true])
    it(`checks the returning owner's class after suppression: class=${matching}, own=${own}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(swordSaintOfEveswind, matching, "activation-discount"),
      );
      const opponent = enableAllTestElements(
        createClassBonusTestChampion(swordSaintOfEveswind, !matching, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: own ? [swordSaintOfEveswind] : [],
            hand: [rearingRebound, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            "main-deck": [woodlandSquirrels],
          },
        },
        playerTwo: {
          champion: opponent,
          zones: {
            field: own ? [] : [swordSaintOfEveswind],
            "main-deck": [woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        owner = own ? p : q;
      const saint = owner.card(swordSaintOfEveswind);
      p.activate(p.card(rearingRebound), {
        targets: { "target-1": [saint.objectId] },
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
      });
      passEffectsStack(game);
      expect(game.state.objects[saint.objectId]!.zone).toBe("banishment");
      advanceToMain(game, q.id);
      const returned = game.state.objects[saint.objectId]!;
      expect(returned.zone).toBe("field");
      expect(returned.controllerId).toBe(owner.id);
      expect(returned.counters.buff ?? 0).toBe((own ? matching : !matching) ? 2 : 0);
    });
