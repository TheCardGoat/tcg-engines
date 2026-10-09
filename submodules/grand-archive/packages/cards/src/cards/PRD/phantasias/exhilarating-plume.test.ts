import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { exhilaratingPlume } from "./exhilarating-plume.ts";

/** @covers A9c8tb7LKD-a1 */
describe("Exhilarating Plume — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: exhilaratingPlume, discount: 2 });
});

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { strappingConscript } from "../../DOA/allies/strapping-conscript.ts";
import { anointedPurifier } from "../allies/anointed-purifier.ts";
import { spectralHaunting } from "../../PTM/actions/spectral-haunting.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
function finishEntry(game: GrandArchiveTestEngine) {
  for (let i = 0; i < 24; i++) {
    passEffectsStack(game);
    const d = game.state.decision;
    if (d?.kind === "choose-replacement")
      answerDecision(game, "choose-replacement", d.candidateIds[0]);
    else if (game.state.stack.length === 0) return;
    else throw new Error(`Unexpected ${d?.kind}`);
  }
  throw new Error("Entry did not finish");
}
/** @covers A9c8tb7LKD-a2 */
describe("Exhilarating Plume — activated Human ally entry", () => {
  for (const matching of [false, true])
    for (const opposing of [false, true])
      for (const resurrect of [false, true])
        for (const kind of ["human", "other", "printed-counters"] as const)
          for (const zone of ["field", "two-on-field", "hand", "banishment"] as const)
            it(`class=${matching}, opposing=${opposing}, return=${resurrect}, kind=${kind}, source=${zone}`, () => {
              const champion = enableAllTestElements(
                createClassBonusTestChampion(exhilaratingPlume, matching, "activation-discount"),
              );
              const card =
                kind === "human"
                  ? strappingConscript
                  : kind === "other"
                    ? woodlandSquirrels
                    : anointedPurifier;
              const hand = [
                ...(resurrect ? [spectralHaunting] : [card]),
                ...Array.from({ length: 7 }, () => woodlandSquirrels),
              ];
              const game = GrandArchiveTestEngine.startFixture({
                firstPlayer: opposing ? "playerTwo" : "playerOne",
                playerOne: {
                  champion,
                  zones: {
                    field:
                      zone === "field"
                        ? [exhilaratingPlume]
                        : zone === "two-on-field"
                          ? [exhilaratingPlume, exhilaratingPlume]
                          : [],
                    hand: [
                      ...(!opposing ? hand : []),
                      ...(zone === "hand" ? [exhilaratingPlume] : []),
                    ],
                    graveyard: !opposing && resurrect ? [card] : [],
                    banishment: zone === "banishment" ? [exhilaratingPlume] : [],
                    "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
                  },
                },
                playerTwo: {
                  champion,
                  zones: {
                    hand: opposing ? hand : [],
                    graveyard: opposing && resurrect ? [card] : [],
                    "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
                  },
                },
              });
              const p = game.player("player-one"),
                q = game.player("player-two"),
                actor = opposing ? q : p,
                enemy = opposing ? p : q,
                source = actor.cards(card, { zone: resurrect ? "graveyard" : "hand" })[0]!;
              const face = grandArchiveTestFace(card);
              if (
                face.cost.kind !== "reserve" ||
                typeof face.cost.amount !== "number" ||
                typeof face.stats.power !== "number"
              )
                throw new Error("Expected fixed ally");
              const cost = resurrect ? 6 : face.cost.amount;
              actor.activate(resurrect ? spectralHaunting : source, {
                reservePayment: actor
                  .cards(woodlandSquirrels, { zone: "hand" })
                  .filter((c) => c.objectId !== source.objectId)
                  .slice(0, cost)
                  .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
                ...(resurrect ? { targets: { "target-ally-card": [source.objectId] } } : {}),
              });
              finishEntry(game);
              const counters =
                (kind === "printed-counters" ? 2 : 0) +
                (!opposing && !resurrect && kind !== "other"
                  ? zone === "field"
                    ? 1
                    : zone === "two-on-field"
                      ? 2
                      : 0
                  : 0);
              expect(game.state.objects[source.objectId]!.zone).toBe("field");
              expect(game.state.objects[source.objectId]!.counters.buff ?? 0).toBe(counters);
              advanceToMain(game, actor.id, game.state.turn.number);
              actor.declareAttack(source, enemy.card(champion));
              game.resolveCombatWithoutRetaliation();
              expect(game.state.objects[enemy.card(champion).objectId]!.damage).toBe(
                face.stats.power + counters,
              );
            });
});
