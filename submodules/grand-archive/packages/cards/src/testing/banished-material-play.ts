import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveCharacteristics } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import { baubleOfMending } from "../cards/DOA/items/bauble-of-mending.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "./decisions.ts";

export function proveBanishedMaterialPlay(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  abilityId: string,
  ascendant = false,
) {
  for (const matching of [false, true])
    for (const paid of [false, true])
      for (const accept of [false, true])
        it(`banishes only its selected non-champion and pays to play it: class=${matching}, paid=${paid}, accept=${accept}`, () => {
          const champion = createClassBonusTestChampion(card, matching, "activation-discount");
          const nextChampion = lineageTestChampion("Other", 1),
            material = paid ? baubleOfMending : trainingSword;
          const game = GrandArchiveTestEngine.startFixture({
            phase: "materialize",
            playerOne: {
              champion,
              zones: {
                "material-deck": [card, trainingSword, baubleOfMending, nextChampion],
                banishment: [material],
                hand: [material],
                memory: [woodlandSquirrels],
              },
            },
            playerTwo: { champion, zones: { "material-deck": [material] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = p.card(card),
            chosen = p.card(material, { zone: "material-deck" });
          const unrelated = p.card(material, { zone: "banishment" });
          const subtypes = () =>
            deriveGrandArchiveCharacteristics(game.state.objects[p.card(champion).objectId]!, {
              program: game.program,
              state: game.state,
              controllerId: p.id,
              bindings: {},
            }).subtypes;
          const originalSubtypes = subtypes();
          p.materialize(source);
          passEffectsStack(game);
          expect(game.state.decision).toMatchObject({
            kind: "resolve-effect-choice",
            playerId: p.id,
          });
          for (const ids of [
            [],
            [p.card(nextChampion).objectId],
            [q.card(material).objectId],
            [p.card(material, { zone: "hand" }).objectId],
            [unrelated.objectId],
            [chosen.objectId, chosen.objectId],
          ]) {
            const before = game.state;
            expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
            expect(game.state).toEqual(before);
          }
          answerDecision(game, "resolve-effect-choice", [chosen.objectId]);
          passEffectsStack(game);
          expect(game.state.objects[chosen.objectId]).toMatchObject({
            zone: "banishment",
            facing: "face-down",
            banishedBy: {
              sourceId: source.objectId,
              sourceIncarnation: game.state.objects[source.objectId]!.incarnation,
            },
          });
          const view = game.view(q.id).players.find((player) => player.id === p.id)!
            .zones.banishment;
          if (view.visibility !== "visible") throw new Error("Expected public banishment zone");
          expect(view.hiddenCount).toBe(1);
          expect(view.objects.some((object) => object.id === chosen.objectId)).toBe(false);
          const before = game.state;
          expect(() => p.materialize(chosen)).toThrow();
          expect(game.state).toEqual(before);
          p.activateAbility(source, abilityId);
          expect(p.zone("banishment")).toContainEqual(source);
          expect(subtypes()).toEqual(originalSubtypes);
          expect(game.state.objects[chosen.objectId]!.zone).toBe("banishment");
          passEffectsStack(game);
          expect(game.state.decision).toMatchObject({ kind: "resolve-optional-effect" });
          answerDecision(game, "resolve-optional-effect", accept);
          if (accept) {
            expect(game.state.decision).toMatchObject({
              kind: "announce-effect-materialization",
              playerId: p.id,
            });
            answerDecision(game, "announce-effect-materialization", {});
            expect(p.zone("memory")).toHaveLength(paid ? 0 : 1);
            expect(game.state.objects[chosen.objectId]!.zone).toBe("effects-stack");
            passEffectsStack(game);
            expect(p.zone("field")).toContainEqual(chosen);
          } else {
            passEffectsStack(game);
            expect(p.zone("memory")).toHaveLength(1);
            expect(game.state.objects[chosen.objectId]).toMatchObject({
              zone: "banishment",
              facing: "face-down",
            });
          }
          expect(subtypes()).toEqual(
            ascendant
              ? expect.arrayContaining([...originalSubtypes, "ASCENDANT"])
              : originalSubtypes,
          );
          expect(p.zone("banishment")).toContainEqual(unrelated);
          expect(q.card(material, { zone: "material-deck" })).toBeDefined();
        });
  for (const hasCard of [false, true]) {
    it(`finishes without an available play: selected card exists=${hasCard}`, () => {
      const champion = createClassBonusTestChampion(card, false, "activation-discount");
      const nextChampion = lineageTestChampion("Other", 1);
      const game = GrandArchiveTestEngine.startFixture({
        phase: "materialize",
        playerOne: {
          champion,
          zones: {
            "material-deck": [card, nextChampion, ...(hasCard ? [baubleOfMending] : [])],
            banishment: [trainingSword],
          },
        },
        playerTwo: { champion },
      });
      const p = game.player("player-one"),
        source = p.card(card);
      p.materialize(source);
      passEffectsStack(game);
      expect(game.state.decision).toBeNull();
      expect(p.card(nextChampion, { zone: "material-deck" })).toBeDefined();
      if (hasCard) expect(p.card(baubleOfMending, { zone: "banishment" })).toBeDefined();
      p.activateAbility(source, abilityId);
      passEffectsStack(game);
      if (game.state.decision?.kind === "resolve-optional-effect") {
        answerDecision(game, "resolve-optional-effect", true);
        passEffectsStack(game);
      }
      if (hasCard) {
        expect(game.state.decision).toMatchObject({
          kind: "announce-effect-materialization",
          mayDecline: true,
        });
        const before = game.state;
        expect(() => answerDecision(game, "announce-effect-materialization", {})).toThrow();
        expect(game.state).toEqual(before);
        expect(
          game
            .legalCommands(p.id)
            .some(({ command }) => command.move === "answer-decision" && command.answer === false),
        ).toBe(true);
        answerDecision(game, "announce-effect-materialization", false);
        passEffectsStack(game);
      }
      expect(game.state.decision).toBeNull();
      expect(game.state.stack).toHaveLength(0);
      expect(p.cards(trainingSword, { zone: "field" })).toHaveLength(0);
      expect(p.zone("memory")).toHaveLength(0);
      expect(p.zone("banishment")).toContainEqual(source);
      if (hasCard) expect(p.card(baubleOfMending, { zone: "banishment" })).toBeDefined();
      const subtypes = deriveGrandArchiveCharacteristics(
        game.state.objects[p.card(champion).objectId]!,
        { program: game.program, state: game.state, controllerId: p.id, bindings: {} },
      ).subtypes;
      expect(subtypes.includes("ASCENDANT")).toBe(ascendant);
    });
  }
}

import { invokeDominance } from "../cards/DOA/actions/invoke-dominance.ts";
import { enableAllTestElements } from "./class-bonus-test-champion.ts";

export function proveBanishedPreservedAction(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  abilityId: string,
) {
  for (const complete of [false, true]) {
    it(`plays a previously preserved action using reserve, or declines its declaration: complete=${complete}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(card, false, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [invokeDominance, woodlandSquirrels, woodlandSquirrels],
            "material-deck": [card, trainingSword],
            "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: { "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels) },
        },
      });
      const p = game.player("player-one"),
        action = p.card(invokeDominance),
        source = p.card(card);
      p.activate(action, {
        reservePayment: [
          { kind: "card", cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
        ],
      });
      passEffectsStack(game);
      expect(game.state.objects[action.objectId]!.zone).toBe("material-deck");
      expect(game.state.objects[action.objectId]!.states.has("preserved")).toBe(true);
      const turn = game.state.turn.number;
      let reached = false;
      for (let i = 0; i < 128; i++) {
        const wait = game.waitState();
        if (
          wait.kind === "materialization-choice" &&
          wait.playerId === p.id &&
          game.state.turn.number > turn
        ) {
          reached = true;
          break;
        }
        if (wait.kind === "materialization-choice")
          game.player(wait.playerId).execute({ move: "skip-materialization" });
        else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
        else throw new Error(`Unexpected ${wait.kind}`);
      }
      expect(reached).toBe(true);
      p.materialize(source);
      passEffectsStack(game);
      answerDecision(game, "resolve-effect-choice", [action.objectId]);
      passEffectsStack(game);
      expect(game.state.objects[action.objectId]).toMatchObject({
        zone: "banishment",
        facing: "face-down",
      });
      p.activateAbility(source, abilityId);
      passEffectsStack(game);
      answerDecision(game, "resolve-optional-effect", true);
      expect(game.state.decision).toMatchObject({
        kind: "announce-effect-activation",
        mayDecline: true,
      });
      const before = game.state;
      expect(() => answerDecision(game, "announce-effect-activation", {})).toThrow();
      expect(game.state).toEqual(before);
      const hand = p.zone("hand"),
        memory = p.zone("memory");
      if (complete) {
        answerDecision(game, "announce-effect-activation", {
          reservePayment: [
            { kind: "card", cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
          ],
        });
        expect(game.state.objects[action.objectId]!.zone).toBe("effects-stack");
        expect(p.zone("hand")).toHaveLength(hand.length - 1);
        expect(p.zone("memory")).toHaveLength(memory.length + 1);
        passEffectsStack(game);
        expect(game.state.objects[action.objectId]!.zone).toBe("material-deck");
        expect(game.state.objects[action.objectId]!.states.has("preserved")).toBe(true);
      } else {
        answerDecision(game, "announce-effect-activation", false);
        passEffectsStack(game);
        expect(game.state.objects[action.objectId]).toMatchObject({
          zone: "banishment",
          facing: "face-down",
        });
        expect(p.zone("hand")).toEqual(hand);
        expect(p.zone("memory")).toEqual(memory);
      }
      expect(p.zone("banishment")).toContainEqual(source);
      expect(game.state.decision).toBeNull();
    });
  }
}
