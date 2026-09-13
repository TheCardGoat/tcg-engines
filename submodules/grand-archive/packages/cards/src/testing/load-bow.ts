import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";

import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import { intricateLongbow } from "../cards/AMB/weapons/intricate-longbow.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";

export function proveLoadBow({
  card,
  abilityId,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  abilityId: string;
}): void {
  function setup() {
    const champion = createClassBonusTestChampion(card, false, "activation-discount");
    return GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: { field: [card, card, intricateLongbow, trainingSword] },
      },
      playerTwo: { champion, zones: { field: [intricateLongbow] } },
    });
  }

  it("rests immediately, then loads only on resolution into an unloaded Bow", () => {
    const game = setup();
    const player = game.player("player-one");
    const arrow = player.cards(card, { zone: "field" })[0]!;
    const bow = player.card(intricateLongbow, { zone: "field" });
    player.activateAbility(arrow, abilityId, { targets: { "target-weapon": [bow.objectId] } });
    expect(game.state.objects[arrow.objectId]?.states.has("rested")).toBe(true);
    expect(game.state.objects[arrow.objectId]?.zone).toBe("field");
    const beforeRepeat = game.state;
    expect(() =>
      player.activateAbility(arrow, abilityId, { targets: { "target-weapon": [bow.objectId] } }),
    ).toThrow();
    expect(game.state).toEqual(beforeRepeat);
    passEffectsStack(game);
    expect(game.state.objects[arrow.objectId]?.zone).toBe("loaded");
    expect(game.state.objects[arrow.objectId]?.hostId).toBe(bow.objectId);
    const before = game.state;
    expect(() =>
      player.activateAbility(player.cards(card, { zone: "field" })[0]!, abilityId, {
        targets: { "target-weapon": [bow.objectId] },
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
    const champion = createClassBonusTestChampion(card, false, "activation-discount");
    player.declareAttack(
      player.card(champion, { zone: "field" }),
      game.player("player-two").card(champion, { zone: "field" }),
      { weaponIds: [bow.objectId] },
    );
    expect(game.state.objects[arrow.objectId]?.zone).toBe("intent");
  });

  for (const invalid of ["non-bow", "opponent-bow"] as const) {
    it(`rejects ${invalid} before resting`, () => {
      const game = setup();
      const player = game.player("player-one");
      const target =
        invalid === "non-bow"
          ? player.card(trainingSword, { zone: "field" })
          : game.player("player-two").card(intricateLongbow, { zone: "field" });
      const before = game.state;
      expect(() =>
        player.activateAbility(player.cards(card, { zone: "field" })[0]!, abilityId, {
          targets: { "target-weapon": [target.objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
    });
  }
}
