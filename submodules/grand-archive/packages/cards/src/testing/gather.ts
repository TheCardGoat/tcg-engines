import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";

import { blightroot } from "../cards/ALC/tokens/blightroot.ts";
import { fraysia } from "../cards/ALC/tokens/fraysia.ts";
import { manaroot } from "../cards/ALC/tokens/manaroot.ts";
import { razorvine } from "../cards/ALC/tokens/razorvine.ts";
import { silvershine } from "../cards/ALC/tokens/silvershine.ts";
import { springleaf } from "../cards/ALC/tokens/springleaf.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";

const herbs = [blightroot, fraysia, manaroot, razorvine, silvershine, springleaf];

/** Gather 1–3: one of the six named ingredient tokens, controlled by the gathering player. */
export function proveGather({
  card,
  reserveCost,
  classBonus,
}: {
  readonly card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  readonly reserveCost: number;
  readonly classBonus: boolean;
}): void {
  for (const matchingClass of [true, false]) {
    it(`gathers on resolution with matchingClass=${matchingClass}`, () => {
      const champion = createClassBonusTestChampion(card, matchingClass, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        randomSeed: 1,
        definitions: herbs,
        playerOne: {
          champion,
          zones: { hand: [card, ...Array.from({ length: reserveCost }, () => woodlandSquirrels)] },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      const tokens = () =>
        player.zone("field").filter((ref) => game.state.objects[ref.objectId]?.isToken);
      player.activate(card, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((ref) => ({ kind: "card", cardId: ref.objectId })),
      });
      expect(tokens()).toHaveLength(0);
      expect(game.resolveStackUntilChoice()).toBe("stack-empty");
      if (matchingClass || !classBonus) {
        expect(tokens()).toHaveLength(1);
        const token = tokens()[0]!;
        expect(herbs.map((herb) => herb.canonicalId)).toContain(token.definitionId);
        expect(game.state.objects[token.objectId]?.controllerId).toBe(player.id);
        expect(game.state.objects[token.objectId]?.states.has("rested")).toBe(false);
      } else {
        expect(tokens()).toHaveLength(0);
      }
      expect(game.player("player-two").zone("field")).toHaveLength(1);
    });
  }
}
