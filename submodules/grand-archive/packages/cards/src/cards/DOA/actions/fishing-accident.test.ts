import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { acceptedContract } from "./accepted-contract.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { fishingAccident } from "./fishing-accident.ts";
/** @covers RRx0KK6g6D-a1 @covers RRx0KK6g6D-a2 */
describe("Fishing Accident's optional preparation replaces resting with owner-deck placement", () => {
  for (const prepared of [false, true])
    for (const ownership of ["own", "opponent"] as const)
      it(`prepared=${prepared}, target=${ownership}`, () => {
        const champion = createClassBonusTestChampion(
            fishingAccident,
            false,
            "activation-discount",
          ),
          game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  fishingAccident,
                  acceptedContract,
                  ...Array.from({ length: 6 }, () => woodlandSquirrels),
                ],
                field: [giantTortoise, trainingSword],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [giantTortoise],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
          });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          owner = ownership === "own" ? p : q,
          target = owner.card(giantTortoise),
          hero = p.card(champion),
          pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const empty = game.state;
        expect(() =>
          p.activate(fishingAccident, {
            prepareAbilityIndexes: [0],
            reservePayment: pay(1),
            targets: { "target-1": [target.objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(empty);
        p.activate(acceptedContract, { reservePayment: pay(5) });
        passEffectsStack(game);
        const before = game.state;
        for (const bad of [hero, p.card(trainingSword)]) {
          expect(() =>
            p.activate(fishingAccident, {
              reservePayment: pay(1),
              targets: { "target-1": [bad.objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        expect(() =>
          p.activate(fishingAccident, {
            ...(prepared ? { prepareAbilityIndexes: [0] as const } : {}),
            targets: { "target-1": [target.objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        const deck = owner.zone("main-deck");
        p.activate(fishingAccident, {
          reservePayment: pay(1),
          ...(prepared ? { prepareAbilityIndexes: [0] as const } : {}),
          targets: { "target-1": [target.objectId] },
        });
        expect(game.state.objects[hero.objectId]!.counters.preparation).toBe(prepared ? 1 : 3);
        passEffectsStack(game);
        if (prepared) {
          expect(owner.zone("main-deck").map((c) => c.objectId)).toEqual([
            ...deck.map((c) => c.objectId),
            target.objectId,
          ]);
          expect(game.state.objects[target.objectId]!.ownerId).toBe(owner.id);
        } else {
          expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(true);
          expect(owner.zone("main-deck")).toEqual(deck);
          advanceToMain(game, q.id);
          if (ownership === "own") advanceToMain(game, p.id);
          expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(false);
        }
      });
});
