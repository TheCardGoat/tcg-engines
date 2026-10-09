import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { reclaim } from "../cards/DOA/actions/reclaim.ts";
import { batteryCoreX } from "../cards/PRD/items/battery-core-x.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";

type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
export function proveControlledEntryCondition(
  card: Card,
  support: Card,
  wrongType: Card,
  {
    draw = false,
    ranged = 0,
    alternative,
    wrongSubtype = woodlandSquirrels,
  }: { draw?: boolean; ranged?: number; alternative?: Card; wrongSubtype?: Card } = {},
) {
  const face = grandArchiveTestFace(card),
    cost = face.cost;
  if (cost.kind !== "reserve" || typeof cost.amount !== "number")
    throw new Error("Expected fixed reserve cost");
  const printedCost = cost.amount;
  for (const matching of [false, true])
    for (const position of [
      "absent",
      "one",
      "two",
      "opponent",
      "hand",
      "graveyard",
      "wrong-type",
      "wrong-subtype",
      ...(alternative ? ["alternative", "alternative-opponent", "alternative-graveyard"] : []),
    ]) {
      it(`checks controlled objects on entry: class=${matching}, support=${position}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(card, matching, "activation-discount"),
        );
        const other = enableAllTestElements(
          createClassBonusTestChampion(card, true, "activation-discount"),
        );
        const field =
          position === "one"
            ? [support]
            : position === "two"
              ? [support, support]
              : position === "wrong-type"
                ? [wrongType]
                : position === "wrong-subtype"
                  ? [wrongSubtype]
                  : position === "alternative" && alternative
                    ? [alternative]
                    : [];
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                card,
                ...Array.from({ length: printedCost }, () => woodlandSquirrels),
                ...(position === "hand" ? [support] : []),
              ],
              field,
              graveyard:
                position === "graveyard"
                  ? [support]
                  : position === "alternative-graveyard" && alternative
                    ? [alternative]
                    : [],
              "main-deck": [reclaim, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion: other,
            zones: {
              field:
                position === "alternative-opponent" && alternative
                  ? [alternative]
                  : position === "opponent"
                    ? [support]
                    : [],
              "main-deck": [woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(card),
          top = p.card(reclaim, { zone: "main-deck" });
        p.activate(source, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((ref) => ({ kind: "card", cardId: ref.objectId })),
        });
        p.pass();
        q.pass();
        expect(game.state.objects[source.objectId]!.zone).toBe("field");
        expect(game.state.objects[source.objectId]!.states.has("distant")).toBe(false);
        expect(game.state.objects[top.objectId]!.zone).toBe("main-deck");
        expect(
          game.state.stack.some(
            (item) => item.kind === "triggered-ability" && item.sourceId === source.objectId,
          ),
        ).toBe(matching);
        passEffectsStack(game);
        const enabled = matching && ["one", "two", "alternative"].includes(position);
        expect(game.state.decision).toBeNull();
        expect(game.state.stack).toHaveLength(0);
        expect(game.state.zones[p.id].memory).toHaveLength(printedCost + (draw && enabled ? 1 : 0));
        expect(game.state.objects[top.objectId]!.zone).toBe(
          draw && enabled ? "memory" : "main-deck",
        );
        expect(game.state.objects[source.objectId]!.states.has("distant")).toBe(!draw && enabled);
        if (!draw) {
          p.declareAttack(source, q.card(other));
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[q.card(other).objectId]!.damage).toBe(
            (face.stats.power ?? 0) + (enabled ? ranged : 0),
          );
          advanceToMain(game, q.id);
          expect(game.state.objects[source.objectId]!.states.has("distant")).toBe(false);
        }
      });
    }
  for (const remove of [false, true]) {
    it(`evaluates the support object when the entry trigger resolves: remove=${remove}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(card, true, "activation-discount"),
      );
      const chosen = draw ? batteryCoreX : support;
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [chosen],
            hand: [
              card,
              reclaim,
              ...Array.from({ length: printedCost + 2 }, () => woodlandSquirrels),
            ],
            "main-deck": [woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(card),
        supportRef = p.card(chosen);
      const pay = (n: number) =>
        p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, n)
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
      p.activate(source, { reservePayment: pay(printedCost) });
      p.pass();
      q.pass();
      expect(game.state.stack.some((item) => item.kind === "triggered-ability")).toBe(true);
      const memoryBefore = game.state.zones[p.id].memory.length;
      if (remove) {
        if (draw)
          p.activateAbility(supportRef, "oqhB00zhaD-a2", {
            targets: { "target-ally": [source.objectId] },
          });
        else
          p.activate(reclaim, {
            reservePayment: pay(2),
            targets: { "target-1": [supportRef.objectId] },
          });
        p.pass();
        q.pass();
        expect(game.state.objects[supportRef.objectId]?.zone).not.toBe("field");
      }
      passEffectsStack(game);
      expect(game.state.objects[source.objectId]!.states.has("distant")).toBe(!draw && !remove);
      expect(game.state.zones[p.id].memory).toHaveLength(
        memoryBefore + (!draw && remove ? 2 : 0) + (draw && !remove ? 1 : 0),
      );
    });
  }
}
