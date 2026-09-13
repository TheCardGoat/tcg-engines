import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { proveOnEnterDraw } from "../../../testing/on-enter-draw.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { meltdown } from "../actions/meltdown.ts";
import { potionOfHealing } from "./potion-of-healing.ts";
import { temptationsFacade } from "./temptations-facade.ts";

/** @covers ww4akrkn1d-a1 */
describe("Temptation's Facade — entry draw", () => {
  proveOnEnterDraw({
    card: temptationsFacade,
    abilityId: "ww4akrkn1d-a1",
    cost: { kind: "memory", amount: 1 },
  });
});

/** @covers ww4akrkn1d-a2 */
describe("Temptation's Facade — Nico retarget", () => {
  it("rests to redirect an activation from another controlled non-champion object to itself", () => {
    const base = createClassBonusTestChampion(temptationsFacade, true, "activation-discount");
    if (base.layout.kind !== "single-faced") throw new Error("Expected champion");
    const champion = {
      ...base,
      layout: {
        kind: "single-faced" as const,
        face: { ...base.layout.face, lineageName: "Nico", elements: ["WATER", "FIRE"] as const },
      },
    };
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: { champion, zones: { field: [temptationsFacade, potionOfHealing] } },
      playerTwo: {
        champion,
        zones: { hand: [meltdown, ...Array.from({ length: 4 }, () => woodlandSquirrels)] },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const potion = player.card(potionOfHealing);
    const facade = player.card(temptationsFacade);
    opponent.activate(meltdown, {
      targets: { "target-1": [potion.objectId] },
      reservePayment: opponent
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card", cardId: card.objectId })),
    });
    const activation = game.state.stack.at(-1);
    if (activation?.kind !== "card-activation") throw new Error("Expected activation");
    opponent.pass();
    player.activateAbility(facade, "ww4akrkn1d-a2", {
      targets: { "target-activation": [activation.id] },
    });
    passEffectsStack(game);
    answerDecision(game, "retarget-stack-item", { targets: { "target-1": [facade.objectId] } });
    passEffectsStack(game);
    expect(game.state.objects[potion.objectId]!.zone).toBe("field");
    expect(game.state.objects[facade.objectId]!.zone).toBe("banishment");
  });
});
