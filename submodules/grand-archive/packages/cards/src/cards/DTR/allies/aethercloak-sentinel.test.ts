import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { aethercloakSentinel } from "./aethercloak-sentinel.ts";
import { resonantAether } from "../actions/resonant-aether.ts";
import { balefulOblation } from "../actions/baleful-oblation.ts";
import { backdash } from "../actions/backdash.ts";
import { trivariateDream } from "../weapons/trivariate-dream.ts";
import { radiantVega } from "../weapons/radiant-vega.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { sparkAlight } from "../../DOA/actions/spark-alight.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceToMain,
  answerDecision,
  currentDecision,
  passEffectsStack,
} from "../../../testing/decisions.ts";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";

/** @covers 1mvv1f83ls-a1 */
describe("Aethercloak Sentinel - grouped Ranged, Spellshroud and Taunt", () => {
  proveRangedAlly({ card: aethercloakSentinel, power: 1, ranged: 4, classBonus: false });
  for (const rested of [false, true])
    it(`blocks spells from either player, allows skills, and requires attacks only while awake=${!rested}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(aethercloakSentinel, false, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [aethercloakSentinel, woodlandSquirrels],
            hand: [sparkAlight, backdash, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [giantTortoise, woodlandSquirrels],
            hand: [sparkAlight, woodlandSquirrels, woodlandSquirrels],
            "main-deck": [woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(aethercloakSentinel);
      const before = game.state;
      expect(() =>
        p.activate(sparkAlight, {
          targets: { "target-1": [source.objectId] },
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 2)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      p.activate(backdash, {
        targets: { "target-1": [source.objectId] },
        reservePayment: [
          { kind: "card", cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
        ],
      });
      passEffectsStack(game);
      expect(game.state.objects[source.objectId]!.states.has("distant")).toBe(true);
      if (rested) {
        p.declareAttack(source, q.card(champion));
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(5);
      }
      advanceToMain(game, q.id);
      const pending = game.state;
      expect(() =>
        q.activate(sparkAlight, {
          targets: { "target-1": [source.objectId] },
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 2)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
        }),
      ).toThrow();
      expect(game.state).toEqual(pending);
      if (!rested) {
        for (const target of [p.card(champion), p.card(woodlandSquirrels, { zone: "field" })]) {
          expect(() => q.declareAttack(q.card(giantTortoise), target)).toThrow();
          expect(game.state).toEqual(pending);
        }
        q.declareAttack(q.card(giantTortoise), source);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[source.objectId]!.damage).toBe(1);
      } else {
        q.declareAttack(q.card(giantTortoise), p.card(champion));
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(1);
      }
    });
});

function championFor(kind: "Guardian" | "Ranger" | "Spirit") {
  return enableAllTestElements(
    createClassBonusTestChampion(
      kind === "Guardian" ? balefulOblation : resonantAether,
      kind !== "Spirit",
      "activation-discount",
    ),
  );
}

/** @covers 1mvv1f83ls-a2 */
describe("Aethercloak Sentinel - optional class loading and hand-only draw", () => {
  for (const kind of ["Guardian", "Ranger", "Spirit"] as const)
    for (const zone of ["hand", "graveyard"] as const)
      for (const accept of [false, true])
        it(`${kind}, from ${zone}, accept=${accept}`, () => {
          const champion = championFor(kind);
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  aethercloakSentinel,
                  resonantAether,
                  woodlandSquirrels,
                  woodlandSquirrels,
                  woodlandSquirrels,
                ],
                graveyard: [resonantAether, woodlandSquirrels],
                memory: [resonantAether],
                banishment: [resonantAether],
                field: [trivariateDream, radiantVega, trainingSword],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: { graveyard: [resonantAether], field: [trivariateDream] },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = p.card(aethercloakSentinel),
            charge = p.card(resonantAether, { zone }),
            weapon = p.card(trivariateDream),
            top = p.zone("main-deck")[0]!;
          const payment = p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 2)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          const before = game.state;
          expect(() => p.activate(source, { reservePayment: payment.slice(0, 1) })).toThrow();
          expect(game.state).toEqual(before);
          p.activate(source, { reservePayment: payment });
          expect(game.state.objects[charge.objectId]!.zone).toBe(zone);
          passEffectsStack(game);
          expect(game.state.objects[source.objectId]!.zone).toBe("field");
          const enabled = kind !== "Spirit";
          if (enabled) {
            expect(game.state.decision?.kind).toBe("resolve-optional-effect");
            answerDecision(game, "resolve-optional-effect", accept);
            passEffectsStack(game);
            if (accept) {
              const pending = game.state;
              for (const ids of [
                [],
                [q.card(resonantAether).objectId],
                [p.card(resonantAether, { zone: "memory" }).objectId],
                [p.card(resonantAether, { zone: "banishment" }).objectId],
                [p.card(woodlandSquirrels, { zone: "graveyard" }).objectId],
                [charge.objectId, charge.objectId],
              ]) {
                expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
                expect(game.state).toEqual(pending);
              }
              answerDecision(game, "resolve-effect-choice", [charge.objectId]);
              const hostChoice = game.state;
              for (const ids of [
                [],
                [q.card(trivariateDream).objectId],
                [p.card(trainingSword).objectId],
                [source.objectId],
                [weapon.objectId, p.card(radiantVega).objectId],
              ]) {
                expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
                expect(game.state).toEqual(hostChoice);
              }
              expect(game.state.objects[top.objectId]!.zone).toBe("main-deck");
              answerDecision(game, "resolve-effect-choice", [weapon.objectId]);
              passEffectsStack(game);
              expect(game.state.objects[charge.objectId]!.zone).toBe("loaded");
              expect(game.state.objects[charge.objectId]!.hostId).toBe(weapon.objectId);
            }
          }
          const loaded = enabled && accept;
          expect(p.zone("main-deck")).toHaveLength(loaded && zone === "hand" ? 1 : 2);
          expect(game.state.objects[top.objectId]!.zone).toBe(
            loaded && zone === "hand" ? "hand" : "main-deck",
          );
          if (!loaded) expect(game.state.objects[charge.objectId]!.zone).toBe(zone);
          expect(game.state.decision).toBeFalsy();
          expect(game.state.stack).toHaveLength(0);
          if (loaded) {
            p.declareAttack(p.card(champion), q.card(champion), { weaponIds: [weapon.objectId] });
            expect(game.state.objects[charge.objectId]!.zone).toBe("intent");
            game.resolveCombatWithoutRetaliation();
            expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(2);
            expect(game.state.objects[charge.objectId]!.zone).toBe("graveyard");
          }
        });
  for (const missing of ["charge", "host", "both"] as const)
    it(`finishes without a draw or load when missing ${missing}`, () => {
      const champion = championFor("Ranger");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [aethercloakSentinel, woodlandSquirrels, woodlandSquirrels],
            graveyard: missing === "host" ? [resonantAether] : [],
            field: [trainingSword, ...(missing === "charge" ? [trivariateDream] : [])],
            "main-deck": [woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { field: [trivariateDream], graveyard: [resonantAether] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      p.activate(aethercloakSentinel, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
      });
      passEffectsStack(game);
      if (game.state.decision?.kind === "resolve-optional-effect") {
        answerDecision(game, "resolve-optional-effect", true);
        passEffectsStack(game);
        if (currentDecision(game)?.kind === "resolve-effect-choice") {
          answerDecision(game, "resolve-effect-choice", [
            p.card(resonantAether, { zone: "graveyard" }).objectId,
          ]);
          passEffectsStack(game);
        }
      }
      expect(game.state.decision).toBeFalsy();
      expect(game.state.stack).toHaveLength(0);
      expect(p.zone("main-deck")).toHaveLength(1);
      expect(p.cards(aethercloakSentinel, { zone: "field" })).toHaveLength(1);
      expect(p.zone("loaded")).toHaveLength(0);
      expect(q.card(resonantAether, { zone: "graveyard" })).toBeDefined();
    });
});
