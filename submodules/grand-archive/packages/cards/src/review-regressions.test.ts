import { describe, expect, it } from "vitest";
import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  createClassBonusTestChampion,
  grandArchiveTestFace,
} from "./testing/class-bonus-test-champion.ts";
import { classBonusLeveledChampion } from "./testing/class-bonus-level.ts";
import { answerDecision, declareResolvedAttack, passEffectsStack } from "./testing/decisions.ts";
import { woodlandSquirrels } from "./cards/DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "./cards/ALC/allies/automated-gardener.ts";
import { automatonDrone } from "./cards/ALC/tokens/automaton-drone.ts";
import { frigidEmbrittlement } from "./cards/PRD/actions/frigid-embrittlement.ts";
import { gildedPyre } from "./cards/PTM/actions/gilded-pyre.ts";
import { glacialEvocation } from "./cards/SP4/actions/glacial-evocation.ts";
import { voltaicSphere } from "./cards/FTC/actions/voltaic-sphere.ts";
import { smokeOut } from "./cards/HVN/actions/smoke-out.ts";
import { frostShard } from "./cards/MRC/actions/frost-shard.ts";
import { tempestDownfall } from "./cards/MRC/actions/tempest-downfall.ts";
import { aeneanFlurryOfFire } from "./cards/PRD/actions/aenean-flurry-of-fire.ts";
import { hectorPraetorianGuard } from "./cards/MRC/allies/hector-praetorian-guard.ts";
import { meadowbloomDryad } from "./cards/DOA/allies/meadowbloom-dryad.ts";
import { verdantScepter } from "./cards/P24/items/verdant-scepter.ts";
import { fierySwing } from "./cards/AMB/attacks/fiery-swing.ts";

// A durable ally that can be rested and given a counter through a public activation.
const preparedAlly: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  ...automatedGardener,
  canonicalId: "reviewtarget",
  slug: "reviewtarget",
  layout: {
    kind: "single-faced",
    face: {
      ...grandArchiveTestFace(automatedGardener),
      id: "reviewtarget:face:default",
      catalogId: "reviewtarget",
      name: "Review Ally",
      cost: { kind: "reserve", amount: 0 },
      elements: ["NORM"],
      stats: { power: 1, life: 20 },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["SPIRIT"],
        subtypes: ["AUTOMATON", "SLIME"],
      },
      abilities: [
        {
          id: "reviewtarget-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Stealth",
          keyword: { name: "stealth" },
        },
        {
          id: "reviewtarget-a2",
          kind: "activated",
          text: "REST: Put a buff counter on this ally.",
          activation: "ability",
          cost: { kind: "rest", subject: { kind: "source" } },
          effect: { kind: "add-counter", subject: { kind: "source" }, counter: "buff", amount: 1 },
        },
      ],
    },
  },
};

function payment(game: GrandArchiveTestEngine, count: number, playerId = "player-one") {
  return game
    .player(playerId)
    .cards(woodlandSquirrels, { zone: "hand" })
    .slice(0, count)
    .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
}

describe("PR review: conditional damage retains its announced recipient", () => {
  for (const [card, damage] of [
    [frigidEmbrittlement, 4],
    [gildedPyre, 4],
    [glacialEvocation, 3],
    [voltaicSphere, 5],
    [smokeOut, 4],
    [frostShard, 3],
    [tempestDownfall, 6],
  ] as const) {
    it(`${card.slug} deals ${damage} in its conditional branch`, () => {
      const champion = createClassBonusTestChampion(card, false, "activation-discount");
      const cost = grandArchiveTestFace(card).cost;
      if (cost.kind !== "reserve" || typeof cost.amount !== "number")
        throw new Error("Expected fixed reserve cost");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [
              preparedAlly,
              card,
              ...Array.from({ length: cost.amount }, () => woodlandSquirrels),
            ],
          },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      player.activate(preparedAlly);
      passEffectsStack(game);
      const target = player.card(preparedAlly, { zone: "field" });
      player.activateAbility(target, "reviewtarget-a2");
      passEffectsStack(game);
      player.activate(card, {
        reservePayment: payment(game, cost.amount),
        targets: { "target-1": [target.objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[target.objectId]?.damage).toBe(damage);
      expect(game.state.stack).toHaveLength(0);
    });
  }
});

describe("Aenean Flurry of Fire repetition", () => {
  for (const [bonus, level, damage] of [
    [false, 5, 2],
    [true, 4, 2],
    [true, 5, 4],
  ] as const) {
    it(`deals ${damage} with class bonus=${bonus}, level=${level}`, () => {
      const { starter, lineage } = classBonusLeveledChampion(aeneanFlurryOfFire, bonus, level);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion: starter,
          lineage,
          zones: { hand: [aeneanFlurryOfFire, woodlandSquirrels, woodlandSquirrels] },
        },
        playerTwo: { champion: starter },
      });
      const target = game.player("player-two").card(starter, { zone: "field" });
      game.player("player-one").activate(aeneanFlurryOfFire, {
        reservePayment: payment(game, 2),
        targets: { "target-1": [target.objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[target.objectId]?.damage).toBe(damage);
      expect(game.state.stack).toHaveLength(0);
    });
  }
});

it("Hector derives prevention from controlled tokens and applies it only once per turn", () => {
  const defender = createClassBonusTestChampion(hectorPraetorianGuard, true, "activation-discount");
  const attacker = createClassBonusTestChampion(gildedPyre, false, "activation-discount");
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion: attacker,
      zones: {
        hand: [gildedPyre, gildedPyre, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
      },
    },
    playerTwo: {
      champion: defender,
      zones: { field: [hectorPraetorianGuard, automatonDrone, automatonDrone] },
    },
  });
  const target = game.player("player-two").card(hectorPraetorianGuard, { zone: "field" });
  for (const damage of [0, 2]) {
    game
      .player("player-one")
      .activate(game.player("player-one").cards(gildedPyre, { zone: "hand" })[0]!, {
        reservePayment: payment(game, 2),
        targets: { "target-1": [target.objectId] },
      });
    passEffectsStack(game);
    expect(game.state.objects[target.objectId]?.damage).toBe(damage);
  }
});

it("Meadowbloom Dryad triggers for its own entry and another allied entry", () => {
  const champion = createClassBonusTestChampion(meadowbloomDryad, true, "activation-discount");
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: { hand: [meadowbloomDryad, preparedAlly, woodlandSquirrels, woodlandSquirrels] },
    },
    playerTwo: { champion },
  });
  const player = game.player("player-one");
  player.activate(meadowbloomDryad, { reservePayment: payment(game, 2) });
  passEffectsStack(game);
  const dryad = player.card(meadowbloomDryad, { zone: "field" });
  for (const count of [1, 2]) {
    expect(game.state.decision?.kind).toBe("announce-triggered-ability");
    answerDecision(game, "announce-triggered-ability", {
      targets: { "target-1": [dryad.objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[dryad.objectId]?.counters.buff).toBe(count);
    if (count === 1) {
      player.activate(preparedAlly);
      passEffectsStack(game);
    }
  }
});

it("resolved attack declarations use player two's decision", () => {
  const champion = createClassBonusTestChampion(fierySwing, false, "activation-discount");
  const game = GrandArchiveTestEngine.startFixture({
    firstPlayer: "playerTwo",
    playerOne: { champion },
    playerTwo: {
      champion,
      zones: { hand: [fierySwing, ...Array.from({ length: 6 }, () => woodlandSquirrels)] },
    },
  });
  const attacker = game.player("player-two").card(champion, { zone: "field" });
  const target = game.player("player-one").card(champion, { zone: "field" });
  game.player("player-two").activate(fierySwing, {
    attackAttackerId: attacker.objectId,
    reservePayment: payment(game, 6, "player-two"),
  });
  passEffectsStack(game);
  declareResolvedAttack(
    game,
    attacker.objectId,
    target.objectId,
    "player two declares Fiery Swing",
  );
  game.resolveCombatWithoutRetaliation();
  expect(game.state.objects[target.objectId]?.damage).toBe(6);
});

for (const selectedCount of [0, 2]) {
  it(`Verdant Scepter lets its controller choose ${selectedCount} of four Slime allies and then draw`, () => {
    const champion = createClassBonusTestChampion(verdantScepter, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      playerOne: {
        champion,
        zones: {
          "material-deck": [verdantScepter],
          memory: [woodlandSquirrels],
          field: Array.from({ length: 5 }, () => preparedAlly),
          "main-deck": [woodlandSquirrels],
        },
      },
      playerTwo: { champion, zones: { field: [preparedAlly] } },
    });
    const player = game.player("player-one");
    player.materialize(verdantScepter);
    passEffectsStack(game);
    answerDecision(game, "resolve-optional-effect", true);
    passEffectsStack(game);
    const slimes = player.cards(preparedAlly, { zone: "field" });
    answerDecision(game, "resolve-effect-choice", [slimes[0]!.objectId]);
    passEffectsStack(game);
    const scepter = player.card(verdantScepter, { zone: "field" });
    const remaining = player.cards(preparedAlly, { zone: "field" });
    const handBefore = player.zone("hand").length;
    player.activateAbility(scepter, "7wsxirq146-a2");
    passEffectsStack(game);
    const before = game.state;
    expect(() =>
      answerDecision(
        game,
        "resolve-effect-choice",
        remaining.slice(0, 3).map((ref) => ref.objectId),
      ),
    ).toThrow();
    expect(game.state).toEqual(before);
    const selected = remaining.slice(0, selectedCount).map((ref) => ref.objectId);
    answerDecision(game, "resolve-effect-choice", selected);
    passEffectsStack(game);
    for (const ally of remaining)
      expect(game.state.objects[ally.objectId]?.counters.buff ?? 0).toBe(
        selected.includes(ally.objectId) ? 1 : 0,
      );
    expect(player.zone("hand")).toHaveLength(handBefore + 1);
    expect(
      game.state.objects[game.player("player-two").card(preparedAlly, { zone: "field" }).objectId]
        ?.counters.buff ?? 0,
    ).toBe(0);
  });
}
