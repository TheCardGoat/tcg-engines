import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { poisonousApple } from "./poisonous-apple.ts";
import { tomeOfIgnorance } from "./tome-of-ignorance.ts";
import { chillingTouch } from "../../DOA/actions/chilling-touch.ts";
import { enfeebledDagger } from "./enfeebled-dagger.ts";
import { evasivePositioning } from "../actions/evasive-positioning.ts";
import { unwelcomeFortune } from "../actions/unwelcome-fortune.ts";
import { tombSweep } from "../../P26/actions/tomb-sweep.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers ukurlcbgzi-a1 @covers ukurlcbgzi-a2 */
describe("Poisonous Apple — current controller's graveyard and unpreventable damage", () => {
  for (const giveAway of [false, true])
    for (const opposingActor of [false, true])
      for (const opposingGraveyard of [false, true])
        for (const floating of [false, true])
          it(`give away=${giveAway}, opposing actor=${opposingActor}, opposing graveyard=${opposingGraveyard}, floating=${floating}`, () => {
            const champion = createClassBonusTestChampion(
              poisonousApple,
              false,
              "activation-discount",
            );
            const graveCard = floating ? unwelcomeFortune : woodlandSquirrels;
            const game = GrandArchiveTestEngine.startFixture({
              phase: "materialize",
              playerOne: {
                champion,
                zones: {
                  "material-deck": [poisonousApple],
                  field: [enfeebledDagger],
                  graveyard: [graveCard],
                  hand: [
                    evasivePositioning,
                    tombSweep,
                    ...Array.from({ length: 4 }, () => woodlandSquirrels),
                  ],
                  "main-deck": [woodlandSquirrels, woodlandSquirrels],
                },
              },
              playerTwo: {
                champion,
                zones: {
                  graveyard: [graveCard],
                  hand: [tombSweep, woodlandSquirrels, woodlandSquirrels],
                },
              },
            });
            const p = game.player("player-one"),
              q = game.player("player-two");
            const controller = giveAway ? q : p,
              other = giveAway ? p : q;
            const actor = opposingActor ? other : controller;
            const graveyard = opposingGraveyard ? other : controller;
            const apple = p.card(poisonousApple, { zone: "material-deck" });
            p.materialize(apple);
            passEffectsStack(game);
            expect(game.state.decision).toMatchObject({
              kind: "resolve-effect-choice",
              playerId: p.id,
            });
            expect(game.state.objects[apple.objectId]!.controllerId).toBe(p.id);
            const before = game.state;
            expect(() =>
              answerDecision(game, "resolve-effect-choice", [p.card(champion).objectId]),
            ).toThrow();
            expect(game.state).toEqual(before);
            answerDecision(game, "resolve-effect-choice", [controller.id]);
            passEffectsStack(game);
            expect(game.state.objects[apple.objectId]).toMatchObject({
              zone: "field",
              ownerId: p.id,
              controllerId: controller.id,
            });
            advanceToMain(game, p.id);
            const hero = controller.card(champion),
              otherHero = other.card(champion);
            p.activate(evasivePositioning, {
              targets: { "target-1": [hero.objectId] },
              reservePayment: [
                { kind: "card", cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
              ],
            });
            passEffectsStack(game);
            if (actor.id === q.id) p.pass();
            const target = graveyard.card(graveCard, { zone: "graveyard" });
            actor.activate(tombSweep, {
              targets: { "target-card": [target.objectId] },
              reservePayment: actor
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, 2)
                .map((c) => ({ kind: "card", cardId: c.objectId })),
            });
            expect(game.state.objects[hero.objectId]!.damage).toBe(0);
            for (
              let step = 0;
              game.state.objects[target.objectId]!.zone === "graveyard" && step < 8;
              step++
            ) {
              const wait = game.waitState();
              if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
              game.player(wait.playerId).pass();
            }
            expect(game.state.objects[target.objectId]!.zone).toBe("banishment");
            const shouldTrigger = floating && !opposingGraveyard;
            expect(
              game.state.stack.filter(
                (item) => item.kind === "triggered-ability" && item.ability.id === "ukurlcbgzi-a2",
              ),
            ).toHaveLength(shouldTrigger ? 1 : 0);
            expect(game.state.objects[hero.objectId]!.damage).toBe(0);
            passEffectsStack(game);
            expect(game.state.objects[hero.objectId]!.damage).toBe(shouldTrigger ? 2 : 0);
            expect(game.state.objects[otherHero.objectId]!.damage).toBe(0);
            // The unpreventable hit leaves Evasive Positioning's shield available.
            p.activateAbility(enfeebledDagger, "idpdon8f0h-a1", {
              targets: { "target-unit": [hero.objectId] },
            });
            passEffectsStack(game);
            expect(game.state.objects[hero.objectId]!.damage).toBe(shouldTrigger ? 2 : 0);
          });
  it("does not trigger when Floating Memory is banished from memory", () => {
    const champion = enableAllTestElements(
      createClassBonusTestChampion(poisonousApple, false, "activation-discount"),
    );
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: {
          field: [poisonousApple],
          memory: [unwelcomeFortune],
          graveyard: [unwelcomeFortune],
        },
      },
      playerTwo: { champion, zones: { hand: [chillingTouch, woodlandSquirrels] } },
    });
    const p = game.player("player-one"),
      q = game.player("player-two");
    const memory = p.card(unwelcomeFortune, { zone: "memory" });
    q.activate(chillingTouch, {
      targets: { "target-opponent": [p.id] },
      reservePayment: [{ kind: "card", cardId: q.card(woodlandSquirrels).objectId }],
    });
    passEffectsStack(game);
    expect(game.state.objects[memory.objectId]!.zone).toBe("banishment");
    expect(p.cards(unwelcomeFortune, { zone: "graveyard" })).toHaveLength(1);
    expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(0);
    expect(game.state.stack).toHaveLength(0);
  });

  it("triggers when Floating Memory pays an actual materialization cost", () => {
    const champion = enableAllTestElements(
      createClassBonusTestChampion(poisonousApple, false, "activation-discount"),
    );
    const game = GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      playerOne: {
        champion,
        zones: {
          field: [poisonousApple],
          graveyard: [unwelcomeFortune],
          "material-deck": [tomeOfIgnorance],
        },
      },
      playerTwo: { champion },
    });
    const p = game.player("player-one"),
      q = game.player("player-two");
    const floating = p.card(unwelcomeFortune, { zone: "graveyard" });
    p.materialize(tomeOfIgnorance, { floatingMemoryCardIds: [floating.objectId] });
    expect(game.state.objects[floating.objectId]!.zone).toBe("banishment");
    expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(0);
    passEffectsStack(game);
    expect(p.cards(tomeOfIgnorance, { zone: "field" })).toHaveLength(1);
    expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(2);
    expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(0);
  });
});
