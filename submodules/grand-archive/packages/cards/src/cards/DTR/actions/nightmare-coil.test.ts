import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { nightmareCoil } from "./nightmare-coil.ts";
import { backdash } from "./backdash.ts";
import { chainedCharge } from "./chained-charge.ts";
import { rivuletAdjutant } from "../allies/rivulet-adjutant.ts";
import { enfeebledDagger } from "../items/enfeebled-dagger.ts";
import { sovereignSanctuary } from "../phantasias/sovereign-sanctuary.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

function fixture(matching = false, shield = false) {
  const base = enableAllTestElements(
    createClassBonusTestChampion(nightmareCoil, matching, "activation-discount"),
  );
  const champion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
    ...base,
    layout: {
      kind: "single-faced",
      face: { ...requireSingleFace(base), stats: { ...requireSingleFace(base).stats, life: 80 } },
    },
  };
  const game = GrandArchiveTestEngine.startFixture({
    firstPlayer: "playerTwo",
    playerOne: {
      champion,
      zones: {
        hand: [
          chainedCharge,
          nightmareCoil,
          nightmareCoil,
          backdash,
          backdash,
          ...Array.from({ length: 8 }, () => woodlandSquirrels),
        ],
        field: [woodlandSquirrels, enfeebledDagger],
        "main-deck": Array.from({ length: 12 }, () => woodlandSquirrels),
      },
    },
    playerTwo: {
      champion,
      zones: {
        hand: [
          chainedCharge,
          backdash,
          backdash,
          backdash,
          ...Array.from({ length: 6 }, () => woodlandSquirrels),
        ],
        field: [
          rivuletAdjutant,
          woodlandSquirrels,
          enfeebledDagger,
          enfeebledDagger,
          ...(shield ? [sovereignSanctuary] : []),
        ],
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
  const becomeDistant = (targetId = p.card(champion).objectId) => {
    opportunity(p);
    p.activate(p.cards(backdash, { zone: "hand" })[0]!, {
      reservePayment: pay(p, 1),
      targets: { "target-1": [targetId] },
    });
    passEffectsStack(game);
  };
  const ready = () => {
    becomeDistant();
    advanceToRecollection(game, p.id);
    expect(game.state.objects[p.card(champion).objectId]!.states.has("distant")).toBe(true);
  };
  return { game, p, q, champion, pay, opportunity, becomeDistant, ready };
}

/** @covers 3fe3c97s71-a1 */
describe("Nightmare Coil — only a Distant champion's own recollection", () => {
  for (const phase of [
    "own-recollection",
    "opposing-recollection",
    "own-main",
    "opposing-main",
  ] as const)
    for (const distant of ["none", "champion", "ally", "opponent"] as const) {
      it(`${phase}, Distant=${distant}`, () => {
        const { game, p, q, champion, pay, opportunity, becomeDistant } = fixture();
        if (phase === "own-recollection") advanceToRecollection(game, p.id);
        else if (phase === "opposing-recollection") advanceToRecollection(game, q.id);
        else if (phase === "own-main") advanceToMain(game, p.id);
        if (distant !== "none")
          becomeDistant(
            distant === "champion"
              ? p.card(champion).objectId
              : distant === "ally"
                ? p.card(woodlandSquirrels, { zone: "field" }).objectId
                : q.card(champion).objectId,
          );
        opportunity(p);
        const source = p.cards(nightmareCoil)[0]!,
          before = game.state;
        const legal = phase === "own-recollection" && distant === "champion";
        if (!legal) {
          expect(() => p.activate(source, { reservePayment: pay(p, 2) })).toThrow();
          expect(game.state).toEqual(before);
          return;
        }
        expect(() => p.activate(source, { reservePayment: pay(p, 1) })).toThrow();
        expect(game.state).toEqual(before);
        const top = p.zone("main-deck")[0]!,
          hand = p.zone("hand").length;
        p.activate(source, { reservePayment: pay(p, 2) });
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
        expect(game.state.objects[top.objectId]!.zone).toBe("hand");
        expect(p.zone("hand")).toHaveLength(hand - 2);
        expect(game.state.turn.phase).toBe("recollection");
      });
    }
});

/** @covers 3fe3c97s71-a2 */
describe("Nightmare Coil — class-gated protection against negation", () => {
  for (const matching of [false, true])
    for (const payTax of [false, true]) {
      it(`matching Ranger=${matching}, pay counterspell tax=${payTax}`, () => {
        const { game, p, q, champion, pay, opportunity, ready } = fixture(matching);
        ready();
        const source = p.cards(nightmareCoil)[0]!,
          top = p.zone("main-deck")[0]!;
        p.activate(source, { reservePayment: pay(p, 2) });
        const activation = game.state.stack.at(-1)!;
        opportunity(q);
        q.activate(chainedCharge, {
          reservePayment: pay(q, matching ? 1 : 2),
          targets: { "target-stack-item": [activation.id] },
        });
        passEffectsStack(game);
        answerDecision(
          game,
          "resolve-effect-payment",
          payTax ? { reservePayment: pay(p, 1) } : false,
        );
        passEffectsStack(game);
        expect(game.state.objects[top.objectId]!.zone).toBe(
          matching || payTax ? "hand" : "main-deck",
        );
        expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
        expect(p.zone("memory")).toHaveLength(3 + (payTax ? 1 : 0));
        // The counterspell was activated before Coil resolved, so it incurs no delayed damage.
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(0);
        opportunity(q);
        q.activateAbility(q.cards(enfeebledDagger)[0]!, "idpdon8f0h-a1", {
          targets: { "target-unit": [p.card(champion).objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(
          matching || payTax ? 8 : 0,
        );
      });
    }
});

/** @covers 3fe3c97s71-a3 */
describe("Nightmare Coil — repeated self-damage until the turn ends", () => {
  for (const copies of [1, 2])
    for (const shield of [false, true]) {
      it(`${copies} resolved copies, opposing prevention=${shield}`, () => {
        const { game, p, q, champion, pay, opportunity, ready } = fixture(false, shield);
        ready();
        const sources = p.cards(nightmareCoil),
          deck = p.zone("main-deck");
        for (const source of sources.slice(0, copies)) {
          p.activate(source, { reservePayment: pay(p, 2) });
          passEffectsStack(game);
        }
        for (const drawn of deck.slice(0, copies))
          expect(game.state.objects[drawn.objectId]!.zone).toBe("hand");
        const damage = () => game.state.objects[q.card(champion).objectId]!.damage;
        expect(damage()).toBe(0);
        // The caster's own activated ability and card never incur the penalty.
        p.activateAbility(p.card(enfeebledDagger), "idpdon8f0h-a1", {
          targets: {
            "target-unit": [shield ? p.card(champion).objectId : q.card(rivuletAdjutant).objectId],
          },
        });
        passEffectsStack(game);
        p.activate(p.card(backdash, { zone: "hand" }), {
          reservePayment: pay(p, 1),
          targets: { "target-1": [p.card(champion).objectId] },
        });
        passEffectsStack(game);
        expect(damage()).toBe(0);
        if (!shield) expect(q.cards(rivuletAdjutant, { zone: "banishment" })).toHaveLength(1);
        for (let activation = 1; activation <= 3; activation++) {
          opportunity(q);
          if (activation === 2) {
            const before = game.state;
            expect(() =>
              q.activateAbility(q.cards(enfeebledDagger)[0]!, "idpdon8f0h-a1", {
                targets: {
                  "target-unit": [p.cards(nightmareCoil, { zone: "graveyard" })[0]!.objectId],
                },
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
            q.activateAbility(q.cards(enfeebledDagger)[0]!, "idpdon8f0h-a1", {
              targets: { "target-unit": [p.card(champion).objectId] },
            });
          } else
            q.activate(q.cards(backdash, { zone: "hand" })[0]!, {
              reservePayment: pay(q, 1),
              targets: { "target-1": [q.card(champion).objectId] },
            });
          if (copies === 2) {
            const decision = game.state.decision;
            if (decision?.kind !== "order-triggered-abilities")
              throw new Error("Expected both delayed triggers");
            expect(decision.pendingTriggerIds).toHaveLength(2);
            answerDecision(game, "order-triggered-abilities", decision.pendingTriggerIds);
          }
          passEffectsStack(game);
          expect(damage()).toBe(8 * copies * activation);
        }
        const hits = game.state.eventHistory.filter(
          (e) => e.type === "damage-marked" && e.objectId === q.card(champion).objectId,
        );
        expect(hits).toHaveLength(3 * copies);
        for (const hit of hits)
          expect(hit).toMatchObject({
            sourceId: q.card(champion).objectId,
            amount: 8,
            preventable: false,
          });
        advanceToMain(game, q.id);
        const before = damage();
        q.activate(q.card(backdash, { zone: "hand" }), {
          reservePayment: pay(q, 1),
          targets: { "target-1": [q.card(champion).objectId] },
        });
        passEffectsStack(game);
        expect(damage()).toBe(before);
        q.activateAbility(q.card(enfeebledDagger, { zone: "field" }), "idpdon8f0h-a1", {
          targets: { "target-unit": [p.card(champion).objectId] },
        });
        passEffectsStack(game);
        expect(damage()).toBe(before);
      });
    }
});

/** @covers 3fe3c97s71-a3 */
it("still punishes an opposing activation that is subsequently negated", () => {
  const { game, p, q, champion, pay, opportunity, ready } = fixture();
  ready();
  p.activate(p.cards(nightmareCoil)[0]!, { reservePayment: pay(p, 2) });
  passEffectsStack(game);
  opportunity(q);
  const source = q.cards(backdash)[0]!;
  q.activate(source, {
    reservePayment: pay(q, 1),
    targets: { "target-1": [q.card(champion).objectId] },
  });
  const activation = game.state.stack.find(
    (s) => s.kind === "card-activation" && s.sourceId === source.objectId,
  );
  if (!activation) throw new Error("Expected opposing Backdash activation");
  opportunity(p);
  p.activate(chainedCharge, {
    reservePayment: pay(p, 2),
    targets: { "target-stack-item": [activation.id] },
  });
  passEffectsStack(game);
  answerDecision(game, "resolve-effect-payment", false);
  passEffectsStack(game);
  expect(game.state.objects[q.card(champion).objectId]!.states.has("distant")).toBe(false);
  expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(8);
  expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
});
