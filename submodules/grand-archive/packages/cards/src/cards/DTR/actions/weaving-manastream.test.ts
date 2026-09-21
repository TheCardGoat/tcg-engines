import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { slateWhetstone } from "../../P24/items/slate-whetstone.ts";
import { tombSweep } from "../../P26/actions/tomb-sweep.ts";
import { trivariateDream } from "../weapons/trivariate-dream.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { createLineageTestChampion } from "../../../testing/champion-lineage.ts";
import {
  createClassBonusTestChampion,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { weavingManastream } from "./weaving-manastream.ts";

/** @covers wi4f59furp-a2 */
describe("Weaving Manastream — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: weavingManastream });
});

/** @covers wi4f59furp-a1 */
describe("Weaving Manastream — distant until the end of the own turn", () => {
  for (const matching of [false, true])
    for (const opposingTurn of [false, true])
      it(`class=${matching}, opposing turn=${opposingTurn}`, () => {
        const champion = createClassBonusTestChampion(
          weavingManastream,
          matching,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: opposingTurn ? "playerTwo" : "playerOne",
          playerOne: {
            champion,
            zones: {
              hand: [weavingManastream, woodlandSquirrels, woodlandSquirrels],
              field: [woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(champion);
        if (opposingTurn) q.pass();
        const payment = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const before = game.state;
        expect(() => p.activate(weavingManastream, { reservePayment: payment.slice(1) })).toThrow();
        expect(game.state).toEqual(before);
        p.activate(weavingManastream, { reservePayment: payment });
        expect(game.state.objects[hero.objectId]!.states.has("distant")).toBe(false);
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]!.states.has("distant")).toBe(true);
        expect(game.state.objects[q.card(champion).objectId]!.states.has("distant")).toBe(false);
        expect(
          game.state.objects[p.card(woodlandSquirrels, { zone: "field" }).objectId]!.states.has(
            "distant",
          ),
        ).toBe(false);
        if (!opposingTurn) advanceToMain(game, q.id);
        expect(game.state.objects[hero.objectId]!.states.has("distant")).toBe(opposingTurn);
        q.declareAttack(q.card(woodlandSquirrels, { zone: "field" }), hero);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[hero.objectId]!.damage).toBe(1);
        advanceToMain(game, p.id);
        expect(game.state.objects[hero.objectId]!.states.has("distant")).toBe(opposingTurn);
        advanceToMain(game, q.id);
        expect(game.state.objects[hero.objectId]!.states.has("distant")).toBe(false);
        expect(p.cards(weavingManastream, { zone: "graveyard" })).toHaveLength(1);
      });
});

/** @covers wi4f59furp-a3 */
describe("Weaving Manastream — conditional reload after graveyard memory payment", () => {
  for (const diana of [false, true])
    for (const water of [false, true])
      for (const accept of [false, true]) run(diana, water, accept, "floating", true);
  run(true, true, true, "floating", false);
  run(true, true, true, "memory", true);
  run(true, true, true, "ordinary", true);
  run(true, true, true, "self-ordinary", true);
  function run(
    diana: boolean,
    water: boolean,
    accept: boolean,
    paymentKind: "floating" | "memory" | "ordinary" | "self-ordinary",
    available: boolean,
  ) {
    it(`Diana=${diana}, water=${water}, accept=${accept}, payment=${paymentKind}, host=${available}`, () => {
      const base = createLineageTestChampion(weavingManastream, diana ? "Diana" : "Other");
      const champion = {
        ...base,
        layout: {
          kind: "single-faced" as const,
          face: {
            ...requireSingleFace(base),
            elements: water ? ["WATER" as const] : ["NORM" as const],
          },
        },
      };
      const game = GrandArchiveTestEngine.startFixture({
        phase: "materialize",
        playerOne: {
          champion,
          zones: {
            hand: [tombSweep, woodlandSquirrels, woodlandSquirrels],
            field: [trainingSword, ...(available ? [trivariateDream, trivariateDream] : [])],
            graveyard:
              paymentKind === "memory" ? [trivariateDream] : [weavingManastream, trivariateDream],
            memory:
              paymentKind === "memory"
                ? [weavingManastream]
                : paymentKind !== "floating"
                  ? [woodlandSquirrels]
                  : [],
            "material-deck": [slateWhetstone],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [trivariateDream],
            hand: [tombSweep, woodlandSquirrels, woodlandSquirrels],
            graveyard: [weavingManastream],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(weavingManastream);
      p.materialize(
        slateWhetstone,
        paymentKind === "floating" ? { floatingMemoryCardIds: [source.objectId] } : {},
      );
      if (paymentKind === "ordinary" || paymentKind === "self-ordinary") {
        const wait = game.waitState();
        const actor = paymentKind === "self-ordinary" ? p : q;
        if (wait.kind === "opportunity" && wait.playerId !== actor.id)
          game.player(wait.playerId).pass();
        actor.activate(tombSweep, {
          targets: { "target-card": [source.objectId] },
          reservePayment: actor
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
      }
      expect(game.state.objects[source.objectId]!.zone).toBe(
        paymentKind === "ordinary" || paymentKind === "self-ordinary" ? "graveyard" : "banishment",
      );
      passEffectsStack(game);
      const triggers = diana && water && paymentKind === "floating";
      if (triggers && available) {
        expect(game.state.decision).toMatchObject({
          kind: "resolve-optional-effect",
          playerId: p.id,
        });
        answerDecision(game, "resolve-optional-effect", accept);
        passEffectsStack(game);
        if (accept) {
          const snapshot = game.state;
          for (const invalid of [
            p.card(trainingSword).objectId,
            q.card(trivariateDream).objectId,
            p.card(trivariateDream, { zone: "graveyard" }).objectId,
            p.card(champion).objectId,
          ]) {
            expect(() => answerDecision(game, "resolve-effect-choice", [invalid])).toThrow();
            expect(game.state).toEqual(snapshot);
          }
          const host = p.cards(trivariateDream, { zone: "field" })[1]!;
          answerDecision(game, "resolve-effect-choice", [host.objectId]);
          passEffectsStack(game);
          expect(game.state.objects[source.objectId]!.hostId).toBe(host.objectId);
        }
      } else if (triggers && game.state.decision?.kind === "resolve-optional-effect") {
        const snapshot = game.state;
        expect(() => answerDecision(game, "resolve-optional-effect", true)).toThrow();
        expect(game.state).toEqual(snapshot);
        answerDecision(game, "resolve-optional-effect", false);
        passEffectsStack(game);
      }
      const loaded = triggers && available && accept;
      expect(game.state.decision).toBeNull();
      expect(game.state.objects[source.objectId]!.zone).toBe(loaded ? "loaded" : "banishment");
      expect(q.cards(weavingManastream, { zone: "graveyard" })).toHaveLength(1);
      advanceToMain(game, p.id);
      expect(p.cards(slateWhetstone, { zone: "field" })).toHaveLength(1);
      if (loaded) {
        const host = p.cards(trivariateDream, { zone: "field" })[1]!;
        p.declareAttack(p.card(champion), q.card(champion), { weaponIds: [host.objectId] });
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(2);
        expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
      }
    });
  }
});
