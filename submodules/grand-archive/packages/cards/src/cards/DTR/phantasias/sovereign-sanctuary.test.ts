import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { sovereignSanctuary } from "./sovereign-sanctuary.ts";
import { enfeebledDagger } from "../items/enfeebled-dagger.ts";
import { raisedSlash } from "../attacks/raised-slash.ts";
import { sparkAlight } from "../../DOA/actions/spark-alight.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { nocturnesOblivion } from "../../P25/actions/nocturnes-oblivion.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { declareResolvedAttack, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers w6OqqsfEso-a1 */
describe("Sovereign Sanctuary — repeatable prevention for controlled units", () => {
  for (const zone of ["field", "graveyard"] as const)
    for (const owned of [false, true])
      for (const ally of [false, true])
        for (const kind of ["ability", "combat", "unpreventable"] as const)
          it(`${zone}, owned=${owned}, ally=${ally}, ${kind}`, () => {
            const champion = enableAllTestElements(
              createClassBonusTestChampion(sovereignSanctuary, false, "activation-discount"),
            );
            const supplies = {
              field: [giantTortoise, enfeebledDagger, enfeebledDagger],
              hand: [
                raisedSlash,
                sparkAlight,
                sparkAlight,
                ...Array.from({ length: 4 }, () => woodlandSquirrels),
              ],
            };
            const game = GrandArchiveTestEngine.startFixture({
              firstPlayer: owned ? "playerTwo" : "playerOne",
              playerOne: {
                champion,
                zones: {
                  ...supplies,
                  field: [...supplies.field, ...(zone === "field" ? [sovereignSanctuary] : [])],
                  graveyard: zone === "graveyard" ? [sovereignSanctuary] : [],
                },
              },
              playerTwo: { champion, zones: supplies },
            });
            const p = game.player("player-one"),
              q = game.player("player-two");
            const actor = owned ? q : p,
              defender = owned ? p : q;
            const target = defender.card(ally ? giantTortoise : champion, { zone: "field" });
            const payment = (count: number) =>
              actor
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, count)
                .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
            const prevented = owned && zone === "field";
            if (kind === "combat") {
              const attacker = actor.card(champion);
              actor.activate(raisedSlash, {
                attackAttackerId: attacker.objectId,
                reservePayment: payment(3),
              });
              passEffectsStack(game);
              declareResolvedAttack(
                game,
                attacker.objectId,
                target.objectId,
                "Declare Raised Slash",
              );
              game.resolveCombatWithoutRetaliation();
              expect(game.state.objects[target.objectId]!.damage).toBe(prevented ? 1 : 3);
            } else {
              for (let hit = 1; hit <= 2; hit++) {
                if (kind === "ability") {
                  actor.activateAbility(
                    actor.cards(enfeebledDagger, { zone: "field" })[0]!,
                    "idpdon8f0h-a1",
                    { targets: { "target-unit": [target.objectId] } },
                  );
                } else {
                  actor.activate(actor.cards(sparkAlight, { zone: "hand" })[0]!, {
                    targets: { "target-1": [target.objectId] },
                    reservePayment: payment(2),
                  });
                }
                passEffectsStack(game);
                expect(game.state.objects[target.objectId]!.damage).toBe(
                  hit * (kind === "unpreventable" ? 2 : prevented ? 0 : 1),
                );
              }
            }
            expect(game.state.objects[p.card(sovereignSanctuary).objectId]!.zone).toBe(zone);
          });
});

/** @covers w6OqqsfEso-a2 */
describe("Sovereign Sanctuary — sacrifice and draw before recollection", () => {
  for (const afterTrigger of [false, true])
    it(`removed ${afterTrigger ? "after" : "before"} the recollection trigger`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(sovereignSanctuary, false, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: {
            field: [sovereignSanctuary],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: {
            hand: [nocturnesOblivion, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const source = p.card(sovereignSanctuary),
        top = p.zone("main-deck")[0]!;
      if (afterTrigger) {
        advanceToRecollection(game, p.id);
        expect(
          game.state.stack.some(
            (item) => item.kind === "triggered-ability" && item.ability.id === "w6OqqsfEso-a2",
          ),
        ).toBe(true);
        p.pass();
      }
      q.activate(nocturnesOblivion, {
        targets: { "target-1": [source.objectId] },
        reservePayment: q
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      });
      passEffectsStack(game);
      expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
      if (!afterTrigger) {
        advanceToRecollection(game, p.id);
        expect(game.state.stack).toHaveLength(0);
      }
      expect(game.state.objects[top.objectId]!.zone).toBe(afterTrigger ? "memory" : "main-deck");
      expect(p.zone("memory")).toHaveLength(afterTrigger ? 1 : 0);
    });

  for (const sourceZone of ["hand", "field", "graveyard"] as const)
    for (const deckSize of [1, 4])
      it(`${sourceZone}, deck=${deckSize}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(sovereignSanctuary, false, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                ...(sourceZone === "hand" ? [sovereignSanctuary] : []),
                woodlandSquirrels,
                woodlandSquirrels,
                woodlandSquirrels,
              ],
              field: [
                enfeebledDagger,
                enfeebledDagger,
                ...(sourceZone === "field" ? [sovereignSanctuary] : []),
              ],
              graveyard: sourceZone === "graveyard" ? [sovereignSanctuary] : [],
              "main-deck": Array.from({ length: deckSize }, () => woodlandSquirrels),
            },
          },
          playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const source = p.card(sovereignSanctuary),
          hero = p.card(champion),
          top = p.zone("main-deck")[0]!;
        if (sourceZone === "hand") {
          const payment = p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
          const before = game.state;
          expect(() => p.activate(source, { reservePayment: payment.slice(0, 2) })).toThrow();
          expect(game.state).toEqual(before);
          p.activate(source, { reservePayment: payment });
          expect(p.zone("memory")).toHaveLength(3);
          expect(game.state.objects[source.objectId]!.zone).not.toBe("field");
          passEffectsStack(game);
        }
        const active = sourceZone !== "graveyard";
        p.activateAbility(p.cards(enfeebledDagger, { zone: "field" })[0]!, "idpdon8f0h-a1", {
          targets: { "target-unit": [hero.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]!.damage).toBe(active ? 0 : 1);
        advanceToRecollection(game, q.id);
        expect(game.state.stack).toHaveLength(0);
        expect(game.state.objects[source.objectId]!.zone).toBe(active ? "field" : "graveyard");
        expect(game.state.objects[top.objectId]!.zone).toBe("main-deck");
        advanceToRecollection(game, p.id);
        expect(
          game.state.stack.some(
            (item) => item.kind === "triggered-ability" && item.ability.id === "w6OqqsfEso-a2",
          ),
        ).toBe(active);
        const memory = p.zone("memory").length,
          hand = p.zone("hand").length;
        expect(game.state.objects[source.objectId]!.zone).toBe(active ? "field" : "graveyard");
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
        expect(game.state.objects[top.objectId]!.zone).toBe(active ? "memory" : "main-deck");
        expect(p.zone("memory")).toHaveLength(memory + (active ? 1 : 0));
        expect(p.zone("hand")).toHaveLength(hand);
        p.activateAbility(p.cards(enfeebledDagger, { zone: "field" })[0]!, "idpdon8f0h-a1", {
          targets: { "target-unit": [hero.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]!.damage).toBe(active ? 1 : 2);
        for (let step = 0; step < 12 && p.zone("memory").length > 0; step++) {
          const wait = game.waitState();
          if (wait.kind !== "opportunity")
            throw new Error(`Unexpected ${wait.kind} before recollection`);
          game.player(wait.playerId).pass();
        }
        expect(p.zone("memory")).toHaveLength(0);
        if (active) expect(game.state.objects[top.objectId]!.zone).toBe("hand");
      });
});
