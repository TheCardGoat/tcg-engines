import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { songOfNurturing } from "../cards/DOA/actions/song-of-nurturing.ts";
import { attuneWithTheWinds } from "../cards/DOA/actions/attune-with-the-winds.ts";
import { favorableWinds } from "../cards/DOA/actions/favorable-winds.ts";
import { createClassBonusTestChampion, requireSingleFace } from "./class-bonus-test-champion.ts";
import { passEffectsStack, advanceToMain } from "./decisions.ts";
export function proveHarmonyMelodyTrigger(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  kind: "level" | "music",
): void {
  it(`each controlled Harmony or Melody adds one ${kind}, ignoring other cards and opposing activations`, () => {
    const base = createClassBonusTestChampion(card, false, "activation-discount"),
      face = requireSingleFace(base),
      champion = {
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
          hand: [
            songOfNurturing,
            attuneWithTheWinds,
            favorableWinds,
            ...Array.from({ length: 7 }, () => woodlandSquirrels),
          ],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: [card],
          hand: [songOfNurturing, woodlandSquirrels, woodlandSquirrels],
          "main-deck": [woodlandSquirrels],
        },
      },
    });
    const p = game.player("player-one"),
      q = game.player("player-two");
    const value = (player: typeof p) =>
      kind === "music"
        ? (game.state.objects[player.card(card).objectId]!.counters["named:music"] ?? 0)
        : deriveGrandArchiveNumericProperty(
            game.state.objects[player.card(champion).objectId]!,
            "level",
            { program: game.program, state: game.state, controllerId: player.id, bindings: {} },
          );
    p.activate(p.cards(woodlandSquirrels, { zone: "hand" })[0]!);
    passEffectsStack(game);
    expect(value(p)).toBe(0);
    for (const [action, cost, expected] of [
      [favorableWinds, 1, 0],
      [songOfNurturing, 2, 1],
      [attuneWithTheWinds, 3, 2],
    ] as const) {
      p.activate(action, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, cost)
          .map((c) => ({ kind: "card", cardId: c.objectId })),
      });
      passEffectsStack(game);
      expect(value(p)).toBe(expected);
      expect(value(q)).toBe(0);
    }
    advanceToMain(game, q.id);
    expect(value(p)).toBe(kind === "music" ? 2 : 0);
    q.activate(songOfNurturing, {
      reservePayment: q
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 2)
        .map((c) => ({ kind: "card", cardId: c.objectId })),
    });
    passEffectsStack(game);
    expect(value(q)).toBe(1);
    expect(value(p)).toBe(kind === "music" ? 2 : 0);
  });
}
