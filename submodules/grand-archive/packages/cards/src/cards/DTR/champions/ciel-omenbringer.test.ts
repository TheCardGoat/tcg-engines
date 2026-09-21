import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { cielOmenbringer } from "./ciel-omenbringer.ts";
import { condemnedTrinket } from "../items/condemned-trinket.ts";
import { backdash } from "../actions/backdash.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { lineageTestChampion, proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

function reachMaterialization(game: GrandArchiveTestEngine, playerId: string): void {
  for (let i = 0; i < 128; i++) {
    const wait = game.waitState();
    if (wait.kind === "materialization-choice") {
      if (wait.playerId === playerId) return;
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    } else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else throw new Error(`Unexpected ${wait.kind}`);
  }
  throw new Error("Did not reach materialization");
}

/** @covers o69ogocemo-a1 */
describe("Ciel, Omenbringer — Ciel Lineage", () => {
  proveChampionLineage({ card: cielOmenbringer, lineageName: "Ciel", level: 2, memoryCost: 2 });
});

/** @covers o69ogocemo-a2 */
describe("Ciel, Omenbringer — discard then draw per owned omen", () => {
  for (const count of [0, 1, 3])
    for (const zone of ["hand", "memory"] as const)
      it(`${count} omens, discards from ${zone}`, () => {
        const starter = lineageTestChampion("Ciel", 0),
          enemy = lineageTestChampion("Opponent", 0);
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion: starter,
            lineage: [lineageTestChampion("Ciel", 1)],
            zones: {
              field: Array.from({ length: count }, () => condemnedTrinket),
              hand: [
                backdash,
                backdash,
                ...Array.from({ length: 3 * count + 4 }, () => woodlandSquirrels),
              ],
              memory: [woodlandSquirrels, woodlandSquirrels],
              graveyard: Array.from({ length: count + 1 }, () => backdash),
              banishment: [backdash],
              "material-deck": [cielOmenbringer],
              "main-deck": Array.from({ length: 10 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion: enemy,
            zones: {
              field: [condemnedTrinket],
              hand: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              graveyard: [backdash, woodlandSquirrels],
              "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        q.activateAbility(condemnedTrinket, "21oy1nd4nw-a1", {
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
        answerDecision(game, "resolve-effect-choice", [q.card(backdash).objectId]);
        passEffectsStack(game);
        advanceToMain(game, p.id);
        for (let i = 0; i < count; i++) {
          const selected = p.cards(backdash, { zone: "graveyard" })[0]!;
          p.activateAbility(p.cards(condemnedTrinket, { zone: "field" })[0]!, "21oy1nd4nw-a1", {
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, 3)
              .map((c) => ({ kind: "card", cardId: c.objectId })),
          });
          passEffectsStack(game);
          answerDecision(game, "resolve-effect-choice", [selected.objectId]);
          passEffectsStack(game);
        }
        for (const action of p.cards(backdash, { zone: "hand" })) {
          p.activate(action, {
            reservePayment: [
              { kind: "card", cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
            ],
            targets: { "target-1": [q.card(enemy).objectId] },
          });
          passEffectsStack(game);
        }
        advanceToMain(game, q.id);
        reachMaterialization(game, p.id);
        const memoryBefore = p.zone("memory").length;
        p.materialize(cielOmenbringer);
        expect(p.zone("memory")).toHaveLength(memoryBefore - 2);
        const initialMemory = p.zone("memory").length,
          initialHand = p.zone("hand").length;
        const deck = p.zone("main-deck").map((c) => c.objectId);
        const opposing = q.zone("memory").map((c) => c.objectId);
        passEffectsStack(game);
        for (let i = 0; i < count; i++) {
          expect(game.state.decision).toMatchObject({
            kind: "resolve-effect-choice",
            playerId: p.id,
          });
          expect(p.zone("main-deck")).toHaveLength(deck.length - i);
          const chosen = p.zone(zone)[0]!;
          for (const invalid of [
            [],
            [q.card(woodlandSquirrels, { zone: "graveyard" }).objectId],
            [p.cards(backdash, { zone: "graveyard" })[0]!.objectId],
            [p.zone("hand")[0]!.objectId, p.zone("memory")[0]!.objectId],
          ]) {
            const before = game.state;
            expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
            expect(game.state).toEqual(before);
          }
          answerDecision(game, "resolve-effect-choice", [chosen.objectId]);
          passEffectsStack(game);
          expect(game.state.objects[chosen.objectId]!.zone).toBe("graveyard");
          expect(game.state.objects[deck[i]!]!.zone).toBe("memory");
        }
        expect(game.state.decision).toBeNull();
        expect(p.zone("hand")).toHaveLength(initialHand - (zone === "hand" ? count : 0));
        expect(p.zone("memory")).toHaveLength(initialMemory + (zone === "hand" ? count : 0));
        expect(q.zone("memory").map((c) => c.objectId)).toEqual(opposing);
        expect(p.zone("main-deck")).toHaveLength(deck.length - count);
      });
});

/** @covers o69ogocemo-a3 */
describe("Ciel, Omenbringer — paid activation of one omen through Lineage Release", () => {
  for (const [count, current, choice] of [
    [5, false, "action"],
    [6, true, "action"],
    [6, false, "none"],
    [6, false, "action"],
    [6, false, "ally"],
    [7, false, "action"],
  ] as const)
    it(`${count} owned omens, current=${current}, choice=${choice}`, () => {
      const starter = lineageTestChampion("Ciel", 0),
        enemy = lineageTestChampion("Opponent", 0);
      const successor = lineageTestChampion("Ciel", 3);
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion: starter,
          lineage: [
            lineageTestChampion("Ciel", 1),
            cielOmenbringer,
            ...(current ? [] : [successor]),
          ],
          zones: {
            "material-deck": current ? [successor] : [],
            field: Array.from({ length: count }, () => condemnedTrinket),
            hand: [
              cielOmenbringer,
              ...Array.from({ length: 3 * count + 1 }, () => woodlandSquirrels),
            ],
            graveyard: [
              backdash,
              backdash,
              ...Array.from({ length: count - 1 }, () => woodlandSquirrels),
            ],
            banishment: [backdash],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion: enemy,
          zones: {
            field: [condemnedTrinket],
            hand: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            graveyard: [backdash, woodlandSquirrels],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      q.activateAbility(condemnedTrinket, "21oy1nd4nw-a1", {
        reservePayment: q
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card", cardId: c.objectId })),
      });
      passEffectsStack(game);
      answerDecision(game, "resolve-effect-choice", [q.card(backdash).objectId]);
      passEffectsStack(game);
      advanceToMain(game, p.id);
      const action = p.cards(backdash, { zone: "graveyard" })[0]!;
      const unmarked = p.card(backdash, { zone: "banishment" });
      const omenCards = [action, ...p.cards(woodlandSquirrels, { zone: "graveyard" })];
      for (const card of omenCards) {
        p.activateAbility(p.cards(condemnedTrinket, { zone: "field" })[0]!, "21oy1nd4nw-a1", {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 3)
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
        answerDecision(game, "resolve-effect-choice", [card.objectId]);
        passEffectsStack(game);
      }
      const source = p.card(cielOmenbringer, { zone: "inner-lineage" });
      const before = game.state;
      expect(() =>
        p.activateAbility(p.card(cielOmenbringer, { zone: "hand" }), "o69ogocemo-a3"),
      ).toThrow();
      expect(game.state).toEqual(before);
      if (count < 6 || current) {
        expect(() => p.activateAbility(source, "o69ogocemo-a3")).toThrow();
        expect(game.state).toEqual(before);
        if (count < 6) return;
        advanceToMain(game, q.id);
        reachMaterialization(game, p.id);
        p.materialize(successor);
        passEffectsStack(game);
        expect(
          game.state.objects[p.card(starter, { zone: "field" }).objectId]!.activeDefinitionId,
        ).toBe(successor.canonicalId);
        expect(game.state.objects[source.objectId]!.zone).toBe("inner-lineage");
      }
      const selected = choice === "ally" ? omenCards[1]! : action;
      const memory = p.zone("memory").length;
      p.activateAbility(source, "o69ogocemo-a3");
      expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
      expect(game.state.objects[selected.objectId]!.zone).toBe("banishment");
      expect(p.zone("memory")).toHaveLength(memory);
      passEffectsStack(game);
      expect(game.state.decision?.kind).toBe("resolve-effect-choice");
      for (const invalid of [
        [source.objectId],
        [unmarked.objectId],
        [q.card(backdash, { zone: "banishment" }).objectId],
        [p.card(backdash, { zone: "graveyard" }).objectId],
        [action.objectId, omenCards[1]!.objectId],
      ]) {
        const beforeChoice = game.state;
        expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
        expect(game.state).toEqual(beforeChoice);
      }
      answerDecision(game, "resolve-effect-choice", choice === "none" ? [] : [selected.objectId]);
      passEffectsStack(game);
      if (choice !== "none") {
        expect(game.state.decision).toMatchObject({
          kind: "announce-effect-activation",
          playerId: p.id,
          cardId: selected.objectId,
          payCosts: true,
        });
        if (choice === "action") {
          const unpaid = game.state;
          expect(() =>
            answerDecision(game, "announce-effect-activation", {
              targets: { "target-1": [q.card(enemy).objectId] },
              reservePayment: [],
            }),
          ).toThrow();
          expect(game.state).toEqual(unpaid);
          answerDecision(game, "announce-effect-activation", {
            targets: { "target-1": [q.card(enemy).objectId] },
            reservePayment: [
              { kind: "card", cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
            ],
          });
        } else answerDecision(game, "announce-effect-activation", {});
        expect(game.state.objects[selected.objectId]!.zone).toBe("effects-stack");
        passEffectsStack(game);
        expect(game.state.objects[selected.objectId]!.zone).toBe(
          choice === "action" ? "graveyard" : "field",
        );
        expect(game.state.objects[selected.objectId]!.counters.omen ?? 0).toBe(0);
      }
      expect(p.zone("memory")).toHaveLength(memory + Number(choice === "action"));
      expect(game.state.objects[q.card(enemy).objectId]!.states.has("distant")).toBe(
        choice === "action",
      );
      expect(game.state.decision).toBeNull();
      const spent = game.state;
      expect(() => p.activateAbility(source, "o69ogocemo-a3")).toThrow();
      expect(game.state).toEqual(spent);
    });
});
