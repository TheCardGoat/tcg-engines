import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { spellwardScepter } from "./spellward-scepter.ts";
import { enfeebledDagger } from "./enfeebled-dagger.ts";
import { unwelcomeFortune } from "../actions/unwelcome-fortune.ts";
import { backdash } from "../actions/backdash.ts";
import { annulSpell } from "../../P25/actions/annul-spell.ts";
import { frozenDismissal } from "../../ALC/actions/frozen-dismissal.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers f6lxizyuml-a2 */
describe("Spellward Scepter — next controlled card activation protection", () => {
  for (const intervening of ["none", "ability", "opponent", "expiry"] as const)
    it(`protects exactly the next card with ${intervening} intervening`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(spellwardScepter, false, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [spellwardScepter, enfeebledDagger],
            hand: [woodlandSquirrels, woodlandSquirrels],
            "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: {
            hand: [
              frozenDismissal,
              frozenDismissal,
              backdash,
              ...Array.from({ length: 7 }, () => woodlandSquirrels),
            ],
            "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const scepter = p.card(spellwardScepter, { zone: "field" });
      p.activateAbility(scepter, "f6lxizyuml-a2");
      expect(game.state.objects[scepter.objectId]!.zone).toBe("banishment");
      passEffectsStack(game);
      if (intervening === "ability") {
        p.activateAbility(enfeebledDagger, "idpdon8f0h-a1", {
          targets: { "target-unit": [q.card(champion).objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(1);
      }
      if (intervening === "opponent") {
        p.pass();
        q.activate(backdash, {
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 1)
            .map((c) => ({ kind: "card", cardId: c.objectId })),
          targets: { "target-1": [q.card(champion).objectId] },
        });
        passEffectsStack(game);
      }
      if (intervening === "expiry") advanceToMain(game, p.id, game.state.turn.number);
      const allies = p.cards(woodlandSquirrels, { zone: "hand" }).slice(0, 2);
      for (const [index, ally] of allies.entries()) {
        p.activate(ally);
        const activation = game.state.stack.at(-1);
        if (activation?.kind !== "card-activation") throw new Error("Expected ally activation");
        p.pass();
        q.activate(q.cards(frozenDismissal, { zone: "hand" })[0]!, {
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 3)
            .map((c) => ({ kind: "card", cardId: c.objectId })),
          targets: { "target-stack-item": [activation.id] },
        });
        passEffectsStack(game);
        if (game.state.decision?.kind === "resolve-effect-payment") {
          expect(game.state.decision.playerId).toBe(p.id);
          answerDecision(game, "resolve-effect-payment", false);
          passEffectsStack(game);
        }
        expect(game.state.objects[ally.objectId]!.zone).toBe(
          index === 0 && intervening !== "expiry" ? "field" : "banishment",
        );
      }
      expect(q.zone("memory")).toHaveLength(intervening === "opponent" ? 7 : 6);
    });

  for (const beforeResolution of [false, true])
    it(`protects a Spell only after the scepter resolves: before=${beforeResolution}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(spellwardScepter, false, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [spellwardScepter],
            hand: [unwelcomeFortune, woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: { hand: [annulSpell, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels] },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      p.activateAbility(spellwardScepter, "f6lxizyuml-a2");
      if (!beforeResolution) passEffectsStack(game);
      p.activate(unwelcomeFortune, {
        targets: { "target-player": [p.id] },
        reservePayment: p
          .cards(woodlandSquirrels)
          .map((c) => ({ kind: "card", cardId: c.objectId })),
      });
      const activation = game.state.stack.at(-1);
      if (activation?.kind !== "card-activation") throw new Error("Expected Spell activation");
      p.pass();
      q.activate(annulSpell, {
        targets: { "target-stack-item": [activation.id] },
        reservePayment: q
          .cards(woodlandSquirrels)
          .map((c) => ({ kind: "card", cardId: c.objectId })),
      });
      passEffectsStack(game);
      if (game.state.decision?.kind === "resolve-effect-payment") {
        answerDecision(game, "resolve-effect-payment", false);
        passEffectsStack(game);
      }
      expect(game.state.eventHistory.filter((e) => e.type === "cards-looked-at")).toHaveLength(
        beforeResolution ? 0 : 1,
      );
      expect(p.zone("memory")).toHaveLength(2);
      expect(q.zone("memory")).toHaveLength(3);
    });

  it("cannot pay its rest cost on the turn it materializes Hindered", () => {
    const champion = createClassBonusTestChampion(spellwardScepter, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      playerOne: {
        champion,
        zones: {
          "material-deck": [spellwardScepter],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const p = game.player("player-one");
    p.materialize(spellwardScepter);
    passEffectsStack(game);
    advanceToMain(game, p.id);
    const scepter = p.card(spellwardScepter, { zone: "field" });
    expect(game.state.objects[scepter.objectId]!.states.has("rested")).toBe(true);
    const before = game.state;
    expect(() => p.activateAbility(scepter, "f6lxizyuml-a2")).toThrow();
    expect(game.state).toEqual(before);
  });
});
