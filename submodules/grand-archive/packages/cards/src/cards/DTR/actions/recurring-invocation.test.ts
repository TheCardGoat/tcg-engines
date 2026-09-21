import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { recurringInvocation } from "./recurring-invocation.ts";
import { evasivePositioning } from "./evasive-positioning.ts";
import { tombSweep } from "../../P26/actions/tomb-sweep.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  requireSingleFace,
  grandArchiveDefaultFaceId,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers iyhlctxcrq-a1 */
describe("Recurring Invocation — next Spell this turn", () => {
  for (const intervening of [
    "none",
    "skill-and-ally",
    "opponent",
    "expiry",
    "before-resolution",
  ] as const)
    it(`Empower 2 with ${intervening}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(recurringInvocation, true, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [
              recurringInvocation,
              evasivePositioning,
              fireball,
              fireball,
              fireball,
              ...Array.from({ length: 9 }, () => woodlandSquirrels),
            ],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: {
            hand: [fireball, woodlandSquirrels, woodlandSquirrels],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const payment = (n: number) =>
        p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, n)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const cast = () =>
        p.activate(p.cards(fireball, { zone: "hand" })[0]!, {
          reservePayment: payment(2),
          targets: { "target-1": [q.card(champion).objectId] },
        });
      const before = game.state;
      expect(() => p.activate(recurringInvocation, { reservePayment: payment(1) })).toThrow();
      expect(game.state).toEqual(before);
      p.activate(recurringInvocation, { reservePayment: payment(2) });
      expect(p.zone("memory")).toHaveLength(2);
      let priorDamage = 0;
      if (intervening === "before-resolution") {
        cast();
        p.pass();
        q.pass();
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(1);
        priorDamage = 1;
      }
      passEffectsStack(game);
      if (intervening === "skill-and-ally") {
        p.activate(evasivePositioning, {
          reservePayment: payment(1),
          targets: { "target-1": [p.card(champion).objectId] },
        });
        passEffectsStack(game);
        p.activate(p.cards(woodlandSquirrels, { zone: "hand" })[0]!);
        passEffectsStack(game);
      } else if (intervening === "opponent") {
        p.pass();
        q.activate(fireball, {
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card", cardId: c.objectId })),
          targets: { "target-1": [p.card(champion).objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(1);
        if (game.waitState().kind === "opportunity") {
          const wait = game.waitState();
          if (wait.kind === "opportunity" && wait.playerId === q.id) q.pass();
        }
      } else if (intervening === "expiry") {
        advanceToMain(game, q.id);
        advanceToMain(game, p.id);
      }
      cast();
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(priorDamage);
      passEffectsStack(game);
      const firstDamage = intervening === "expiry" ? 1 : 3;
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(priorDamage + firstDamage);
      cast();
      passEffectsStack(game);
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(
        priorDamage + firstDamage + 1,
      );
    });
});

/** @covers iyhlctxcrq-a2 */
describe("Recurring Invocation — class-gated graveyard level-up trigger", () => {
  for (const matching of [false, true])
    for (const zone of ["graveyard", "hand", "banishment"] as const)
      for (const accept of [false, true])
        it(`class=${matching}, source=${zone}, accept=${accept}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(recurringInvocation, matching, "activation-discount"),
          );
          const face = requireSingleFace(champion);
          const nextId = `${champion.canonicalId}-successor`;
          const next = {
            ...champion,
            canonicalId: nextId,
            slug: nextId,
            layout: {
              kind: "single-faced" as const,
              face: {
                ...face,
                id: grandArchiveDefaultFaceId(nextId),
                catalogId: nextId,
                stats: { level: 1, life: 15 },
                cost: { kind: "memory" as const, amount: 1 },
              },
            },
          };
          const game = GrandArchiveTestEngine.startFixture({
            phase: "materialize",
            playerOne: {
              champion,
              zones: {
                hand: [
                  fireball,
                  fireball,
                  ...Array.from({ length: 9 }, () => woodlandSquirrels),
                  ...(zone === "hand" ? [recurringInvocation] : []),
                ],
                graveyard: zone === "graveyard" ? [recurringInvocation] : [],
                banishment: zone === "banishment" ? [recurringInvocation] : [],
                memory: [woodlandSquirrels],
                "material-deck": [next],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: { champion, zones: { graveyard: [recurringInvocation] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const source = p.card(recurringInvocation),
            opposing = q.card(recurringInvocation);
          p.materialize(next);
          expect(game.state.objects[source.objectId]!.zone).toBe(zone);
          passEffectsStack(game);
          const triggers = matching && zone === "graveyard";
          if (triggers) {
            expect(game.state.decision?.kind).toBe("resolve-optional-effect");
            answerDecision(game, "resolve-optional-effect", accept !== false);
            passEffectsStack(game);
            if (accept) {
              expect(game.state.decision?.kind).toBe("resolve-effect-payment");
              const unpaid = game.state;
              expect(() =>
                answerDecision(game, "resolve-effect-payment", { reservePayment: [] }),
              ).toThrow();
              expect(game.state).toEqual(unpaid);
              expect(() => answerDecision(game, "resolve-effect-payment", false)).toThrow();
              expect(game.state).toEqual(unpaid);
              answerDecision(game, "resolve-effect-payment", {
                reservePayment: [
                  {
                    kind: "card",
                    cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId,
                  },
                ],
              });
              passEffectsStack(game);
            }
          } else expect(game.state.decision).toBeNull();
          expect(game.state.objects[source.objectId]!.zone).toBe(
            triggers && accept === true ? "banishment" : zone,
          );
          expect(game.state.objects[opposing.objectId]!.zone).toBe("graveyard");
          advanceToMain(game, p.id);
          const cost = matching ? 2 : 4;
          for (let i = 0; i < 2; i++) {
            p.activate(p.cards(fireball, { zone: "hand" })[0]!, {
              reservePayment: p
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, cost)
                .map((c) => ({ kind: "card", cardId: c.objectId })),
              targets: { "target-1": [q.card(champion).objectId] },
            });
            passEffectsStack(game);
            expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(
              2 * (i + 1) + Number(triggers && accept === true) * 2,
            );
          }
        });
});

/** @covers iyhlctxcrq-a2 */
describe("Recurring Invocation — the complete optional cost must remain payable", () => {
  for (const removed of [false, true])
    it(
      removed
        ? "cannot banish the old source after an opponent removes it"
        : "cannot banish without reserve available",
      () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(recurringInvocation, true, "activation-discount"),
        );
        const face = requireSingleFace(champion);
        const nextId = `${champion.canonicalId}-successor`;
        const next = {
          ...champion,
          canonicalId: nextId,
          slug: nextId,
          layout: {
            kind: "single-faced" as const,
            face: {
              ...face,
              id: grandArchiveDefaultFaceId(nextId),
              catalogId: nextId,
              stats: { level: 1, life: 15 },
              cost: { kind: "memory" as const, amount: 1 },
            },
          },
        };
        const game = GrandArchiveTestEngine.startFixture({
          phase: "materialize",
          playerOne: {
            champion,
            zones: {
              hand: removed ? [woodlandSquirrels] : [],
              graveyard: [recurringInvocation],
              memory: [woodlandSquirrels],
              "material-deck": [next],
            },
          },
          playerTwo: {
            champion,
            zones: { hand: [tombSweep, woodlandSquirrels, woodlandSquirrels] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const source = p.card(recurringInvocation);
        p.materialize(next);
        if (removed) {
          const wait = game.waitState();
          if (wait.kind === "opportunity" && wait.playerId === p.id) p.pass();
          q.activate(tombSweep, {
            reservePayment: q
              .cards(woodlandSquirrels)
              .map((c) => ({ kind: "card", cardId: c.objectId })),
            targets: { "target-card": [source.objectId] },
          });
        }
        passEffectsStack(game);
        if (game.state.decision?.kind === "resolve-optional-effect") {
          const before = game.state;
          expect(() => answerDecision(game, "resolve-optional-effect", true)).toThrow();
          expect(game.state).toEqual(before);
          answerDecision(game, "resolve-optional-effect", false);
          passEffectsStack(game);
        }
        expect(game.state.decision).toBeNull();
        expect(game.state.objects[source.objectId]!.zone).toBe(
          removed ? "banishment" : "graveyard",
        );
        expect(game.state.players[p.id]!.states.empower ?? 0).toBe(0);
        expect(p.zone("hand")).toHaveLength(Number(removed));
        expect(p.zone("memory")).toHaveLength(0);
      },
    );
});

/** @covers iyhlctxcrq-a1 */
it("uses Empower's level while announcing the next Spell's cost, then consumes it", () => {
  const champion = createClassBonusTestChampion(recurringInvocation, true, "activation-discount");
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: {
        hand: [
          recurringInvocation,
          tombSweep,
          tombSweep,
          ...Array.from({ length: 5 }, () => woodlandSquirrels),
        ],
      },
    },
    playerTwo: { champion, zones: { graveyard: [woodlandSquirrels, woodlandSquirrels] } },
  });
  const p = game.player("player-one"),
    q = game.player("player-two");
  const payment = (n: number) =>
    p
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(0, n)
      .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
  p.activate(recurringInvocation, { reservePayment: payment(2) });
  passEffectsStack(game);
  for (const cost of [1, 2]) {
    const spell = p.cards(tombSweep, { zone: "hand" })[0]!;
    const target = q.cards(woodlandSquirrels, { zone: "graveyard" })[0]!;
    const before = game.state;
    expect(() =>
      p.activate(spell, {
        reservePayment: payment(cost - 1),
        targets: { "target-card": [target.objectId] },
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
    p.activate(spell, {
      reservePayment: payment(cost),
      targets: { "target-card": [target.objectId] },
    });
    expect(game.state.objects[target.objectId]!.zone).toBe("graveyard");
    passEffectsStack(game);
    expect(game.state.objects[target.objectId]!.zone).toBe("banishment");
  }
  expect(p.zone("memory")).toHaveLength(5);
});
