import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import type { GrandArchivePantheonPlayerSetup } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import { lesserBoonOfApollo } from "../cards/PP1/boons/lesser-boon-of-apollo.ts";
import { greaterBoonOfHorses } from "../cards/PP1/boons/greater-boon-of-horses.ts";
import { pantheonBarrier } from "../cards/PP1/tokens/pantheon-barrier.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";
type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
export function proveOpponentCountDiscount(card: Card, alliesOnly: boolean) {
  const face = grandArchiveTestFace(card);
  if (face.cost.kind !== "reserve" || typeof face.cost.amount !== "number")
    throw new Error("Expected a fixed reserve cost");
  const cost = face.cost.amount;
  const attack = face.typeLine.types.includes("ATTACK");
  const discount = alliesOnly ? 3 : 2;
  function activate(game: GrandArchiveTestEngine, expected: number, champion: Card) {
    const p = game.player("player-one");
    const source = p.cards(card, { zone: "hand" })[0]!;
    const payment = p
      .zone("hand")
      .filter((c) => c.objectId !== source.objectId)
      .slice(0, expected)
      .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
    expect(payment).toHaveLength(expected);
    const options = attack
      ? { attackAttackerId: p.card(champion, { zone: "field" }).objectId }
      : {};
    const before = game.state;
    if (expected > 0) {
      expect(() => p.activate(source, { ...options, reservePayment: payment.slice(1) })).toThrow();
      expect(game.state).toEqual(before);
    }
    const memory = p.zone("memory").length;
    p.activate(source, { ...options, reservePayment: payment });
    expect(p.zone("memory")).toHaveLength(memory + expected);
    expect(p.cards(card, { zone: "hand" }).some((c) => c.objectId === source.objectId)).toBe(false);
    expect(game.state.stack).toHaveLength(1);
  }
  for (const matching of [false, true])
    for (const count of [0, 1, 2, 3, 4])
      it(`uses opposing field ${alliesOnly ? "allies" : "units"}: allies=${count}, class=${matching}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(card, matching, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [card, ...Array.from({ length: cost }, () => woodlandSquirrels)],
              field: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels, trainingSword],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [trainingSword, ...Array.from({ length: count }, () => woodlandSquirrels)],
              graveyard: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              hand: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        activate(
          game,
          matching && count + (alliesOnly ? 0 : 1) >= 3 ? cost - discount : cost,
          champion,
        );
      });
  for (const matching of [false, true])
    for (const counts of [
      [1, 1],
      [2, 2],
      [3, 0],
      [0, 3],
    ])
      it(`one opponent must meet the threshold: ${counts}, class=${matching}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(card, matching, "activation-discount"),
        );
        const setup = (id: string): GrandArchivePantheonPlayerSetup => ({
          id,
          name: id,
          startingChampionDefinitionId: champion.canonicalId,
          mainDeck: [
            {
              definitionId: id === "player-one" ? card.canonicalId : woodlandSquirrels.canonicalId,
              count: 40,
            },
          ],
          materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
          pantheon: {
            lesserBoonDefinitionId: lesserBoonOfApollo.canonicalId,
            greaterBoonDefinitionId: greaterBoonOfHorses.canonicalId,
            barrierDefinitionId: pantheonBarrier.canonicalId,
          },
        });
        const game = GrandArchiveTestEngine.start(
          [
            champion,
            card,
            woodlandSquirrels,
            lesserBoonOfApollo,
            greaterBoonOfHorses,
            pantheonBarrier,
          ],
          {
            mode: "pantheon",
            firstPlayerId: "player-one",
            randomSeed: 43,
            players: [setup("player-one"), setup("player-two"), setup("player-three")],
          },
          { validateDeckConstruction: false, skipPregameForTests: true },
        );
        const p = game.player("player-one");
        for (let turn = 0; turn < 4; turn++) advanceToMain(game, p.id, game.state.turn.number);
        for (const [i, id] of ["player-two", "player-three"].entries()) {
          const opponent = game.player(id);
          advanceToMain(game, opponent.id);
          for (const ally of opponent
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, counts[i])) {
            opponent.activate(ally);
            passEffectsStack(game);
          }
          expect(opponent.cards(woodlandSquirrels, { zone: "field" })).toHaveLength(counts[i]!);
        }
        advanceToMain(game, p.id);
        activate(
          game,
          matching && counts.some((n) => n + (alliesOnly ? 0 : 1) >= 3) ? cost - discount : cost,
          champion,
        );
      });
}
