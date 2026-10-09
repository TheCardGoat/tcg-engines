import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { memoriteObelith } from "../cards/PTM/tokens/memorite-obelith.ts";
import { crystalAccretion } from "../cards/PTM/actions/crystal-accretion.ts";
import { crystalveinAwakening } from "../cards/PTM/actions/crystalvein-awakening.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";

export function proveMemoriteAccretion(): void {
  it("caps both stats at five sheen while Accretion affects every qualifying unit on both sides", () => {
    const champion = enableAllTestElements(
      createClassBonusTestChampion(crystalveinAwakening, false, "activation-discount"),
    );
    const game = GrandArchiveTestEngine.startFixture({
      definitions: [memoriteObelith],
      playerOne: {
        champion,
        zones: {
          hand: [
            crystalveinAwakening,
            ...Array.from({ length: 5 }, () => crystalAccretion),
            ...Array.from({ length: 12 }, () => woodlandSquirrels),
          ],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: {
        champion,
        zones: {
          hand: [crystalveinAwakening, woodlandSquirrels, woodlandSquirrels],
          field: [memoriteObelith],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      untouched = q.card(memoriteObelith);
    const summon = (playerId: string) => {
      const player = game.player(playerId);
      player.activate(crystalveinAwakening, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((ref) => ({ kind: "card", cardId: ref.objectId })),
      });
      passEffectsStack(game);
    };
    summon(p.id);
    advanceToMain(game, q.id);
    summon(q.id);
    advanceToMain(game, p.id, game.state.turn.number);
    const tokens = [
      p.card(memoriteObelith),
      ...q.cards(memoriteObelith).filter((ref) => ref.objectId !== untouched.objectId),
    ];
    expect(tokens).toHaveLength(2);
    const stats = (count: number) => {
      for (const ref of tokens) {
        const object = game.state.objects[ref.objectId]!;
        expect(object.counters["named:sheen"]).toBe(count);
        for (const [property, base] of [
          ["power", 0],
          ["life", 1],
        ] as const)
          expect(
            deriveGrandArchiveNumericProperty(object, property, {
              program: game.program,
              state: game.state,
              controllerId: object.controllerId,
              bindings: {},
            }),
          ).toBe(base + Math.min(count, 5));
      }
      expect(game.state.objects[untouched.objectId]!.counters["named:sheen"] ?? 0).toBe(0);
      expect(game.state.objects[p.card(champion).objectId]!.counters["named:sheen"] ?? 0).toBe(0);
    };
    stats(1);
    for (let count = 2; count <= 6; count++) {
      p.activate(p.cards(crystalAccretion, { zone: "hand" })[0]!, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((ref) => ({ kind: "card", cardId: ref.objectId })),
      });
      passEffectsStack(game);
      stats(count);
    }
  });
}
