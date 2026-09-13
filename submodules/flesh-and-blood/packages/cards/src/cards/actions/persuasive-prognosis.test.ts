import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { heartOfFyendalBlue } from "../resources/heart-of-fyendal.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { persuasivePrognosisBlue } from "./persuasive-prognosis.ts";

describe("Persuasive Prognosis (MST104) AAA", () => {
  it("happy: hit banishes the top card and a same-color action from hand, then gains 1{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [persuasivePrognosisBlue],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, snatchRed],
        deckTop: [nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(persuasivePrognosisBlue);
    expectCombat(game).toHaveAttackPower(1);
    expectCombat(game).toHaveKeyword("stealth");
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(19);
    expect(Dash.zone("banished").filter((id) => id === nimblismBlue.canonicalId)).toHaveLength(2);
    expectFabCard(Dash, snatchRed).toBeIn("hand");
    expectFabPlayer(Arakni).toHaveLife(22);
  });

  it("boundary: a miss does not banish from deck or hand", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [persuasivePrognosisBlue],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue],
        deckTop: [snatchRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(persuasivePrognosisBlue);
    game.advanceCombatTo("defend");
    Dash.defendWith(nimblismBlue);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Dash.zone("deck")).toContain(snatchRed.canonicalId);
    expectFabPlayer(Arakni).toHaveLife(20);
  });

  it("timing: banishing a non-action does not gain life from the second trigger", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [persuasivePrognosisBlue],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [],
        deckTop: [heartOfFyendalBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.attackWith(persuasivePrognosisBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Arakni).toHaveLife(20);
  });
});
