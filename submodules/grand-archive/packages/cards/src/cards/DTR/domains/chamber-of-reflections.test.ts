import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { chateauDeCoeurs } from "./chateau-de-coeurs.ts";
import { trainingSession } from "../../DOA/actions/training-session.ts";
import { chamberOfReflections } from "./chamber-of-reflections.ts";
import { palatialConcourse } from "../../ALC/domains/palatial-concourse.ts";
import { shatterfallKeep } from "../../ALC/domains/shatterfall-keep.ts";
import { theConstellatorySpire } from "../../ALC/domains/the-constellatory-spire.ts";
import { camelotImpenetrable } from "../../DOA/domains/camelot-impenetrable.ts";
import { varuckSmolderingSpire } from "../../DOA/domains/varuck-smoldering-spire.ts";
import { avalonCursedIsle } from "../../DOA/domains/avalon-cursed-isle.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
const basicDistortion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  ...chamberOfReflections,
  canonicalId: "basic-distortion-domain-fixture",
  slug: "basic-distortion-domain-fixture",
  layout: {
    kind: "single-faced",
    face: {
      ...requireSingleFace(chamberOfReflections),
      id: "basic-distortion-domain-fixture:face:default",
      catalogId: "basic-distortion-domain-fixture",
      elements: ["NORM"],
      abilities: [],
    },
  },
};

/** @covers pbtudivyzb-a2 */
describe("Chamber of Reflections - sacrifice, domain search, direct entry and shuffle", () => {
  for (const selected of [
    palatialConcourse,
    shatterfallKeep,
    camelotImpenetrable,
    varuckSmolderingSpire,
  ])
    for (const seed of [1, 2])
      for (const find of [false, true])
        it(`${selected.slug}, seed=${seed}, find=${find}`, () => {
          const champion = createClassBonusTestChampion(
            chamberOfReflections,
            false,
            "activation-discount",
          );
          const game = GrandArchiveTestEngine.startFixture({
            randomSeed: seed,
            playerOne: {
              champion,
              zones: {
                field: [chamberOfReflections],
                hand: [selected],
                graveyard: [selected],
                "main-deck": [
                  selected,
                  palatialConcourse,
                  woodlandSquirrels,
                  woodlandSquirrels,
                  avalonCursedIsle,
                  theConstellatorySpire,
                  basicDistortion,
                ],
              },
            },
            playerTwo: { champion, zones: { "main-deck": [selected, woodlandSquirrels] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = p.card(chamberOfReflections),
            chosen = p.cards(selected, { zone: "main-deck" })[0]!;
          const deck = p.zone("main-deck"),
            opposing = q.zone("main-deck"),
            hand = p.zone("hand");
          p.activateAbility(source, "pbtudivyzb-a2");
          expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
          expect(p.zone("main-deck")).toEqual(deck);
          const paid = game.state;
          expect(() => p.activateAbility(source, "pbtudivyzb-a2")).toThrow();
          expect(game.state).toEqual(paid);
          passEffectsStack(game);
          expect(game.state.decision?.kind).toBe("resolve-effect-choice");
          const pending = game.state;
          for (const ids of [
            [p.card(selected, { zone: "hand" }).objectId],
            [p.card(selected, { zone: "graveyard" }).objectId],
            [q.card(selected, { zone: "main-deck" }).objectId],
            [p.card(avalonCursedIsle, { zone: "main-deck" }).objectId],
            [p.card(theConstellatorySpire, { zone: "main-deck" }).objectId],
            [p.card(basicDistortion, { zone: "main-deck" }).objectId],
            [p.cards(woodlandSquirrels, { zone: "main-deck" })[0]!.objectId],
            [chosen.objectId, chosen.objectId],
          ]) {
            expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
            expect(game.state).toEqual(pending);
          }
          answerDecision(game, "resolve-effect-choice", find ? [chosen.objectId] : []);
          passEffectsStack(game);
          expect(game.state.objects[chosen.objectId]!.zone).toBe(find ? "field" : "main-deck");
          expect(p.zone("hand")).toEqual(hand);
          expect(p.zone("memory")).toHaveLength(0);
          expect(q.zone("main-deck")).toEqual(opposing);
          expect(p.zone("main-deck").map((c) => c.objectId)).not.toEqual(
            deck.filter((c) => !find || c.objectId !== chosen.objectId).map((c) => c.objectId),
          );
          expect(
            p
              .zone("main-deck")
              .map((c) => c.objectId)
              .sort(),
          ).toEqual(
            deck
              .filter((c) => !find || c.objectId !== chosen.objectId)
              .map((c) => c.objectId)
              .sort(),
          );
          expect(game.state.decision).toBeFalsy();
          expect(game.state.stack).toHaveLength(0);
        });

  it("cannot rest an already rested Chamber, but can sacrifice it after the next wake phase", () => {
    const champion = createClassBonusTestChampion(
      chamberOfReflections,
      false,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [chamberOfReflections, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
        },
      },
      playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] } },
    });
    const p = game.player("player-one"),
      source = p.card(chamberOfReflections);
    p.activate(source, {
      reservePayment: p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
    });
    passEffectsStack(game);
    expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
    const before = game.state;
    expect(() => p.activateAbility(source, "pbtudivyzb-a2")).toThrow();
    expect(game.state).toEqual(before);
    advanceToMain(game, p.id, game.state.turn.number);
    expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(false);
    p.activateAbility(source, "pbtudivyzb-a2");
    passEffectsStack(game);
    if (game.state.decision?.kind === "resolve-effect-choice")
      answerDecision(game, "resolve-effect-choice", []);
    passEffectsStack(game);
    expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
    expect(game.state.decision).toBeFalsy();
    expect(game.state.stack).toHaveLength(0);
  });
  it("puts the found domain directly onto the field and resolves its real entry trigger", () => {
    const champion = createClassBonusTestChampion(
      chamberOfReflections,
      false,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: {
          field: [chamberOfReflections],
          "main-deck": [
            chateauDeCoeurs,
            chateauDeCoeurs,
            chateauDeCoeurs,
            woodlandSquirrels,
            woodlandSquirrels,
            woodlandSquirrels,
          ],
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: [woodlandSquirrels],
          hand: [trainingSession, woodlandSquirrels, woodlandSquirrels],
        },
      },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      ally = q.card(woodlandSquirrels, { zone: "field" });
    q.activate(trainingSession, {
      targets: { "target-1": [ally.objectId] },
      reservePayment: q
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
    });
    passEffectsStack(game);
    advanceToMain(game, p.id);
    expect(game.state.objects[ally.objectId]!.counters.buff).toBe(1);
    const chosen = p.cards(chateauDeCoeurs, { zone: "main-deck" })[0]!,
      memory = p.zone("memory"),
      hand = p.zone("hand");
    p.activateAbility(chamberOfReflections, "pbtudivyzb-a2");
    passEffectsStack(game);
    answerDecision(game, "resolve-effect-choice", [chosen.objectId]);
    expect(game.state.objects[chosen.objectId]!.zone).toBe("field");
    expect(game.state.objects[ally.objectId]!.counters.buff).toBe(1);
    passEffectsStack(game);
    expect(game.state.objects[ally.objectId]!.counters.buff ?? 0).toBe(0);
    expect(p.zone("memory")).toEqual(memory);
    expect(p.zone("hand")).toEqual(hand);
  });
});
