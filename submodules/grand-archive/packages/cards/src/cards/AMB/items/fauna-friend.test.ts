import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { nimbleLongbowman } from "../../RDO/allies/nimble-longbowman.ts";
import { faunaFriend } from "./fauna-friend.ts";

/** @covers japulzj7gv-a1 */
describe("Fauna Friend — non-Human power", () => {
  it("rests to give a non-Human ally +1 POWER only with two non-Human allies in the graveyard", () => {
    const champion = createClassBonusTestChampion(faunaFriend, true, "activation-discount");
    const blocked = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [faunaFriend, woodlandSquirrels],
          graveyard: [woodlandSquirrels, nimbleLongbowman],
        },
      },
      playerTwo: { champion },
    });
    const blockedBefore = blocked.state;
    expect(() =>
      blocked.player("player-one").activateAbility(faunaFriend, "japulzj7gv-a1", {
        targets: {
          "target-1": [
            blocked.player("player-one").card(woodlandSquirrels, { zone: "field" }).objectId,
          ],
        },
      }),
    ).toThrow();
    expect(blocked.state).toEqual(blockedBefore);

    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [faunaFriend, woodlandSquirrels, nimbleLongbowman],
          graveyard: [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const beast = player.card(woodlandSquirrels, { zone: "field" });
    const human = player.card(nimbleLongbowman, { zone: "field" });
    const beforeHuman = game.state;
    expect(() =>
      player.activateAbility(faunaFriend, "japulzj7gv-a1", {
        targets: { "target-1": [human.objectId] },
      }),
    ).toThrow();
    expect(game.state).toEqual(beforeHuman);

    const powerOf = (objectId: typeof human.objectId) =>
      deriveGrandArchiveNumericProperty(game.state.objects[objectId]!, "power", {
        program: game.program,
        state: game.state,
        controllerId: player.id,
        bindings: {},
      });
    player.activateAbility(faunaFriend, "japulzj7gv-a1", {
      targets: { "target-1": [beast.objectId] },
    });
    expect(game.state.objects[player.card(faunaFriend).objectId]!.states.has("rested")).toBe(true);
    expect(powerOf(beast.objectId)).toBe(1);
    passEffectsStack(game);
    expect(powerOf(beast.objectId)).toBe(2);
    expect(powerOf(human.objectId)).toBe(1);
  });
});
