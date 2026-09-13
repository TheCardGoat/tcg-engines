import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { turbulentBullet } from "../items/turbulent-bullet.ts";
import { seekersRifle } from "../weapons/seekers-rifle.ts";
import { loadSoul } from "./load-soul.ts";

/** @covers 8tuhuy4xip-a1 @covers 8tuhuy4xip-a2 */
describe("Load Soul — Bullet, Gun durability, and inherited life penalty", () => {
  it("materializes a Bullet, adds two durability, and moves under its champion", () => {
    const baseChampion = createClassBonusTestChampion(loadSoul, false, "activation-discount");
    if (baseChampion.layout.kind !== "single-faced") throw new Error("Expected test champion");
    const champion = {
      ...baseChampion,
      layout: {
        kind: "single-faced" as const,
        face: { ...baseChampion.layout.face, elements: ["NORM", "UMBRA", "WIND"] as const },
      },
    };
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [loadSoul, woodlandSquirrels, woodlandSquirrels],
          field: [seekersRifle],
          "material-deck": [turbulentBullet],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const source = player.card(loadSoul, { zone: "hand" });
    const championRef = player.card(champion, { zone: "field" });
    const gun = player.card(seekersRifle, { zone: "field" });
    const bullet = player.card(turbulentBullet, { zone: "material-deck" });
    player.activate(source, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card", cardId: card.objectId })),
    });
    passEffectsStack(game);
    answerDecision(game, "resolve-effect-choice", [bullet.objectId]);
    expect(game.state.decision?.kind).toBe("announce-effect-materialization");
    answerDecision(game, "announce-effect-materialization", {});
    passEffectsStack(game);
    answerDecision(game, "resolve-optional-effect", true);
    passEffectsStack(game);
    answerDecision(game, "resolve-effect-choice", [gun.objectId]);
    passEffectsStack(game);

    expect(game.state.objects[bullet.objectId]!.zone).toBe("field");
    expect(game.state.objects[gun.objectId]!.counters.durability).toBe(4);
    expect(game.state.objects[source.objectId]!).toMatchObject({
      zone: "inner-lineage",
      hostId: championRef.objectId,
    });
    expect(
      deriveGrandArchiveNumericProperty(game.state.objects[championRef.objectId]!, "life", {
        program: game.program,
        state: game.state,
        controllerId: player.id,
        bindings: {},
      }),
    ).toBe(13);
  });
});
