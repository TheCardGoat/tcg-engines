import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { flowerbud } from "../cards/HVN/tokens/flowerbud.ts";
import { vacuousServant } from "../cards/DTR/tokens/vacuous-servant.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { singeingLeap } from "../cards/PTM/actions/singeing-leap.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import { enableAllTestElements, grandArchiveTestFace } from "./class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "./decisions.ts";

export function proveLineageEntrySummon(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  name: string,
  amount: number,
  { optionalTarget = false, fullBloom = false, servant = false } = {},
) {
  const cost = grandArchiveTestFace(card).cost;
  if (cost.kind === "none" || typeof cost.amount !== "number")
    throw new Error("Expected fixed cost");
  const printedCost = cost.amount,
    material = cost.kind === "memory",
    token = servant ? vacuousServant : flowerbud;
  for (const identity of ["wrong", "matching", "buried", "current"])
    for (const omit of optionalTarget && (identity === "matching" || identity === "current")
      ? [false, true]
      : [false])
      it(`checks current lineage and resolves the entry trigger: identity=${identity}, omit=${omit}`, () => {
        const enabled = identity === "matching" || identity === "current";
        const initialDamage = fullBloom ? (identity === "current" ? 9 : 3) : 0;
        const starter = enableAllTestElements(
          lineageTestChampion(identity === "matching" || identity === "buried" ? name : "Other", 0),
        );
        const lineage =
          identity === "buried" || identity === "current"
            ? [
                enableAllTestElements(
                  lineageTestChampion(identity === "current" ? name : "Other", 1),
                ),
              ]
            : [];
        const opponent = enableAllTestElements(lineageTestChampion(name, 0));
        const game = GrandArchiveTestEngine.startFixture({
          phase: material ? "materialize" : "main",
          definitions: [token],
          playerOne: {
            champion: starter,
            lineage,
            zones: {
              ...(material
                ? {
                    "material-deck": [card],
                    memory: Array.from({ length: printedCost }, () => woodlandSquirrels),
                  }
                : {}),
              hand: [
                ...(material ? [] : [card]),
                ...Array.from({ length: initialDamage }, () => singeingLeap),
                ...Array.from(
                  { length: material ? 0 : printedCost + initialDamage },
                  () => woodlandSquirrels,
                ),
              ],
            },
          },
          playerTwo: { champion: opponent },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(card),
          hero = p.card(starter),
          enemy = q.card(opponent);
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
        if (fullBloom)
          for (let i = 0; i < initialDamage; i++) {
            p.activate(p.cards(singeingLeap, { zone: "hand" })[0]!, { reservePayment: pay(1) });
            passEffectsStack(game);
          }
        if (material) p.materialize(source);
        else p.activate(source, { reservePayment: pay(printedCost) });
        expect(p.cards(token, { zone: "field" })).toHaveLength(0);
        expect(q.cards(token, { zone: "field" })).toHaveLength(0);
        p.pass();
        q.pass();
        expect(game.state.objects[source.objectId]!.zone).toBe("field");
        expect(p.cards(token, { zone: "field" })).toHaveLength(0);
        expect(q.cards(token, { zone: "field" })).toHaveLength(0);
        if (enabled && !servant) {
          expect(game.state.decision).toMatchObject({
            kind: "announce-triggered-ability",
            playerId: p.id,
          });
          const before = game.state;
          for (const ids of [[p.id], [q.id, q.id], ...(!optionalTarget ? [[]] : [])]) {
            expect(() =>
              answerDecision(game, "announce-triggered-ability", {
                targets: { "target-opponent": ids },
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          answerDecision(game, "announce-triggered-ability", {
            targets: { "target-opponent": omit ? [] : [q.id] },
          });
        }
        for (let i = 0; i < 24; i++) {
          passEffectsStack(game);
          if (game.state.decision?.kind === "order-triggered-abilities")
            answerDecision(
              game,
              "order-triggered-abilities",
              game.state.decision.pendingTriggerIds,
            );
          else break;
        }
        expect(game.state.decision).toBeNull();
        expect(game.state.stack).toHaveLength(0);
        const owner = servant ? p : q;
        expect(owner.cards(token, { zone: "field" })).toHaveLength(enabled && !omit ? amount : 0);
        expect((servant ? q : p).cards(token, { zone: "field" })).toHaveLength(0);
        for (const ref of owner.cards(token, { zone: "field" })) {
          expect(game.state.objects[ref.objectId]).toMatchObject({
            ownerId: owner.id,
            controllerId: owner.id,
            isToken: true,
          });
          expect(game.state.objects[ref.objectId]!.states.has("rested")).toBe(false);
        }
        if (fullBloom) {
          expect(game.state.objects[enemy.objectId]!.damage).toBe(enabled ? 8 : 0);
          expect(game.state.objects[hero.objectId]!.damage).toBe(
            enabled ? Math.max(0, initialDamage - 8) : initialDamage,
          );
        }
      });
}
