import { proveAnimalBeastLevel } from "../../../testing/animal-beast-level.ts";
import { describe } from "vitest";
import { melodiousFlute } from "./melodious-flute.ts";

/** @covers WAFNy2lY5t-a1 */
describe("Melodious Flute \u2014 resolution", () => {
  proveAnimalBeastLevel(melodiousFlute);
});
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { grandArchiveObjectCurrentCharacteristics } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { empoweringHarmony } from "../actions/empowering-harmony.ts";
import { mistResonance } from "../actions/mist-resonance.ts";
/** @covers WAFNy2lY5t-a2 */
for (const bonus of [false, true])
  for (const expired of [false, true])
    it(`Flute changes only the next own Harmony activation this turn: class=${bonus},expired=${expired}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(melodiousFlute, bonus, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [melodiousFlute],
            hand: [
              empoweringHarmony,
              empoweringHarmony,
              ...Array.from({ length: 8 }, () => woodlandSquirrels),
            ],
            "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: {
            hand: [mistResonance, ...Array.from({ length: 5 }, () => woodlandSquirrels)],
            "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(melodiousFlute);
      if (!bonus) {
        const before = game.state;
        expect(() => p.activateAbility(source, "WAFNy2lY5t-a2")).toThrow();
        expect(game.state).toEqual(before);
        return;
      }
      p.activateAbility(source, "WAFNy2lY5t-a2");
      expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
      passEffectsStack(game);
      if (expired) {
        advanceToMain(game, q.id);
        advanceToMain(game, p.id);
      }
      p.activate(p.cards(woodlandSquirrels, { zone: "hand" })[0]!);
      passEffectsStack(game);
      p.pass();
      q.activate(mistResonance, {
        reservePayment: q
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 5)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
      });
      passEffectsStack(game);
      const w = game.waitState();
      if (w.kind === "opportunity" && w.playerId === q.id) q.pass();
      for (let i = 0; i < 2; i++) {
        const action = p.cards(empoweringHarmony, { zone: "hand" })[0]!,
          top = p.zone("main-deck")[0]!;
        p.activate(action, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 2)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
        });
        const types = grandArchiveObjectCurrentCharacteristics(
          game.program,
          game.state,
          game.state.objects[action.objectId]!,
        ).subtypes;
        expect(types).toContain("HARMONY");
        expect(types.includes("MELODY")).toBe(!expired && i === 0);
        passEffectsStack(game);
        expect(game.state.objects[top.objectId]!.zone).toBe(!expired ? "hand" : "main-deck");
      }
    });

import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";
import { requireSingleFace } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision } from "../../../testing/decisions.ts";
/** @covers WAFNy2lY5t-a2 */
it("retains Melody history when an effect defers the Harmony activation", () => {
  const base = createClassBonusTestChampion(melodiousFlute, true, "activation-discount");
  const champion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
    ...base,
    layout: {
      kind: "single-faced",
      face: {
        ...requireSingleFace(base),
        abilities: [
          {
            id: "deferredHarmony-a1",
            kind: "activated",
            activation: "ability",
            cost: { kind: "pay-reserve", amount: 0 },
            text: "Activate a Harmony from hand.",
            targets: [
              {
                id: "harmony",
                kind: "target",
                declared: "announcement",
                chooser: "controller",
                count: { kind: "exactly", amount: 1 },
                unique: true,
                candidates: {
                  kind: "card",
                  zones: ["hand"],
                  relationship: "zone-of",
                  player: "controller",
                  filter: { kind: "subtype", oneOf: ["HARMONY"] },
                },
              },
            ],
            effect: {
              kind: "activate-card",
              subject: { kind: "bound", binding: "harmony" },
              payCosts: true,
            },
          },
        ],
      },
    },
  };
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: {
        field: [melodiousFlute],
        hand: [
          empoweringHarmony,
          empoweringHarmony,
          ...Array.from({ length: 4 }, () => woodlandSquirrels),
        ],
        "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
      },
    },
    playerTwo: { champion },
  });
  const p = game.player("player-one"),
    [first, second] = p.cards(empoweringHarmony);
  if (!first || !second) throw new Error("Expected two Harmonies");
  p.activateAbility(melodiousFlute, "WAFNy2lY5t-a2");
  passEffectsStack(game);
  p.activateAbility(champion, "deferredHarmony-a1", { targets: { harmony: [first.objectId] } });
  passEffectsStack(game);
  const top = p.zone("main-deck")[0]!;
  answerDecision(game, "announce-effect-activation", {
    reservePayment: p
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(0, 2)
      .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
  });
  passEffectsStack(game);
  expect(
    game.state.eventHistory.some(
      (e) =>
        e.type === "stack-item-deferred" &&
        e.item.kind === "card-activation" &&
        e.item.cardId === first.objectId,
    ),
  ).toBe(true);
  expect(game.state.objects[first.objectId]!.zone).toBe("graveyard");
  expect(game.state.objects[top.objectId]!.zone).toBe("hand");
  const next = p.zone("main-deck")[0]!;
  p.activate(second, {
    reservePayment: p
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(0, 2)
      .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
  });
  passEffectsStack(game);
  expect(game.state.objects[next.objectId]!.zone).toBe("hand");
});
