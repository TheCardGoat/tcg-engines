import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { tsunamiOfNanyue } from "./tsunami-of-nanyue.ts";

/** @covers pi9ftq3sul-a2 */
describe("Tsunami of Nanyue — rested ally damage", () => {
  it("deals two to rested allies and leaves awake allies undamaged", () => {
    const champion = createClassBonusTestChampion(tsunamiOfNanyue, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [tsunamiOfNanyue, ...Array.from({ length: 5 }, () => woodlandSquirrels)],
          field: [woodlandSquirrels],
        },
      },
      playerTwo: { champion, zones: { field: [giantTortoise] } },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const own = player.card(woodlandSquirrels, { zone: "field" });
    const theirs = opponent.card(giantTortoise, { zone: "field" });
    player.declareAttack(own, theirs);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[own.objectId]!.states.has("rested")).toBe(true);
    player.activate(tsunamiOfNanyue, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 5)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
    });
    passEffectsStack(game);
    expect(game.state.objects[own.objectId]!.zone).toBe("graveyard");
    expect(game.state.objects[theirs.objectId]!.zone).toBe("field");
    expect(game.state.objects[theirs.objectId]!.damage).toBe(1);
  });
});
