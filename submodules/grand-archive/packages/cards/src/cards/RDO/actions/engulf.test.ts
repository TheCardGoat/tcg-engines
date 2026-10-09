import { describe } from "vitest";
import { engulf } from "./engulf.ts";

import { proveLevelActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
/** @covers IPmK09iEIT-a1 */
describe("engulf — level discount", () => {
  proveLevelActivationDiscount({
    card: engulf,
    discount: 3,
    threshold: 2,
    classBonus: false,
    preparation: "stack-action",
  });
});

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { blissfulCalling } from "../../DOA/actions/blissful-calling.ts";
import { openingCut } from "../../DEMO22/attacks/opening-cut.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers IPmK09iEIT-a2 */
describe("Engulf — non-attack activation target", () => {
  for (const kind of ["ally", "spell", "skill", "attack"] as const)
    it(`checks and resolves against ${kind}`, () => {
      const incoming =
        kind === "ally"
          ? woodlandSquirrels
          : kind === "spell"
            ? fireball
            : kind === "skill"
              ? blissfulCalling
              : openingCut;
      const cost = kind === "ally" ? 0 : kind === "spell" ? 4 : 1;
      const champion = enableAllTestElements(
        createClassBonusTestChampion(engulf, false, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: { hand: [engulf, ...Array.from({ length: 6 }, () => woodlandSquirrels)] },
        },
        playerTwo: {
          champion,
          zones: {
            field: [trainingSword],
            hand: [incoming, ...Array.from({ length: cost }, () => woodlandSquirrels)],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = q.cards(incoming, { zone: "hand" })[0]!;
      q.activate(source, {
        reservePayment: q
          .cards(woodlandSquirrels, { zone: "hand" })
          .filter((ref) => ref.objectId !== source.objectId)
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
        ...(kind === "spell" ? { targets: { "target-1": [p.card(champion).objectId] } } : {}),
        ...(kind === "attack" ? { attackAttackerId: q.card(champion).objectId } : {}),
      });
      const target = game.state.stack.at(-1)!;
      q.pass();
      const options = {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
        targets: { "target-stack-item": [target.id] },
      };
      const before = game.state;
      if (kind === "attack") {
        expect(() => p.activate(engulf, options)).toThrow();
        expect(game.state).toEqual(before);
        return;
      }
      p.activate(engulf, options);
      passEffectsStack(game);
      expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
      expect(game.state.stack).toHaveLength(0);
      expect(game.state.decision).toBeNull();
      expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(0);
    });
});
