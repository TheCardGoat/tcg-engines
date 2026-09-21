import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { cometaryVantage } from "./cometary-vantage.ts";
import { backdash } from "./backdash.ts";
import { viridescentAetherstreak } from "./viridescent-aetherstreak.ts";
import { nocturnesOblivion } from "../../P25/actions/nocturnes-oblivion.ts";
import { resonantAether } from "./resonant-aether.ts";
import { trivariateDream } from "../weapons/trivariate-dream.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { comboStrike } from "../../DOA/attacks/combo-strike.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceCombatToTrigger,
  advanceToMain,
  declareResolvedAttack,
  answerDecision,
  passEffectsStack,
} from "../../../testing/decisions.ts";

function fixture(
  boundary?: "prevented" | "hosts-removed" | "before-attack" | "no-intent" | "non-aethercharge",
) {
  const champion = enableAllTestElements(
    createClassBonusTestChampion(cometaryVantage, false, "activation-discount"),
  );
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: {
        hand: [
          ...(boundary === "non-aethercharge" ? [comboStrike] : []),
          cometaryVantage,
          backdash,
          ...Array.from({ length: 4 }, () => resonantAether),
          ...Array.from({ length: 8 }, () => woodlandSquirrels),
        ],
        field: [trivariateDream, trivariateDream, trainingSword, woodlandSquirrels],
        "main-deck": Array.from({ length: 12 }, () => woodlandSquirrels),
      },
    },
    playerTwo: {
      champion,
      zones: {
        hand: [
          cometaryVantage,
          backdash,
          ...(boundary === "prevented" ? [viridescentAetherstreak] : []),
          ...(boundary === "hosts-removed" ? [nocturnesOblivion, nocturnesOblivion] : []),
          ...Array.from({ length: 8 }, () => woodlandSquirrels),
        ],
        field: [trivariateDream, trivariateDream, trainingSword, woodlandSquirrels],
        "main-deck": Array.from({ length: 12 }, () => woodlandSquirrels),
      },
    },
  });
  const p = game.player("player-one"),
    q = game.player("player-two");
  const pay = (actor: typeof p, n: number) =>
    actor
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(0, n)
      .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
  const opportunity = (actor: typeof p) => {
    const wait = game.waitState();
    if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
    if (wait.playerId !== actor.id) game.player(wait.playerId).pass();
  };
  return { game, p, q, champion, pay, opportunity };
}

/** @covers y4c89re0bd-a1 */
describe("Cometary Vantage — exact mode count and ordered Glimpse/draw", () => {
  for (const distant of ["none", "own-champion", "own-ally", "opposing-champion"] as const) {
    const combinations =
      distant === "own-champion"
        ? [
            ["glimpse", "draw"],
            ["glimpse", "grant-on-hit"],
            ["draw", "grant-on-hit"],
          ]
        : [["glimpse"], ["draw"], ["grant-on-hit"]];
    for (const modes of combinations)
      it(`${distant}: ${modes.join("+")}`, () => {
        const { game, p, q, champion, pay } = fixture();
        if (distant !== "none") {
          const target =
            distant === "own-champion"
              ? p.card(champion)
              : distant === "own-ally"
                ? p.card(woodlandSquirrels, { zone: "field" })
                : q.card(champion);
          p.activate(backdash, {
            reservePayment: pay(p, 1),
            targets: { "target-1": [target.objectId] },
          });
          passEffectsStack(game);
        }
        const before = game.state;
        expect(() => p.activate(cometaryVantage, { modeIds: modes, reservePayment: [] })).toThrow();
        for (const invalid of [
          [],
          ["glimpse", "glimpse"],
          ["glimpse", "draw", "grant-on-hit"],
          distant === "own-champion" ? ["glimpse"] : ["glimpse", "draw"],
        ]) {
          expect(() =>
            p.activate(cometaryVantage, { modeIds: invalid, reservePayment: pay(p, 1) }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        const deck = p.zone("main-deck").map((c) => c.objectId),
          hand = p.zone("hand").length;
        p.activate(cometaryVantage, { modeIds: modes, reservePayment: pay(p, 1) });
        passEffectsStack(game);
        let expected = deck;
        if (modes.includes("glimpse")) {
          expect(game.state.decision).toMatchObject({
            kind: "resolve-glimpse",
            playerId: p.id,
            cardIds: deck.slice(0, 4),
          });
          expect(p.zone("hand")).toHaveLength(hand - 2);
          expect(() =>
            answerDecision(game, "resolve-glimpse", {
              kind: "reorder",
              top: [deck[4]],
              bottom: deck.slice(0, 3),
            }),
          ).toThrow();
          const top = [deck[2]!, deck[0]!],
            bottom = [deck[3]!, deck[1]!];
          answerDecision(game, "resolve-glimpse", { kind: "reorder", top, bottom });
          expected = [...top, ...deck.slice(4), ...bottom];
          passEffectsStack(game);
        }
        if (modes.includes("draw")) {
          expect(p.zone("hand").map((c) => c.objectId)).toContain(expected[0]);
          expected = expected.slice(1);
        }
        expect(p.zone("main-deck").map((c) => c.objectId)).toEqual(expected);
        expect(p.zone("hand")).toHaveLength(hand - 2 + (modes.includes("draw") ? 1 : 0));
        expect(p.cards(cometaryVantage, { zone: "graveyard" })).toHaveLength(1);
        expect(game.state.stack).toHaveLength(0);
        expect(game.state.decision).toBeNull();
      });
  }
});

/** @covers y4c89re0bd-a1 */
describe("Cometary Vantage — each attacking Aethercharge reloads on hit", () => {
  for (const opponentCasts of [false, true])
    for (const count of [1, 3])
      for (const otherHost of [false, true]) {
        it(`opponent casts=${opponentCasts}, charges=${count}, another host=${otherHost}`, () => {
          const { game, p, q, champion, pay, opportunity } = fixture();
          const weapons = p.cards(trivariateDream),
            weapon = weapons[0]!,
            other = weapons[1]!;
          const charges = p.cards(resonantAether),
            used = charges.slice(0, count),
            spare = charges[count]!;
          for (const charge of [...used, spare]) {
            p.activate(charge, { reservePayment: pay(p, 1) });
            passEffectsStack(game);
            answerDecision(game, "resolve-effect-choice", [
              charge.objectId === spare.objectId ? other.objectId : weapon.objectId,
            ]);
            passEffectsStack(game);
          }
          p.declareAttack(p.card(champion), q.card(champion), { weaponIds: [weapon.objectId] });
          for (const charge of used)
            expect(game.state.objects[charge.objectId]!.zone).toBe("intent");
          const caster = opponentCasts ? q : p;
          opportunity(caster);
          caster.activate(cometaryVantage, {
            reservePayment: pay(caster, 1),
            modeIds: ["grant-on-hit"],
          });
          passEffectsStack(game);
          let reloads = 0;
          const destination = otherHost ? other : weapon;
          for (
            let step = 0;
            (game.state.combat || game.state.stack.length || game.state.decision) && step < 100;
            step++
          ) {
            const decision = game.state.decision;
            if (decision?.kind === "order-triggered-abilities")
              answerDecision(game, "order-triggered-abilities", decision.pendingTriggerIds);
            else if (decision?.kind === "choose-retaliators")
              answerDecision(game, "choose-retaliators", []);
            else if (decision?.kind === "resolve-effect-choice") {
              expect(decision.playerId).toBe(p.id);
              for (const invalid of [
                [],
                [destination.objectId, destination.objectId],
                [q.cards(trivariateDream)[0]!.objectId],
                [p.card(trainingSword).objectId],
                [p.card(champion).objectId],
              ]) {
                expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
              }
              answerDecision(game, "resolve-effect-choice", [destination.objectId]);
              reloads++;
            } else {
              const wait = game.waitState();
              if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
              game.player(wait.playerId).pass();
            }
          }
          expect(reloads).toBe(count);
          expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(count + 1);
          for (const charge of used) {
            expect(game.state.objects[charge.objectId]!.zone).toBe("loaded");
            expect(game.state.objects[charge.objectId]!.hostId).toBe(destination.objectId);
          }
          expect(game.state.objects[spare.objectId]!.zone).toBe("loaded");
          advanceToMain(game, p.id, game.state.turn.number);
          p.declareAttack(p.card(champion), q.card(champion), {
            weaponIds: [destination.objectId],
          });
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(
            2 * (count + 1) + (otherHost ? 1 : 0),
          );
          for (const charge of used)
            expect(game.state.objects[charge.objectId]!.zone).toBe("graveyard");
          expect(game.state.objects[spare.objectId]!.zone).toBe(otherHost ? "graveyard" : "loaded");
          expect(game.state.decision).toBeNull();
        });
      }
});

/** @covers y4c89re0bd-a1 */
describe("Cometary Vantage — hit and available-host boundaries", () => {
  for (const boundary of [
    "prevented",
    "hosts-removed",
    "before-attack",
    "no-intent",
    "non-aethercharge",
  ] as const) {
    it(boundary, () => {
      const { game, p, q, champion, pay, opportunity } = fixture(boundary);
      const weapons = p.cards(trivariateDream),
        weapon = weapons[0]!,
        other = weapons[1]!;
      const charge = p.cards(resonantAether)[0]!;
      if (boundary !== "no-intent" && boundary !== "non-aethercharge") {
        p.activate(charge, { reservePayment: pay(p, 1) });
        passEffectsStack(game);
        answerDecision(game, "resolve-effect-choice", [weapon.objectId]);
        passEffectsStack(game);
      }
      const vantage = () => {
        opportunity(p);
        p.activate(cometaryVantage, { reservePayment: pay(p, 1), modeIds: ["grant-on-hit"] });
        passEffectsStack(game);
      };
      if (boundary === "before-attack") vantage();
      if (boundary === "no-intent")
        p.declareAttack(p.card(woodlandSquirrels, { zone: "field" }), q.card(champion));
      else if (boundary === "non-aethercharge") {
        p.activate(comboStrike, {
          reservePayment: pay(p, 2),
          attackAttackerId: p.card(champion).objectId,
        });
        passEffectsStack(game);
        declareResolvedAttack(
          game,
          p.card(champion).objectId,
          q.card(champion).objectId,
          "attack using a non-Aethercharge card",
        );
      } else p.declareAttack(p.card(champion), q.card(champion), { weaponIds: [weapon.objectId] });
      if (boundary !== "before-attack") vantage();
      if (boundary === "prevented") {
        opportunity(q);
        q.activate(viridescentAetherstreak, {
          modeIds: ["become-distant", "prevent-damage"],
          reservePayment: pay(q, 3),
          targets: { "distant-unit": [q.card(champion).objectId] },
        });
        passEffectsStack(game);
      }
      if (boundary === "hosts-removed") {
        advanceCombatToTrigger(game, "granted-ox12m3-a1");
        expect(
          game.state.stack.some(
            (s) => s.kind === "triggered-ability" && s.ability.id === "granted-ox12m3-a1",
          ),
        ).toBe(true);
        // Remove both legal hosts before the granted On Hit ability resolves.
        for (const host of [weapon, other]) {
          opportunity(q);
          q.activate(q.cards(nocturnesOblivion, { zone: "hand" })[0]!, {
            reservePayment: pay(q, 3),
            targets: { "target-1": [host.objectId] },
          });
        }
        passEffectsStack(game);
      }
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(
        boundary === "prevented"
          ? 0
          : boundary === "no-intent"
            ? 1
            : boundary === "non-aethercharge"
              ? 3
              : 2,
      );
      expect(game.state.objects[charge.objectId]!.zone).toBe(
        boundary === "no-intent" || boundary === "non-aethercharge" ? "hand" : "graveyard",
      );
      if (boundary === "non-aethercharge")
        expect(p.cards(comboStrike, { zone: "graveyard" })).toHaveLength(1);
      expect(game.state.decision).toBeNull();
      expect(game.state.stack).toHaveLength(0);
    });
  }
});

/** @covers y4c89re0bd-a1 */
it("keeps its announced single mode when the champion becomes Distant in response", () => {
  const { game, p, q, champion, pay, opportunity } = fixture();
  const deck = p.zone("main-deck").map((c) => c.objectId),
    hand = p.zone("hand").length;
  p.activate(cometaryVantage, { modeIds: ["draw"], reservePayment: pay(p, 1) });
  opportunity(q);
  q.activate(backdash, {
    reservePayment: pay(q, 1),
    targets: { "target-1": [p.card(champion).objectId] },
  });
  passEffectsStack(game);
  expect(game.state.objects[p.card(champion).objectId]!.states.has("distant")).toBe(true);
  expect(p.zone("main-deck").map((c) => c.objectId)).toEqual(deck.slice(1));
  expect(p.zone("hand")).toHaveLength(hand - 1);
  expect(game.state.decision).toBeNull();
  expect(game.state.stack).toHaveLength(0);
});
