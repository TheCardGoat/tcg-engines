import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { goldenHeartPlate } from "../equipment/golden-heart-plate.ts";
import { maskOfManyFaces } from "../equipment/mask-of-many-faces.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { wreckerRompRed } from "./wrecker-romp.ts";
import { amnesiaRed } from "./amnesia.ts";

const runechant = fabToken("runechant");

describe("Amnesia (OUT183) AAA", () => {
  it("happy: hits a hero; cards and tokens they own lose names", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [amnesiaRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [snatchRed],
        chest: [goldenHeartPlate],
        arena: [runechant],
        life: 20,
        deck: [
          nimblismBlue,
          wreckerRompRed,
          wreckerRompRed,
          wreckerRompRed,
          wreckerRompRed,
          wreckerRompRed,
        ],
      },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    Fai.attackWith(amnesiaRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(14);
    expectFabCard(Fai, amnesiaRed).toBeIn("graveyard");
    expectFabCard(Dash, snatchRed).toHaveNames([]);
    expectFabCard(Dash, runechant).toHaveNames([]);
    expectFabCard(Dash, goldenHeartPlate).toHaveNames([]);
    expectFabCard(Fai, amnesiaRed).toHaveName("Amnesia");
    game.helpers.expectLog("flesh-and-blood.name-gain-restricted", {
      sourceName: "Amnesia",
      playerId: Dash.id,
    });
    game.helpers.expectLog("flesh-and-blood.lose-names", {
      cardName: "Golden Heart Plate",
    });
    game.helpers.expectLog("flesh-and-blood.lose-names", { cardName: "Runechant" });
    game.helpers.expectPrivateLog("flesh-and-blood.lose-names", Dash.id, {
      cardName: "Snatch",
    });
    game.helpers.expectNoPublicLog("flesh-and-blood.lose-names", { cardName: "Snatch" });

    expect(game.renderedPlayerNarrative(Fai.id)).toContain(
      "Amnesia prevents opponent's cards and tokens from gaining names until the start of their next turn.",
    );
    expect(game.renderedPlayerNarrative(Dash.id)).toContain(
      "Amnesia prevents your cards and tokens from gaining names until the start of their next turn.",
    );
    expect(game.renderedPlayerNarrative(Dash.id)).toContain(
      "Snatch lost all names because of Amnesia.",
    );
    expect(game.renderedPlayerNarrative(Fai.id)).not.toContain(
      "Snatch lost all names because of Amnesia.",
    );
    expect(game.renderedPlayerNarrative(Dash.id).join("\n")).not.toContain("Nimblism");
    expect(game.renderedPlayerNarrative(Fai.id).join("\n")).not.toContain("Nimblism");
  });

  it("boundary: a miss does not strip names", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [amnesiaRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [amnesiaRed, wreckerRompRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    Fai.attackWith(amnesiaRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([amnesiaRed, wreckerRompRed]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Dash, wreckerRompRed).toHaveName("Wrecker Romp");
  });

  it("timing: names return at the start of your next turn; Gold cannot be re-granted until then", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [amnesiaRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        chest: [goldenHeartPlate],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    Fai.attackWith(amnesiaRed);
    game.helpers.resolveRestOfCombat();
    expectFabCard(Dash, goldenHeartPlate).notToHaveName("Gold");

    Fai.endTurn();
    game.helpers.resolveUntilIdle();
    expectFabCard(Dash, goldenHeartPlate).notToHaveName("Gold");

    Dash.endTurn();
    game.helpers.resolveUntilIdle();
    expectFabCard(Dash, goldenHeartPlate).toHaveName("Gold");
    game.helpers.expectLog("flesh-and-blood.gain-name", {
      cardName: "Golden Heart Plate",
      gainedName: "Gold",
    });
  });

  it("interaction: its explicit restriction prevents Mask of Many Faces from granting a name", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [amnesiaRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        head: [maskOfManyFaces],
        hand: [nimblismBlue, snatchRed],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, autoPitch: true },
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    Fai.playAttack(amnesiaRed);
    game.closeCombat();
    Fai.endTurn();
    game.untilIdle();

    Dash.activate(maskOfManyFaces);
    const pitch = Dash.expectDecision("payment").candidates.find(
      (candidate) => candidate.instanceId === Dash.findCardInZone("hand", nimblismBlue),
    );
    expect(pitch).toBeDefined();
    game.answerDecision(Dash.id, { kind: "payment", instanceIds: [pitch!.instanceId] });
    game.advanceToDecision(Dash, "effect-resolution");
    Dash.choose("Crouching Tiger");
    game.untilIdle();
    Dash.playAttack(snatchRed);

    expectFabCard(Dash, snatchRed).toHaveNames([]);
    game.helpers.expectLog("flesh-and-blood.name-card", {
      playerId: Dash.id,
      cardName: "Crouching Tiger",
    });
    game.helpers.expectNoPublicLog("flesh-and-blood.gain-name", {
      cardName: "Snatch",
      gainedName: "Crouching Tiger",
    });
  });
});
