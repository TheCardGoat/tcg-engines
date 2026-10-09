import type { GrandArchiveTargetId } from "@tcg/grand-archive-engine/runtime";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { stillwaterPatrol } from "../cards/DOA/allies/stillwater-patrol.ts";
import { automatonDrone } from "../cards/ALC/tokens/automaton-drone.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { snowWhiteWeissQueen } from "../cards/DTR/allies/snow-white-weiss-queen.ts";
import { declareResolvedAttack, advanceToMain, passEffectsStack } from "./decisions.ts";

export function proveEphemerateCard({
  card,
  ephemerateCost,
  target,
  departure,
  command = false,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  ephemerateCost: number;
  target?: "unit" | "player";
  departure?: "end-sacrifice" | "combat";
  command?: boolean;
}): void {
  const printed = grandArchiveTestFace(card).cost;
  if (printed.kind !== "reserve" || typeof printed.amount !== "number")
    throw new Error("Expected fixed reserve cost");
  const printedCost = printed.amount;
  for (const ephemerate of [false, true])
    it(`activates from ${ephemerate ? "graveyard" : "hand"} with exact cost and correct ephemeral lifetime`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(card, false, "activation-discount"),
      );
      const cost = ephemerate ? ephemerateCost : printedCost;
      const game = GrandArchiveTestEngine.startFixture({
        definitions: [automatonDrone],
        playerOne: {
          champion,
          zones: {
            field: command ? [snowWhiteWeissQueen] : [],
            hand: [
              ...(ephemerate ? [] : [card]),
              ...Array.from({ length: cost + 1 }, () => woodlandSquirrels),
            ],
            graveyard: ephemerate ? [card] : [],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: { field: [stillwaterPatrol], "main-deck": [woodlandSquirrels, woodlandSquirrels] },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(card);
      const targets: Readonly<Record<string, readonly GrandArchiveTargetId[]>> | undefined =
        target === "unit"
          ? { "target-1": [p.card(champion).objectId] }
          : target === "player"
            ? { "target-player": [q.id] }
            : undefined;
      const payment = p
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, cost)
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const options = {
        ...(command ? { attackAttackerId: p.card(snowWhiteWeissQueen).objectId } : {}),
        targets,
        activationMethod: ephemerate ? ("ephemerate" as const) : undefined,
      };
      const before = game.state;
      expect(() => p.activate(source, { ...options, reservePayment: payment.slice(1) })).toThrow();
      expect(game.state).toEqual(before);
      expect(() =>
        p.activate(source, {
          ...options,
          activationMethod: ephemerate ? undefined : "ephemerate",
          reservePayment: payment,
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      p.activate(source, { ...options, reservePayment: payment });
      expect(p.zone("memory")).toHaveLength(cost);
      expect(game.state.objects[source.objectId]!.zone).toBe("effects-stack");
      expect(game.state.objects[source.objectId]!.states.has("ephemeral")).toBe(
        ephemerate && !departure && !command,
      );
      passEffectsStack(game);
      if (command) {
        declareResolvedAttack(
          game,
          p.card(snowWhiteWeissQueen).objectId,
          q.card(champion).objectId,
          "Ephemerate Command attack",
        );
        expect(game.state.objects[source.objectId]!.zone).toBe("intent");
        expect(game.state.objects[source.objectId]!.states.has("ephemeral")).toBe(ephemerate);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(3);
      }
      if (departure) {
        expect(game.state.objects[source.objectId]!.zone).toBe("field");
        expect(game.state.objects[source.objectId]!.states.has("ephemeral")).toBe(ephemerate);
        advanceToMain(game, q.id);
        if (departure === "combat") {
          expect(game.state.objects[source.objectId]!.zone).toBe("field");
          q.declareAttack(stillwaterPatrol, source);
          game.resolveCombatWithoutRetaliation();
        }
      }
      expect(game.state.objects[source.objectId]!.zone).toBe(
        ephemerate ? "banishment" : "graveyard",
      );
      expect(game.state.objects[source.objectId]!.states.has("ephemeral")).toBe(false);
    });
}
