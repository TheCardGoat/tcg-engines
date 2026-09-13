import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { glacialGuidance } from "../../DOA/actions/glacial-guidance.ts";
import { fractalOfSnow } from "../phantasias/fractal-of-snow.ts";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { awakenedDeacon } from "./awakened-deacon.ts";

/** @covers c9p4lpnvx7-a2 */
describe("Awakened Deacon — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: awakenedDeacon });
});

/** @covers c9p4lpnvx7-a1 */
describe("Awakened Deacon — conditional Intercept", () => {
  for (const classBonus of [false, true])
    for (const count of [0, 1, 2, 3]) {
      for (const accept of [false, true])
        for (const rested of count === 2 ? [false, true] : [false]) {
          it(`Class Bonus=${classBonus}, Phantasias=${count}, rested=${rested}, accept=${accept}`, () => {
            const champion = createClassBonusTestChampion(
              awakenedDeacon,
              classBonus,
              "activation-discount",
            );
            const game = GrandArchiveTestEngine.startFixture({
              firstPlayer: "playerTwo",
              playerOne: {
                champion,
                zones: {
                  field: [
                    awakenedDeacon,
                    woodlandSquirrels,
                    ...Array.from({ length: count }, () => fractalOfSnow),
                  ],
                  hand: [fractalOfSnow],
                  graveyard: [fractalOfSnow],
                },
              },
              playerTwo: {
                champion,
                zones: {
                  field: [woodlandSquirrels, woodlandSquirrels, fractalOfSnow, fractalOfSnow],
                  hand: [glacialGuidance, woodlandSquirrels],
                },
              },
            });
            const player = game.player("player-one");
            const opponent = game.player("player-two");
            const deacon = player.card(awakenedDeacon);
            const target = player.card(champion);
            if (rested) {
              opponent.activate(glacialGuidance, {
                targets: { "target-1": [deacon.objectId] },
                reservePayment: [
                  {
                    kind: "card",
                    cardId: opponent.card(woodlandSquirrels, { zone: "hand" }).objectId,
                  },
                ],
              });
              passEffectsStack(game);
              const wait = game.waitState();
              if (wait.kind === "opportunity" && wait.playerId !== opponent.id)
                game.player(wait.playerId).pass();
            }
            const attacker = opponent.cards(woodlandSquirrels, { zone: "field" })[0]!;
            opponent.declareAttack(attacker, target);
            const active = count >= 2 && !rested;
            expect(
              game.state.stack.filter(
                (item) => item.kind === "triggered-ability" && item.sourceId === deacon.objectId,
              ),
            ).toHaveLength(active ? 1 : 0);
            expect(game.state.combat?.targetIds).toEqual([target.objectId]);
            passEffectsStack(game);
            if (active) answerDecision(game, "resolve-optional-effect", accept);
            passEffectsStack(game);
            const redirected = active && accept;
            expect(game.state.combat?.targetIds).toEqual([
              redirected ? deacon.objectId : target.objectId,
            ]);
            expect(game.state.objects[deacon.objectId]!.damage).toBe(0);
            expect(game.state.objects[target.objectId]!.damage).toBe(0);
            game.resolveCombatWithoutRetaliation();
            expect(game.state.objects[deacon.objectId]!.damage).toBe(redirected ? 1 : 0);
            expect(game.state.objects[target.objectId]!.damage).toBe(redirected ? 0 : 1);
            // The ability protects the champion, not another ally.
            const wait = game.waitState();
            if (wait.kind === "opportunity" && wait.playerId !== opponent.id)
              game.player(wait.playerId).pass();
            const other = player.card(woodlandSquirrels, { zone: "field" });
            opponent.declareAttack(opponent.cards(woodlandSquirrels, { zone: "field" })[1]!, other);
            expect(game.state.stack).toHaveLength(0);
            game.resolveCombatWithoutRetaliation();
            expect(player.zone("graveyard")).toContainEqual(other);
          });
        }
    }

  it("loses Intercept immediately when the second Phantasia is sacrificed", () => {
    const champion = createClassBonusTestChampion(awakenedDeacon, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: { champion, zones: { field: [awakenedDeacon, fractalOfSnow, fractalOfSnow] } },
      playerTwo: { champion, zones: { field: [woodlandSquirrels, woodlandSquirrels] } },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const target = player.card(champion);
    const attackers = opponent.cards(woodlandSquirrels);
    opponent.declareAttack(attackers[0]!, target);
    passEffectsStack(game);
    answerDecision(game, "resolve-optional-effect", true);
    passEffectsStack(game);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[player.card(awakenedDeacon).objectId]!.damage).toBe(1);
    const wait = game.waitState();
    if (wait.kind === "opportunity" && wait.playerId !== player.id)
      game.player(wait.playerId).pass();
    player.activateAbility(player.cards(fractalOfSnow)[0]!, "uhuy4xippo-a2");
    passEffectsStack(game);
    expect(player.cards(fractalOfSnow, { zone: "field" })).toHaveLength(1);
    const next = game.waitState();
    if (next.kind === "opportunity" && next.playerId !== opponent.id)
      game.player(next.playerId).pass();
    opponent.declareAttack(attackers[1]!, target);
    expect(game.state.stack).toHaveLength(0);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(1);
  });
});
