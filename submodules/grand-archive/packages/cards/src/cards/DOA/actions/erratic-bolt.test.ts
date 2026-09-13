import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { erraticBolt } from "./erratic-bolt.ts";
import { channelingStone } from "../items/channeling-stone.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { proveFixedDamageAction } from "../../../testing/fixed-damage-action.ts";
/** @covers DqtlaMGMvd-a1 */
describe("Erratic Bolt's level-based targeted damage", () => {
  for (const level of [0, 1, 3])
    proveFixedDamageAction({
      card: erraticBolt,
      cost: 4,
      damage: level,
      targetKind: "unit",
      level,
    });
});
/** @covers DqtlaMGMvd-a2 */
describe("Erratic Bolt's optional random banishment", () => {
  for (const classBonus of [false, true])
    for (const accept of [false, true])
      for (const remaining of [0, 1, 4])
        it(`class=${classBonus}, accept=${accept}, memory=${remaining}`, () => {
          const champion = grantTestChampionLevel(
              createClassBonusTestChampion(erraticBolt, classBonus, "activation-discount"),
              2,
            ),
            game = GrandArchiveTestEngine.startFixture({
              playerOne: {
                champion,
                zones: {
                  field: [channelingStone, channelingStone],
                  hand: [erraticBolt],
                  memory: Array.from({ length: remaining }, () => woodlandSquirrels),
                  "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
                },
              },
              playerTwo: { champion, zones: { memory: [woodlandSquirrels, woodlandSquirrels] } },
            });
          const p = game.player("player-one"),
            q = game.player("player-two");
          for (const stone of p.cards(channelingStone, { zone: "field" })) {
            p.activateAbility(stone, "EBWWwvSxr3-a1");
            passEffectsStack(game);
          }
          p.activate(erraticBolt, { targets: { "target-1": [q.card(champion).objectId] } });
          passEffectsStack(game);
          const initialBanish = p.zone("banishment").map((c) => c.objectId),
            memory = p.zone("memory").map((c) => c.objectId);
          expect(memory).toHaveLength(remaining);
          if (classBonus && game.state.decision?.kind === "resolve-optional-effect") {
            answerDecision(game, "resolve-optional-effect", accept);
            passEffectsStack(game);
          }
          expect(game.state.decision).toBeNull();
          const paid = classBonus && accept && remaining >= 2,
            extra = p.zone("banishment").filter((c) => !initialBanish.includes(c.objectId));
          expect(extra).toHaveLength(paid ? 2 : 0);
          for (const c of extra) expect(memory).toContain(c.objectId);
          expect(p.zone("memory")).toHaveLength(remaining - (paid ? 2 : 0));
          expect(p.zone("hand")).toHaveLength(paid ? 2 : 0);
          expect(q.zone("memory")).toHaveLength(2);
          expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(2);
        });
});
