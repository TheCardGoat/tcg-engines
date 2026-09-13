import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { favorableWinds } from "../actions/favorable-winds.ts";
import { intangibleGeist } from "../allies/intangible-geist.ts";
import { channelingStone } from "../items/channeling-stone.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack, declareResolvedAttack } from "../../../testing/decisions.ts";
import { proveAttackPower } from "../../../testing/attack-power.ts";
import { describe } from "vitest";
import { windCutter } from "./wind-cutter.ts";

/** @covers TgYTZg6TaG-a1 */
describe("Wind Cutter \u2014 resolution", () => {
  proveAttackPower({ card: windCutter, cost: 2, power: 1, classBonus: false });
});

describe("other conditional boundaries", () => {
  proveAttackPower({ card: windCutter, cost: 2, power: 2, classBonus: true });
});

/** @covers TgYTZg6TaG-a2 */
describe("Wind Cutter's random memory reveal on hit", () => {
  for (const kind of ["wind", "norm", "empty"] as const)
    for (const hit of [false, true])
      it(`${kind} memory, hit=${hit}`, () => {
        const champion = createClassBonusTestChampion(windCutter, false, "activation-discount"),
          opponent = createClassBonusTestChampion(intangibleGeist, true, "activation-discount"),
          paymentCard = kind === "wind" ? favorableWinds : woodlandSquirrels;
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: kind === "empty" ? [channelingStone] : [],
              hand: [windCutter, ...(kind === "empty" ? [] : [paymentCard, paymentCard])],
            },
          },
          playerTwo: {
            champion: opponent,
            zones: { field: hit ? [] : [intangibleGeist], memory: [favorableWinds] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          attack = p.card(windCutter);
        if (kind === "empty") {
          p.activateAbility(channelingStone, "EBWWwvSxr3-a1");
          passEffectsStack(game);
        }
        p.activate(attack, {
          attackAttackerId: p.card(champion).objectId,
          reservePayment: p
            .cards(paymentCard, { zone: "hand" })
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
        const memory = p.zone("memory").map((c) => c.objectId),
          history = game.state.eventHistory.length;
        declareResolvedAttack(
          game,
          p.card(champion).objectId,
          q.card(hit ? opponent : intangibleGeist).objectId,
          "Declare Wind Cutter",
        );
        game.resolveCombatWithoutRetaliation();
        expect(game.state.decision).toBeNull();
        expect(game.state.objects[attack.objectId]!.zone).toBe(
          hit && kind === "wind" ? "memory" : "graveyard",
        );
        const revealed = game.state.eventHistory
          .slice(history)
          .filter((e) => e.type === "card-revealed");
        expect(revealed).toHaveLength(hit && kind !== "empty" ? 1 : 0);
        for (const event of revealed) expect(memory).toContain(event.objectId);
        expect(q.zone("memory")).toHaveLength(1);
      });
});
