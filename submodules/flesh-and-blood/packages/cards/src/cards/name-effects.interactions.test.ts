import { describe, expect, it } from "vitest";
import type { FleshAndBloodCard } from "@tcg/flesh-and-blood-types";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  type FabPlayerSetup,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "./heroes/bravo.ts";
import { dash } from "./heroes/dash.ts";
import { fai } from "./heroes/fai.ts";
import { iraCrimsonHaze } from "./heroes/ira-crimson-haze.ts";
import { vynnset } from "./heroes/vynnset.ts";
import { amnesiaRed } from "./actions/amnesia.ts";
import { amuletOfEchoesBlue } from "./actions/amulet-of-echoes.ts";
import { beLikeWaterRed } from "./actions/be-like-water.ts";
import { nimblismBlue } from "./actions/nimblism.ts";
import { snatchRed } from "./actions/snatch.ts";
import { aurumAegis } from "./equipment/aurum-aegis.ts";
import { goldenGait } from "./equipment/golden-gait.ts";
import { goldenGalea } from "./equipment/golden-galea.ts";
import { goldenGauntlets } from "./equipment/golden-gauntlets.ts";
import { goldenHeartPlate } from "./equipment/golden-heart-plate.ts";
import { maskOfManyFaces } from "./equipment/mask-of-many-faces.ts";
import { runechantOfEnvyYellow } from "./instants/runechant-of-envy.ts";
import { runechantOfGluttonyYellow } from "./instants/runechant-of-gluttony.ts";
import { runechantOfGreedYellow } from "./instants/runechant-of-greed.ts";
import { runechantOfLustYellow } from "./instants/runechant-of-lust.ts";
import { runechantOfPrideYellow } from "./instants/runechant-of-pride.ts";
import { runechantOfSlothYellow } from "./instants/runechant-of-sloth.ts";
import { runechantOfWrathYellow } from "./instants/runechant-of-wrath.ts";

type PublicStaticNameGrantCase = {
  readonly card: FleshAndBloodCard;
  readonly gainedName: "Gold" | "Runechant";
  readonly seat: Pick<FabPlayerSetup, "arena" | "head" | "chest" | "arms" | "legs" | "weapon2">;
};

const GOLD_NAME_GRANTS = [
  { card: aurumAegis, gainedName: "Gold", seat: { weapon2: [aurumAegis] } },
  { card: goldenGalea, gainedName: "Gold", seat: { head: [goldenGalea] } },
  { card: goldenHeartPlate, gainedName: "Gold", seat: { chest: [goldenHeartPlate] } },
  { card: goldenGauntlets, gainedName: "Gold", seat: { arms: [goldenGauntlets] } },
  { card: goldenGait, gainedName: "Gold", seat: { legs: [goldenGait] } },
] as const satisfies readonly PublicStaticNameGrantCase[];

const RUNECHANT_NAME_GRANTS = [
  runechantOfEnvyYellow,
  runechantOfGluttonyYellow,
  runechantOfGreedYellow,
  runechantOfLustYellow,
  runechantOfPrideYellow,
  runechantOfSlothYellow,
  runechantOfWrathYellow,
] as const satisfies readonly FleshAndBloodCard[];

describe("name-related continuous effects", () => {
  it.each(GOLD_NAME_GRANTS)(
    "$card.slug loses Gold to Amnesia, cannot regain it early, then explains the genuine re-gain",
    ({ card, gainedName, seat }) => {
      const printedName = card.base.names[0];
      expect(printedName).toBeDefined();
      const game = FabTestEngine.start(
        {
          hero: fai,
          hand: [amnesiaRed],
          resourcePoints: 2,
          actionPoints: 1,
          deck: 6,
        },
        { hero: dash, ...seat, life: 20, deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Fai = game.as(fai);
      const Dash = game.as(dash);

      expectFabCard(Dash, card).toHaveName(printedName!).toHaveName(gainedName);

      Fai.playAttack(amnesiaRed);
      game.closeCombat();
      expectFabCard(Dash, card).toHaveNames([]);
      game.helpers.expectLog("flesh-and-blood.lose-names", { cardName: printedName! });

      Fai.endTurn();
      game.untilIdle();
      expectFabCard(Dash, card).toHaveNames([]);

      Dash.endTurn();
      game.untilIdle();
      expectFabCard(Dash, card).toHaveName(printedName!).toHaveName(gainedName);
      game.helpers.expectLog("flesh-and-blood.gain-name", {
        cardName: printedName!,
        gainedName,
      });
    },
  );

  it.each(RUNECHANT_NAME_GRANTS)(
    "$slug enters the arena with both names and explains that it gained Runechant",
    (card) => {
      const printedName = card.base.names[0];
      expect(printedName).toBeDefined();
      const game = FabTestEngine.start(
        { hero: vynnset, hand: [card], actionPoints: 1, deck: 6 },
        { hero: bravo, deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const Vynnset = game.as(vynnset);

      Vynnset.play(card);
      game.untilIdle();

      expectFabCard(Vynnset, card).toBeIn("arena").toHaveName(printedName!).toHaveName("Runechant");
      game.helpers.expectLog("flesh-and-blood.gain-name", {
        cardName: printedName!,
        gainedName: "Runechant",
      });
    },
  );

  it("keeps every distinct name when separate effects grant names to the same card", () => {
    const game = FabTestEngine.start(
      {
        hero: iraCrimsonHaze,
        head: [maskOfManyFaces],
        hand: [beLikeWaterRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraCrimsonHaze);

    Ira.activate(maskOfManyFaces);
    game.advanceToDecision(Ira, "effect-resolution");
    Ira.choose("Crouching Tiger");
    game.untilIdle();

    Ira.playAttack(beLikeWaterRed);
    game.advanceToDecision(Ira, "boolean");
    Ira.chooseBoolean(true);
    game.advanceToDecision(Ira, "effect-resolution");
    Ira.choose("Surging Strike");
    game.advanceUntil({ stopAt: "resolution", ordering: "listed" });

    expectFabCard(Ira, beLikeWaterRed)
      .toHaveName("Be Like Water")
      .toHaveName("Crouching Tiger")
      .toHaveName("Surging Strike");
    game.helpers.expectLog("flesh-and-blood.gain-name", {
      cardName: "Be Like Water",
      gainedName: "Crouching Tiger",
    });
    game.helpers.expectLog("flesh-and-blood.gain-name", {
      cardName: "Be Like Water",
      gainedName: "Surging Strike",
    });
  });

  it("does not treat an already-present name as a gain or emit a false gain log", () => {
    const game = FabTestEngine.start(
      {
        hero: iraCrimsonHaze,
        head: [maskOfManyFaces],
        hand: [beLikeWaterRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraCrimsonHaze);

    Ira.activate(maskOfManyFaces);
    game.advanceToDecision(Ira, "effect-resolution");
    Ira.choose("Be Like Water");
    game.untilIdle();
    Ira.playAttack(beLikeWaterRed, { stopAt: "on-attack" });

    expectFabCard(Ira, beLikeWaterRed).toHaveNames(["Be Like Water"]);
    game.helpers.expectLog("flesh-and-blood.name-card", {
      playerId: Ira.id,
      cardName: "Be Like Water",
    });
    game.helpers.expectNoPublicLog("flesh-and-blood.gain-name", {
      cardName: "Be Like Water",
      gainedName: "Be Like Water",
    });
  });

  it("uses a gained name for later same-name interactions", () => {
    const game = FabTestEngine.start(
      {
        hero: iraCrimsonHaze,
        head: [maskOfManyFaces],
        hand: [beLikeWaterRed, snatchRed, nimblismBlue, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arena: [amuletOfEchoesBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraCrimsonHaze);
    const Dash = game.as(dash);

    Ira.activate(maskOfManyFaces);
    game.advanceToDecision(Ira, "effect-resolution");
    Ira.choose("Snatch");
    game.untilIdle();

    Ira.playAttack(beLikeWaterRed);
    Dash.defendWith();
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    Ira.playAttack(snatchRed);
    Dash.defendWith();
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    Ira.pass();

    Dash.activate(amuletOfEchoesBlue);
    game.untilIdle({ entityTargets: "pause" });
    const privateCards = Ira.cardsIn("hand", nimblismBlue);
    expect(privateCards).toHaveLength(2);
    Dash.target(privateCards[0]!, privateCards[1]!);
    game.untilIdle();

    expectFabCard(Ira, privateCards[0]!).toBeIn("graveyard");
    expectFabCard(Ira, privateCards[1]!).toBeIn("graveyard");
    game.helpers.expectLog("flesh-and-blood.gain-name", {
      cardName: "Be Like Water",
      gainedName: "Snatch",
    });
  });
});
