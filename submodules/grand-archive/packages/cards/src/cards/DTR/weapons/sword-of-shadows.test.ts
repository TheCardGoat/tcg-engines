import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { swordOfShadows } from "./sword-of-shadows.ts";
import { corhaziCourier } from "../../DOA/allies/corhazi-courier.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { exposeDarkness } from "../actions/expose-darkness.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers zcvq77mdgd-a1 @covers zcvq77mdgd-a2 */
describe("Sword of Shadows — class-restricted power and opposing Stealth", () => {
  for (const matching of [false, true])
    for (const opposing of ["none", "ordinary", "one-stealth", "two-stealth"] as const)
      it(`deals the correct damage with class=${matching} and ${opposing}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(swordOfShadows, matching, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: { field: [swordOfShadows, corhaziCourier], "main-deck": [woodlandSquirrels] },
          },
          playerTwo: {
            champion,
            zones: {
              field:
                opposing === "none"
                  ? []
                  : opposing === "ordinary"
                    ? [giantTortoise]
                    : Array.from(
                        { length: opposing === "two-stealth" ? 2 : 1 },
                        () => corhaziCourier,
                      ),
              graveyard: [corhaziCourier],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          target = q.card(champion);
        p.declareAttack(p.card(champion), target, { weaponIds: [p.card(swordOfShadows).objectId] });
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(
          matching && !opposing.includes("stealth") ? 2 : 1,
        );
      });

  it("updates immediately when opposing Stealth is removed, then restores the penalty next turn", () => {
    const champion = enableAllTestElements(
      createClassBonusTestChampion(swordOfShadows, true, "activation-discount"),
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [swordOfShadows],
          hand: [exposeDarkness, woodlandSquirrels],
          "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: [corhaziCourier],
          "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
        },
      },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      target = q.card(champion),
      sword = p.card(swordOfShadows);
    p.activate(exposeDarkness, {
      targets: { "target-1": [q.card(corhaziCourier).objectId] },
      reservePayment: [
        { kind: "card", cardId: p.card(woodlandSquirrels, { zone: "hand" }).objectId },
      ],
    });
    passEffectsStack(game);
    p.declareAttack(p.card(champion), target, { weaponIds: [sword.objectId] });
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(2);
    advanceToMain(game, q.id);
    advanceToMain(game, p.id);
    p.declareAttack(p.card(champion), target, { weaponIds: [sword.objectId] });
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(3);
    expect(game.state.objects[sword.objectId]!.zone).toBe("banishment");
  });
});
