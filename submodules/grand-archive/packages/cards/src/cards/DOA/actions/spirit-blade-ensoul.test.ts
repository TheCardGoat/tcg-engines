import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceToMain,
  answerDecision,
  passEffectsStack,
  declareResolvedAttack,
} from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { curvedDagger } from "../weapons/curved-dagger.ts";
import { sealedBladeDoa as sealedBlade } from "../weapons/sealed-blade-doa.ts";
import { spiritBladeEnsoul } from "./spirit-blade-ensoul.ts";
/** @covers CQ1bxUyi0Q-a1 */
describe("Ensoul summons cheap Swords but animates and sacrifices all controlled Swords", () => {
  for (const count of [0, 2])
    it(`chooses ${count} Swords`, () => {
      const champion = createClassBonusTestChampion(spiritBladeEnsoul, true, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [spiritBladeEnsoul, ...Array.from({ length: 6 }, () => woodlandSquirrels)],
            "material-deck": [trainingSword, sealedBlade, curvedDagger],
            banishment: [trainingSword],
            graveyard: [trainingSword],
            field: [sealedBlade, curvedDagger],
            "main-deck": [woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: {
            "material-deck": [trainingSword],
            field: [trainingSword],
            "main-deck": [woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        existing = p.card(sealedBlade, { zone: "field" }),
        dagger = p.card(curvedDagger, { zone: "field" }),
        foe = q.card(champion);
      const choices = [
        p.card(trainingSword, { zone: "material-deck" }),
        p.card(trainingSword, { zone: "banishment" }),
      ];
      expect(() => p.declareAttack(existing, foe)).toThrow();
      p.activate(spiritBladeEnsoul, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
      });
      passEffectsStack(game);
      for (const invalid of [
        p.card(sealedBlade, { zone: "material-deck" }),
        p.card(curvedDagger, { zone: "material-deck" }),
        p.card(trainingSword, { zone: "graveyard" }),
        q.card(trainingSword, { zone: "material-deck" }),
      ])
        expect(() => answerDecision(game, "resolve-effect-choice", [invalid.objectId])).toThrow();
      answerDecision(
        game,
        "resolve-effect-choice",
        choices.slice(0, count).map((c) => c.objectId),
      );
      passEffectsStack(game);
      expect(() => p.declareAttack(dagger, foe)).toThrow();
      for (const sword of [existing, ...choices.slice(0, count)]) {
        p.declareAttack(sword, foe);
        game.resolveCombatWithoutRetaliation();
      }
      expect(game.state.objects[foe.objectId]!.damage).toBe(3 + count);
      advanceToMain(game, q.id);
      for (const sword of [existing, ...choices.slice(0, count)])
        expect(game.state.objects[sword.objectId]!.zone).toBe("banishment");
      expect(game.state.objects[dagger.objectId]!.zone).toBe("field");
      expect(q.card(trainingSword, { zone: "field" })).toBeDefined();
      expect(p.card(sealedBlade, { zone: "material-deck" })).toBeDefined();
    });
});
