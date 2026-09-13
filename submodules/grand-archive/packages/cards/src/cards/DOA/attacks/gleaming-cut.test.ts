import { describe, expect, it } from "vitest";
import { memoryRevealFixture } from "../../../testing/memory-reveal-fixture.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { gleamingCut as card } from "./gleaming-cut.ts";
/** @covers qufoIF014c-a2 */
describe("Memory reveal requires both bonuses and can select another named copy", () => {
  for (const boundary of ["enabled", "class", "element", "hand", "opponent"] as const)
    for (const accept of [false, true])
      for (const other of [false, true])
        it(`${boundary},accept=${accept},other=${other}`, () => {
          const { game, p, q, hero, foe, source, reveal } = memoryRevealFixture(
            card,
            boundary !== "class",
            boundary !== "element",
            boundary === "hand" ? "hand" : "memory",
          );
          const selected = other ? p.cards(card, { zone: "memory" })[1]! : source,
            top = p
              .zone("main-deck")
              .slice(0, 2)
              .map((c) => c.objectId),
            hand = p.zone("hand").length;
          reveal(boundary !== "opponent");
          if (boundary === "enabled") {
            expect(game.state.decision?.kind).toBe("resolve-optional-effect");
            answerDecision(game, "resolve-optional-effect", accept);
            if (accept) {
              for (const bad of [
                q.card(card, { zone: "memory" }),
                p.card(card, { zone: "hand" }),
                p.card(woodlandSquirrels, { zone: "memory" }),
              ]) {
                const before = game.state;
                expect(() =>
                  answerDecision(game, "resolve-effect-choice", [bad.objectId]),
                ).toThrow();
                expect(game.state).toEqual(before);
              }
              answerDecision(game, "resolve-effect-choice", [selected.objectId]);
            }
            passEffectsStack(game);
          }
          const happened = boundary === "enabled" && accept;
          expect(game.state.objects[selected.objectId]!.zone).toBe(
            happened ? "banishment" : boundary === "hand" && !other ? "hand" : "memory",
          );
          if (other)
            expect(game.state.objects[source.objectId]!.zone).toBe(
              boundary === "hand" ? "hand" : "memory",
            );
          expect(q.zone("memory")).toHaveLength(1);
          expect(p.zone("hand")).toHaveLength(hand + 2 * (happened ? 1 : 0));
          if (happened) for (const id of top) expect(game.state.objects[id]!.zone).toBe("hand");
        });
});
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { declareResolvedAttack } from "../../../testing/decisions.ts";
import { corhaziInfiltrator } from "../allies/corhazi-infiltrator.ts";
/** @covers qufoIF014c-a1 */
for (const luxem of [false, true])
  it(`Gleaming Cut gains two power only from a selected luxem memory card: ${luxem}`, () => {
    const champion = createClassBonusTestChampion(card, false, "activation-discount"),
      game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [card, woodlandSquirrels, woodlandSquirrels],
            memory: [corhaziInfiltrator],
            field: [woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { memory: [corhaziInfiltrator] } },
      });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      hero = p.card(champion),
      foe = q.card(champion),
      pay = p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
    const before = game.state;
    expect(() =>
      p.activate(card, { attackAttackerId: hero.objectId, reservePayment: pay.slice(1) }),
    ).toThrow();
    expect(game.state).toEqual(before);
    p.activate(card, { attackAttackerId: hero.objectId, reservePayment: pay });
    passEffectsStack(game);
    declareResolvedAttack(game, hero.objectId, foe.objectId, "Gleaming Cut");
    passEffectsStack(game);
    const selected = luxem
      ? p.card(corhaziInfiltrator, { zone: "memory" })
      : p.cards(woodlandSquirrels, { zone: "memory" })[0]!;
    expect(() =>
      answerDecision(game, "resolve-effect-choice", [q.card(corhaziInfiltrator).objectId]),
    ).toThrow();
    answerDecision(game, "resolve-effect-choice", [selected.objectId]);
    passEffectsStack(game);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[foe.objectId]!.damage).toBe(luxem ? 4 : 2);
    expect(game.state.objects[selected.objectId]!.zone).toBe("memory");
    p.declareAttack(p.card(woodlandSquirrels, { zone: "field" }), foe);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[foe.objectId]!.damage).toBe(luxem ? 5 : 3);
  });
