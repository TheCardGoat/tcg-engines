import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { stillwaterPatrol } from "../cards/DOA/allies/stillwater-patrol.ts";
import { soothingDisillusion } from "../cards/AMB/actions/soothing-disillusion.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";

export function proveClassEphemerate(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  cost: number,
  kind: "vantage" | "leap" | "slime" | "fractal",
) {
  const printed = grandArchiveTestFace(card).cost;
  if (printed.kind !== "reserve" || typeof printed.amount !== "number")
    throw new Error("Expected reserve cost");
  const printedCost = printed.amount;
  for (const classBonus of [false, true])
    for (const graveyard of [false, true]) {
      it(`checks Ephemerate class, cost, resolution and departure: class=${classBonus}, graveyard=${graveyard}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(card, classBonus, "activation-discount"),
        );
        const paymentCost = graveyard ? cost : printedCost;
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                ...(graveyard ? [] : [card]),
                soothingDisillusion,
                ...Array.from({ length: paymentCost + 2 }, () => woodlandSquirrels),
              ],
              graveyard: graveyard ? [card] : [],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [stillwaterPatrol, stillwaterPatrol],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(card),
          hero = p.card(champion);
        const payment = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const options: NonNullable<Parameters<typeof p.activate>[1]> = {
          ...(graveyard ? { activationMethod: "ephemerate" } : {}),
          ...(kind === "vantage" ? { targets: { "target-1": [hero.objectId] } } : {}),
          reservePayment: payment(paymentCost),
        };
        const before = game.state;
        expect(() =>
          p.activate(source, { ...options, reservePayment: payment(paymentCost - 1) }),
        ).toThrow();
        expect(game.state).toEqual(before);
        if (graveyard && !classBonus) {
          expect(() => p.activate(source, options)).toThrow();
          expect(game.state).toEqual(before);
          expect(
            p
              .legalCommands()
              .some(
                (c) => c.command.move === "activate-card" && c.command.cardId === source.objectId,
              ),
          ).toBe(false);
          return;
        }
        expect(() =>
          p.activate(source, {
            ...options,
            activationMethod: graveyard ? undefined : "ephemerate",
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activate(source, options);
        const permanent = kind === "slime" || kind === "fractal";
        expect(game.state.objects[source.objectId]!.zone).toBe("effects-stack");
        expect(game.state.objects[source.objectId]!.states.has("ephemeral")).toBe(
          graveyard && !permanent,
        );
        expect(p.zone("memory")).toHaveLength(paymentCost);
        passEffectsStack(game);
        if (kind === "vantage" || kind === "leap") {
          expect(game.state.objects[hero.objectId]!.states.has("distant")).toBe(true);
          expect(game.state.objects[hero.objectId]!.damage).toBe(kind === "leap" ? 1 : 0);
          expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(0);
        } else {
          expect(game.state.objects[source.objectId]!.zone).toBe("field");
          expect(game.state.objects[source.objectId]!.states.has("ephemeral")).toBe(graveyard);
          if (kind === "slime") {
            p.declareAttack(source, q.card(champion));
            game.resolveCombatWithoutRetaliation();
            expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(graveyard ? 4 : 2);
            advanceToMain(game, q.id);
            for (const attacker of q.cards(stillwaterPatrol, { zone: "field" })) {
              q.declareAttack(attacker, source);
              game.resolveCombatWithoutRetaliation();
            }
          } else {
            p.activate(soothingDisillusion, {
              reservePayment: payment(2),
              modeIds: ["mode-1"],
              targets: { "target-1": [source.objectId] },
            });
            passEffectsStack(game);
          }
        }
        expect(game.state.objects[source.objectId]!.zone).toBe(
          graveyard ? "banishment" : "graveyard",
        );
        expect(game.state.objects[source.objectId]!.states.has("ephemeral")).toBe(false);
      });
    }
}
