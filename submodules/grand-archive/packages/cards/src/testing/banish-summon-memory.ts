import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { powercell } from "../cards/MRC/tokens/powercell.ts";
import { trainingDummy } from "../cards/P26/tokens/training-dummy.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";
type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
export function proveBanishSummonMemory(card: Card, abilityId: string, dummy: boolean) {
  for (const matching of [false, true])
    for (const opponentTurn of [false, true])
      it(`pays three reserve, banishes, and resolves token and memory in printed order: class=${matching}, opponent=${opponentTurn}`, () => {
        const champion = createClassBonusTestChampion(card, matching, "activation-discount");
        const token = dummy ? trainingDummy : powercell;
        const game = GrandArchiveTestEngine.startFixture({
          definitions: [token],
          firstPlayer: opponentTurn ? "playerTwo" : "playerOne",
          playerOne: {
            champion,
            zones: {
              field: [card],
              hand: Array.from({ length: 4 }, () => woodlandSquirrels),
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: { field: [card, token], "main-deck": [woodlandSquirrels, woodlandSquirrels] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(card),
          existing = q.card(token);
        const targets = dummy ? { "target-opponent": [q.id] } : undefined;
        if (opponentTurn) q.pass();
        const pay = (amount: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, amount)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        for (const invalid of [0, 2, 4]) {
          const before = game.state;
          expect(() =>
            p.activateAbility(source, abilityId, { reservePayment: pay(invalid), targets }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        if (dummy) {
          const before = game.state;
          expect(() =>
            p.activateAbility(source, abilityId, {
              reservePayment: pay(3),
              targets: { "target-opponent": [p.id] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        const top = p.zone("main-deck")[0]!,
          payment = pay(3);
        p.activateAbility(source, abilityId, { reservePayment: payment, targets });
        expect(p.cards(card, { zone: "banishment" })).toEqual([source]);
        expect(p.zone("memory").map((c) => c.objectId)).toEqual(payment.map((c) => c.cardId));
        expect(p.zone("hand")).toHaveLength(1);
        expect(p.zone("main-deck")[0]).toEqual(top);
        expect(p.cards(token, { zone: "field" })).toHaveLength(0);
        expect(q.cards(token, { zone: "field" })).toEqual([existing]);
        const beforeAgain = game.state;
        expect(() =>
          p.activateAbility(source, abilityId, { reservePayment: pay(3), targets }),
        ).toThrow();
        expect(game.state).toEqual(beforeAgain);
        passEffectsStack(game);
        expect(p.zone("memory").map((c) => c.objectId)).toEqual([
          ...payment.map((c) => c.cardId),
          top.objectId,
        ]);
        expect(p.zone("hand")).toHaveLength(1);
        expect(p.zone("main-deck")).toHaveLength(1);
        const recipient = dummy ? q : p;
        const summoned = recipient
          .cards(token, { zone: "field" })
          .filter((c) => c.objectId !== existing.objectId);
        expect(summoned).toHaveLength(1);
        const object = game.state.objects[summoned[0]!.objectId]!;
        expect(object).toMatchObject({
          ownerId: recipient.id,
          controllerId: recipient.id,
          isToken: true,
        });
        expect(object.states.has("rested")).toBe(!dummy);
        expect(q.zone("hand")).toHaveLength(0);
        expect(q.zone("memory")).toHaveLength(0);
        expect(q.cards(card, { zone: "field" })).toHaveLength(1);
        expect(game.state.objects[existing.objectId]!.states.has("rested")).toBe(false);
        const drawIndex = game.state.eventHistory.findIndex(
          (e) => e.type === "object-moved" && e.objectId === top.objectId && e.to === "memory",
        );
        const summonIndex = game.state.eventHistory.findIndex(
          (e) => e.type === "tokens-summoned" && e.objects.some((o) => o.id === object.id),
        );
        expect(drawIndex).toBeGreaterThan(-1);
        expect(summonIndex).toBeGreaterThan(-1);
        expect(drawIndex < summonIndex).toBe(dummy);
      });
}
