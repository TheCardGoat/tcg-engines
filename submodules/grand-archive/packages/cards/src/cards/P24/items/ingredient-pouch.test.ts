import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { ingredientPouch } from "./ingredient-pouch.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { blightroot } from "../../ALC/tokens/blightroot.ts";
import { fraysia } from "../../ALC/tokens/fraysia.ts";
import { manaroot } from "../../ALC/tokens/manaroot.ts";
import { razorvine } from "../../ALC/tokens/razorvine.ts";
import { silvershine } from "../../ALC/tokens/silvershine.ts";
import { springleaf } from "../../ALC/tokens/springleaf.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
const herbs = [blightroot, fraysia, manaroot, razorvine, silvershine, springleaf];
function fixture(matching: boolean, opponentTurn: boolean, randomSeed = 1) {
  const champion = createClassBonusTestChampion(ingredientPouch, matching, "activation-discount");
  return GrandArchiveTestEngine.startFixture({
    randomSeed,
    definitions: herbs,
    firstPlayer: opponentTurn ? "playerTwo" : "playerOne",
    playerOne: {
      champion,
      zones: {
        field: [ingredientPouch],
        hand: Array.from({ length: 3 }, () => woodlandSquirrels),
        "main-deck": [woodlandSquirrels, woodlandSquirrels],
      },
    },
    playerTwo: {
      champion,
      zones: { field: [springleaf], "main-deck": [woodlandSquirrels, woodlandSquirrels] },
    },
  });
}
/** @covers u7d6soporh-a1 */
describe("Ingredient Pouch's paid, repeatable Gather", () => {
  for (const matching of [false, true])
    for (const opponentTurn of [false, true])
      it(`pays one and rests before gathering an owned awake Herb: class=${matching}, opponent=${opponentTurn}`, () => {
        const game = fixture(matching, opponentTurn),
          p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(ingredientPouch),
          opposing = q.card(springleaf);
        if (opponentTurn) q.pass();
        const tokens = () => p.zone("field").filter((c) => game.state.objects[c.objectId]!.isToken);
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        for (let activation = 0; activation < 2; activation++) {
          if (activation) advanceToMain(game, p.id, game.state.turn.number);
          expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(false);
          for (const invalid of [0, 2]) {
            const before = game.state;
            expect(() =>
              p.activateAbility(source, "u7d6soporh-a1", { reservePayment: pay(invalid) }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          const memory = p.zone("memory").length,
            random = game.state.random;
          p.activateAbility(source, "u7d6soporh-a1", { reservePayment: pay(1) });
          expect(p.zone("memory")).toHaveLength(memory + 1);
          expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
          expect(game.state.random).toEqual(random);
          expect(tokens()).toHaveLength(activation);
          const beforeRepeat = game.state;
          expect(() =>
            p.activateAbility(source, "u7d6soporh-a1", { reservePayment: pay(1) }),
          ).toThrow();
          expect(game.state).toEqual(beforeRepeat);
          const deck = p.zone("main-deck");
          passEffectsStack(game);
          expect(tokens()).toHaveLength(activation + 1);
          expect(game.state.random).not.toEqual(random);
          expect(p.zone("main-deck")).toEqual(deck);
          for (const token of tokens()) {
            expect(herbs.map((h) => h.canonicalId)).toContain(token.definitionId);
            expect(game.state.objects[token.objectId]).toMatchObject({
              ownerId: p.id,
              controllerId: p.id,
              isToken: true,
            });
            expect(game.state.objects[token.objectId]!.states.has("rested")).toBe(false);
          }
          expect(q.cards(springleaf, { zone: "field" })).toEqual([opposing]);
        }
      });

  it("reproduces seeded results and can summon each of the six ingredients", () => {
    const outcomes = new Set<string>();
    for (let seed = 1; seed <= 24; seed++) {
      const run = () => {
        const game = fixture(false, false, seed),
          p = game.player("player-one");
        p.activateAbility(ingredientPouch, "u7d6soporh-a1", {
          reservePayment: [
            { kind: "card", cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
          ],
        });
        passEffectsStack(game);
        const tokens = p.zone("field").filter((c) => game.state.objects[c.objectId]!.isToken);
        expect(tokens).toHaveLength(1);
        return tokens[0]!.definitionId;
      };
      const result = run();
      expect(run()).toBe(result);
      outcomes.add(result);
    }
    expect([...outcomes].sort()).toEqual(herbs.map((h) => h.canonicalId).sort());
  });
});
