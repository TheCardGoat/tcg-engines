import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { veltechArmiger } from "../cards/PRD/allies/veltech-armiger.ts";
import { chargerXUltra } from "../cards/PRD/items/charger-x-ultra.ts";
import { distortReality } from "../cards/RDO/actions/distort-reality.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";
export function proveFilteredCostScope(
  modifier: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  kind: "veltech" | "ultimate",
): void {
  for (const own of kind === "veltech" ? [0, 1] : [0, 1, 2])
    for (const opposing of kind === "veltech" ? [0, 1] : [0, 1, 2])
      for (const qualifies of [false, true])
        it(`${kind} own=${own}, opposing=${opposing}, qualifies=${qualifies}`, () => {
          const sourceCard = qualifies
            ? kind === "veltech"
              ? chargerXUltra
              : distortReality
            : veltechArmiger;
          const base = qualifies && kind === "ultimate" ? 12 : 2;
          const cost =
            kind === "veltech"
              ? base - (qualifies ? own : 0)
              : base + (qualifies ? 3 * (own + opposing) : 0);
          const champion = enableAllTestElements(
            createClassBonusTestChampion(modifier, false, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: Array.from({ length: own }, () => modifier),
                graveyard: [modifier],
                hand: [sourceCard, ...Array.from({ length: cost + 1 }, () => woodlandSquirrels)],
              },
            },
            playerTwo: {
              champion,
              zones: { field: Array.from({ length: opposing }, () => modifier) },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = p.card(sourceCard);
          const payment = (n: number) =>
            p
              .cards(woodlandSquirrels)
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          const before = game.state;
          for (const n of [cost - 1, cost + 1]) {
            expect(() => p.activate(source, { reservePayment: payment(n) })).toThrow();
            expect(game.state).toEqual(before);
          }
          p.activate(source, { reservePayment: payment(cost) });
          expect(p.zone("memory")).toHaveLength(cost);
          expect(q.zone("memory")).toHaveLength(0);
          passEffectsStack(game);
          expect(game.state.decision).toBeNull();
          expect(game.state.objects[source.objectId]!.zone).toBe(
            sourceCard === distortReality ? "graveyard" : "field",
          );
        });
}
