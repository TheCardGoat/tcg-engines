import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../cards/ALC/items/potion-of-healing.ts";
import { featheryTune } from "../cards/HVN/actions/feathery-tune.ts";
import { fledgling } from "../cards/HVN/tokens/fledgling.ts";
import { productionCrawldroid } from "../cards/PRD/allies/production-crawldroid.ts";
import { powercell } from "../cards/MRC/tokens/powercell.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";
export function proveNextEntryRested({
  card,
  cost,
  items,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  cost: number;
  items: boolean;
}): void {
  for (const own of [false, true])
    for (const expired of [false, true])
      it(`rests the first batch only: own=${own}, expired=${expired}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(card, false, "activation-discount"),
        );
        const summon = items ? productionCrawldroid : featheryTune,
          token = items ? powercell : fledgling,
          other = items ? woodlandSquirrels : potionOfHealing;
        const activeHand = [
          summon,
          summon,
          other,
          ...Array.from({ length: 12 }, () => woodlandSquirrels),
        ];
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: own ? "playerOne" : "playerTwo",
          definitions: [token],
          playerOne: {
            champion,
            zones: {
              hand: [
                card,
                ...(own ? activeHand : Array.from({ length: cost }, () => woodlandSquirrels)),
              ],
              "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: {
              hand: own ? [] : activeHand,
              "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          active = own ? p : q;
        if (!own) q.pass();
        p.activate(card, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, cost)
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
        });
        passEffectsStack(game);
        if (expired) advanceToMain(game, active.id, game.state.turn.number);
        else if (!own) {
          const wait = game.waitState();
          if (wait.kind === "opportunity" && wait.playerId === p.id) p.pass();
        }
        const pay = (n: number) =>
          active
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
        active.activate(active.cards(other, { zone: "hand" })[0]!, {
          reservePayment: pay(items ? 0 : 3),
        });
        passEffectsStack(game);
        const sources = active.cards(summon, { zone: "hand" });
        for (let batch = 0; batch < 2; batch++) {
          const old = new Set(active.cards(token, { zone: "field" }).map((ref) => ref.objectId));
          active.activate(sources[batch]!, { reservePayment: pay(3) });
          passEffectsStack(game);
          const created = active
            .cards(token, { zone: "field" })
            .filter((ref) => !old.has(ref.objectId));
          expect(created).toHaveLength(2);
          for (const ref of created)
            expect(game.state.objects[ref.objectId]!.states.has("rested")).toBe(
              !expired && batch === 0,
            );
        }
      });
}
