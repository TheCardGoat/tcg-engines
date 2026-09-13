import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { focalIntensity } from "../../RDO/actions/focal-intensity.ts";
import { leadingCharge } from "../attacks/leading-charge.ts";
import { huaXiongInsurgentsFang } from "./hua-xiong-insurgents-fang.ts";

function jinChampion(enabled: boolean) {
  const champion = createClassBonusTestChampion(
    huaXiongInsurgentsFang,
    true,
    "activation-discount",
  );
  if (champion.layout.kind !== "single-faced") throw new Error("Expected fixture champion");
  return {
    ...champion,
    layout: {
      kind: "single-faced" as const,
      face: {
        ...champion.layout.face,
        lineageName: enabled ? "Jin" : "Not Jin",
        elements: ["NORM", "FIRE", "WATER", "WIND"] as const,
      },
    },
  };
}

/** @covers TvugEkGGVd-a2 */
describe("Hua Xiong, Insurgent's Fang — Jin Bonus Polearm power", () => {
  for (const jin of [false, true]) {
    it(`Leading Charge deals ${jin ? 6 : 4} while Jin Bonus is ${jin ? "enabled" : "disabled"}`, () => {
      const champion = jinChampion(jin);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [huaXiongInsurgentsFang],
            hand: [leadingCharge, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
          },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const attacker = player.card(champion, { zone: "field" });
      const target = opponent.card(champion, { zone: "field" });
      player.activate(leadingCharge, {
        attackAttackerId: attacker.objectId,
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      });
      for (let step = 0; game.waitState().kind !== "decision" && step < 16; step++) {
        const wait = game.waitState();
        if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
        game.player(wait.playerId).pass();
      }
      player.executeLegal(
        (candidate) =>
          candidate.command.move === "answer-decision" &&
          typeof candidate.command.answer === "object" &&
          candidate.command.answer !== null &&
          "attackerId" in candidate.command.answer &&
          candidate.command.answer.attackerId === attacker.objectId &&
          !("delegatePlayerId" in candidate.command.answer) &&
          "targetIds" in candidate.command.answer &&
          Array.isArray(candidate.command.answer.targetIds) &&
          candidate.command.answer.targetIds.includes(target.objectId) &&
          (!("weaponIds" in candidate.command.answer) ||
            (Array.isArray(candidate.command.answer.weaponIds) &&
              candidate.command.answer.weaponIds.length === 0)),
        "declare Leading Charge",
      );
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(jin ? 6 : 4);
    });
  }
});

/** @covers TvugEkGGVd-a3 */
describe("Hua Xiong, Insurgent's Fang — Jin Bonus prevent", () => {
  for (const jin of [false, true]) {
    it(`${jin ? "prevents 2" : "cannot activate"} with Jin Bonus ${jin}`, () => {
      const champion = jinChampion(jin);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [huaXiongInsurgentsFang],
            hand: [leadingCharge, focalIntensity, woodlandSquirrels],
          },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      const protectedUnit = player.card(champion, { zone: "field" });
      if (!jin) {
        const before = game.state;
        expect(() =>
          player.activateAbility(huaXiongInsurgentsFang, "TvugEkGGVd-a3", {
            costSelections: [[player.card(leadingCharge, { zone: "hand" }).objectId]],
            targets: { "target-1": [protectedUnit.objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        return;
      }
      player.activateAbility(huaXiongInsurgentsFang, "TvugEkGGVd-a3", {
        costSelections: [[player.card(leadingCharge, { zone: "hand" }).objectId]],
        targets: { "target-1": [protectedUnit.objectId] },
      });
      expect(
        game.state.objects[
          player.card(huaXiongInsurgentsFang, { zone: "field" }).objectId
        ]!.states.has("rested"),
      ).toBe(true);
      expect(player.cards(leadingCharge, { zone: "graveyard" })).toHaveLength(1);
      passEffectsStack(game);
      player.activate(focalIntensity, {
        reservePayment: [
          { kind: "card", cardId: player.card(woodlandSquirrels, { zone: "hand" }).objectId },
        ],
        targets: { "target-1": [protectedUnit.objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[protectedUnit.objectId]!.damage).toBe(0);
    });
  }
});
