import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceCombatToTrigger,
  answerDecision,
  passEffectsStack,
} from "../../../testing/decisions.ts";
import { seekersRifle } from "../weapons/seekers-rifle.ts";
import { supplyDrone } from "../allies/supply-drone.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { proveLoadBullet } from "../../../testing/load-bullet.ts";
import { vanishingShot } from "./vanishing-shot.ts";

/** @covers 0iqmyn2rz3-a1 */
describe("vanishing-shot — load", () => {
  proveLoadBullet({ card: vanishingShot, abilityId: "0iqmyn2rz3-a1", reserveCost: 0 });
});

/** @covers 0iqmyn2rz3-a2 */
describe("Vanishing Shot — optional ally-hit return", () => {
  for (const targetKind of ["survivor", "destroyed", "champion"] as const) {
    for (const accept of [false, true]) {
      it(`${accept ? "accepts" : "declines"} returning a ${targetKind} hit recipient`, () => {
        const champion = createClassBonusTestChampion(vanishingShot, false, "activation-discount");
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: { champion, zones: { field: [vanishingShot, seekersRifle] } },
          playerTwo: { champion, zones: { field: [supplyDrone, woodlandSquirrels] } },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const target = opponent.card(
          targetKind === "champion"
            ? champion
            : targetKind === "survivor"
              ? supplyDrone
              : woodlandSquirrels,
          { zone: "field" },
        );
        const gun = player.card(seekersRifle, { zone: "field" });
        player.activateAbility(vanishingShot, "0iqmyn2rz3-a1", {
          targets: { "target-weapon": [gun.objectId] },
        });
        passEffectsStack(game);
        player.declareAttack(player.card(champion, { zone: "field" }), target, {
          weaponIds: [gun.objectId],
        });
        advanceCombatToTrigger(game, "0iqmyn2rz3-a2");
        expect(
          game.state.stack.some(
            (item) => item.kind === "triggered-ability" && item.ability.id === "0iqmyn2rz3-a2",
          ),
        ).toBe(targetKind !== "champion");
        expect(opponent.zone("memory")).toHaveLength(0);
        passEffectsStack(game);
        if (game.state.decision?.kind === "resolve-optional-effect") {
          expect(game.state.decision.playerId).toBe("player-one");
          answerDecision(game, "resolve-optional-effect", accept);
          passEffectsStack(game);
        }
        expect(opponent.zone("memory")).toEqual(
          targetKind === "survivor" && accept ? [target] : [],
        );
        expect(game.state.objects[target.objectId]?.zone).toBe(
          targetKind === "destroyed"
            ? "graveyard"
            : targetKind === "survivor" && accept
              ? "memory"
              : "field",
        );
        expect(player.zone("memory")).toHaveLength(0);
        expect(game.state.stack).toHaveLength(0);
      });
    }
  }
});
