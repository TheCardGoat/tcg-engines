import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { automatedGardener } from "../../ALC/allies/automated-gardener.ts";
import { shimmercloakAssassin } from "../../ALC/allies/shimmercloak-assassin.ts";
import { glacialGuidance } from "../../DOA/actions/glacial-guidance.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { condemnedTrinket } from "../../DTR/items/condemned-trinket.ts";
import { kraalStonescaleTyrant } from "../../FTC/allies/kraal-stonescale-tyrant.ts";
import { shieldroid } from "../../PRD/allies/shieldroid.ts";
import { shadeStriker } from "../../RDO/allies/shade-striker.ts";
import { maryAnnMaladroitMaid } from "./mary-ann-maladroit-maid.ts";
import { overlordMkIii } from "./overlord-mk-iii.ts";

function makeOmen(
  game: GrandArchiveTestEngine,
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
): void {
  const player = game.player("player-one");
  const source = player.cards(condemnedTrinket, { zone: "field" })[0]!;
  const chosen = player.cards(card, { zone: "graveyard" })[0]!;
  player.activateAbility(source, "21oy1nd4nw-a1", {
    reservePayment: player
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(0, 3)
      .map((payment) => ({ kind: "card" as const, cardId: payment.objectId })),
  });
  passEffectsStack(game);
  if (game.state.decision?.kind === "resolve-effect-choice") {
    answerDecision(game, "resolve-effect-choice", [chosen.objectId]);
    passEffectsStack(game);
  }
  expect(game.state.objects[chosen.objectId]).toMatchObject({
    zone: "banishment",
    counters: { omen: 1 },
  });
}

function keywordFixture(
  omen: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  opponentField: readonly GrandArchiveAnyCard<GrandArchiveAbilityDefinition>[] = [],
  opponentHand: readonly GrandArchiveAnyCard<GrandArchiveAbilityDefinition>[] = [],
) {
  const champion = createClassBonusTestChampion(maryAnnMaladroitMaid, false, "activation-discount");
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: {
        field: [maryAnnMaladroitMaid, condemnedTrinket, woodlandSquirrels],
        hand: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        graveyard: [omen],
        "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
      },
    },
    playerTwo: {
      champion,
      zones: {
        field: [...opponentField],
        hand: [...opponentHand],
        "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
      },
    },
  });
  makeOmen(game, omen);
  return { game, champion };
}

/** @covers mt5zs1w6c0-a1 */
describe("Mary Ann, Maladroit Maid — distinct omen reserve costs", () => {
  it("counts each reserve cost once even when multiple omens share that cost", () => {
    const champion = createClassBonusTestChampion(
      maryAnnMaladroitMaid,
      false,
      "activation-discount",
    );
    const omens = [
      woodlandSquirrels,
      woodlandSquirrels,
      automatedGardener,
      shadeStriker,
      overlordMkIii,
    ];
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [
            maryAnnMaladroitMaid,
            ...Array.from({ length: omens.length }, () => condemnedTrinket),
          ],
          hand: Array.from({ length: omens.length * 3 }, () => woodlandSquirrels),
          graveyard: omens,
        },
      },
      playerTwo: { champion },
    });
    for (const omen of omens) makeOmen(game, omen);
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    player.declareAttack(maryAnnMaladroitMaid, opponent.card(champion));
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[opponent.card(champion).objectId]!.damage).toBe(3);
  });
});

/** @covers mt5zs1w6c0-a2 */
describe("Mary Ann, Maladroit Maid — omen keyword inheritance", () => {
  it("inherits True Sight and Steadfast from an Overlord omen", () => {
    const { game } = keywordFixture(overlordMkIii, [shimmercloakAssassin, automatedGardener]);
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const mary = player.card(maryAnnMaladroitMaid);
    player.declareAttack(mary, opponent.card(shimmercloakAssassin));
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[mary.objectId]!.states.has("rested")).toBe(true);
    advanceToMain(game, opponent.id);
    const attacker = opponent.card(automatedGardener);
    opponent.declareAttack(attacker, mary);
    let retaliated = false;
    for (let step = 0; game.state.combat && step < 64; step += 1) {
      if (game.state.decision?.kind === "choose-retaliators") {
        expect(game.state.decision.candidates).toContain(mary.objectId);
        answerDecision(game, "choose-retaliators", [mary.objectId]);
        retaliated = true;
      } else {
        const wait = game.waitState();
        if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
        game.player(wait.playerId).pass();
      }
    }
    expect(retaliated).toBe(true);
    expect(game.state.objects[attacker.objectId]!.damage).toBe(1);
  });

  it("inherits Spellshroud and Intercept from an Overlord omen", () => {
    const { game, champion } = keywordFixture(
      overlordMkIii,
      [automatedGardener],
      [glacialGuidance, woodlandSquirrels],
    );
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const mary = player.card(maryAnnMaladroitMaid);
    advanceToMain(game, opponent.id);
    const before = game.state;
    expect(() =>
      opponent.activate(glacialGuidance, {
        targets: { "target-1": [mary.objectId] },
        reservePayment: [
          { kind: "card", cardId: opponent.card(woodlandSquirrels, { zone: "hand" }).objectId },
        ],
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
    opponent.declareAttack(automatedGardener, player.card(champion));
    passEffectsStack(game);
    answerDecision(game, "resolve-optional-effect", true);
    passEffectsStack(game);
    expect(game.state.combat?.targetIds).toEqual([mary.objectId]);
  });

  it("inherits Vigor from a Kraal omen", () => {
    const { game, champion } = keywordFixture(kraalStonescaleTyrant);
    const player = game.player("player-one");
    const mary = player.card(maryAnnMaladroitMaid);
    player.declareAttack(mary, game.player("player-two").card(champion));
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[mary.objectId]!.states.has("rested")).toBe(true);
    for (let step = 0; game.state.turn.phase !== "end" && step < 64; step += 1) {
      const wait = game.waitState();
      if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
      game.player(wait.playerId).pass();
    }
    passEffectsStack(game);
    expect(game.state.objects[mary.objectId]!.states.has("rested")).toBe(false);
  });

  it("inherits Ambush from a Shade Striker omen", () => {
    const { game } = keywordFixture(shadeStriker, [automatedGardener]);
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const mary = player.card(maryAnnMaladroitMaid);
    advanceToMain(game, opponent.id);
    const attacker = opponent.card(automatedGardener);
    opponent.declareAttack(attacker, player.card(woodlandSquirrels, { zone: "field" }));
    let retaliated = false;
    for (let step = 0; game.state.combat && step < 64; step += 1) {
      if (game.state.decision?.kind === "choose-retaliators") {
        expect(game.state.decision.candidates).toContain(mary.objectId);
        answerDecision(game, "choose-retaliators", [mary.objectId]);
        retaliated = true;
      } else {
        const wait = game.waitState();
        if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
        game.player(wait.playerId).pass();
      }
    }
    expect(retaliated).toBe(true);
    expect(game.state.objects[attacker.objectId]!.damage).toBe(1);
  });

  it("inherits Stealth from a Shimmercloak Assassin omen", () => {
    const { game } = keywordFixture(shimmercloakAssassin, [automatedGardener]);
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    advanceToMain(game, opponent.id);
    const before = game.state;
    expect(() =>
      opponent.declareAttack(automatedGardener, player.card(maryAnnMaladroitMaid)),
    ).toThrow();
    expect(game.state).toEqual(before);
    opponent.declareAttack(automatedGardener, player.card(woodlandSquirrels, { zone: "field" }));
    expect(game.state.combat?.targetIds).toEqual([
      player.card(woodlandSquirrels, { zone: "field" }).objectId,
    ]);
  });

  it("inherits Taunt from a Shieldroid omen", () => {
    const { game } = keywordFixture(shieldroid, [automatedGardener]);
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    advanceToMain(game, opponent.id);
    const before = game.state;
    expect(() =>
      opponent.declareAttack(automatedGardener, player.card(woodlandSquirrels, { zone: "field" })),
    ).toThrow();
    expect(game.state).toEqual(before);
    opponent.declareAttack(automatedGardener, player.card(maryAnnMaladroitMaid));
    expect(game.state.combat?.targetIds).toEqual([player.card(maryAnnMaladroitMaid).objectId]);
  });
});
