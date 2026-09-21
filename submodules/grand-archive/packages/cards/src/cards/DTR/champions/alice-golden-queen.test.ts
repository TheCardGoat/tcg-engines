import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { aliceGoldenQueen } from "./alice-golden-queen.ts";
import { skeweringAdvance } from "../attacks/skewering-advance.ts";
import { snowWhiteWeissQueen } from "../allies/snow-white-weiss-queen.ts";
import { spirelleSchwartzQueen } from "../allies/spirelle-schwartz-queen.ts";
import { enfeebledDagger } from "../items/enfeebled-dagger.ts";
import { chargedDirective } from "../../MRC/attacks/charged-directive.ts";
import { powercell } from "../../MRC/tokens/powercell.ts";
import { supplyDrone } from "../../ALC/allies/supply-drone.ts";
import { comboStrike } from "../../DOA/attacks/combo-strike.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { idleThoughts } from "../../DOA/actions/idle-thoughts.ts";
import { secondWind } from "../../DOA/actions/second-wind.ts";
import { sparkAlight } from "../../DOA/actions/spark-alight.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceToMain,
  answerDecision,
  declareResolvedAttack,
  passEffectsStack,
} from "../../../testing/decisions.ts";

/** @covers daip7s9ztd-a1 */
describe("Alice Golden Queen — inherited Chessman Command power", () => {
  for (const position of ["current", "buried", "material"] as const)
    for (const kind of ["chessman", "automaton", "ordinary"] as const)
      for (const opposing of [false, true]) {
        it(`${position}, ${kind}, opposing activation=${opposing}`, () => {
          const starter = lineageTestChampion("Alice", 0),
            successor = lineageTestChampion("Alice", 2),
            enemy = lineageTestChampion("Other", 0);
          const attack =
            kind === "chessman"
              ? skeweringAdvance
              : kind === "automaton"
                ? chargedDirective
                : comboStrike;
          const zones = {
            field: [enableAllTestElements(trainingSword), snowWhiteWeissQueen, supplyDrone],
            hand: [attack, woodlandSquirrels, woodlandSquirrels],
          };
          const game = GrandArchiveTestEngine.startFixture({
            definitions: [powercell],
            firstPlayer: opposing ? "playerTwo" : "playerOne",
            playerOne: {
              champion: starter,
              lineage:
                position === "material"
                  ? []
                  : [aliceGoldenQueen, ...(position === "buried" ? [successor] : [])],
              zones: {
                ...zones,
                "material-deck": position === "material" ? [aliceGoldenQueen] : [],
              },
            },
            playerTwo: { champion: enemy, zones },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            actor = opposing ? q : p,
            defender = opposing ? p.card(starter) : q.card(enemy);
          const attacker =
            kind === "chessman"
              ? actor.card(snowWhiteWeissQueen)
              : kind === "automaton"
                ? actor.card(supplyDrone)
                : actor.card(opposing ? enemy : starter);
          actor.activate(attack, {
            attackAttackerId: attacker.objectId,
            reservePayment: actor
              .cards(woodlandSquirrels)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          });
          passEffectsStack(game);
          declareResolvedAttack(
            game,
            attacker.objectId,
            defender.objectId,
            "resolve the Command or ordinary attack",
          );
          game.resolveCombatWithoutRetaliation();
          const base = kind === "automaton" ? 2 : 3;
          expect(game.state.objects[defender.objectId]!.damage).toBe(
            base + (!opposing && position !== "material" && kind === "chessman" ? 1 : 0),
          );
        });
      }
});

/** @covers daip7s9ztd-a2 */
describe("Alice Golden Queen — Lineage Release protects the awake Chessmen at resolution", () => {
  for (const scenario of [
    "awake",
    "rests-after",
    "rested-before",
    "wakes-after",
    "wakes-before-resolution",
    "expires",
    "unpreventable",
  ] as const) {
    it(scenario, () => {
      const starter = lineageTestChampion("Alice", 0),
        successor = lineageTestChampion("Alice", 2),
        enemy = lineageTestChampion("Other", 0);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion: starter,
          lineage: [aliceGoldenQueen, successor],
          zones: {
            field: [
              enableAllTestElements(trainingSword),
              spirelleSchwartzQueen,
              snowWhiteWeissQueen,
              giantTortoise,
            ],
            hand: [
              snowWhiteWeissQueen,
              secondWind,
              skeweringAdvance,
              ...Array.from({ length: 5 }, () => woodlandSquirrels),
            ],
            "material-deck": [aliceGoldenQueen],
            "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion: enemy,
          zones: {
            field: [
              enableAllTestElements(trainingSword),
              spirelleSchwartzQueen,
              ...Array.from({ length: 12 }, () => enfeebledDagger),
            ],
            hand: [
              sparkAlight,
              secondWind,
              woodlandSquirrels,
              woodlandSquirrels,
              woodlandSquirrels,
            ],
            "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(aliceGoldenQueen, { zone: "inner-lineage" }),
        target = p.card(spirelleSchwartzQueen);
      const opportunity = (actor: typeof p) => {
        const wait = game.waitState();
        if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
        if (wait.playerId !== actor.id) game.player(wait.playerId).pass();
      };
      if (
        scenario === "rested-before" ||
        scenario === "wakes-after" ||
        scenario === "wakes-before-resolution"
      ) {
        p.activate(skeweringAdvance, {
          attackAttackerId: target.objectId,
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 2)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
        });
        passEffectsStack(game);
        declareResolvedAttack(
          game,
          target.objectId,
          q.card(enemy).objectId,
          "rest the Chessman through a Command attack",
        );
        game.resolveCombatWithoutRetaliation();
      }
      const before = game.state;
      expect(() =>
        p.activateAbility(p.card(aliceGoldenQueen, { zone: "material-deck" }), "daip7s9ztd-a2"),
      ).toThrow();
      expect(game.state).toEqual(before);
      p.activateAbility(source, "daip7s9ztd-a2");
      expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
      if (scenario === "wakes-before-resolution") {
        opportunity(q);
        q.activate(secondWind, {
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 3)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          targets: { "target-1": [target.objectId] },
        });
      }
      passEffectsStack(game);
      expect(() => p.activateAbility(source, "daip7s9ztd-a2")).toThrow();
      if (scenario === "rests-after") {
        p.activate(skeweringAdvance, {
          attackAttackerId: target.objectId,
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 2)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
        });
        passEffectsStack(game);
        declareResolvedAttack(
          game,
          target.objectId,
          q.card(enemy).objectId,
          "rest the Chessman through a Command attack",
        );
        game.resolveCombatWithoutRetaliation();
      }
      if (scenario === "wakes-after") {
        p.activate(secondWind, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 3)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          targets: { "target-1": [target.objectId] },
        });
        passEffectsStack(game);
      }
      if (scenario === "expires") advanceToMain(game, q.id);
      if (scenario === "unpreventable") {
        opportunity(q);
        q.activate(sparkAlight, {
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 2)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          targets: { "target-1": [target.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.damage).toBe(2);
      }
      const protectedTarget =
        scenario === "awake" ||
        scenario === "rests-after" ||
        scenario === "unpreventable" ||
        scenario === "wakes-before-resolution";
      for (let hit = 1; hit <= 4; hit++) {
        opportunity(q);
        q.activateAbility(q.cards(enfeebledDagger, { zone: "field" })[0]!, "idpdon8f0h-a1", {
          targets: { "target-unit": [target.objectId] },
        });
        passEffectsStack(game);
        const damage =
          (scenario === "unpreventable" ? 2 : 0) + (protectedTarget ? Math.max(0, hit - 3) : hit);
        expect(game.state.objects[target.objectId]!.zone).toBe(damage >= 4 ? "graveyard" : "field");
        if (damage < 4) expect(game.state.objects[target.objectId]!.damage).toBe(damage);
      }
      if (scenario === "awake") {
        const hit = (id: typeof target.objectId) => {
          opportunity(q);
          q.activateAbility(q.cards(enfeebledDagger, { zone: "field" })[0]!, "idpdon8f0h-a1", {
            targets: { "target-unit": [id] },
          });
          passEffectsStack(game);
        };
        const second = p.card(snowWhiteWeissQueen, { zone: "field" });
        for (let n = 1; n <= 4; n++) {
          hit(second.objectId);
          expect(game.state.objects[second.objectId]!.zone).toBe(n === 4 ? "graveyard" : "field");
        }
        for (const excluded of [
          p.card(giantTortoise),
          q.card(spirelleSchwartzQueen),
          p.card(starter),
        ]) {
          hit(excluded.objectId);
          expect(game.state.objects[excluded.objectId]!.damage).toBe(1);
        }
        opportunity(p);
        const late = p.card(snowWhiteWeissQueen, { zone: "hand" });
        p.activate(late, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 3)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
        });
        passEffectsStack(game);
        answerDecision(game, "announce-triggered-ability", {
          targets: { "target-1": [q.card(enemy).objectId] },
        });
        passEffectsStack(game);
        hit(late.objectId);
        expect(game.state.objects[late.objectId]!.zone).toBe("graveyard");
      }
      expect(game.state.objects[p.card(starter).objectId]!.activeDefinitionId).toBe(
        successor.canonicalId,
      );
    });
  }
});

/** @covers daip7s9ztd-a2 */
it("cannot release the current champion, then releases after paid leveling even with no allies", () => {
  const starter = lineageTestChampion("Alice", 0),
    successor = lineageTestChampion("Alice", 2),
    enemy = lineageTestChampion("Other", 0);
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion: starter,
      lineage: [aliceGoldenQueen],
      zones: {
        "material-deck": [successor],
        graveyard: [idleThoughts, idleThoughts],
        "main-deck": [woodlandSquirrels, woodlandSquirrels],
      },
    },
    playerTwo: { champion: enemy, zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] } },
  });
  const p = game.player("player-one"),
    source = p.card(aliceGoldenQueen, { zone: "inner-lineage" });
  const before = game.state;
  expect(() => p.activateAbility(source, "daip7s9ztd-a2")).toThrow();
  expect(game.state).toEqual(before);
  for (let i = 0; i < 128; i++) {
    const wait = game.waitState();
    if (wait.kind === "materialization-choice") {
      if (wait.playerId === p.id) break;
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    } else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else throw new Error(`Unexpected ${wait.kind}`);
  }
  p.materialize(successor, { floatingMemoryCardIds: p.cards(idleThoughts).map((c) => c.objectId) });
  passEffectsStack(game);
  expect(p.cards(idleThoughts, { zone: "banishment" })).toHaveLength(2);
  expect(game.state.objects[p.card(starter).objectId]!.activeDefinitionId).toBe(
    successor.canonicalId,
  );
  p.activateAbility(source, "daip7s9ztd-a2");
  passEffectsStack(game);
  expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
  expect(game.state.decision).toBeNull();
  expect(game.state.stack).toHaveLength(0);
});
