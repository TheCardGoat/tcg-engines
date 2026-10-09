import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { fireball } from "../cards/DOA/actions/fireball.ts";
import { evasivePositioning } from "../cards/DTR/actions/evasive-positioning.ts";
import { tombSweep } from "../cards/P26/actions/tomb-sweep.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";

export function proveEmpowerAction(card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>) {
  for (const matching of [false, true])
    for (const mode of [
      "normal",
      "non-spell",
      "opponent",
      "expired",
      "early-spell",
      "stacked",
      "activation-cost",
    ])
      it(`Empower 3 applies to the next Spell: class=${matching}, mode=${mode}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(card, matching, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                card,
                card,
                evasivePositioning,
                tombSweep,
                fireball,
                fireball,
                fireball,
                ...Array.from({ length: 18 }, () => woodlandSquirrels),
              ],
              "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              hand: [
                fireball,
                woodlandSquirrels,
                woodlandSquirrels,
                woodlandSquirrels,
                woodlandSquirrels,
              ],
              graveyard: [woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(champion),
          foe = q.card(champion);
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
        const castEmpower = () =>
          p.activate(p.cards(card, { zone: "hand" })[0]!, { reservePayment: pay(1) });
        const castFireball = () =>
          p.activate(p.cards(fireball, { zone: "hand" })[0]!, {
            reservePayment: pay(matching ? 2 : 4),
            targets: { "target-1": [foe.objectId] },
          });
        const before = game.state;
        expect(() =>
          p.activate(p.cards(card, { zone: "hand" })[0]!, { reservePayment: [] }),
        ).toThrow();
        expect(game.state).toEqual(before);
        castEmpower();
        if (mode === "early-spell") castFireball();
        passEffectsStack(game);
        const initialDamage = mode === "early-spell" ? 1 : 0;
        expect(game.state.objects[foe.objectId]!.damage).toBe(initialDamage);
        if (mode === "non-spell") {
          p.activate(evasivePositioning, {
            reservePayment: pay(1),
            targets: { "target-1": [hero.objectId] },
          });
          passEffectsStack(game);
          p.activate(p.cards(woodlandSquirrels, { zone: "hand" })[0]!);
          passEffectsStack(game);
        }
        if (mode === "opponent") {
          p.pass();
          q.activate(fireball, {
            reservePayment: q
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, matching ? 2 : 4)
              .map((ref) => ({ kind: "card", cardId: ref.objectId })),
            targets: { "target-1": [hero.objectId] },
          });
          passEffectsStack(game);
          expect(game.state.objects[hero.objectId]!.damage).toBe(1);
        }
        if (mode === "expired") advanceToMain(game, p.id, game.state.turn.number);
        if (mode === "stacked") {
          castEmpower();
          passEffectsStack(game);
        }
        if (mode === "activation-cost") {
          const target = q.card(woodlandSquirrels, { zone: "graveyard" });
          const current = game.state;
          expect(() =>
            p.activate(tombSweep, {
              reservePayment: [],
              targets: { "target-card": [target.objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(current);
          p.activate(tombSweep, {
            reservePayment: pay(1),
            targets: { "target-card": [target.objectId] },
          });
          passEffectsStack(game);
          expect(game.state.objects[target.objectId]!.zone).toBe("banishment");
        }
        expect(
          deriveGrandArchiveNumericProperty(game.state.objects[hero.objectId]!, "level", {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          }),
        ).toBe(0);
        const bonus = ["expired", "activation-cost"].includes(mode)
          ? 0
          : mode === "stacked" && !grandArchiveTestFace(card).typeLine.subtypes.includes("SPELL")
            ? 6
            : 3;
        castFireball();
        passEffectsStack(game);
        expect(game.state.objects[foe.objectId]!.damage).toBe(initialDamage + 1 + bonus);
        castFireball();
        passEffectsStack(game);
        expect(game.state.objects[foe.objectId]!.damage).toBe(initialDamage + 2 + bonus);
        expect(p.cards(card, { zone: "graveyard" })).toHaveLength(mode === "stacked" ? 2 : 1);
      });
}
