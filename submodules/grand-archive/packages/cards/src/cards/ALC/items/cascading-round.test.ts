import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceCombatToTrigger, passEffectsStack } from "../../../testing/decisions.ts";
import { seekersRifle } from "../weapons/seekers-rifle.ts";
import { supplyDrone } from "../allies/supply-drone.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { reposition } from "../actions/reposition.ts";
import { proveRenewableBullet } from "../../../testing/renewable-bullet.ts";
import { proveLoadBullet } from "../../../testing/load-bullet.ts";
import { cascadingRound } from "./cascading-round.ts";

/** @covers ywc08c9htu-a1 */
describe("Cascading Round — Renewable", () => {
  proveRenewableBullet({ card: cascadingRound, loadAbilityId: "ywc08c9htu-a2" });
});

/** @covers ywc08c9htu-a3 */
describe("Cascading Round — mill on hit", () => {
  for (const deckSize of [0, 2]) {
    for (const hitsChampion of [false, true]) {
      it(`mills exactly the top card on ${hitsChampion ? "champion" : "ally"} hit with ${deckSize} deck cards`, () => {
        const champion = createClassBonusTestChampion(cascadingRound, false, "activation-discount");
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [cascadingRound, seekersRifle],
              "main-deck": [woodlandSquirrels, reposition].slice(0, deckSize),
            },
          },
          playerTwo: { champion, zones: { field: [supplyDrone], "main-deck": [reposition] } },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const deck = player.zone("main-deck");
        const gun = player.card(seekersRifle, { zone: "field" });
        player.activateAbility(cascadingRound, "ywc08c9htu-a2", {
          targets: { "target-weapon": [gun.objectId] },
        });
        passEffectsStack(game);
        player.declareAttack(
          player.card(champion, { zone: "field" }),
          opponent.card(hitsChampion ? champion : supplyDrone, { zone: "field" }),
          { weaponIds: [gun.objectId] },
        );
        advanceCombatToTrigger(game, "ywc08c9htu-a3");
        expect(
          game.state.stack.some(
            (item) => item.kind === "triggered-ability" && item.ability.id === "ywc08c9htu-a3",
          ),
        ).toBe(true);
        expect(player.zone("main-deck")).toEqual(deck);
        expect(player.zone("graveyard")).toHaveLength(0);
        passEffectsStack(game);
        expect(player.zone("main-deck")).toEqual(deck.slice(1));
        expect(player.zone("graveyard")).toEqual(deck.slice(0, 1));
        expect(opponent.zone("main-deck")).toHaveLength(1);
        expect(player.zone("hand")).toHaveLength(0);
      });
    }
  }
});

/** @covers ywc08c9htu-a2 */
describe("cascading-round — load", () => {
  proveLoadBullet({ card: cascadingRound, abilityId: "ywc08c9htu-a2", reserveCost: 0 });
});
