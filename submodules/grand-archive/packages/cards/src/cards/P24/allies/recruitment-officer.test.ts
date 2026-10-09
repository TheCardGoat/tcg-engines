import { describe, expect, it } from "vitest";
import { proveClassFoster } from "../../../testing/class-foster.ts";
import { recruitmentOfficer } from "./recruitment-officer.ts";
/** @covers 1x97n2jnlt-a1 */
describe("recruitment-officer — Class Bonus Foster", () => proveClassFoster(recruitmentOfficer));

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { organizeTheAlliance } from "../../ALC/actions/organize-the-alliance.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { glacialGuidance } from "../../DOA/actions/glacial-guidance.ts";

/** @covers 1x97n2jnlt-a2 */
describe("Recruitment Officer — choose an ally from the top five", () => {
  for (const matching of [false, true])
    for (const mode of ["choose", "decline", "no-ally", "short-deck"] as const)
      it(`class=${matching}, selection=${mode}`, () => {
        const champion = createClassBonusTestChampion(
          recruitmentOfficer,
          matching,
          "activation-discount",
        );
        const cards =
          mode === "no-ally"
            ? Array.from({ length: 7 }, () => glacialGuidance)
            : [
                giantTortoise,
                glacialGuidance,
                woodlandSquirrels,
                glacialGuidance,
                giantTortoise,
                woodlandSquirrels,
                glacialGuidance,
              ];
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            preserveMainDeckOrder: true,
            zones: {
              field: [recruitmentOfficer],
              hand: [
                organizeTheAlliance,
                giantTortoise,
                woodlandSquirrels,
                woodlandSquirrels,
                woodlandSquirrels,
              ],
              "main-deck": mode === "short-deck" ? cards.slice(0, 3) : cards,
            },
          },
          playerTwo: { champion, zones: { hand: [giantTortoise] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const deck = p.zone("main-deck").map((c) => c.objectId),
          looked = deck.slice(0, 5);
        const handAlly = p.card(giantTortoise, { zone: "hand" });
        p.activate(organizeTheAlliance, {
          targets: { "target-1": [p.card(recruitmentOfficer).objectId] },
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
        expect(
          game.state.objects[p.card(recruitmentOfficer).objectId]!.states.has("fostered"),
        ).toBe(true);
        const chosen = mode === "choose" || mode === "short-deck" ? [looked[0]!] : [];
        if (game.state.decision?.kind === "resolve-optional-effect") {
          answerDecision(game, "resolve-optional-effect", mode !== "decline");
          passEffectsStack(game);
        }
        const decision = game.state.decision;
        if (decision?.kind !== "resolve-effect-choice")
          throw new Error(`Expected ally selection, got ${decision?.kind}`);
        if (
          decision.selection.id === "chosen-card" ||
          decision.selection.id === "reveal-selection"
        ) {
          for (const invalid of [
            handAlly.objectId,
            q.card(giantTortoise).objectId,
            looked[1]!,
            ...(deck[5] ? [deck[5]] : []),
          ]) {
            const before = game.state;
            expect(() => answerDecision(game, "resolve-effect-choice", [invalid])).toThrow();
            expect(game.state).toEqual(before);
          }
          answerDecision(game, "resolve-effect-choice", chosen);
          passEffectsStack(game);
        } else expect(mode).toBe("no-ally");
        const remaining = looked.filter((id) => !chosen.includes(id)).reverse();
        expect(game.state.decision?.kind).toBe("resolve-effect-choice");
        const before = game.state;
        expect(() =>
          answerDecision(game, "resolve-effect-choice", [remaining[0]!, remaining[0]!]),
        ).toThrow();
        expect(game.state).toEqual(before);
        answerDecision(game, "resolve-effect-choice", remaining);
        passEffectsStack(game);
        expect(p.zone("hand").map((c) => c.objectId)).toEqual([handAlly.objectId, ...chosen]);
        expect(p.zone("main-deck").map((c) => c.objectId)).toEqual([
          ...deck.slice(5),
          ...remaining,
        ]);
        expect(
          game.state.eventHistory.filter((e) => e.type === "card-revealed").map((e) => e.objectId),
        ).toEqual(chosen);
        expect(q.zone("hand")).toHaveLength(1);
        expect(game.state.decision).toBeNull();
        expect(game.state.stack).toHaveLength(0);
      });
});
