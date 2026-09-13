import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { ensnaringFumes } from "./ensnaring-fumes.ts";

/** @covers wPKxvzTmqq-a3 */
describe("Ensnaring Fumes — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: ensnaringFumes });
});
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { acceptedContract } from "./accepted-contract.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers wPKxvzTmqq-a1 @covers wPKxvzTmqq-a2 */
describe("Ensnaring Fumes replaces reserve with exactly three preparation", () => {
  for (const alternate of [false, true])
    for (const populated of [false, true])
      it(`alternative payment=${alternate}, allies=${populated}`, () => {
        const champion = createClassBonusTestChampion(ensnaringFumes, false, "activation-discount"),
          game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  ensnaringFumes,
                  acceptedContract,
                  ...Array.from({ length: 10 }, () => woodlandSquirrels),
                ],
                field: [trainingSword, ...(populated ? [woodlandSquirrels, giantTortoise] : [])],
                graveyard: [woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [trainingSword, ...(populated ? [woodlandSquirrels, giantTortoise] : [])],
                graveyard: [woodlandSquirrels],
              },
            },
          });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(champion),
          ownAllies = p
            .zone("field")
            .filter((c) =>
              [woodlandSquirrels.canonicalId, giantTortoise.canonicalId].includes(c.definitionId),
            ),
          foeAllies = q
            .zone("field")
            .filter((c) =>
              [woodlandSquirrels.canonicalId, giantTortoise.canonicalId].includes(c.definitionId),
            ),
          payment = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const empty = game.state;
        expect(() => p.activate(ensnaringFumes, { costOptionIndex: 1 })).toThrow();
        expect(game.state).toEqual(empty);
        p.activate(acceptedContract, { reservePayment: payment(5) });
        passEffectsStack(game);
        const before = game.state;
        expect(() => p.activate(ensnaringFumes, { reservePayment: payment(4) })).toThrow();
        expect(game.state).toEqual(before);
        p.activate(
          ensnaringFumes,
          alternate ? { costOptionIndex: 1 } : { reservePayment: payment(5) },
        );
        expect(game.state.objects[hero.objectId]!.counters.preparation).toBe(alternate ? 0 : 3);
        expect(p.zone("memory")).toHaveLength(alternate ? 5 : 10);
        expect(p.zone("field").map((c) => c.objectId)).toEqual(
          expect.arrayContaining(ownAllies.map((c) => c.objectId)),
        );
        passEffectsStack(game);
        expect(p.zone("hand").map((c) => c.objectId)).toEqual(
          expect.arrayContaining(ownAllies.map((c) => c.objectId)),
        );
        expect(q.zone("hand").map((c) => c.objectId)).toEqual(foeAllies.map((c) => c.objectId));
        expect(p.zone("hand")).toHaveLength((alternate ? 5 : 0) + ownAllies.length);
        for (const owner of [p, q]) {
          expect(owner.card(trainingSword, { zone: "field" })).toBeDefined();
          expect(owner.cards(woodlandSquirrels, { zone: "graveyard" })).toHaveLength(1);
          expect(owner.zone("field")).toHaveLength(2);
        }
      });
});
