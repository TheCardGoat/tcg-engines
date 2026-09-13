import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../weapons/training-sword.ts";
import { proveIntrinsicLink } from "../../../testing/intrinsic-link.ts";
import { meltdown } from "../../ALC/actions/meltdown.ts";
import { scarletTassel } from "./scarlet-tassel.ts";

/** @covers swy2NJ4q6O-a1 */
describe("Scarlet Tassel — Regalia Link", () => {
  proveIntrinsicLink({
    card: scarletTassel,
    host: trainingSword,
    invalidHost: woodlandSquirrels,
  });
});

/** @covers swy2NJ4q6O-a2 */
describe("Scarlet Tassel — linked omnishroud", () => {
  it("pays two and rests so the linked regalia cannot be targeted", () => {
    const champion = createClassBonusTestChampion(scarletTassel, true, "activation-discount");
    const caster = createClassBonusTestChampion(meltdown, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      playerOne: {
        champion,
        zones: {
          field: [trainingSword],
          hand: [woodlandSquirrels, woodlandSquirrels],
          "material-deck": [scarletTassel],
          "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion: caster,
        zones: {
          hand: [meltdown, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
          "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const host = player.card(trainingSword, { zone: "field" });
    player.materialize(scarletTassel, {
      targets: { "intrinsic-link-target": [host.objectId] },
    });
    passEffectsStack(game);
    for (let step = 0; game.state.turn.phase !== "main" && step < 32; step++) {
      const wait = game.waitState();
      if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
      game.player(wait.playerId).pass();
    }
    const tassel = player.card(scarletTassel, { zone: "field" });
    for (
      let step = 0;
      step < 80 && !(game.state.turn.playerId === opponent.id && game.state.turn.phase === "main");
      step++
    ) {
      const wait = game.waitState();
      if (wait.kind === "materialization-choice")
        game.player(wait.playerId).execute({ move: "skip-materialization" });
      else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
      else throw new Error(`Unexpected ${wait.kind}`);
    }
    const wait = game.waitState();
    if (wait.kind === "opportunity" && wait.playerId !== player.id)
      game.player(wait.playerId).pass();
    player.activateAbility(tassel, "swy2NJ4q6O-a2", {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 2)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
    });
    expect(game.state.objects[tassel.objectId]!.states.has("rested")).toBe(true);
    passEffectsStack(game);
    const before = game.state;
    expect(() =>
      opponent.activate(meltdown, {
        targets: { "target-1": [host.objectId] },
        reservePayment: opponent
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
  });
});
