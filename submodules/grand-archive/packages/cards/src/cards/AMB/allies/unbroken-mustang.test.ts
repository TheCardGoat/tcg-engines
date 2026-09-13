import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { potionOfHealing } from "../../ALC/items/potion-of-healing.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../weapons/training-sword.ts";
import { slateWhetstone } from "../../P24/items/slate-whetstone.ts";
import { unbrokenMustang } from "./unbroken-mustang.ts";

/** @covers ye9jkvfo0x-a1 */
describe("Unbroken Mustang — On Enter destroy a cheap item or weapon", () => {
  it("destroys a legal item, rejects a memory-cost 1 item, and may choose nothing", () => {
    const champion = createClassBonusTestChampion(unbrokenMustang, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [unbrokenMustang, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
          field: [potionOfHealing, trainingSword, slateWhetstone],
        },
      },
      playerTwo: { champion, zones: { field: [potionOfHealing] } },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    player.activate(unbrokenMustang, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
    });
    player.pass();
    opponent.pass();
    passEffectsStack(game);
    expect(game.state.decision?.kind).toBe("announce-triggered-ability");
    const illegal = player.card(slateWhetstone, { zone: "field" });
    const before = game.state;
    expect(() =>
      answerDecision(game, "announce-triggered-ability", {
        targets: { "target-1": [illegal.objectId] },
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
    const potion = player.card(potionOfHealing, { zone: "field" });
    answerDecision(game, "announce-triggered-ability", {
      targets: { "target-1": [potion.objectId] },
    });
    expect(game.state.objects[potion.objectId]!.zone).toBe("field");
    passEffectsStack(game);
    expect(game.state.objects[potion.objectId]!.zone).toBe("graveyard");
    expect(player.cards(trainingSword, { zone: "field" })).toHaveLength(1);
    expect(player.cards(slateWhetstone, { zone: "field" })).toHaveLength(1);
  });

  it("may choose zero targets", () => {
    const champion = createClassBonusTestChampion(unbrokenMustang, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [unbrokenMustang, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
          field: [potionOfHealing],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    player.activate(unbrokenMustang, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
    });
    player.pass();
    game.player("player-two").pass();
    passEffectsStack(game);
    answerDecision(game, "announce-triggered-ability", { targets: { "target-1": [] } });
    passEffectsStack(game);
    expect(player.cards(potionOfHealing, { zone: "field" })).toHaveLength(1);
  });
});
