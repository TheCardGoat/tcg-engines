import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";
import { seekersRifle } from "../cards/ALC/weapons/seekers-rifle.ts";
import { magebaneLash } from "../cards/ALC/weapons/magebane-lash.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";

export function proveLoadBullet({
  card,
  abilityId,
  reserveCost,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  abilityId: string;
  reserveCost: number;
}): void {
  function setup() {
    const champion = createClassBonusTestChampion(card, false, "activation-discount");
    return GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [card, card, seekersRifle, magebaneLash],
          hand: Array.from({ length: reserveCost * 2 }, () => woodlandSquirrels),
        },
      },
      playerTwo: { champion, zones: { field: [seekersRifle] } },
    });
  }
  if (reserveCost > 0) {
    it("rejects insufficient reserve before resting the Bullet", () => {
      const game = setup();
      const player = game.player("player-one");
      const before = game.state;
      expect(() =>
        player.activateAbility(player.cards(card, { zone: "field" })[0]!, abilityId, {
          targets: { "target-weapon": [player.card(seekersRifle, { zone: "field" }).objectId] },
          reservePayment: player
            .zone("hand")
            .slice(0, reserveCost - 1)
            .map((ref) => ({ kind: "card", cardId: ref.objectId })),
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
    });
  }
  it("pays reserve and rests immediately, then loads only on resolution", () => {
    const game = setup();
    const player = game.player("player-one");
    const bullet = player.cards(card, { zone: "field" })[0]!;
    const gun = player.card(seekersRifle, { zone: "field" });
    player.activateAbility(bullet, abilityId, {
      targets: { "target-weapon": [gun.objectId] },
      reservePayment: player
        .zone("hand")
        .slice(0, reserveCost)
        .map((ref) => ({ kind: "card", cardId: ref.objectId })),
    });
    expect(game.state.objects[bullet.objectId]?.states.has("rested")).toBe(true);
    expect(game.state.objects[bullet.objectId]?.zone).toBe("field");
    expect(player.zone("memory")).toHaveLength(reserveCost);
    const beforeRepeat = game.state;
    expect(() =>
      player.activateAbility(bullet, abilityId, {
        targets: { "target-weapon": [gun.objectId] },
        reservePayment: player
          .zone("hand")
          .slice(0, reserveCost)
          .map((ref) => ({ kind: "card", cardId: ref.objectId })),
      }),
    ).toThrow();
    expect(game.state).toEqual(beforeRepeat);
    passEffectsStack(game);
    expect(game.state.objects[bullet.objectId]?.zone).toBe("loaded");
    expect(game.state.objects[bullet.objectId]?.hostId).toBe(gun.objectId);
    const before = game.state;
    expect(() =>
      player.activateAbility(player.cards(card, { zone: "field" })[0]!, abilityId, {
        targets: { "target-weapon": [gun.objectId] },
        reservePayment: player.zone("hand").map((ref) => ({ kind: "card", cardId: ref.objectId })),
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
    const champion = createClassBonusTestChampion(card, false, "activation-discount");
    player.declareAttack(
      player.card(champion, { zone: "field" }),
      game.player("player-two").card(champion, { zone: "field" }),
      { weaponIds: [gun.objectId] },
    );
    expect(game.state.objects[bullet.objectId]?.zone).toBe("intent");
  });
  for (const invalid of ["non-gun", "opponent-gun"] as const) {
    it(`rejects ${invalid} before paying any costs`, () => {
      const game = setup();
      const player = game.player("player-one");
      const target =
        invalid === "non-gun"
          ? player.card(magebaneLash, { zone: "field" })
          : game.player("player-two").card(seekersRifle, { zone: "field" });
      const before = game.state;
      expect(() =>
        player.activateAbility(player.cards(card, { zone: "field" })[0]!, abilityId, {
          targets: { "target-weapon": [target.objectId] },
          reservePayment: player
            .zone("hand")
            .slice(0, reserveCost)
            .map((ref) => ({ kind: "card", cardId: ref.objectId })),
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
    });
  }
}
