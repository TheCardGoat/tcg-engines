import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { conduitOfTheMadMage } from "../allies/conduit-of-the-mad-mage.ts";
import { arcaneDisposition } from "../actions/arcane-disposition.ts";
import { fireball } from "../actions/fireball.ts";
import { erraticBolt } from "../actions/erratic-bolt.ts";
import { auravoltCurrent } from "../../RDO/actions/auravolt-current.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { describe } from "vitest";
import { proveChampionLineage, lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { raiStormSeer } from "./rai-storm-seer.ts";

/** @covers g92bHLtTNl-a1 */
describe("Rai, Storm Seer \u2014 g92bHLtTNl-a1", () => {
  proveChampionLineage({ card: raiStormSeer, lineageName: "Rai", level: 3, memoryCost: 3 });
});

/** @covers g92bHLtTNl-a2 */
describe("Rai Storm Seer's exact banishment characteristics", () => {
  for (const count of [0, 1, 3])
    it(`counts ${count} own arcane Mage Spells and updates after a real banishment`, () => {
      const opponent = createClassBonusTestChampion(erraticBolt, false, "activation-discount"),
        game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion: lineageTestChampion("Rai", 0),
            lineage: [lineageTestChampion("Rai", 1), lineageTestChampion("Rai", 2), raiStormSeer],
            zones: {
              banishment: [
                ...Array.from({ length: count }, () => arcaneDisposition),
                auravoltCurrent,
                conduitOfTheMadMage,
                fireball,
              ],
              graveyard: [arcaneDisposition],
              hand: [erraticBolt, ...Array.from({ length: 4 }, () => arcaneDisposition)],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: { champion: opponent, zones: { banishment: [arcaneDisposition] } },
        });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        hero = p.card(lineageTestChampion("Rai", 0)),
        level = () =>
          deriveGrandArchiveNumericProperty(game.state.objects[hero.objectId]!, "level", {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          });
      p.activate(erraticBolt, {
        reservePayment: p
          .cards(arcaneDisposition, { zone: "hand" })
          .map((c) => ({ kind: "card", cardId: c.objectId })),
        targets: { "target-1": [q.card(opponent).objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[q.card(opponent).objectId]!.damage).toBe(3 + count);
      expect(level()).toBe(3 + count);
      answerDecision(game, "resolve-optional-effect", true);
      passEffectsStack(game);
      expect(game.state.decision).toBeNull();
      expect(level()).toBe(5 + count);
      expect(p.cards(arcaneDisposition, { zone: "banishment" })).toHaveLength(count + 2);
      expect(q.cards(arcaneDisposition, { zone: "banishment" })).toHaveLength(1);
      expect(p.zone("hand")).toHaveLength(2);
    });
});
