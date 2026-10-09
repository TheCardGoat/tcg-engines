import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { dredgingStreams } from "../cards/SP4/actions/dredging-streams.ts";
import { reclaim } from "../cards/DOA/actions/reclaim.ts";
import {
  createClassBonusTestChampion,
  requireSingleFace,
  enableAllTestElements,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack, advanceCombatToTrigger } from "./decisions.ts";

export function proveDeathDraw({
  card,
  abilityId,
  classRestricted = false,
  levelBonus = 0,
  attacker = woodlandSquirrels,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  abilityId: string;
  classRestricted?: boolean;
  levelBonus?: number;
  attacker?: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
}): void {
  for (const matching of classRestricted ? [true, false] : [false]) {
    for (const exile of [false, true])
      it(`draws after dying, not on attack declaration (class=${matching}, exile=${exile})`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(card, matching, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion,
            zones: { field: [card], "main-deck": [woodlandSquirrels, woodlandSquirrels] },
          },
          playerTwo: {
            champion,
            zones: {
              field: [attacker],
              hand: exile ? [dredgingStreams, woodlandSquirrels, woodlandSquirrels] : [],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const deck = p.zone("main-deck");
        const level = () =>
          deriveGrandArchiveNumericProperty(
            game.state.objects[p.card(champion).objectId]!,
            "level",
            {
              program: game.program,
              state: game.state,
              controllerId: p.id,
              bindings: {},
            },
          );
        expect(level()).toBe(levelBonus);
        q.declareAttack(attacker, p.card(card));
        expect(p.zone("hand")).toHaveLength(0);
        advanceCombatToTrigger(game, abilityId);
        expect(p.cards(card, { zone: "graveyard" })).toHaveLength(1);
        expect(level()).toBe(0);
        expect(p.zone("hand")).toHaveLength(0);
        if (exile) {
          q.activate(dredgingStreams, {
            reservePayment: q
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((ref) => ({ kind: "card", cardId: ref.objectId })),
            targets: { "target-card": [p.card(card, { zone: "graveyard" }).objectId] },
          });
        }
        passEffectsStack(game);
        if (exile) expect(p.cards(card, { zone: "banishment" })).toHaveLength(1);
        expect(p.zone("hand")).toEqual(classRestricted && !matching ? [] : deck.slice(0, 1));
        expect(p.zone("main-deck")).toEqual(classRestricted && !matching ? deck : deck.slice(1));
        expect(p.zone("memory")).toHaveLength(0);
        expect(q.zone("hand")).toHaveLength(0);
      });
  }
  it("does not draw when returned to hand without dying", () => {
    const base = createClassBonusTestChampion(card, true, "activation-discount");
    const face = requireSingleFace(base);
    const champion = {
      ...base,
      layout: {
        kind: "single-faced" as const,
        face: { ...face, elements: [...face.elements, "WIND" as const] },
      },
    };
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [card],
          hand: [reclaim, woodlandSquirrels, woodlandSquirrels],
          "main-deck": [woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const p = game.player("player-one"),
      deck = p.zone("main-deck");
    p.activate(reclaim, {
      reservePayment: p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((c) => ({ kind: "card", cardId: c.objectId })),
      targets: { "target-1": [p.card(card, { zone: "field" }).objectId] },
    });
    passEffectsStack(game);
    expect(p.zone("main-deck")).toEqual(deck);
    expect(p.cards(card, { zone: "hand" })).toHaveLength(1);
  });
}
