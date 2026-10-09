import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  requireSingleFace,
} from "./class-bonus-test-champion.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { fireball } from "../cards/DOA/actions/fireball.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";
export function proveEntryEmpower(card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>) {
  for (const matches of [false, true])
    for (const expired of [false, true])
      it(`empowers only the next Spell this turn, class=${matches}, expired=${expired}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(card, matches, "activation-discount"),
        );
        const spellCost = requireSingleFace(champion).typeLine.classes.includes("MAGE") ? 2 : 4;
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                card,
                fireball,
                fireball,
                ...Array.from({ length: 14 }, () => woodlandSquirrels),
              ],
              "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: { "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels) },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          foe = q.card(champion);
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(-n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        p.activate(card, { reservePayment: pay(2) });
        passEffectsStack(game);
        p.activate(p.cards(woodlandSquirrels, { zone: "hand" })[0]!, { reservePayment: [] });
        passEffectsStack(game);
        if (expired) {
          advanceToMain(game, q.id);
          advanceToMain(game, p.id);
        }
        const spells = p.cards(fireball, { zone: "hand" });
        p.activate(spells[0]!, {
          reservePayment: pay(spellCost),
          targets: { "target-1": [foe.objectId] },
        });
        passEffectsStack(game);
        const first = matches && !expired ? 3 : 1;
        expect(game.state.objects[foe.objectId]!.damage).toBe(first);
        p.activate(spells[1]!, {
          reservePayment: pay(spellCost),
          targets: { "target-1": [foe.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[foe.objectId]!.damage).toBe(first + 1);
      });
}
