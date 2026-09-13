import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { ghostsOfPendragon } from "./ghosts-of-pendragon.ts";
import { spiritsBlessing } from "../actions/spirits-blessing.ts";
import { woodlandSquirrels } from "./woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { excaliburCursedSword } from "../weapons/excalibur-cursed-sword.ts";
/** @covers SkAe1hsw5H-a1 */
describe("Ghosts of Pendragon draws only after returning a controlled regalia to its owner", () => {
  for (const borrowed of [false, true])
    for (const accept of [false, true])
      it(`borrowed=${borrowed}, accept=${accept}`, () => {
        const champion = createClassBonusTestChampion(spiritsBlessing, true, "activation-discount"),
          game = GrandArchiveTestEngine.startFixture({
            firstPlayer: "playerTwo",
            phase: "materialize",
            playerOne: {
              champion,
              zones: {
                hand: [ghostsOfPendragon, woodlandSquirrels, woodlandSquirrels],
                field: [trainingSword, woodlandSquirrels],
                "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: {
                "material-deck": [excaliburCursedSword],
                field: [trainingSword],
                "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
              },
            },
          });
        const p = game.player("player-one"),
          q = game.player("player-two");
        q.materialize(excaliburCursedSword);
        passEffectsStack(game);
        answerDecision(game, "resolve-effect-choice", [borrowed ? p.id : q.id]);
        passEffectsStack(game);
        advanceToMain(game, q.id);
        advanceToMain(game, p.id);
        const regalia = borrowed ? q.card(excaliburCursedSword) : p.card(trainingSword),
          top = p.zone("main-deck").slice(0, 2);
        p.activate(ghostsOfPendragon, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 2)
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        const hand = p.zone("hand").length;
        passEffectsStack(game);
        answerDecision(game, "resolve-optional-effect", accept);
        if (accept) {
          const before = game.state;
          for (const bad of [
            q.card(trainingSword),
            p.card(woodlandSquirrels, { zone: "field" }),
            p.card(ghostsOfPendragon),
          ]) {
            expect(() => answerDecision(game, "resolve-effect-choice", [bad.objectId])).toThrow();
            expect(game.state).toEqual(before);
          }
          answerDecision(game, "resolve-effect-choice", [regalia.objectId]);
        }
        passEffectsStack(game);
        expect(p.zone("hand")).toHaveLength(hand + (accept ? 2 : 0));
        for (const card of top)
          expect(game.state.objects[card.objectId]!.zone).toBe(accept ? "hand" : "main-deck");
        expect(game.state.objects[regalia.objectId]!.zone).toBe(accept ? "material-deck" : "field");
        if (accept)
          expect((borrowed ? q : p).zone("material-deck").map((c) => c.objectId)).toContain(
            regalia.objectId,
          );
        expect(p.card(ghostsOfPendragon, { zone: "field" })).toBeDefined();
      });
  it("does not draw when no controlled regalia can be returned", () => {
    const champion = createClassBonusTestChampion(spiritsBlessing, true, "activation-discount"),
      game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [ghostsOfPendragon, woodlandSquirrels, woodlandSquirrels],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { field: [trainingSword] } },
      });
    const p = game.player("player-one");
    p.activate(ghostsOfPendragon, {
      reservePayment: p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((c) => ({ kind: "card", cardId: c.objectId })),
    });
    passEffectsStack(game);
    expect(game.state.decision).toBeNull();
    expect(p.zone("hand")).toHaveLength(0);
    expect(p.zone("main-deck")).toHaveLength(2);
  });
});
