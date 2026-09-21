import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { suspiciousConcoction } from "./suspicious-concoction.ts";
import { spiritsBlessing } from "../../DOA/actions/spirits-blessing.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 5tphi6xl26-a1 */
describe("Suspicious Concoction — optional reward for its controller's level-up", () => {
  for (const damage of [0, 1, 3])
    for (const accept of [false, true])
      it(`handles ${damage} damage and ${accept ? "banishes" : "keeps"} the potion`, () => {
        const champion = lineageTestChampion("Test", 0),
          next = lineageTestChampion("Test", 1);
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion,
            zones: {
              field: [suspiciousConcoction],
              memory: [woodlandSquirrels],
              "material-deck": [next],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: Array.from({ length: damage }, () => giantTortoise),
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(champion),
          source = p.card(suspiciousConcoction);
        for (const attacker of q.cards(giantTortoise)) {
          q.declareAttack(attacker, hero);
          game.resolveCombatWithoutRetaliation();
        }
        expect(game.state.objects[hero.objectId]!.damage).toBe(damage);
        for (let step = 0; step < 64; step++) {
          const wait = game.waitState();
          if (wait.kind === "materialization-choice" && wait.playerId === p.id) break;
          if (wait.kind === "opportunity") game.player(wait.playerId).pass();
          else throw new Error(`Unexpected wait: ${wait.kind}`);
        }
        const top = p.zone("main-deck")[0]!;
        p.materialize(next);
        expect(p.zone("memory")).toHaveLength(0);
        expect(game.state.objects[top.objectId]!.zone).toBe("main-deck");
        p.pass();
        q.pass();
        expect(game.state.objects[hero.objectId]!.activeDefinitionId).toBe(next.canonicalId);
        expect(game.state.objects[source.objectId]!.zone).toBe("field");
        expect(game.state.objects[top.objectId]!.zone).toBe("main-deck");
        passEffectsStack(game);
        expect(game.state.decision).toMatchObject({
          kind: "resolve-optional-effect",
          playerId: p.id,
        });
        answerDecision(game, "resolve-optional-effect", accept);
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.zone).toBe(accept ? "banishment" : "field");
        expect(game.state.objects[top.objectId]!.zone).toBe(accept ? "memory" : "main-deck");
        expect(game.state.objects[hero.objectId]!.damage).toBe(
          accept ? Math.max(0, damage - 2) : damage,
        );
        expect(q.zone("memory")).toHaveLength(0);
        expect(p.zone("hand")).toHaveLength(0);
      });

  it("does not trigger for an opponent's champion leveling up", () => {
    const champion = lineageTestChampion("Test", 0),
      next = lineageTestChampion("Test", 1);
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      phase: "materialize",
      playerOne: {
        champion,
        zones: { field: [suspiciousConcoction], "main-deck": [woodlandSquirrels] },
      },
      playerTwo: {
        champion,
        zones: {
          memory: [woodlandSquirrels],
          "material-deck": [next],
          "main-deck": [woodlandSquirrels],
        },
      },
    });
    const p = game.player("player-one"),
      q = game.player("player-two");
    q.materialize(next);
    passEffectsStack(game);
    expect(game.state.decision).toBeNull();
    expect(p.card(suspiciousConcoction, { zone: "field" })).toBeDefined();
    expect(p.zone("main-deck")).toHaveLength(1);
    expect(p.zone("memory")).toHaveLength(0);
  });
});

/** @covers 5tphi6xl26-a1 */
it("Suspicious Concoction tracks its source across one zone change before its trigger resolves", () => {
  const champion = enableAllTestElements(lineageTestChampion("Test", 0));
  const next = enableAllTestElements(lineageTestChampion("Test", 1));
  const game = GrandArchiveTestEngine.startFixture({
    phase: "materialize",
    playerOne: {
      champion,
      zones: {
        field: [suspiciousConcoction],
        memory: [woodlandSquirrels],
        hand: [spiritsBlessing, woodlandSquirrels],
        "material-deck": [next],
        "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
      },
    },
    playerTwo: { champion },
  });
  const p = game.player("player-one"),
    q = game.player("player-two"),
    source = p.card(suspiciousConcoction),
    deck = p.zone("main-deck");
  p.materialize(next);
  p.pass();
  q.pass();
  p.activate(spiritsBlessing, {
    reservePayment: [
      { kind: "card", cardId: p.card(woodlandSquirrels, { zone: "hand" }).objectId },
    ],
    costSelections: [[source.objectId]],
  });
  expect(game.state.objects[source.objectId]!.zone).toBe("material-deck");
  passEffectsStack(game);
  if (game.state.decision?.kind === "resolve-optional-effect") {
    answerDecision(game, "resolve-optional-effect", true);
    passEffectsStack(game);
  }
  expect(game.state.decision).toBeNull();
  expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
  expect(p.zone("main-deck")).toEqual(deck.slice(2));
  expect(p.zone("hand")).toEqual(deck.slice(0, 1));
  expect(p.zone("memory")).toHaveLength(2);
  expect(game.state.objects[deck[1]!.objectId]!.zone).toBe("memory");
});
