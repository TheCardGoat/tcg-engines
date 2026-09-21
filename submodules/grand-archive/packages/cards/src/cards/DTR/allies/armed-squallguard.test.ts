import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { armedSquallguard } from "./armed-squallguard.ts";
import { condemnedTrinket } from "../items/condemned-trinket.ts";
import { exsanguinatingWallop } from "../attacks/exsanguinating-wallop.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers e7782pjg1d-a1 @covers e7782pjg1d-a2 */
describe("Armed Squallguard — attack and ally omens independently modify combat stats", () => {
  for (const mode of ["none", "attack", "ally", "both", "opponent", "unmarked"] as const) {
    it(`checks controlled omen types (${mode})`, () => {
      const champion = createClassBonusTestChampion(armedSquallguard, false, "activation-discount");
      const omens =
        mode === "attack"
          ? [exsanguinatingWallop]
          : mode === "ally"
            ? [woodlandSquirrels]
            : mode === "none"
              ? []
              : [exsanguinatingWallop, woodlandSquirrels];
      const opposing = mode === "opponent",
        unmarked = mode === "unmarked";
      const count = unmarked ? 0 : omens.length;
      const trinkets = Array.from({ length: count }, () => condemnedTrinket);
      const payments = Array.from({ length: count * 3 }, () => woodlandSquirrels);
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: opposing ? "playerTwo" : "playerOne",
        playerOne: {
          champion,
          zones: {
            field: [armedSquallguard, ...(opposing ? [] : trinkets)],
            hand: opposing ? [] : payments,
            graveyard: !opposing && !unmarked ? omens : [],
            banishment: unmarked ? omens : [],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [
              woodlandSquirrels,
              woodlandSquirrels,
              woodlandSquirrels,
              ...(opposing ? trinkets : []),
            ],
            hand: opposing ? payments : [],
            graveyard: opposing ? omens : [],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        owner = opposing ? q : p;
      for (const trinket of owner.cards(condemnedTrinket, { zone: "field" })) {
        const selected = owner.zone("graveyard")[0]!;
        owner.activateAbility(trinket, "21oy1nd4nw-a1", {
          reservePayment: owner
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 3)
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
        if (game.state.decision) answerDecision(game, "resolve-effect-choice", [selected.objectId]);
        passEffectsStack(game);
        expect(game.state.objects[selected.objectId]!.counters.omen).toBe(1);
      }
      if (opposing) advanceToMain(game, p.id);
      const source = p.card(armedSquallguard);
      p.declareAttack(source, q.card(champion));
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(
        mode === "attack" || mode === "both" ? 3 : 2,
      );
      advanceToMain(game, q.id);
      const life = mode === "ally" || mode === "both" ? 3 : 2;
      for (const [index, attacker] of q
        .cards(woodlandSquirrels, { zone: "field" })
        .slice(0, life)
        .entries()) {
        q.declareAttack(attacker, source);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[source.objectId]!.zone).toBe(
          index + 1 < life ? "field" : "graveyard",
        );
      }
    });
  }
});
