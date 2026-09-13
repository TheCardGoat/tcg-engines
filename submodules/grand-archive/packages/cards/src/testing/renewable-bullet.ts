import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";
import { seekersRifle } from "../cards/ALC/weapons/seekers-rifle.ts";
import { meltdown } from "../cards/ALC/actions/meltdown.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";

export function proveRenewableBullet({
  card,
  loadAbilityId,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  loadAbilityId: string;
}): void {
  for (const sourceZone of ["field", "loaded", "intent"] as const) {
    it(`replaces banishment from ${sourceZone} only when Renewable functions there`, () => {
      const champion = createClassBonusTestChampion(meltdown, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [card, seekersRifle],
            hand: [meltdown, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
            "main-deck": [woodlandSquirrels],
          },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      const bullet = player.card(card, { zone: "field" });
      const gun = player.card(seekersRifle, { zone: "field" });
      if (sourceZone !== "field") {
        player.activateAbility(bullet, loadAbilityId, {
          targets: { "target-weapon": [gun.objectId] },
        });
        passEffectsStack(game);
      }
      if (sourceZone === "intent") {
        player.declareAttack(
          player.card(champion, { zone: "field" }),
          game.player("player-two").card(champion, { zone: "field" }),
          { weaponIds: [gun.objectId] },
        );
        expect(game.state.objects[bullet.objectId]?.zone).toBe("intent");
        expect(player.cards(card, { zone: "material-deck" })).toHaveLength(0);
        game.resolveCombatWithoutRetaliation();
      } else {
        player.activate(meltdown, {
          targets: { "target-1": [sourceZone === "loaded" ? gun.objectId : bullet.objectId] },
          reservePayment: player
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((ref) => ({ kind: "card", cardId: ref.objectId })),
        });
        expect(game.state.objects[bullet.objectId]?.zone).toBe(sourceZone);
        passEffectsStack(game);
      }
      expect(game.state.objects[bullet.objectId]?.zone).toBe(
        sourceZone === "loaded" ? "banishment" : "material-deck",
      );
      expect(player.cards(card, { zone: "graveyard" })).toHaveLength(0);
      expect(game.player("player-two").cards(card)).toHaveLength(0);
    });
  }
}
