import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { healingAura } from "../phantasias/healing-aura.ts";
import { allianceGearshield } from "./alliance-gearshield.ts";
import { crystallineMirror } from "./crystalline-mirror.ts";

/** @covers 9agwj4f15j-a1 */
describe("Crystalline Mirror — Phantasia entry Glimpse", () => {
  it("glimpses when a Phantasia enters under its controller", () => {
    const champion = createClassBonusTestChampion(crystallineMirror, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [crystallineMirror],
          hand: [healingAura, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    player.activate(healingAura, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card", cardId: card.objectId })),
    });
    passEffectsStack(game);
    expect(game.state.decision?.kind).toBe("resolve-glimpse");
    expect(
      game.state.decision && "cardIds" in game.state.decision ? game.state.decision.cardIds : [],
    ).toHaveLength(1);
  });
});

/** @covers 9agwj4f15j-a2 */
describe("Crystalline Mirror — Class Bonus destruction", () => {
  it("banishes itself and destroys a memory-zero item while controlling three Phantasias", () => {
    const champion = createClassBonusTestChampion(crystallineMirror, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: { field: [crystallineMirror, healingAura, healingAura, healingAura] },
      },
      playerTwo: { champion, zones: { field: [allianceGearshield] } },
    });
    const player = game.player("player-one");
    const mirror = player.card(crystallineMirror);
    const target = game.player("player-two").card(allianceGearshield);
    player.activateAbility(mirror, "9agwj4f15j-a2", {
      targets: { "target-1": [target.objectId] },
    });
    expect(game.state.objects[mirror.objectId]!.zone).toBe("banishment");
    passEffectsStack(game);
    expect(game.state.objects[target.objectId]!.zone).not.toBe("field");
  });
});
