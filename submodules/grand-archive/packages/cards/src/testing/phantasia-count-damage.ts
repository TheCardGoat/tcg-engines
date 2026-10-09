import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { quietRefraction } from "../cards/SP4/phantasias/quiet-refraction.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";
export function provePhantasiaCountDamage({
  card,
  cost,
  base,
  championOnly = false,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  cost: number;
  base: number;
  championOnly?: boolean;
}): void {
  for (const count of [0, 1, 2])
    for (const owner of ["player-one", "player-two"])
      for (const kind of championOnly ? ["champion"] : ["champion", "ally"])
        it(`counts ${count} own phantasias against ${owner}'s ${kind}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(card, false, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [
                  trainingSword,
                  giantTortoise,
                  ...Array.from({ length: count }, () => quietRefraction),
                ],
                graveyard: [quietRefraction],
                banishment: [quietRefraction],
                hand: [card, ...Array.from({ length: cost }, () => woodlandSquirrels)],
              },
            },
            playerTwo: {
              champion,
              zones: { field: [giantTortoise, quietRefraction, quietRefraction] },
            },
          });
          const p = game.player("player-one"),
            target = game.player(owner).card(kind === "champion" ? champion : giantTortoise);
          const reservePayment = p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
          const before = game.state;
          expect(() =>
            p.activate(card, {
              reservePayment,
              targets: {
                "target-1": [p.card(championOnly ? giantTortoise : trainingSword).objectId],
              },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
          p.activate(card, { reservePayment, targets: { "target-1": [target.objectId] } });
          expect(game.state.objects[target.objectId]!.damage).toBe(0);
          passEffectsStack(game);
          expect(game.state.objects[target.objectId]!.damage).toBe(base + count);
          expect(p.cards(card, { zone: "graveyard" })).toHaveLength(1);
        });
}
