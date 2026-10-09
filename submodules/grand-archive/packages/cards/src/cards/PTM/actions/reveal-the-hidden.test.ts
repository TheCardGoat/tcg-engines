import { takeCover } from "../../ALC/actions/take-cover.ts";
import {
  GrandArchiveTestEngine,
  grandArchiveObjectActiveKeywords,
} from "@tcg/grand-archive-engine/testing";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceToMain,
  advanceCombatToTrigger,
  passEffectsStack,
} from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { cunningBroker } from "../../FTC/allies/cunning-broker.ts";
import { smokeBombs } from "../../DOA/items/smoke-bombs.ts";
import { reclaim } from "../../DOA/actions/reclaim.ts";
import { describe, expect, it } from "vitest";
import { revealTheHidden } from "./reveal-the-hidden.ts";
import { proveLevelOneDraw } from "../../../testing/level-one-draw.ts";
/** @covers rHccTUUWou-a2 */
describe("reveal-the-hidden — level-gated draw", () => proveLevelOneDraw(revealTheHidden, false));

/** @covers rHccTUUWou-a1 */
describe("Reveal the Hidden — stealth removal and locked targets", () => {
  for (const matching of [false, true])
    for (const ownTurn of [false, true]) {
      it(`removes both sides' stealth and prevents reacquisition, class=${matching}, own turn=${ownTurn}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(revealTheHidden, matching, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: ownTurn ? "playerOne" : "playerTwo",
          playerOne: {
            champion,
            zones: {
              field: [cunningBroker, woodlandSquirrels, smokeBombs, smokeBombs, smokeBombs],
              hand: [revealTheHidden, woodlandSquirrels, woodlandSquirrels],
              "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [cunningBroker, woodlandSquirrels],
              "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          attacker = ownTurn ? p : q,
          defender = ownTurn ? q : p;
        const hidden = defender.card(cunningBroker),
          attackerAlly = attacker.card(woodlandSquirrels, { zone: "field" });
        const stealth = (id: typeof hidden.objectId) =>
          grandArchiveObjectActiveKeywords(game.program, game.state, game.state.objects[id]!).some(
            (k) => k.name === "stealth",
          );
        expect(() => attacker.declareAttack(attackerAlly, hidden)).toThrow();
        if (!ownTurn) q.pass();
        p.activate(revealTheHidden, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        expect(stealth(hidden.objectId)).toBe(true);
        passEffectsStack(game);
        expect(stealth(p.card(cunningBroker).objectId)).toBe(false);
        expect(stealth(q.card(cunningBroker).objectId)).toBe(false);
        const plain = p.card(woodlandSquirrels, { zone: "field" });
        for (const target of [hidden, plain]) {
          if (!ownTurn) q.pass();
          const deck = p.zone("main-deck");
          p.activateAbility(p.cards(smokeBombs, { zone: "field" })[0]!, "ScGcOmkoQt-a1", {
            targets: { "target-1": [target.objectId] },
          });
          passEffectsStack(game);
          expect(stealth(target.objectId)).toBe(false);
          expect(p.zone("main-deck")).toEqual(deck.slice(1));
        }
        attacker.declareAttack(attackerAlly, hidden);
        advanceCombatToTrigger(game, "no-such-trigger");
        expect(game.state.objects[hidden.objectId]!.damage).toBe(1);
        advanceToMain(game, p.id, game.state.turn.number);
        expect(stealth(p.card(cunningBroker).objectId)).toBe(true);
        expect(stealth(q.card(cunningBroker).objectId)).toBe(true);
        p.activateAbility(p.cards(smokeBombs, { zone: "field" })[0]!, "ScGcOmkoQt-a1", {
          targets: { "target-1": [plain.objectId] },
        });
        passEffectsStack(game);
        expect(stealth(plain.objectId)).toBe(true);
      });
    }
  for (const reentry of [false, true])
    it(`excludes new field instances, reentry=${reentry}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(revealTheHidden, false, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [cunningBroker, smokeBombs],
            hand: [
              revealTheHidden,
              reclaim,
              cunningBroker,
              woodlandSquirrels,
              ...Array.from({ length: 8 }, () => woodlandSquirrels),
            ],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: { champion },
      });
      const p = game.player("player-one"),
        original = p.card(cunningBroker, { zone: "field" });
      const pay = (amount: number) =>
        p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, amount)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const stealth = (id: typeof original.objectId) =>
        grandArchiveObjectActiveKeywords(game.program, game.state, game.state.objects[id]!).some(
          (k) => k.name === "stealth",
        );
      p.activate(revealTheHidden, { reservePayment: pay(2) });
      passEffectsStack(game);
      expect(stealth(original.objectId)).toBe(false);
      if (reentry) {
        p.activate(reclaim, {
          targets: { "target-1": [original.objectId] },
          reservePayment: pay(2),
        });
        passEffectsStack(game);
      }
      const fresh = reentry ? original : p.cards(cunningBroker, { zone: "hand" })[0]!;
      p.activate(fresh, { reservePayment: pay(2) });
      passEffectsStack(game);
      expect(stealth(fresh.objectId)).toBe(true);
      const plain = p.cards(woodlandSquirrels, { zone: "hand" })[0]!;
      p.activate(plain);
      passEffectsStack(game);
      p.activateAbility(smokeBombs, "ScGcOmkoQt-a1", { targets: { "target-1": [plain.objectId] } });
      passEffectsStack(game);
      expect(stealth(plain.objectId)).toBe(true);
      if (!reentry) expect(stealth(original.objectId)).toBe(false);
    });
});

/** @covers rHccTUUWou-a1 */
describe("Reveal the Hidden — champion stealth", () => {
  for (const own of [false, true])
    it(`removes and blocks granted champion stealth, own=${own}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(revealTheHidden, false, "activation-discount"),
      );
      const setup = {
        champion,
        zones: {
          hand: [
            revealTheHidden,
            takeCover,
            takeCover,
            takeCover,
            ...Array.from({ length: 20 }, () => woodlandSquirrels),
          ],
          "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        },
      };
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: own ? "playerOne" : "playerTwo",
        playerOne: setup,
        playerTwo: setup,
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        owner = own ? p : q,
        hero = owner.card(champion);
      const stealth = () =>
        grandArchiveObjectActiveKeywords(
          game.program,
          game.state,
          game.state.objects[hero.objectId]!,
        ).some((k) => k.name === "stealth");
      const cover = () => {
        owner.activate(owner.cards(takeCover, { zone: "hand" })[0]!, {
          targets: { "target-1": [hero.objectId] },
          reservePayment: owner
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 5)
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
      };
      cover();
      expect(stealth()).toBe(true);
      if (!own) q.pass();
      p.activate(revealTheHidden, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((c) => ({ kind: "card", cardId: c.objectId })),
      });
      passEffectsStack(game);
      expect(stealth()).toBe(false);
      cover();
      expect(stealth()).toBe(false);
      expect(game.state.objects[hero.objectId]!.states.has("distant")).toBe(true);
      advanceToMain(game, owner.id, game.state.turn.number);
      cover();
      expect(stealth()).toBe(true);
    });
});
