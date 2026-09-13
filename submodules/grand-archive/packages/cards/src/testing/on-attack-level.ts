import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
import {
  advanceToMain,
  passEffectsStack,
  advanceCombatToTrigger,
  declareResolvedAttack,
} from "./decisions.ts";

export function proveOnAttackLevel({
  card,
  abilityId,
  mode,
  cost = 0,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  abilityId: string;
  mode: "ally" | "attack";
  cost?: number;
}): void {
  it("only its own attack adds a level, at trigger resolution, until end of turn", () => {
    const champion = createClassBonusTestChampion(card, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: mode === "ally" ? [card, woodlandSquirrels] : [woodlandSquirrels],
          hand:
            mode === "attack"
              ? [card, ...Array.from({ length: cost }, () => woodlandSquirrels)]
              : [],
          "main-deck": [woodlandSquirrels],
        },
      },
      playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels] } },
    });
    const p = game.player("player-one"),
      q = game.player("player-two");
    const level = (id: typeof p.id) =>
      deriveGrandArchiveNumericProperty(
        game.state.objects[game.player(id).card(champion).objectId]!,
        "level",
        { program: game.program, state: game.state, controllerId: id, bindings: {} },
      );
    p.declareAttack(woodlandSquirrels, q.card(champion));
    game.resolveCombatWithoutRetaliation();
    expect(level(p.id)).toBe(0);
    if (mode === "ally") p.declareAttack(card, q.card(champion));
    else {
      p.activate(card, {
        attackAttackerId: p.card(champion).objectId,
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card", cardId: c.objectId })),
      });
      passEffectsStack(game);
      declareResolvedAttack(
        game,
        p.card(champion).objectId,
        q.card(champion).objectId,
        "Attack with the resolved intent",
      );
    }
    advanceCombatToTrigger(game, abilityId);
    expect(level(p.id)).toBe(0);
    passEffectsStack(game);
    expect(level(p.id)).toBe(1);
    expect(level(q.id)).toBe(0);
    game.resolveCombatWithoutRetaliation();
    advanceToMain(game, q.id);
    expect(level(p.id)).toBe(0);
  });
}
