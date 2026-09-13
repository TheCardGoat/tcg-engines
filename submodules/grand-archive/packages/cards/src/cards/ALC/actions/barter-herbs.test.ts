import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { blightroot } from "../tokens/blightroot.ts";
import { fraysia } from "../tokens/fraysia.ts";
import { manaroot } from "../tokens/manaroot.ts";
import { razorvine } from "../tokens/razorvine.ts";
import { silvershine } from "../tokens/silvershine.ts";
import { springleaf } from "../tokens/springleaf.ts";
import { barterHerbs } from "./barter-herbs.ts";

const herbs = [blightroot, fraysia, manaroot, razorvine, silvershine, springleaf] as const;

/** @covers p5af098kmo-a2 */
describe("Barter Herbs — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: barterHerbs });
});

/** @covers p5af098kmo-a1 */
describe("Barter Herbs — sacrifice up to two Herbs for chosen replacements", () => {
  for (const sacrificeCount of [0, 1, 2]) {
    it(`sacrifices ${sacrificeCount} and summons exactly ${sacrificeCount} chosen tokens`, () => {
      const champion = createClassBonusTestChampion(barterHerbs, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [springleaf, manaroot, woodlandSquirrels],
            hand: [barterHerbs, woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { field: [springleaf] } },
        definitions: herbs,
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const controlled = [
        player.card(springleaf, { zone: "field" }),
        player.card(manaroot, { zone: "field" }),
      ];
      player.activate(barterHerbs, {
        reservePayment: [
          { kind: "card", cardId: player.card(woodlandSquirrels, { zone: "hand" }).objectId },
        ],
      });
      passEffectsStack(game);
      expect(game.state.decision?.kind).toBe("resolve-effect-choice");
      for (const invalid of [
        controlled.map((card) => card.objectId).concat(controlled[0]!.objectId),
        [opponent.card(springleaf, { zone: "field" }).objectId],
        [player.card(woodlandSquirrels, { zone: "field" }).objectId],
      ]) {
        const before = game.state;
        expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
        expect(game.state).toEqual(before);
      }
      const sacrificed = controlled.slice(0, sacrificeCount);
      answerDecision(
        game,
        "resolve-effect-choice",
        sacrificed.map((card) => card.objectId),
      );

      const choices = [blightroot, fraysia].slice(0, sacrificeCount);
      for (const choice of choices) {
        expect(game.state.decision?.kind).toBe("resolve-effect-choice");
        const face =
          choice.layout.kind === "single-faced" ? choice.layout.face : choice.layout.defaultFace;
        answerDecision(game, "resolve-effect-choice", face.name);
      }
      passEffectsStack(game);

      for (const sacrificedHerb of sacrificed)
        expect(game.state.objects[sacrificedHerb.objectId]).toBeUndefined();
      for (const choice of choices) {
        const token = player.card(choice, { zone: "field" });
        expect(game.state.objects[token.objectId]!.isToken).toBe(true);
      }
      expect(opponent.cards(springleaf, { zone: "field" })).toHaveLength(1);
      expect(
        player.zone("field").filter((object) => game.state.objects[object.objectId]!.isToken),
      ).toHaveLength(2);
    });
  }
});
