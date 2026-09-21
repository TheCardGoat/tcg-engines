import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { spiritsBlessing } from "../../DOA/actions/spirits-blessing.ts";
import { devouringMalice } from "./devouring-malice.ts";
import { enfeebledDagger } from "./enfeebled-dagger.ts";
import { evasivePositioning } from "../actions/evasive-positioning.ts";
import { aethercloakSentinel } from "../allies/aethercloak-sentinel.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 1keruycrwi-a1 */
describe("Devouring Malice — X memory and entry gem counters", () => {
  for (const x of [0, 1, 4])
    it(`pays ${x} memory and enters with exactly ${x} gems`, () => {
      const champion = createClassBonusTestChampion(devouringMalice, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        phase: "materialize",
        playerOne: {
          champion,
          zones: {
            "material-deck": [devouringMalice],
            memory: Array.from({ length: x }, () => woodlandSquirrels),
          },
        },
        playerTwo: { champion },
      });
      const p = game.player("player-one"),
        source = p.card(devouringMalice, { zone: "material-deck" });
      const before = game.state;
      expect(() => p.materialize(source, { variables: { X: x + 1 } })).toThrow();
      expect(game.state).toEqual(before);
      p.materialize(source, { variables: { X: x } });
      expect(p.zone("memory")).toHaveLength(0);
      expect(p.zone("banishment")).toHaveLength(x);
      expect(game.state.objects[source.objectId]!.zone).toBe("effects-stack");
      expect(game.state.objects[source.objectId]!.counters["named:gem"] ?? 0).toBe(0);
      passEffectsStack(game);
      expect(game.state.objects[source.objectId]!.zone).toBe("field");
      expect(game.state.objects[source.objectId]!.counters["named:gem"] ?? 0).toBe(x);
      if (x === 0) {
        const empty = game.state;
        expect(() => p.activateAbility(source, "1keruycrwi-a2", { modeIds: ["mode-3"] })).toThrow();
        expect(game.state).toEqual(empty);
      }
    });
});

/** @covers 1keruycrwi-a2 */
describe("Devouring Malice — three distinct Spell modes", () => {
  for (const ownTarget of [false, true])
    it(`resolves all three modes once with own targets=${ownTarget}`, () => {
      const champion = createClassBonusTestChampion(devouringMalice, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        phase: "materialize",
        playerOne: {
          champion,
          zones: {
            "material-deck": [devouringMalice],
            memory: Array.from({ length: 4 }, () => woodlandSquirrels),
            field: [giantTortoise, enfeebledDagger],
            hand: [evasivePositioning, woodlandSquirrels],
            "main-deck": Array.from({ length: 12 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [giantTortoise, aethercloakSentinel],
            "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        hero = p.card(champion);
      p.materialize(devouringMalice, { variables: { X: 4 } });
      passEffectsStack(game);
      advanceToMain(game, p.id);
      const source = p.card(devouringMalice, { zone: "field" });
      p.activate(evasivePositioning, {
        targets: { "target-1": [hero.objectId] },
        reservePayment: [
          { kind: "card", cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
        ],
      });
      passEffectsStack(game);
      const hand = p.zone("hand").length;
      p.activateAbility(source, "1keruycrwi-a2", { modeIds: ["mode-3"] });
      expect(game.state.objects[source.objectId]!.counters["named:gem"]).toBe(3);
      expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
      expect(game.state.objects[hero.objectId]!.damage).toBe(0);
      expect(p.zone("hand")).toHaveLength(hand);
      passEffectsStack(game);
      expect(game.state.objects[hero.objectId]!.damage).toBe(8);
      expect(p.zone("hand")).toHaveLength(hand + 2);
      p.activateAbility(enfeebledDagger, "idpdon8f0h-a1", {
        targets: { "target-unit": [hero.objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[hero.objectId]!.damage).toBe(8);
      const target = (ownTarget ? p : q).card(champion),
        ally = (ownTarget ? p : q).card(giantTortoise);
      const rested = game.state;
      expect(() =>
        p.activateAbility(source, "1keruycrwi-a2", {
          modeIds: ["mode-2"],
          targets: { "target-1": [target.objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(rested);
      advanceToMain(game, q.id);
      advanceToMain(game, p.id);
      const awake = game.state;
      expect(() => p.activateAbility(source, "1keruycrwi-a2", { modeIds: ["mode-3"] })).toThrow();
      expect(game.state).toEqual(awake);
      expect(() =>
        p.activateAbility(source, "1keruycrwi-a2", {
          modeIds: ["mode-2"],
          targets: { "target-1": [ally.objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(awake);
      p.activateAbility(source, "1keruycrwi-a2", {
        modeIds: ["mode-2"],
        targets: { "target-1": [target.objectId] },
      });
      expect(game.state.objects[source.objectId]!.counters["named:gem"]).toBe(2);
      passEffectsStack(game);
      expect(game.state.objects[hero.objectId]!.damage).toBe(ownTarget ? 8 : 5);
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(ownTarget ? 0 : 3);
      advanceToMain(game, q.id);
      advanceToMain(game, p.id);
      const pending = game.state;
      for (const invalid of [hero, source, q.card(aethercloakSentinel)]) {
        expect(() =>
          p.activateAbility(source, "1keruycrwi-a2", {
            modeIds: ["mode-1"],
            targets: { "target-1": [invalid.objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(pending);
      }
      p.activateAbility(source, "1keruycrwi-a2", {
        modeIds: ["mode-1"],
        targets: { "target-1": [ally.objectId] },
      });
      expect(game.state.objects[source.objectId]!.counters["named:gem"]).toBe(1);
      expect(game.state.objects[ally.objectId]!.counters.debuff ?? 0).toBe(0);
      passEffectsStack(game);
      expect(game.state.objects[ally.objectId]!.counters.debuff).toBe(3);
      expect(
        deriveGrandArchiveNumericProperty(game.state.objects[ally.objectId]!, "life", {
          program: game.program,
          state: game.state,
          controllerId: p.id,
          bindings: {},
        }),
      ).toBe(3);
      advanceToMain(game, q.id);
      advanceToMain(game, p.id);
      const exhausted = game.state;
      for (const mode of ["mode-1", "mode-2", "mode-3"]) {
        expect(() =>
          p.activateAbility(source, "1keruycrwi-a2", {
            modeIds: [mode],
            targets:
              mode === "mode-3"
                ? {}
                : { "target-1": [mode === "mode-1" ? ally.objectId : target.objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(exhausted);
      }
    });
  for (const damage of [0, 1])
    it(`caps recovery at the controller's ${damage} existing damage`, () => {
      const champion = createClassBonusTestChampion(devouringMalice, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        phase: "materialize",
        playerOne: {
          champion,
          zones: {
            "material-deck": [devouringMalice],
            memory: [woodlandSquirrels],
            field: [enfeebledDagger],
            "main-deck": [woodlandSquirrels],
          },
        },
        playerTwo: { champion },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        hero = p.card(champion),
        target = q.card(champion);
      p.materialize(devouringMalice, { variables: { X: 1 } });
      passEffectsStack(game);
      advanceToMain(game, p.id);
      if (damage) {
        p.activateAbility(enfeebledDagger, "idpdon8f0h-a1", {
          targets: { "target-unit": [hero.objectId] },
        });
        passEffectsStack(game);
      }
      expect(game.state.objects[hero.objectId]!.damage).toBe(damage);
      p.activateAbility(devouringMalice, "1keruycrwi-a2", {
        modeIds: ["mode-2"],
        targets: { "target-1": [target.objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[hero.objectId]!.damage).toBe(0);
      expect(game.state.objects[target.objectId]!.damage).toBe(3);
      expect(game.state.objects[p.card(devouringMalice).objectId]!.counters["named:gem"] ?? 0).toBe(
        0,
      );
    });

  it("uses a new X and resets chosen modes when the card leaves and is materialized again", () => {
    const champion = enableAllTestElements(
      createClassBonusTestChampion(devouringMalice, false, "activation-discount"),
    );
    const game = GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      playerOne: {
        champion,
        zones: {
          "material-deck": [devouringMalice],
          memory: [woodlandSquirrels],
          hand: [spiritsBlessing, evasivePositioning, woodlandSquirrels, woodlandSquirrels],
          "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion,
        zones: { "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels) },
      },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      target = q.card(champion);
    p.materialize(devouringMalice, { variables: { X: 1 } });
    passEffectsStack(game);
    advanceToMain(game, p.id);
    const source = p.card(devouringMalice);
    p.activateAbility(source, "1keruycrwi-a2", {
      modeIds: ["mode-2"],
      targets: { "target-1": [target.objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[target.objectId]!.damage).toBe(3);
    p.activate(evasivePositioning, {
      targets: { "target-1": [p.card(champion).objectId] },
      reservePayment: [
        { kind: "card", cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
      ],
    });
    passEffectsStack(game);
    p.activate(spiritsBlessing, {
      costSelections: [[source.objectId]],
      reservePayment: [
        { kind: "card", cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
      ],
    });
    passEffectsStack(game);
    expect(game.state.objects[source.objectId]!.zone).toBe("material-deck");
    for (let step = 0; step < 96; step++) {
      const wait = game.waitState();
      if (wait.kind === "materialization-choice" && game.state.turn.playerId === p.id) break;
      if (wait.kind === "materialization-choice")
        game.player(wait.playerId).execute({ move: "skip-materialization" });
      else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
      else throw new Error(`Unexpected ${wait.kind}`);
    }
    p.materialize(source, { variables: { X: 2 } });
    passEffectsStack(game);
    expect(game.state.objects[source.objectId]!.counters["named:gem"]).toBe(2);
    p.activateAbility(source, "1keruycrwi-a2", {
      modeIds: ["mode-2"],
      targets: { "target-1": [target.objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[target.objectId]!.damage).toBe(6);
    expect(game.state.objects[source.objectId]!.counters["named:gem"]).toBe(1);
  });
});
