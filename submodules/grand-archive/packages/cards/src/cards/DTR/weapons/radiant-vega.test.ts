import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { radiantVega } from "./radiant-vega.ts";
import { trivariateDream } from "./trivariate-dream.ts";
import { resonantAether } from "../actions/resonant-aether.ts";
import { backdash } from "../actions/backdash.ts";
import { spellwardScepter } from "../items/spellward-scepter.ts";
import { enfeebledDagger } from "../items/enfeebled-dagger.ts";
import { luxemSight } from "../../DOA/actions/luxem-sight.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createLineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

function prepare(
  count: number,
  own = false,
  matching = true,
  distant = true,
  protectedSpell = false,
  repeated = false,
) {
  const hero = enableAllTestElements(
    createLineageTestChampion(radiantVega, matching ? "Diana" : "Other"),
  );
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion: hero,
      zones: {
        field: [radiantVega, trivariateDream, spellwardScepter],
        hand: [
          backdash,
          ...(repeated ? [backdash, backdash] : []),
          luxemSight,
          ...Array.from({ length: count + 1 }, () => resonantAether),
          ...Array.from({ length: 15 }, () => woodlandSquirrels),
        ],
        "main-deck": Array.from({ length: repeated ? 6 : 1 }, () => woodlandSquirrels),
      },
    },
    playerTwo: {
      champion: hero,
      zones: {
        hand: [
          luxemSight,
          ...(repeated ? [luxemSight, luxemSight] : []),
          woodlandSquirrels,
          woodlandSquirrels,
          woodlandSquirrels,
        ],
        field: [spellwardScepter, enfeebledDagger],
        "main-deck": Array.from({ length: repeated ? 6 : 1 }, () => woodlandSquirrels),
      },
    },
  });
  const p = game.player("player-one"),
    q = game.player("player-two"),
    weapon = p.card(radiantVega);
  const payment = (n: number) =>
    p
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(0, n)
      .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
  const charges = p.cards(resonantAether);
  for (const [index, charge] of charges.entries()) {
    p.activate(charge, { reservePayment: payment(1) });
    passEffectsStack(game);
    answerDecision(game, "resolve-effect-choice", [
      index < count ? weapon.objectId : p.card(trivariateDream).objectId,
    ]);
    passEffectsStack(game);
    expect(game.state.objects[charge.objectId]!.zone).toBe("loaded");
  }
  if (distant) {
    p.activate(p.cards(backdash, { zone: "hand" })[0]!, {
      reservePayment: payment(1),
      targets: { "target-1": [p.card(hero).objectId] },
    });
    passEffectsStack(game);
  }
  const actor = own ? p : q;
  if (!own) p.pass();
  if (protectedSpell) {
    actor.activateAbility(spellwardScepter, "f6lxizyuml-a2");
    passEffectsStack(game);
    const w = game.waitState();
    if (w.kind === "opportunity" && w.playerId !== actor.id) game.player(w.playerId).pass();
  }
  const spell = actor.cards(luxemSight, { zone: "hand" })[0]!;
  actor.activate(spell);
  const activation = game.state.stack.at(-1)!;
  if (!own) q.pass();
  return { game, p, q, hero, weapon, payment, actor, spell, activation, charges };
}

/** @covers odcgpm3ugw-a1 */
describe("Radiant Vega - paid negation based on its own loaded charges", () => {
  for (const own of [false, true])
    for (const count of [0, 1, 3])
      for (const pay of [false, true])
        it(`own=${own}, loaded=${count}, pay=${pay}`, () => {
          const { game, p, q, weapon, payment, actor, spell, activation, charges } = prepare(
            count,
            own,
          );
          const before = game.state,
            memory = p.zone("memory").length;
          for (const targets of [
            [],
            [spell.objectId],
            [weapon.objectId],
            [activation.id, activation.id],
          ]) {
            expect(() =>
              p.activateAbility(weapon, "odcgpm3ugw-a1", {
                reservePayment: payment(2),
                targets: { "target-activation": targets },
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          expect(() =>
            p.activateAbility(weapon, "odcgpm3ugw-a1", {
              reservePayment: payment(1),
              targets: { "target-activation": [activation.id] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
          p.activateAbility(weapon, "odcgpm3ugw-a1", {
            reservePayment: payment(2),
            targets: { "target-activation": [activation.id] },
          });
          expect(p.zone("memory")).toHaveLength(memory + 2);
          expect(game.state.objects[weapon.objectId]).toMatchObject({
            counters: { durability: 3 },
          });
          expect(game.state.objects[weapon.objectId]!.states.has("rested")).toBe(true);
          const paid = game.state;
          expect(() =>
            p.activateAbility(weapon, "odcgpm3ugw-a1", {
              reservePayment: payment(2),
              targets: { "target-activation": [activation.id] },
            }),
          ).toThrow();
          expect(game.state).toEqual(paid);
          passEffectsStack(game);
          expect(game.state.decision).toMatchObject({
            kind: "resolve-effect-payment",
            playerId: actor.id,
          });
          expect(game.state.objects[spell.objectId]!.zone).toBe("effects-stack");
          const pending = game.state;
          if (count > 0) {
            expect(() =>
              answerDecision(game, "resolve-effect-payment", { reservePayment: [] }),
            ).toThrow();
            expect(game.state).toEqual(pending);
          }
          const reserve = actor
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, count)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          answerDecision(game, "resolve-effect-payment", pay ? { reservePayment: reserve } : false);
          passEffectsStack(game);
          expect(actor.zone("main-deck")).toHaveLength(pay ? 0 : 1);
          expect(game.state.objects[spell.objectId]!.zone).toBe("graveyard");
          expect(p.zone("memory")).toHaveLength(memory + 2 + (own && pay ? count : 0));
          expect(q.zone("memory")).toHaveLength(!own && pay ? count : 0);
          expect(game.state.objects[weapon.objectId]).toMatchObject({
            counters: { durability: 3 },
          });
          expect(game.state.objects[weapon.objectId]!.states.has("rested")).toBe(true);
          for (const charge of charges)
            expect(game.state.objects[charge.objectId]!.zone).toBe("loaded");
        });

  for (const matching of [false, true])
    for (const distant of [false, true])
      it(`Diana=${matching}, distant=${distant}`, () => {
        const { game, p, weapon, payment, activation, actor } = prepare(
          1,
          false,
          matching,
          distant,
        );
        const before = game.state;
        const activate = () =>
          p.activateAbility(weapon, "odcgpm3ugw-a1", {
            reservePayment: payment(2),
            targets: { "target-activation": [activation.id] },
          });
        if (matching && distant) {
          activate();
          passEffectsStack(game);
          answerDecision(game, "resolve-effect-payment", false);
        } else {
          expect(activate).toThrow();
          expect(game.state).toEqual(before);
        }
        passEffectsStack(game);
        expect(actor.zone("main-deck")).toHaveLength(matching && distant ? 1 : 0);
        expect(game.state.objects[weapon.objectId]!.counters.durability).toBe(
          matching && distant ? 3 : 5,
        );
      });

  it("keeps all costs paid when the target cannot be negated", () => {
    const { game, p, weapon, payment, activation, actor } = prepare(1, false, true, true, true);
    p.activateAbility(weapon, "odcgpm3ugw-a1", {
      reservePayment: payment(2),
      targets: { "target-activation": [activation.id] },
    });
    passEffectsStack(game);
    answerDecision(game, "resolve-effect-payment", false);
    passEffectsStack(game);
    expect(actor.zone("main-deck")).toHaveLength(0);
    expect(game.state.objects[weapon.objectId]).toMatchObject({ counters: { durability: 3 } });
    expect(game.state.objects[weapon.objectId]!.states.has("rested")).toBe(true);
  });
  it("rejects an activated ability without paying any of Vega's costs", () => {
    const { game, p, q, hero, weapon, payment } = prepare(1);
    passEffectsStack(game);
    p.pass();
    q.activateAbility(enfeebledDagger, "idpdon8f0h-a1", {
      targets: { "target-unit": [p.card(hero).objectId] },
    });
    const ability = game.state.stack.at(-1)!;
    q.pass();
    const before = game.state;
    expect(() =>
      p.activateAbility(weapon, "odcgpm3ugw-a1", {
        reservePayment: payment(2),
        targets: { "target-activation": [ability.id] },
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
    passEffectsStack(game);
    expect(game.state.objects[p.card(hero).objectId]!.damage).toBe(1);
    expect(game.state.objects[weapon.objectId]!.counters.durability).toBe(5);
  });

  it("cannot pay two durability with only one counter left after two paid uses", () => {
    const { game, p, q, hero, weapon, payment, activation } = prepare(
      0,
      false,
      true,
      true,
      false,
      true,
    );
    let targetId = activation.id;
    for (let use = 0; use < 3; use++) {
      if (use > 0) {
        const turn = game.state.turn.number;
        advanceToMain(game, p.id, turn);
        // Distant expires each turn; establish it anew before trying the ability again.
        const dash = p.cards(backdash, { zone: "hand" })[0];
        if (!dash) throw new Error("Expected next Backdash in hand");
        p.activate(dash, {
          reservePayment: payment(1),
          targets: { "target-1": [p.card(hero).objectId] },
        });
        passEffectsStack(game);
        p.pass();
        q.activate(q.cards(luxemSight, { zone: "hand" })[0]!);
        targetId = game.state.stack.at(-1)!.id;
        q.pass();
      }
      const before = game.state;
      const activate = () =>
        p.activateAbility(weapon, "odcgpm3ugw-a1", {
          reservePayment: payment(2),
          targets: { "target-activation": [targetId] },
        });
      if (use === 2) {
        expect(activate).toThrow();
        expect(game.state).toEqual(before);
        expect(game.state.objects[weapon.objectId]!.states.has("rested")).toBe(false);
        passEffectsStack(game);
      } else {
        activate();
        expect(game.state.objects[weapon.objectId]!.counters.durability).toBe(3 - 2 * use);
        passEffectsStack(game);
        answerDecision(game, "resolve-effect-payment", false);
        passEffectsStack(game);
      }
    }
    expect(game.state.objects[weapon.objectId]!.counters.durability).toBe(1);
  });
});
