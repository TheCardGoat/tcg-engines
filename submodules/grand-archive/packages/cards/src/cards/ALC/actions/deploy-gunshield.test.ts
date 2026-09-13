import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { seekersRifle } from "../weapons/seekers-rifle.ts";
import { magebaneLash } from "../weapons/magebane-lash.ts";
import { anathemasEnd } from "../items/anathemas-end.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { meltdown } from "./meltdown.ts";
import { proveFloatingMemory } from "../../../testing/floating-memory.ts";
import { deployGunshield } from "./deploy-gunshield.ts";

/** @covers bjvwbcizm6-a2 */
describe("Deploy Gunshield — Floating Memory", () => {
  proveFloatingMemory(deployGunshield);
});

function nextMain(game: GrandArchiveTestEngine, player: "player-one" | "player-two") {
  advanceToRecollection(game, player);
  for (let step = 0; step < 16 && game.state.turn.phase !== "main"; step++) {
    const wait = game.waitState();
    if (wait.kind !== "opportunity") throw new Error(`Unexpected wait ${wait.kind}`);
    game.player(wait.playerId).pass();
  }
}

/** @covers bjvwbcizm6-a1 */
describe("Deploy Gunshield — temporary spell-only targeting protection", () => {
  it("protects only the chosen friendly Gun, permits loading, and expires at turn end", () => {
    const champion = createClassBonusTestChampion(meltdown, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [seekersRifle, seekersRifle, magebaneLash, anathemasEnd, woodlandSquirrels],
          hand: [deployGunshield, meltdown, ...Array.from({ length: 6 }, () => woodlandSquirrels)],
          "main-deck": [woodlandSquirrels],
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: [seekersRifle],
          hand: [meltdown, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
          "main-deck": [woodlandSquirrels],
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const [gun, otherGun] = player.cards(seekersRifle, { zone: "field" });
    if (!gun || !otherGun) throw new Error("Expected both Guns");
    const shieldPayment = player
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(0, 2)
      .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
    for (const invalid of [
      player.card(magebaneLash, { zone: "field" }),
      player.card(woodlandSquirrels, { zone: "field" }),
      opponent.card(seekersRifle, { zone: "field" }),
    ]) {
      const before = game.state.stateVersion;
      expect(() =>
        player.activate(deployGunshield, {
          reservePayment: shieldPayment,
          targets: { "target-1": [invalid.objectId] },
        }),
      ).toThrow();
      expect(game.state.stateVersion).toBe(before);
    }
    player.activate(deployGunshield, {
      reservePayment: shieldPayment,
      targets: { "target-1": [gun.objectId] },
    });
    passEffectsStack(game);
    const spellPayment = player
      .cards(woodlandSquirrels, { zone: "hand" })
      .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
    const before = game.state.stateVersion;
    expect(() =>
      player.activate(meltdown, {
        reservePayment: spellPayment,
        targets: { "target-1": [gun.objectId] },
      }),
    ).toThrow();
    expect(game.state.stateVersion).toBe(before);
    player.activate(meltdown, {
      reservePayment: spellPayment,
      targets: { "target-1": [otherGun.objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[otherGun.objectId]!.zone).toBe("banishment");
    player.activateAbility(anathemasEnd, "ii17fzcyfr-a1", {
      targets: { "target-weapon": [gun.objectId] },
    });
    passEffectsStack(game);
    expect(player.cards(anathemasEnd, { zone: "loaded" })).toHaveLength(1);
    nextMain(game, "player-two");
    opponent.activate(meltdown, {
      reservePayment: opponent
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 4)
        .map((ref) => ({ kind: "card", cardId: ref.objectId })),
      targets: { "target-1": [gun.objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[gun.objectId]!.zone).toBe("banishment");
  });

  it("can answer an opposing spell and expires at that opponent's turn end", () => {
    const champion = createClassBonusTestChampion(meltdown, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: {
          field: [seekersRifle],
          hand: [deployGunshield, meltdown, ...Array.from({ length: 6 }, () => woodlandSquirrels)],
          "main-deck": [woodlandSquirrels],
        },
      },
      playerTwo: {
        champion,
        zones: {
          hand: [meltdown, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
          "main-deck": [woodlandSquirrels],
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const gun = player.card(seekersRifle, { zone: "field" });
    opponent.activate(meltdown, {
      reservePayment: opponent
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((ref) => ({ kind: "card", cardId: ref.objectId })),
      targets: { "target-1": [gun.objectId] },
    });
    opponent.pass();
    player.activate(deployGunshield, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 2)
        .map((ref) => ({ kind: "card", cardId: ref.objectId })),
      targets: { "target-1": [gun.objectId] },
    });
    expect(game.state.stack).toHaveLength(2);
    passEffectsStack(game);
    expect(opponent.cards(meltdown, { zone: "graveyard" })).toHaveLength(1);
    expect(game.state.objects[gun.objectId]!.zone).toBe("field");
    nextMain(game, "player-one");
    player.activate(meltdown, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 4)
        .map((ref) => ({ kind: "card", cardId: ref.objectId })),
      targets: { "target-1": [gun.objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[gun.objectId]!.zone).toBe("banishment");
  });
});
