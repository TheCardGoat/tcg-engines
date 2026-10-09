import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { infernalVessel } from "./infernal-vessel.ts";
import { fraysia } from "../../ALC/tokens/fraysia.ts";
import { sweetAmbrosia } from "../../P24/items/sweet-ambrosia.ts";
import { potionOfHealing } from "../../ALC/items/potion-of-healing.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers vgWgu1DUYv-a1 */
describe("Infernal Vessel — recovery reduction", () => {
  for (const own of [false, true])
    for (const active of [false, true])
      for (const damage of [0, 6])
        for (const [remedy, ability, recovery] of [
          [fraysia, "soporhlq2k-a1", 1],
          [sweetAmbrosia, "dgyduwh84p-a1", 3],
          [potionOfHealing, "qtb31x97n2-a2", 5],
        ] as const)
          it(`own=${own}, active=${active}, damage=${damage}, recovery=${recovery}`, () => {
            const champion = enableAllTestElements(
              createClassBonusTestChampion(infernalVessel, false, "activation-discount"),
            );
            const attackers = Array.from({ length: damage }, () => woodlandSquirrels);
            const game = GrandArchiveTestEngine.startFixture({
              firstPlayer: own ? "playerTwo" : "playerOne",
              playerOne: {
                champion,
                zones: {
                  field: [...(active ? [infernalVessel] : []), ...(own ? [remedy] : attackers)],
                  banishment: active ? [] : [infernalVessel],
                  "main-deck": [woodlandSquirrels, woodlandSquirrels],
                },
              },
              playerTwo: {
                champion,
                zones: {
                  field: own ? attackers : [remedy],
                  "main-deck": [woodlandSquirrels, woodlandSquirrels],
                },
              },
            });
            const recipient = game.player(own ? "player-one" : "player-two");
            const attacker = game.player(own ? "player-two" : "player-one");
            const hero = recipient.card(champion);
            for (const ally of attacker.cards(woodlandSquirrels, { zone: "field" })) {
              attacker.declareAttack(ally, hero);
              game.resolveCombatWithoutRetaliation();
            }
            expect(game.state.objects[hero.objectId]!.damage).toBe(damage);
            advanceToMain(game, recipient.id);
            const eventCount = game.state.eventHistory.length;
            recipient.activateAbility(remedy, ability);
            passEffectsStack(game);
            const reduced = active ? Math.max(0, recovery - 3) : recovery;
            expect(game.state.objects[hero.objectId]!.damage).toBe(Math.max(0, damage - reduced));
            const recovered = game.state.eventHistory
              .slice(eventCount)
              .filter((e) => e.type === "damage-removed");
            expect(recovered).toHaveLength(reduced > 0 ? 1 : 0);
            if (reduced > 0)
              expect(recovered[0]).toMatchObject({ actorId: recipient.id, amount: reduced });
          });
});
