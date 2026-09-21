import type { GrandArchiveCard, GrandArchiveAbilityDefinition } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { spirelleSchwartzQueen } from "./spirelle-schwartz-queen.ts";
import { aethercloakSentinel } from "./aethercloak-sentinel.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { aesanProtector } from "../../DOA/allies/aesan-protector.ts";
import { nocturnesOblivion } from "../../P25/actions/nocturnes-oblivion.ts";
import { spellwardScepter } from "../items/spellward-scepter.ts";
import { enfeebledDagger } from "../items/enfeebled-dagger.ts";
import { secondWind } from "../../DOA/actions/second-wind.ts";
import { sparkAlight } from "../../DOA/actions/spark-alight.ts";
import { backdash } from "../actions/backdash.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers p2n1953som-a1 */
describe("Spirelle - Spell entry damage and optional private banishment", () => {
  for (const own of [false, true])
    for (const ally of [false, true])
      for (const choice of ["decline", "hand", "memory"] as const)
        it(`${own ? "own" : "opposing"} ${ally ? "ally" : "champion"}, banish ${choice}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(spirelleSchwartzQueen, false, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  spirelleSchwartzQueen,
                  backdash,
                  ...Array.from({ length: 4 }, () => woodlandSquirrels),
                ],
                memory: [backdash],
                field: [giantTortoise, trainingSword, aethercloakSentinel],
                graveyard: [backdash],
                banishment: [backdash],
              },
            },
            playerTwo: {
              champion,
              zones: {
                hand: [backdash],
                memory: [backdash],
                field: [giantTortoise, aethercloakSentinel],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            owner = own ? p : q;
          const source = p.card(spirelleSchwartzQueen),
            target = owner.card(ally ? giantTortoise : champion);
          const payment = p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 2)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          const before = game.state;
          expect(() => p.activate(source, { reservePayment: payment.slice(1) })).toThrow();
          expect(game.state).toEqual(before);
          p.activate(source, { reservePayment: payment });
          expect(p.zone("memory")).toHaveLength(3);
          passEffectsStack(game);
          expect(game.state.objects[target.objectId]!.damage).toBe(0);
          for (const invalid of [
            [],
            [target.objectId, target.objectId],
            [p.card(trainingSword).objectId],
            [p.card(backdash, { zone: "graveyard" }).objectId],
            [p.card(aethercloakSentinel).objectId],
            [q.card(aethercloakSentinel).objectId],
          ]) {
            const before = game.state;
            expect(() =>
              answerDecision(game, "announce-triggered-ability", {
                targets: { "target-1": invalid },
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          answerDecision(game, "announce-triggered-ability", {
            targets: { "target-1": [target.objectId] },
          });
          passEffectsStack(game);
          expect(game.state.objects[target.objectId]!.damage).toBe(3);
          answerDecision(game, "resolve-optional-effect", choice !== "decline");
          if (choice !== "decline") {
            const selected = p.card(backdash, { zone: choice });
            for (const invalid of [
              [],
              [selected.objectId, selected.objectId],
              [p.card(backdash, { zone: "graveyard" }).objectId],
              [p.card(backdash, { zone: "banishment" }).objectId],
              [q.card(backdash, { zone: "hand" }).objectId],
              [q.card(backdash, { zone: "memory" }).objectId],
              [source.objectId],
            ]) {
              const before = game.state;
              expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
              expect(game.state).toEqual(before);
            }
            answerDecision(game, "resolve-effect-choice", [selected.objectId]);
            passEffectsStack(game);
            expect(game.state.objects[selected.objectId]).toMatchObject({
              zone: "banishment",
              facing: "face-down",
              banishedBy: {
                sourceId: source.objectId,
                sourceIncarnation: game.state.objects[source.objectId]!.incarnation,
              },
            });
            const opposingView = game.view(q.id).players.find((player) => player.id === p.id)!
              .zones.banishment;
            if (opposingView.visibility !== "visible")
              throw new Error("Expected public banishment zone");
            expect(opposingView.hiddenCount).toBe(1);
            expect(opposingView.objects.some((object) => object.id === selected.objectId)).toBe(
              false,
            );
          }
          expect(p.zone("banishment")).toHaveLength(choice === "decline" ? 1 : 2);
          expect(q.card(backdash, { zone: "hand" })).toBeDefined();
          expect(q.card(backdash, { zone: "memory" })).toBeDefined();
        });
});

/** @covers p2n1953som-a2 */
describe("Spirelle - reveal linked banishment to negate matching cards", () => {
  for (const cost of [0, 1, 2])
    it(`negates every cost-${cost} card across both players, preserving nonmatching cards`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(spirelleSchwartzQueen, false, "activation-discount"),
      );
      const selectedDefinition = [woodlandSquirrels, backdash, sparkAlight][cost]!;
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [
              spirelleSchwartzQueen,
              selectedDefinition,
              backdash,
              ...Array.from({ length: 10 }, () => woodlandSquirrels),
            ],
            banishment: [backdash],
            graveyard: [backdash],
            "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [enfeebledDagger],
            hand: [
              selectedDefinition,
              secondWind,
              ...Array.from({ length: 8 }, () => woodlandSquirrels),
            ],
            banishment: [backdash],
            "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const source = p.card(spirelleSchwartzQueen),
        stored = p.cards(selectedDefinition, { zone: "hand" })[0]!,
        opposing = q.cards(selectedDefinition, { zone: "hand" })[0]!;
      const unrelated = p.card(backdash, { zone: "banishment" });
      const pay = (owner: typeof p, n: number) =>
        owner
          .cards(woodlandSquirrels, { zone: "hand" })
          .filter((c) => c.objectId !== stored.objectId && c.objectId !== opposing.objectId)
          .slice(0, n)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      p.activate(source, { reservePayment: pay(p, 2) });
      passEffectsStack(game);
      answerDecision(game, "announce-triggered-ability", {
        targets: { "target-1": [q.card(champion).objectId] },
      });
      passEffectsStack(game);
      answerDecision(game, "resolve-optional-effect", true);
      answerDecision(game, "resolve-effect-choice", [stored.objectId]);
      passEffectsStack(game);
      advanceToMain(game, p.id, game.state.turn.number);
      advanceToMain(game, q.id);
      q.activate(opposing, {
        reservePayment: pay(q, cost),
        ...(cost ? { targets: { "target-1": [q.card(champion).objectId] } } : {}),
      });
      q.pass();
      const ownPending = p.card(backdash, { zone: "hand" });
      p.activate(ownPending, {
        reservePayment: pay(p, 1),
        targets: { "target-1": [p.card(champion).objectId] },
      });
      p.pass();
      q.activate(secondWind, {
        reservePayment: pay(q, 3),
        targets: { "target-1": [source.objectId] },
      });
      q.activateAbility(enfeebledDagger, "idpdon8f0h-a1", {
        targets: { "target-unit": [p.card(champion).objectId] },
      });
      q.pass();
      for (const selection of [
        [],
        [stored.objectId, stored.objectId],
        [unrelated.objectId],
        [q.card(backdash, { zone: "banishment" }).objectId],
        [p.card(backdash, { zone: "graveyard" }).objectId],
        [source.objectId],
      ]) {
        const before = game.state;
        expect(() =>
          p.activateAbility(source, "p2n1953som-a2", {
            reservePayment: pay(p, 2),
            costSelections: [selection],
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
      }
      const before = game.state;
      expect(() =>
        p.activateAbility(source, "p2n1953som-a2", {
          reservePayment: pay(p, 1),
          costSelections: [[stored.objectId]],
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      const memory = p.zone("memory").length;
      p.activateAbility(source, "p2n1953som-a2", {
        reservePayment: pay(p, 2),
        costSelections: [[stored.objectId]],
      });
      expect(p.zone("memory")).toHaveLength(memory + 2);
      expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
      const rested = game.state;
      expect(() =>
        p.activateAbility(source, "p2n1953som-a2", {
          reservePayment: pay(p, 2),
          costSelections: [[stored.objectId]],
        }),
      ).toThrow();
      expect(game.state).toEqual(rested);
      expect(game.state.objects[stored.objectId]!.zone).toBe("banishment");
      expect(
        game.state.eventHistory.filter(
          (event) => event.type === "card-revealed" && event.objectId === stored.objectId,
        ),
      ).toHaveLength(1);
      passEffectsStack(game);
      expect(game.state.objects[stored.objectId]!.zone).toBe("memory");
      expect(game.state.objects[opposing.objectId]!.zone).toBe("memory");
      expect(game.state.objects[ownPending.objectId]!.zone).toBe(
        cost === 1 ? "memory" : "effects-stack",
      );
      expect(game.state.objects[unrelated.objectId]!.zone).toBe("banishment");
      expect(game.state.objects[q.card(secondWind).objectId]!.zone).toBe("effects-stack");
      answerDecision(game, "announce-triggered-ability", {
        targets: { "target-1": [q.card(champion).objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(6);
      answerDecision(game, "resolve-optional-effect", false);
      passEffectsStack(game);
      expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(false);
      expect(game.state.objects[p.card(champion).objectId]!.states.has("distant")).toBe(cost !== 1);
      expect(game.state.objects[q.card(champion).objectId]!.states.has("distant")).toBe(false);
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(6);
      expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(1);
    });
});

/** @covers p2n1953som-a2 */
describe("Spirelle - negation protection and removal after resolution", () => {
  for (const protectedSpell of [false, true])
    it(`returns only successfully negated cards, protected=${protectedSpell}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(spirelleSchwartzQueen, false, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [
              spirelleSchwartzQueen,
              secondWind,
              ...Array.from({ length: 6 }, () => woodlandSquirrels),
            ],
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [spellwardScepter],
            hand: [nocturnesOblivion, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const source = p.card(spirelleSchwartzQueen),
        stored = p.card(secondWind),
        spell = q.card(nocturnesOblivion);
      const pay = (owner: typeof p, n: number) =>
        owner
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, n)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      p.activate(source, { reservePayment: pay(p, 2) });
      passEffectsStack(game);
      answerDecision(game, "announce-triggered-ability", {
        targets: { "target-1": [q.card(champion).objectId] },
      });
      passEffectsStack(game);
      answerDecision(game, "resolve-optional-effect", true);
      answerDecision(game, "resolve-effect-choice", [stored.objectId]);
      passEffectsStack(game);
      p.pass();
      if (protectedSpell) {
        q.activateAbility(spellwardScepter, "f6lxizyuml-a2");
        passEffectsStack(game);
        const wait = game.waitState();
        if (wait.kind !== "opportunity") throw new Error("Expected opportunity");
        if (wait.playerId !== q.id) game.player(wait.playerId).pass();
      }
      q.activate(spell, { reservePayment: pay(q, 3), targets: { "target-1": [source.objectId] } });
      q.pass();
      p.activateAbility(source, "p2n1953som-a2", {
        reservePayment: pay(p, 2),
        costSelections: [[stored.objectId]],
      });
      passEffectsStack(game);
      expect(game.state.objects[stored.objectId]!.zone).toBe("memory");
      expect(game.state.objects[spell.objectId]!.zone).toBe(
        protectedSpell ? "effects-stack" : "memory",
      );
      answerDecision(game, "announce-triggered-ability", {
        targets: { "target-1": [q.card(champion).objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(6);
      answerDecision(game, "resolve-optional-effect", false);
      passEffectsStack(game);
      expect(game.state.objects[source.objectId]!.zone).toBe(
        protectedSpell ? "graveyard" : "field",
      );
      expect(game.state.objects[spell.objectId]!.zone).toBe(
        protectedSpell ? "banishment" : "memory",
      );
      expect(q.zone("memory")).toHaveLength(protectedSpell ? 3 : 4);
    });
});

/** @covers p2n1953som-a1 @covers p2n1953som-a2 */
it("a new Spirelle incarnation cannot reveal or retrieve the previous incarnation's cards", () => {
  const champion = enableAllTestElements(
    createClassBonusTestChampion(spirelleSchwartzQueen, false, "activation-discount"),
  );
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: {
        hand: [
          spirelleSchwartzQueen,
          aesanProtector,
          backdash,
          sparkAlight,
          ...Array.from({ length: 14 }, () => woodlandSquirrels),
        ],
      },
    },
    playerTwo: { champion },
  });
  const p = game.player("player-one"),
    q = game.player("player-two");
  const source = p.card(spirelleSchwartzQueen),
    oldStored = p.card(backdash),
    newStored = p.card(sparkAlight);
  const pay = (n: number) =>
    p
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(0, n)
      .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
  const entry = (cardId: typeof source.objectId) => {
    passEffectsStack(game);
    answerDecision(game, "announce-triggered-ability", {
      targets: { "target-1": [q.card(champion).objectId] },
    });
    passEffectsStack(game);
    answerDecision(game, "resolve-optional-effect", true);
    answerDecision(game, "resolve-effect-choice", [cardId]);
    passEffectsStack(game);
  };
  p.activate(source, { reservePayment: pay(2) });
  entry(oldStored.objectId);
  const originalIncarnation = game.state.objects[source.objectId]!.incarnation;
  p.activate(aesanProtector, { reservePayment: pay(4) });
  passEffectsStack(game);
  answerDecision(game, "announce-triggered-ability", {
    targets: { "target-1": [source.objectId] },
  });
  passEffectsStack(game);
  expect(game.state.objects[source.objectId]!.zone).toBe("hand");
  p.activate(source, { reservePayment: pay(2) });
  entry(newStored.objectId);
  expect(game.state.objects[source.objectId]!.incarnation).toBeGreaterThan(originalIncarnation);
  const before = game.state;
  expect(() =>
    p.activateAbility(source, "p2n1953som-a2", {
      reservePayment: pay(2),
      costSelections: [[oldStored.objectId]],
    }),
  ).toThrow();
  expect(game.state).toEqual(before);
  p.activateAbility(source, "p2n1953som-a2", {
    reservePayment: pay(2),
    costSelections: [[newStored.objectId]],
  });
  passEffectsStack(game);
  expect(game.state.objects[newStored.objectId]!.zone).toBe("memory");
  expect(game.state.objects[oldStored.objectId]!.zone).toBe("banishment");
  answerDecision(game, "announce-triggered-ability", {
    targets: { "target-1": [q.card(champion).objectId] },
  });
  passEffectsStack(game);
  answerDecision(game, "resolve-optional-effect", false);
  passEffectsStack(game);
  expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(9);
});

/** @covers p2n1953som-a1 @covers p2n1953som-a2 */
describe("Spirelle - pending abilities after their source leaves", () => {
  for (const duringEntry of [false, true])
    it(`source destroyed during ${duringEntry ? "entry" : "activated ability"} resolution`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(spirelleSchwartzQueen, false, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [
              spirelleSchwartzQueen,
              backdash,
              ...Array.from({ length: 6 }, () => woodlandSquirrels),
            ],
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
      const source = p.card(spirelleSchwartzQueen),
        stored = p.card(backdash);
      const pay = (owner: typeof p, n: number) =>
        owner
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, n)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      p.activate(source, { reservePayment: pay(p, 2) });
      passEffectsStack(game);
      const sourceIncarnation = game.state.objects[source.objectId]!.incarnation;
      answerDecision(game, "announce-triggered-ability", {
        targets: { "target-1": [q.card(champion).objectId] },
      });
      if (!duringEntry) {
        passEffectsStack(game);
        answerDecision(game, "resolve-optional-effect", true);
        answerDecision(game, "resolve-effect-choice", [stored.objectId]);
        passEffectsStack(game);
        p.activateAbility(source, "p2n1953som-a2", {
          reservePayment: pay(p, 2),
          costSelections: [[stored.objectId]],
        });
      }
      p.pass();
      q.activate(nocturnesOblivion, {
        reservePayment: pay(q, 3),
        targets: { "target-1": [source.objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(3);
      if (duringEntry) {
        answerDecision(game, "resolve-optional-effect", true);
        answerDecision(game, "resolve-effect-choice", [stored.objectId]);
        passEffectsStack(game);
        expect(game.state.objects[stored.objectId]).toMatchObject({
          zone: "banishment",
          banishedBy: { sourceId: source.objectId, sourceIncarnation },
        });
      } else {
        expect(game.state.objects[stored.objectId]!.zone).toBe("memory");
        expect(game.state.decision).toBeNull();
      }
    });
});

/** @covers p2n1953som-a1 @covers p2n1953som-a2 */
it("a new controller may reveal either linked card and returns all linked cards to their respective owners", () => {
  const base = enableAllTestElements(
    createClassBonusTestChampion(spirelleSchwartzQueen, false, "activation-discount"),
  );
  const face = requireSingleFace(base);
  const champion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
    ...base,
    layout: {
      kind: "single-faced",
      face: {
        ...face,
        abilities: [
          ...face.abilities,
          {
            id: "spirelleControlFixture-a1",
            kind: "activated",
            text: "Give an ally to an opponent.",
            activation: "ability",
            cost: { kind: "pay-reserve", amount: 0 },
            targets: [
              {
                id: "ally",
                kind: "target",
                declared: "announcement",
                chooser: "controller",
                count: { kind: "exactly", amount: 1 },
                candidates: {
                  kind: "object",
                  zones: ["field"],
                  player: "controller",
                  filter: { kind: "type", oneOf: ["ALLY"] },
                },
              },
            ],
            effect: {
              kind: "change-control",
              subject: { kind: "bound", binding: "ally" },
              controller: "opponent",
            },
          },
          {
            id: "spirelleControlFixture-a2",
            kind: "activated",
            text: "Trigger an ally's On Enter abilities.",
            activation: "ability",
            cost: { kind: "pay-reserve", amount: 0 },
            targets: [
              {
                id: "ally",
                kind: "target",
                declared: "announcement",
                chooser: "controller",
                count: { kind: "exactly", amount: 1 },
                candidates: {
                  kind: "object",
                  zones: ["field"],
                  player: "controller",
                  filter: { kind: "type", oneOf: ["ALLY"] },
                },
              },
            ],
            effect: {
              kind: "trigger-abilities",
              subject: { kind: "bound", binding: "ally" },
              triggerName: "on-enter",
              count: "each",
            },
          },
        ],
      },
    },
  };
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: { hand: [spirelleSchwartzQueen, backdash, woodlandSquirrels, woodlandSquirrels] },
    },
    playerTwo: { champion, zones: { hand: [sparkAlight, woodlandSquirrels, woodlandSquirrels] } },
  });
  const p = game.player("player-one"),
    q = game.player("player-two");
  const source = p.card(spirelleSchwartzQueen),
    first = p.card(backdash),
    second = q.card(sparkAlight);
  const entry = (target: typeof source.objectId, stored: typeof source.objectId) => {
    passEffectsStack(game);
    answerDecision(game, "announce-triggered-ability", { targets: { "target-1": [target] } });
    passEffectsStack(game);
    answerDecision(game, "resolve-optional-effect", true);
    answerDecision(game, "resolve-effect-choice", [stored]);
    passEffectsStack(game);
  };
  p.activate(source, {
    reservePayment: p.cards(woodlandSquirrels).map((c) => ({ kind: "card", cardId: c.objectId })),
  });
  entry(q.card(champion).objectId, first.objectId);
  const incarnation = game.state.objects[source.objectId]!.incarnation;
  p.activateAbility(champion, "spirelleControlFixture-a1", {
    targets: { ally: [source.objectId] },
  });
  passEffectsStack(game);
  expect(game.state.objects[source.objectId]).toMatchObject({ controllerId: q.id, incarnation });
  p.pass();
  q.activateAbility(champion, "spirelleControlFixture-a2", {
    targets: { ally: [source.objectId] },
  });
  entry(p.card(champion).objectId, second.objectId);
  const wait = game.waitState();
  if (wait.kind !== "opportunity") throw new Error("Expected opportunity");
  if (wait.playerId !== q.id) game.player(wait.playerId).pass();
  q.execute({
    move: "activate-ability",
    sourceId: source.objectId,
    abilityId: "p2n1953som-a2",
    reservePayment: q.cards(woodlandSquirrels).map((c) => ({ kind: "card", cardId: c.objectId })),
    costSelections: [[first.objectId]],
  });
  passEffectsStack(game);
  expect(game.state.objects[first.objectId]).toMatchObject({
    zone: "memory",
    ownerId: p.id,
    controllerId: p.id,
  });
  expect(game.state.objects[second.objectId]).toMatchObject({
    zone: "memory",
    ownerId: q.id,
    controllerId: q.id,
  });
  expect(p.zone("memory")).toHaveLength(3);
  expect(q.zone("memory")).toHaveLength(3);
  answerDecision(game, "announce-triggered-ability", {
    targets: { "target-1": [p.card(champion).objectId] },
  });
  passEffectsStack(game);
  answerDecision(game, "resolve-optional-effect", false);
  passEffectsStack(game);
  expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(6);
  expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(3);
});

/** @covers p2n1953som-a1 @covers p2n1953som-a2 */
it("can banish a memory-cost card but cannot reveal it as a reserve-cost payment", () => {
  const champion = enableAllTestElements(
    createClassBonusTestChampion(spirelleSchwartzQueen, false, "activation-discount"),
  );
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: {
        hand: [spirelleSchwartzQueen, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
        memory: [trainingSword],
      },
    },
    playerTwo: { champion },
  });
  const p = game.player("player-one"),
    q = game.player("player-two");
  const source = p.card(spirelleSchwartzQueen),
    stored = p.card(trainingSword);
  const pay = () =>
    p
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(0, 2)
      .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
  p.activate(source, { reservePayment: pay() });
  passEffectsStack(game);
  answerDecision(game, "announce-triggered-ability", {
    targets: { "target-1": [q.card(champion).objectId] },
  });
  passEffectsStack(game);
  answerDecision(game, "resolve-optional-effect", true);
  answerDecision(game, "resolve-effect-choice", [stored.objectId]);
  passEffectsStack(game);
  expect(game.state.objects[stored.objectId]!.zone).toBe("banishment");
  const before = game.state;
  expect(() =>
    p.activateAbility(source, "p2n1953som-a2", {
      reservePayment: pay(),
      costSelections: [[stored.objectId]],
    }),
  ).toThrow();
  expect(game.state).toEqual(before);
});
