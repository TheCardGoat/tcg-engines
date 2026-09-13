import { describe, expect, it } from "vitest";
import { memoryRevealFixture } from "../../../testing/memory-reveal-fixture.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { corhaziInfiltrator as card } from "./corhazi-infiltrator.ts";
/** @covers VAFTR5taNG-a2 */
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
            happened ? "field" : boundary === "hand" && !other ? "hand" : "memory",
          );
          if (other)
            expect(game.state.objects[source.objectId]!.zone).toBe(
              boundary === "hand" ? "hand" : "memory",
            );
          expect(q.zone("memory")).toHaveLength(1);
          expect(p.zone("hand")).toHaveLength(hand + 0 * (happened ? 1 : 0));
          if (happened) {
            p.declareAttack(selected, foe);
            game.resolveCombatWithoutRetaliation();
            expect(game.state.objects[foe.objectId]!.damage).toBe(3);
          }
        });
});
