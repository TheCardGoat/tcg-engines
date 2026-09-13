import { describe, expect, it } from "vitest";
import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  expectFabCard,
  expectFabPlayer,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { malice } from "../heroes/malice.ts";
import { cintariSellsword } from "../tokens/cintari-sellsword.ts";
import { woundingBlowBlue } from "./wounding-blow.ts";
import { snatchRed } from "./snatch.ts";
import { dash } from "../heroes/dash.ts";
import { restlessCorporalRed } from "./restless-corporal.ts";
import { forsakenStrikeYellow } from "./forsaken-strike.ts";
describe("Forsaken Strike preview behavior", () => {
  it("can pay no zombies and attack at printed power", () => {
    const game = FabTestEngine.start(
      { hero: gravyBones, hand: [forsakenStrikeYellow], deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(gravyBones).playAttack(forsakenStrikeYellow);
    expectCombat(game).toHaveAttackPower(3).notToHaveKeyword("go-again");
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(17);
  });
  it("destroying one zombie and discarding another permits two different modes", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [forsakenStrikeYellow, restlessCorporalRed],
        arena: [restlessCorporalRed],
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const player = game.as(gravyBones);
    const destroyed = player.cardIn("arena", restlessCorporalRed);
    const discarded = player.cardIn("hand", restlessCorporalRed);
    game.playInstance(
      player.id,
      player.cardIn("hand", forsakenStrikeYellow).instanceId,
      {},
      "explicit",
    );
    player.targetRequired(destroyed);
    player.targetRequired(discarded);
    player.choose("gate");
    player.choose("power");
    game.advanceUntil({ stopAt: "defend" });
    expectFabCard(player, destroyed).toBeIn("graveyard");
    expectFabCard(player, discarded).toBeIn("graveyard");
    expectFabPlayer(player).toHaveTokenCount("gate-to-i-arathael", 1);
    expectCombat(game).toHaveAttackPower(5);
  });
  it("UST notes errata: the Gate mode is When this attacks, not a play-resolution create", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [forsakenStrikeYellow],
        arena: [restlessCorporalRed],
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const player = game.as(gravyBones);
    const destroyed = player.cardIn("arena", restlessCorporalRed);
    game.playInstance(
      player.id,
      player.cardIn("hand", forsakenStrikeYellow).instanceId,
      {},
      "explicit",
    );
    player.targetRequired(destroyed);
    player.choose("gate");
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectFabPlayer(player).toHaveTokenCount("gate-to-i-arathael", 1);
  });
  it("can select the power mode repeatedly for three destroyed zombies", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [forsakenStrikeYellow],
        arena: [restlessCorporalRed, restlessCorporalRed, restlessCorporalRed],
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const player = game.as(gravyBones);
    game.playInstance(
      player.id,
      player.cardIn("hand", forsakenStrikeYellow).instanceId,
      {},
      "explicit",
    );
    player.targetRequired(...player.cardsIn("arena", restlessCorporalRed));
    for (let i = 0; i < 3; i++) player.choose("power");
    game.advanceUntil({ stopAt: "defend", entityTargets: "maximum" });
    expectCombat(game).toHaveAttackPower(9);
    expectFabPlayer(player).toHaveTokenCount("gate-to-i-arathael", 0);
  });
  it("accepts at most three zombies from each zone and grants all six paid rewards", () => {
    const zombies = [
      restlessCorporalRed,
      restlessCorporalRed,
      restlessCorporalRed,
      restlessCorporalRed,
    ];
    const game = FabTestEngine.start(
      { hero: gravyBones, hand: [forsakenStrikeYellow, ...zombies], arena: zombies, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const player = game.as(gravyBones);
    const arena = player.cardsIn("arena", restlessCorporalRed);
    const hand = player.cardsIn("hand", restlessCorporalRed);
    game.playInstance(
      player.id,
      player.cardIn("hand", forsakenStrikeYellow).instanceId,
      {},
      "explicit",
    );
    expect(() => player.targetRequired(...arena)).toThrow(/Choose the required number of targets/);
    player.targetRequired(...arena.slice(0, 3));
    expect(() => player.targetRequired(...hand)).toThrow(/Choose the required number of targets/);
    player.targetRequired(...hand.slice(0, 3));
    for (let i = 0; i < 5; i++) player.choose("power");
    player.choose("goAgain");
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(13).toHaveKeyword("go-again");
    expectFabCard(player, arena[3]!).toBeIn("arena");
    expectFabCard(player, hand[3]!).toBeIn("hand");
    for (const card of [...arena.slice(0, 3), ...hand.slice(0, 3)])
      expectFabCard(player, card).toBeIn("graveyard");
  });
});

// All sixteen legal payment sizes: the caps apply independently, not to their sum.
const paymentSizes = [0, 1, 2, 3].flatMap((destroy) =>
  [0, 1, 2, 3].map((discard) => ({ destroy, discard })),
);
function paymentFixture() {
  const zombies = Array.from({ length: 4 }, () => restlessCorporalRed);
  const game = FabTestEngine.start(
    { hero: gravyBones, hand: [forsakenStrikeYellow, ...zombies], arena: zombies, deck: [] },
    { hero: dash, hand: [], life: 30, deck: [] },
    FAB_MANUAL_HARNESS,
  );
  const player = game.as(gravyBones);
  const arena = player.cardsIn("arena", restlessCorporalRed);
  const hand = player.cardsIn("hand", restlessCorporalRed);
  game.playInstance(
    player.id,
    player.cardIn("hand", forsakenStrikeYellow).instanceId,
    {},
    "explicit",
  );
  return { game, player, arena, hand };
}
describe("Forsaken Strike — payment and reward boundaries", () => {
  it.each(paymentSizes)(
    "destroy $destroy / discard $discard grants exactly that many power rewards",
    ({ destroy, discard }) => {
      const { game, player, arena, hand } = paymentFixture();
      player.targetRequired(...arena.slice(0, destroy));
      player.targetRequired(...hand.slice(0, discard));
      for (let i = 0; i < destroy + discard; i++) player.choose("power");
      game.advanceUntil({ stopAt: "defend" });

      const power = 3 + 2 * (destroy + discard);
      expectCombat(game).toHaveAttackPower(power).notToHaveKeyword("go-again");
      expectFabPlayer(player).toHaveTokenCount("gate-to-i-arathael", 0);
      for (const card of arena.slice(0, destroy)) expectFabCard(player, card).toBeIn("graveyard");
      for (const card of hand.slice(0, discard)) expectFabCard(player, card).toBeIn("graveyard");
      for (const card of arena.slice(destroy)) expectFabCard(player, card).toBeIn("arena");
      for (const card of hand.slice(discard)) expectFabCard(player, card).toBeIn("hand");
      game.closeCombat();
      expectFabPlayer(game.as(dash)).toHaveLife(30 - power);
      expectFabPlayer(player).toHaveAP(0);
    },
  );

  it("can repeat the Gate mode six times without granting power or go again", () => {
    const { game, player, arena, hand } = paymentFixture();
    player.targetRequired(...arena.slice(0, 3));
    player.targetRequired(...hand.slice(0, 3));
    for (let i = 0; i < 6; i++) player.choose("gate");
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });

    expectFabPlayer(player).toHaveTokenCount("gate-to-i-arathael", 6);
    expectCombat(game).toHaveAttackPower(3).notToHaveKeyword("go-again");
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(27);
    expectFabPlayer(player).toHaveAP(0);
  });

  it("repeated go again grants only one action point and does not affect the next Strike", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [forsakenStrikeYellow, forsakenStrikeYellow],
        arena: [restlessCorporalRed, restlessCorporalRed],
        deck: [],
      },
      { hero: dash, hand: [], life: 20, deck: [] },
      FAB_MANUAL_HARNESS,
    );
    const player = game.as(gravyBones);
    const [first, second] = player.cardsIn("hand", forsakenStrikeYellow);
    game.playInstance(player.id, first!.instanceId, {}, "explicit");
    player.targetRequired(...player.cardsIn("arena", restlessCorporalRed));
    player.choose("goAgain");
    player.choose("goAgain");
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(3).toHaveKeyword("go-again");
    expectFabPlayer(player).toHaveAP(0);
    game.closeCombat();
    expectFabPlayer(player).toHaveAP(1);

    player.playAttack(second!);
    expectCombat(game).toHaveAttackPower(3).notToHaveKeyword("go-again");
    game.closeCombat();
    expectFabPlayer(player).toHaveAP(0);
    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });

  it("uses all three modes together without carrying its power bonus to a later Strike", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [forsakenStrikeYellow, forsakenStrikeYellow, restlessCorporalRed],
        arena: [restlessCorporalRed, restlessCorporalRed],
        deck: [],
      },
      { hero: dash, hand: [], life: 20, deck: [] },
      FAB_MANUAL_HARNESS,
    );
    const player = game.as(gravyBones);
    const [first, second] = player.cardsIn("hand", forsakenStrikeYellow);
    game.playInstance(player.id, first!.instanceId, {}, "explicit");
    player.targetRequired(...player.cardsIn("arena", restlessCorporalRed));
    player.targetRequired(player.cardIn("hand", restlessCorporalRed));
    player.choose("goAgain");
    player.choose("power");
    player.choose("gate");
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(5).toHaveKeyword("go-again");
    expectFabPlayer(player).toHaveTokenCount("gate-to-i-arathael", 1);
    game.closeCombat();
    expectFabPlayer(player).toHaveAP(1);

    player.playAttack(second!);
    expectCombat(game).toHaveAttackPower(3).notToHaveKeyword("go-again");
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(12);
    expectFabPlayer(player).toHaveTokenCount("gate-to-i-arathael", 1).toHaveAP(0);
  });

  it("rejects opposing zombies, non-zombie allies, and non-zombie discards without consuming them", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [forsakenStrikeYellow, restlessCorporalRed, snatchRed],
        arena: [restlessCorporalRed, cintariSellsword],
        deck: [],
      },
      { hero: dash, hand: [], arena: [restlessCorporalRed], deck: [] },
      FAB_MANUAL_HARNESS,
    );
    const player = game.as(gravyBones);
    const opponent = game.as(dash);
    const own = player.cardIn("arena", restlessCorporalRed);
    const opposing = opponent.cardIn("arena", restlessCorporalRed);
    const sellsword = player.cardIn("arena", cintariSellsword);
    const nonZombie = player.cardIn("hand", snatchRed);
    const discarded = player.cardIn("hand", restlessCorporalRed);
    game.playInstance(
      player.id,
      player.cardIn("hand", forsakenStrikeYellow).instanceId,
      {},
      "explicit",
    );
    expect(() => player.targetRequired(opposing)).toThrow(/not a legal target/);
    expect(() => player.targetRequired(sellsword)).toThrow(/not a legal target/);
    expect(() => player.targetRequired(discarded)).toThrow(/not a legal target/);
    expect(() => player.targetRequired(own, own)).toThrow(
      /selected mixed-cost objects exceed the legal component/,
    );
    player.targetRequired(own);
    expect(() => player.targetRequired(nonZombie)).toThrow(/not a legal target/);
    player.targetRequired(discarded);
    player.choose("power");
    player.choose("power");
    game.advanceUntil({ stopAt: "defend" });

    expectFabCard(opponent, opposing).toBeIn("arena");
    expectFabCard(player, sellsword).toBeIn("arena");
    expectFabCard(player, nonZombie).toBeIn("hand");
    expectFabCard(player, own).toBeIn("graveyard");
    expectFabCard(player, discarded).toBeIn("graveyard");
    expectCombat(game).toHaveAttackPower(7);
  });

  it("counts a destroyed zombie even when Malice banishes it, but does not treat a discard as dying", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        hand: [forsakenStrikeYellow, restlessCorporalRed],
        arena: [restlessCorporalRed],
        deck: [],
      },
      { hero: dash, hand: [], life: 20, deck: [] },
      FAB_MANUAL_HARNESS,
    );
    const player = game.as(malice);
    const destroyed = player.cardIn("arena", restlessCorporalRed);
    const discarded = player.cardIn("hand", restlessCorporalRed);
    game.playInstance(
      player.id,
      player.cardIn("hand", forsakenStrikeYellow).instanceId,
      {},
      "explicit",
    );
    player.targetRequired(destroyed);
    player.targetRequired(discarded);
    player.choose("power");
    player.choose("power");
    game.advanceUntil({ stopAt: "defend" });

    expectFabCard(player, destroyed).toBeBanished().toBeFaceDown();
    expectFabCard(player, discarded).toBeIn("graveyard");
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(13);
  });
});

describe("Forsaken Strike — combat resolution", () => {
  it("creates its Gate and gets go again even when the attack is fully defended", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [forsakenStrikeYellow],
        arena: [restlessCorporalRed, restlessCorporalRed],
        deck: [],
      },
      { hero: dash, hand: [woundingBlowBlue], life: 20, deck: [] },
      FAB_MANUAL_HARNESS,
    );
    const player = game.as(gravyBones);
    const defender = game.as(dash);
    game.playInstance(
      player.id,
      player.cardIn("hand", forsakenStrikeYellow).instanceId,
      {},
      "explicit",
    );
    player.targetRequired(...player.cardsIn("arena", restlessCorporalRed));
    player.choose("gate");
    player.choose("goAgain");
    game.advanceUntil({ stopAt: "defend" });
    expectFabPlayer(player).toHaveTokenCount("gate-to-i-arathael", 1).toHaveAP(0);

    defender.defendWith(woundingBlowBlue);
    game.closeCombat();

    expectFabPlayer(defender).toHaveLife(20);
    expectFabPlayer(player).toHaveTokenCount("gate-to-i-arathael", 1).toHaveAP(1);
  });
});
