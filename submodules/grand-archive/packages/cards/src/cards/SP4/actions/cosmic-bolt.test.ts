import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { cosmicBolt } from "./cosmic-bolt.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers vpmu6gvnta-a2 */
describe("Cosmic Bolt damage", () => {
  for (const graveyard of [0, 1, 2])
    for (const banishment of [0, 1, 2])
      for (const targetKind of ["champion", "ally"] as const)
        it(`counts ${graveyard} graveyard and ${banishment} banished copies against a ${targetKind}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(cosmicBolt, false, "activation-discount"),
          );
          const copies = (n: number) => Array.from({ length: n }, () => cosmicBolt);
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [cosmicBolt, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
                graveyard: [...copies(graveyard), woodlandSquirrels],
                banishment: [...copies(banishment), woodlandSquirrels],
                "main-deck": copies(2),
              },
            },
            playerTwo: {
              champion,
              zones: { field: [giantTortoise], graveyard: copies(2), banishment: copies(2) },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const target = q.card(targetKind === "champion" ? champion : giantTortoise);
          const source = p.card(cosmicBolt, { zone: "hand" });
          p.activate(source, {
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
            targets: { "target-1": [target.objectId] },
          });
          expect(game.state.objects[target.objectId]!.damage).toBe(0);
          passEffectsStack(game);
          const damage = 4 + 2 * (graveyard + banishment);
          expect(game.state.objects[target.objectId]!.damage).toBe(
            targetKind === "ally" && damage >= 6 ? 0 : damage,
          );
          expect(q.cards(giantTortoise, { zone: "graveyard" })).toHaveLength(
            targetKind === "ally" && damage >= 6 ? 1 : 0,
          );
          expect(p.cards(cosmicBolt, { zone: "graveyard" })).toHaveLength(graveyard + 1);
        });
});

import { proveStarcallingCard } from "../../../testing/starcalling-card.ts";
/** @covers vpmu6gvnta-a1 */
describe("cosmicBolt Starcalling", () => proveStarcallingCard(cosmicBolt, 2, "bolt"));
