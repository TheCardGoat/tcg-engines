import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { duplicitousReplication } from "./duplicitous-replication.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { enfeebledDagger } from "../items/enfeebled-dagger.ts";
import { nocturnesOblivion } from "../../P25/actions/nocturnes-oblivion.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
const base = enableAllTestElements(
  createClassBonusTestChampion(duplicitousReplication, false, "activation-discount"),
);
const face = requireSingleFace(base);
// A public fixture ability supplies atomic multi-entry events and post-entry modifiers.
const champion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  ...base,
  layout: {
    kind: "single-faced",
    face: {
      ...face,
      abilities: [
        ...face.abilities,
        {
          id: "replicationEntry-a1",
          kind: "activated",
          activation: "ability",
          text: "Put selected cards onto the field under your control, then rest them and add three durability counters.",
          cost: { kind: "pay-reserve", amount: 0 },
          effect: {
            kind: "choose",
            selection: {
              id: "entries",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: { kind: "up-to", amount: 4 },
              unique: true,
              candidates: {
                kind: "card",
                zones: ["material-deck", "hand"],
                relationship: "zone-of",
                player: "each-player",
              },
            },
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "move",
                  subject: { kind: "bound", binding: "entries" },
                  destination: { zone: "field", controller: "controller" },
                },
                {
                  kind: "set-object-state",
                  subject: { kind: "bound", binding: "entries" },
                  state: "rested",
                  value: true,
                },
                {
                  kind: "add-counter",
                  subject: { kind: "bound", binding: "entries" },
                  counter: "durability",
                  amount: 3,
                },
              ],
            },
          },
        },
      ],
    },
  },
};
function opportunity(game: GrandArchiveTestEngine, id: string) {
  const w = game.waitState();
  if (w.kind !== "opportunity") throw new Error(`Unexpected ${w.kind}`);
  if (w.playerId !== id) game.player(w.playerId).pass();
}
function settle(game: GrandArchiveTestEngine) {
  for (let n = 0; n < 64; n++) {
    if (game.state.decision?.kind === "order-triggered-abilities")
      answerDecision(game, "order-triggered-abilities", game.state.decision.pendingTriggerIds);
    else if (game.state.stack.length) {
      const w = game.waitState();
      if (w.kind !== "opportunity") throw new Error(`Unexpected ${w.kind}`);
      game.player(w.playerId).pass();
    } else return;
  }
  throw new Error("Did not settle");
}
function prepare(casts = 1, opposingTurn = false) {
  const game = GrandArchiveTestEngine.startFixture({
    firstPlayer: opposingTurn ? "playerTwo" : "playerOne",
    playerOne: {
      champion,
      zones: {
        hand: [
          ...Array.from({ length: casts }, () => duplicitousReplication),
          ...Array.from({ length: 6 }, () => woodlandSquirrels),
        ],
        "material-deck": [trainingSword, trainingSword, trainingSword, enfeebledDagger],
        "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
      },
    },
    playerTwo: {
      champion,
      zones: {
        hand: [
          woodlandSquirrels,
          nocturnesOblivion,
          woodlandSquirrels,
          woodlandSquirrels,
          woodlandSquirrels,
        ],
        "material-deck": [trainingSword, trainingSword, trainingSword, enfeebledDagger],
        "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
      },
    },
  });
  const p = game.player("player-one"),
    q = game.player("player-two");
  const tokens = () => p.zone("field").filter((c) => game.state.objects[c.objectId]!.isToken);
  const cast = () => {
    opportunity(game, p.id);
    const source = p.cards(duplicitousReplication, { zone: "hand" })[0]!,
      payment = p
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 2)
        .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
      before = game.state;
    expect(() => p.activate(source, { reservePayment: payment.slice(0, 1) })).toThrow();
    expect(game.state).toEqual(before);
    p.activate(source, { reservePayment: payment });
    settle(game);
    expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
  };
  const enter = (actor: typeof p, ids: readonly string[]) => {
    opportunity(game, actor.id);
    actor.activateAbility(actor.card(champion), "replicationEntry-a1");
    passEffectsStack(game);
    answerDecision(game, "resolve-effect-choice", ids);
  };
  return { game, p, q, tokens, cast, enter };
}
/** @covers owq8s5fefw-a1 */
describe("Duplicitous Replication — next opposing regalia entry batch", () => {
  for (const casts of [1, 2])
    for (const count of [1, 2, 3])
      it(`${casts} delayed effects each copy all ${count} simultaneous regalia, once`, () => {
        const { game, p, q, tokens, cast, enter } = prepare(casts);
        for (let n = 0; n < casts; n++) cast();
        expect(tokens()).toHaveLength(0);
        const originals = q.cards(trainingSword, { zone: "material-deck" }).slice(0, count),
          ally = q.cards(woodlandSquirrels, { zone: "hand" })[0]!;
        enter(q, [...originals.map((c) => c.objectId), ally.objectId]);
        expect(tokens()).toHaveLength(0);
        expect(game.state.stack.length + game.state.pendingTriggers.length).toBeGreaterThan(0);
        settle(game);
        expect(tokens()).toHaveLength(casts * count);
        for (const copy of tokens()) {
          const obj = game.state.objects[copy.objectId]!;
          expect(obj).toMatchObject({
            ownerId: p.id,
            controllerId: p.id,
            zone: "field",
            isToken: true,
            definitionId: trainingSword.canonicalId,
          });
          expect(obj.states.has("rested")).toBe(false);
          expect(obj.counters.durability).toBe(2);
        }
        for (const original of originals) {
          expect(game.state.objects[original.objectId]!.states.has("rested")).toBe(true);
          expect(game.state.objects[original.objectId]!.counters.durability).toBe(5);
        }
        enter(q, [q.card(enfeebledDagger, { zone: "material-deck" }).objectId]);
        settle(game);
        expect(tokens()).toHaveLength(casts * count);
        expect(p.zone("memory")).toHaveLength(2 * casts);
      });
  for (const ownCard of [false, true])
    for (const ownControl of [false, true])
      it(`card owned by caster ${ownCard}, enters under caster ${ownControl}`, () => {
        const { game, p, q, tokens, cast, enter } = prepare();
        cast();
        const owner = ownCard ? p : q,
          actor = ownControl ? p : q;
        const original = owner.cards(trainingSword, { zone: "material-deck" })[0]!;
        enter(actor, [original.objectId]);
        settle(game);
        expect(game.state.objects[original.objectId]).toMatchObject({
          ownerId: owner.id,
          controllerId: actor.id,
        });
        expect(tokens()).toHaveLength(ownControl ? 0 : 1);
        if (ownControl) {
          enter(q, [q.card(enfeebledDagger, { zone: "material-deck" }).objectId]);
          settle(game);
          expect(tokens()).toHaveLength(1);
          expect(tokens()[0]!.definitionId).toBe(enfeebledDagger.canonicalId);
        }
      });
  for (const opposingTurn of [false, true])
    it(`expires at the current turn's end, opposing turn=${opposingTurn}`, () => {
      const { game, p, q, tokens, cast, enter } = prepare(1, opposingTurn);
      cast();
      enter(q, [q.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId]);
      settle(game);
      expect(tokens()).toHaveLength(0);
      advanceToMain(game, opposingTurn ? p.id : q.id, game.state.turn.number);
      enter(q, [q.cards(trainingSword, { zone: "material-deck" })[0]!.objectId]);
      settle(game);
      expect(tokens()).toHaveLength(0);
    });
  it("copies a normally materialized weapon, can attack with the token, and the token ceases when removed", () => {
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      phase: "materialize",
      playerOne: {
        champion: base,
        zones: {
          hand: [duplicitousReplication, woodlandSquirrels, woodlandSquirrels],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: {
        champion: base,
        zones: {
          "material-deck": [trainingSword],
          hand: [nocturnesOblivion, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      original = q.card(trainingSword, { zone: "material-deck" });
    q.materialize(original);
    q.pass();
    p.activate(duplicitousReplication, {
      reservePayment: p.cards(woodlandSquirrels).map((c) => ({ kind: "card", cardId: c.objectId })),
    });
    p.pass();
    q.pass();
    expect(game.state.objects[original.objectId]!.zone).toBe("effects-stack");
    expect(p.cards(trainingSword, { zone: "field" })).toHaveLength(0);
    settle(game);
    const copy = p.card(trainingSword, { zone: "field" });
    expect(game.state.objects[copy.objectId]!.isToken).toBe(true);
    advanceToMain(game, p.id);
    p.declareAttack(p.card(base), q.card(base), { weaponIds: [copy.objectId] });
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[q.card(base).objectId]!.damage).toBe(1);
    expect(game.state.objects[copy.objectId]!.counters.durability).toBe(1);
    expect(game.state.objects[original.objectId]!.counters.durability).toBe(2);
    opportunity(game, q.id);
    q.activate(nocturnesOblivion, {
      reservePayment: q
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 3)
        .map((c) => ({ kind: "card", cardId: c.objectId })),
      targets: { "target-1": [copy.objectId] },
    });
    settle(game);
    expect(game.state.objects[copy.objectId]).toBeUndefined();
    expect(game.state.objects[original.objectId]!.zone).toBe("field");
  });
});

/** @covers owq8s5fefw-a1 */
it("copies an entered regalia after it banishes itself in response, and its token ability works", () => {
  const { game, p, q, tokens, cast, enter } = prepare();
  cast();
  const original = q.card(enfeebledDagger, { zone: "material-deck" });
  enter(q, [original.objectId]);
  opportunity(game, q.id);
  q.activateAbility(original, "idpdon8f0h-a1", {
    targets: { "target-unit": [p.card(champion).objectId] },
  });
  settle(game);
  expect(game.state.objects[original.objectId]!.zone).toBe("banishment");
  expect(tokens()).toHaveLength(1);
  const copy = tokens()[0]!;
  expect(copy.definitionId).toBe(enfeebledDagger.canonicalId);
  opportunity(game, p.id);
  p.activateAbility(copy, "idpdon8f0h-a1", {
    targets: { "target-unit": [q.card(champion).objectId] },
  });
  settle(game);
  expect(game.state.objects[copy.objectId]).toBeUndefined();
  expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(1);
  expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(1);
});
