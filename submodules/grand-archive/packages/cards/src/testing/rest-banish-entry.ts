import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
export function proveHinderedRestBanish(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  abilityId: string,
) {
  it("enters rested and must wake before paying the rest and banish cost", () => {
    const champion = enableAllTestElements(
      createClassBonusTestChampion(card, false, "activation-discount"),
    );
    const game = GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      playerOne: {
        champion,
        zones: {
          "material-deck": [card],
          "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] } },
    });
    const p = game.player("player-one"),
      source = p.card(card);
    p.materialize(source);
    passEffectsStack(game);
    advanceToMain(game, p.id);
    expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
    const before = game.state;
    expect(() => p.activateAbility(source, abilityId)).toThrow();
    expect(game.state).toEqual(before);
    advanceToMain(game, p.id, game.state.turn.number);
    expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(false);
    p.activateAbility(source, abilityId);
    expect(p.cards(card, { zone: "banishment" })).toEqual([source]);
    passEffectsStack(game);
  });
}
