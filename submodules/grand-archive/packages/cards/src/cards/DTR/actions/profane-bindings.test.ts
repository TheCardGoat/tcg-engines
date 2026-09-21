import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { profaneBindings } from "./profane-bindings.ts";
import { royalOrdinance } from "./royal-ordinance.ts";
import { enfeebledDagger } from "../items/enfeebled-dagger.ts";
import { spellwardScepter } from "../items/spellward-scepter.ts";
import { luxemSight } from "../../DOA/actions/luxem-sight.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { idleThoughts } from "../../DOA/actions/idle-thoughts.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
const starter = enableAllTestElements(lineageTestChampion("Bindings", 0));
const current = enableAllTestElements(lineageTestChampion("Bindings", 1));
function giveOpportunity(game: GrandArchiveTestEngine, id: string) {
  const wait = game.waitState();
  if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
  if (wait.playerId !== id) game.player(wait.playerId).pass();
}
/** @covers 7h2k6p8fss-a1 */
describe("Profane Bindings — negate, banish the negated source and enter bottom lineage", () => {
  for (const card of [woodlandSquirrels, royalOrdinance])
    for (const own of [false, true])
      for (const protectedActivation of [false, true])
        it(`${card.slug}, own ${own}, protected ${protectedActivation}`, () => {
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: own ? "playerOne" : "playerTwo",
            playerOne: {
              champion: starter,
              lineage: [current],
              zones: {
                hand: [
                  profaneBindings,
                  ...(own ? [card] : []),
                  ...Array.from({ length: 6 }, () => idleThoughts),
                ],
                field: [spellwardScepter],
                "main-deck": [woodlandSquirrels],
              },
            },
            playerTwo: {
              champion: starter,
              zones: {
                hand: [...(!own ? [card] : []), idleThoughts, idleThoughts],
                field: [spellwardScepter],
                "main-deck": [woodlandSquirrels],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            actor = own ? p : q,
            hero = p.card(starter),
            source = p.card(profaneBindings),
            target = actor.card(card, { zone: "hand" });
          const lineage = p.zone("inner-lineage").map((c) => c.objectId);
          if (protectedActivation) {
            actor.activateAbility(spellwardScepter, "f6lxizyuml-a2");
            passEffectsStack(game);
          }
          const originalCost = card === royalOrdinance ? 2 : 0;
          actor.activate(target, {
            reservePayment: actor
              .cards(idleThoughts, { zone: "hand" })
              .slice(0, originalCost)
              .map((c) => ({ kind: "card", cardId: c.objectId })),
          });
          const activation = game.state.stack.at(-1)!;
          giveOpportunity(game, p.id);
          const payment = p
              .cards(idleThoughts, { zone: "hand" })
              .slice(0, 2)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
            before = game.state;
          for (const ids of [
            [],
            [target.objectId],
            [hero.objectId],
            [activation.id, activation.id],
          ]) {
            expect(() =>
              p.activate(source, {
                reservePayment: payment,
                targets: { "target-stack-item": ids },
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          expect(() =>
            p.activate(source, {
              reservePayment: payment.slice(0, 1),
              targets: { "target-stack-item": [activation.id] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
          p.activate(source, {
            reservePayment: payment,
            targets: { "target-stack-item": [activation.id] },
          });
          expect(game.state.objects[target.objectId]!.zone).toBe("effects-stack");
          expect(p.zone("inner-lineage").map((c) => c.objectId)).toEqual(lineage);
          passEffectsStack(game);
          expect(game.state.objects[target.objectId]!.zone).toBe(
            protectedActivation
              ? card === woodlandSquirrels
                ? "field"
                : "graveyard"
              : "banishment",
          );
          expect(actor.zone("main-deck")).toHaveLength(
            protectedActivation && card === royalOrdinance ? 0 : 1,
          );
          expect(p.zone("inner-lineage").map((c) => c.objectId)).toEqual([
            ...lineage,
            source.objectId,
          ]);
          expect(game.state.objects[source.objectId]).toMatchObject({
            zone: "inner-lineage",
            hostId: hero.objectId,
          });
          expect(game.state.objects[hero.objectId]!.activeDefinitionId).toBe(current.canonicalId);
          expect(p.zone("memory")).toHaveLength(2 + (own ? originalCost : 0));
          expect(q.zone("memory")).toHaveLength(own ? 0 : originalCost);
          expect(q.zone("inner-lineage")).toHaveLength(0);
        });
  it("rejects an ability instance without paying or entering lineage", () => {
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion: starter,
        zones: { hand: [profaneBindings, idleThoughts, idleThoughts] },
      },
      playerTwo: { champion: starter, zones: { field: [enfeebledDagger] } },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      hero = p.card(starter);
    q.activateAbility(enfeebledDagger, "idpdon8f0h-a1", {
      targets: { "target-unit": [hero.objectId] },
    });
    const ability = game.state.stack.at(-1)!;
    q.pass();
    const before = game.state;
    expect(() =>
      p.activate(profaneBindings, {
        targets: { "target-stack-item": [ability.id] },
        reservePayment: p.cards(idleThoughts).map((c) => ({ kind: "card", cardId: c.objectId })),
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
    passEffectsStack(game);
    expect(game.state.objects[hero.objectId]!.damage).toBe(1);
    expect(p.zone("memory")).toHaveLength(0);
    expect(p.zone("inner-lineage")).toHaveLength(0);
  });
});
/** @covers 7h2k6p8fss-a2 */
describe("Profane Bindings — inherited cumulative life penalty", () => {
  for (const count of [1, 2, 3, 4])
    it(`${count} resolved Bindings affect only their host, persist after leveling, and lower lethal damage`, () => {
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion: starter,
          zones: {
            hand: [
              ...Array.from({ length: count }, () => profaneBindings),
              ...Array.from({ length: 2 * count }, () => woodlandSquirrels),
            ],
            graveyard: [profaneBindings, idleThoughts],
            banishment: [profaneBindings],
            "material-deck": [current],
            "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion: starter,
          zones: {
            hand: Array.from({ length: count }, () => luxemSight),
            field: Array.from({ length: 20 }, () => enfeebledDagger),
            "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        hero = p.card(starter),
        foe = q.card(starter);
      const life = (id: typeof hero.objectId) =>
        deriveGrandArchiveNumericProperty(game.state.objects[id]!, "life", {
          program: game.program,
          state: game.state,
          controllerId: p.id,
          bindings: {},
        });
      expect(life(hero.objectId)).toBe(20);
      for (let i = 1; i <= count; i++) {
        giveOpportunity(game, q.id);
        q.activate(q.cards(luxemSight, { zone: "hand" })[0]!);
        const activation = game.state.stack.at(-1)!;
        q.pass();
        p.activate(p.cards(profaneBindings, { zone: "hand" })[0]!, {
          targets: { "target-stack-item": [activation.id] },
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 2)
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        expect(life(hero.objectId)).toBe(20 - 5 * (i - 1));
        passEffectsStack(game);
        if (i === 4) {
          expect(game.state.objects[hero.objectId]!.zone).not.toBe("field");
          expect(game.state.objects[foe.objectId]!.zone).toBe("field");
          expect(game.state.objects[hero.objectId]!.damage).toBe(0);
          return;
        }
        expect(life(hero.objectId)).toBe(20 - 5 * i);
        expect(life(foe.objectId)).toBe(20);
      }
      for (let step = 0; step < 128; step++) {
        const wait = game.waitState();
        if (wait.kind === "materialization-choice" && wait.playerId === p.id) break;
        if (wait.kind === "materialization-choice")
          game.player(wait.playerId).execute({ move: "skip-materialization" });
        else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
        else throw new Error(`Unexpected ${wait.kind}`);
      }
      p.materialize(current, {
        floatingMemoryCardIds: [p.card(idleThoughts, { zone: "graveyard" }).objectId],
      });
      passEffectsStack(game);
      expect(game.state.objects[hero.objectId]!.activeDefinitionId).toBe(current.canonicalId);
      expect(life(hero.objectId)).toBe(20 - 5 * count);
      expect(life(foe.objectId)).toBe(20);
      advanceToMain(game, q.id);
      for (let hit = 1; hit <= 20 - 5 * count; hit++) {
        q.activateAbility(q.cards(enfeebledDagger, { zone: "field" })[0]!, "idpdon8f0h-a1", {
          targets: { "target-unit": [hero.objectId] },
        });
        passEffectsStack(game);
        if (hit < 20 - 5 * count) expect(game.state.objects[hero.objectId]!.zone).toBe("field");
      }
      expect(game.state.objects[hero.objectId]!.zone).not.toBe("field");
      expect(game.state.objects[foe.objectId]!.zone).toBe("field");
    });
});
