import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { cyclonicFatestone } from "./cyclonic-fatestone.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers us6ou7utnx-a1 */
describe("Windstalker Wolf Pride", () => {
  for (const level of [4, 5])
    it(`transforms through Guo Jia's ability and obeys only at level five, level=${level}`, () => {
      const champion = lineageTestChampion("Guo Jia", 0),
        foe = lineageTestChampion("Opponent", 0);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          lineage: Array.from({ length: level }, (_, index) =>
            lineageTestChampion("Guo Jia", index + 1),
          ),
          zones: {
            field: [cyclonicFatestone],
            hand: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion: foe,
          zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(cyclonicFatestone),
        target = q.card(foe);
      p.activateAbility(source, "l6410a85dn-a3", {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((ref) => ({ kind: "card", cardId: ref.objectId })),
      });
      passEffectsStack(game);
      expect(game.state.objects[source.objectId]!.face).toBe("transformed");
      advanceToMain(game, p.id, game.state.turn.number);
      if (level < 5) {
        const before = game.state;
        expect(() => p.declareAttack(source, target)).toThrow(
          /disobedient|cannot declare an attack/i,
        );
        expect(game.state).toEqual(before);
      } else {
        p.declareAttack(source, target);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(5);
      }
    });
});

import { proveRestFatestoneTransform } from "../../../testing/rest-fatestone-transform.ts";
/** @covers l6410a85dn-a3 */
describe("Cyclonic Fatestone transform cost", () =>
  proveRestFatestoneTransform(cyclonicFatestone, "l6410a85dn-a3", 3));
