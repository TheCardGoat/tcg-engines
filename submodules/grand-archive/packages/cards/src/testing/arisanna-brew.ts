import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { lineageTestChampion } from "./champion-lineage.ts";
import { enableAllTestElements } from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { blightroot } from "../cards/ALC/tokens/blightroot.ts";
import { silvershine } from "../cards/ALC/tokens/silvershine.ts";
import { razorvine } from "../cards/ALC/tokens/razorvine.ts";
import { manaroot } from "../cards/ALC/tokens/manaroot.ts";
export function proveArisannaBrew(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  different: boolean,
  cost: number,
) {
  const recipe = different
    ? [blightroot, silvershine, razorvine, manaroot]
    : [blightroot, blightroot, silvershine, silvershine, razorvine, razorvine];
  for (const named of [false, true])
    for (const brewed of [false, true])
      for (const reverse of [false, true])
        it(`Arisanna=${named}, brewed=${brewed}, reversed recipe=${reverse}`, () => {
          const champion = enableAllTestElements(
            lineageTestChampion(named ? "Arisanna" : "Other", 0),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [...recipe, blightroot, woodlandSquirrels],
                hand: [card, ...Array.from({ length: cost + 1 }, () => woodlandSquirrels)],
              },
            },
            playerTwo: { champion, zones: { field: recipe } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = p.card(card),
            herbs = p.zone("field").filter((c) => game.state.objects[c.objectId]!.isToken),
            ids = herbs.slice(0, recipe.length).map((c) => c.objectId),
            extra = herbs.at(-1)!.objectId;
          const chosen = reverse ? [...ids].reverse() : ids;
          const pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          const activate = (ingredients: typeof ids) =>
            p.activate(source, { activationMethod: "brew", brewIngredientIds: ingredients });
          const before = game.state;
          if (brewed) {
            const wrongNames = [...ids.slice(0, -1), extra];
            for (const invalid of [
              [],
              ids.slice(1),
              [...ids, extra],
              [ids[0]!, ...ids.slice(0, -1)],
              wrongNames,
              [...ids.slice(1), p.card(woodlandSquirrels, { zone: "field" }).objectId],
              [...ids.slice(1), p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId],
              q
                .zone("field")
                .filter((c) => game.state.objects[c.objectId]!.isToken)
                .map((c) => c.objectId),
            ]) {
              expect(() => activate(invalid)).toThrow();
              expect(game.state).toEqual(before);
            }
            expect(() =>
              p.activate(source, {
                activationMethod: "brew",
                brewIngredientIds: chosen,
                reservePayment: pay(1),
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
            if (!named) {
              expect(() => activate(chosen)).toThrow();
              expect(game.state).toEqual(before);
              return;
            }
            activate(chosen);
            expect(p.zone("memory")).toHaveLength(0);
            for (const id of ids) expect(game.state.objects[id]?.zone).not.toBe("field");
            expect(game.state.objects[extra]!.zone).toBe("field");
          } else {
            for (const n of [cost - 1, cost + 1]) {
              expect(() => p.activate(source, { reservePayment: pay(n) })).toThrow();
              expect(game.state).toEqual(before);
            }
            p.activate(source, { reservePayment: pay(cost) });
            expect(p.zone("memory")).toHaveLength(cost);
            for (const id of ids) expect(game.state.objects[id]!.zone).toBe("field");
          }
          expect(game.state.stack.at(-1)?.activationStates.includes("brewed")).toBe(brewed);
          passEffectsStack(game);
          expect(game.state.objects[source.objectId]!.zone).toBe("field");
          expect(game.state.objects[source.objectId]!.activationStates.has("brewed")).toBe(brewed);
        });
}
