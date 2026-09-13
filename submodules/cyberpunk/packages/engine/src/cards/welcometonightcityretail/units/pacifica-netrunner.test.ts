import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailPacificaNetrunner,
} from "@tcg/cyberpunk-cards";
import { getEffectiveRules } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Pacifica Netrunner", () => {
  it("is a green Netrunner unit with cost 4 and power 1", () => {
    const card = welcomeToNightCityRetailPacificaNetrunner;
    expect(card.type).toBe("unit");
    expect(card.color).toBe("green");
    expect(card.classifications).toEqual(["Netrunner"]);
    expect(card.cost).toBe(4);
    expect(card.power).toBe(1);
    expect(card.printNumber).toBe("084");
    expect(card.abilities[0]?.trigger).toMatchObject({ trigger: "play" });
  });

  it("on play with even Street Cred, spends a rival unit and grants cantReady", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailPacificaNetrunner],
        eddies: 4,
        gigArea: [{ dieType: "d6", faceValue: 2 }],
      },
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }],
      },
    );

    engine.playCard(welcomeToNightCityRetailPacificaNetrunner, { as: P1 });

    const pending = engine.getState().G.turnMetadata.pendingChoice;
    if (pending?.type === "chooseTarget") {
      engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });
    }

    const operator = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P2);
    expect(operator.meta.spent).toBe(true);
    const rules = getEffectiveRules(engine.getState(), operator.instanceId as string);
    expect(rules).toContain("cantReady");
  });

  it("keeps the rival unit spent through their ready step, then expires on source next turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailPacificaNetrunner],
        eddies: 4,
        gigArea: [{ dieType: "d6", faceValue: 2 }],
      },
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
      },
    );

    engine.playCard(welcomeToNightCityRetailPacificaNetrunner, { as: P1 });
    const pending = engine.getState().G.turnMetadata.pendingChoice;
    if (pending?.type === "chooseTarget") {
      engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });
    }

    // Advance to rival's turn: ready step must leave the locked unit spent.
    engine.passPhase({ as: P1 });
    // May need a second pass depending on phase; drive until P2 is active.
    for (let i = 0; i < 6; i++) {
      if (engine.getActivePlayerId() === P2) break;
      const active = engine.getActivePlayerId();
      try {
        engine.passPhase({ as: active });
      } catch {
        break;
      }
    }

    const operatorOnRivalTurn = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P2);
    expect(operatorOnRivalTurn.meta.spent).toBe(true);
    expect(
      getEffectiveRules(engine.getState(), operatorOnRivalTurn.instanceId as string),
    ).toContain("cantReady");

    // Advance through rival's turn back to source player's next turn — lock expires
    // at the start of the source controller's next turn.
    let sawSourceAgain = false;
    for (let i = 0; i < 10; i++) {
      const active = engine.getActivePlayerId();
      if (active === P1 && i > 0) {
        sawSourceAgain = true;
        break;
      }
      try {
        engine.passPhase({ as: active });
      } catch {
        break;
      }
    }
    expect(sawSourceAgain).toBe(true);

    const operatorLater = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P2);
    // After source's next turn starts, cantReady expires; unit may still be spent
    // until its controller's ready step, but the rule must be gone.
    expect(getEffectiveRules(engine.getState(), operatorLater.instanceId as string)).not.toContain(
      "cantReady",
    );
  });

  it("does not spend a rival unit when Street Cred is odd", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailPacificaNetrunner],
        eddies: 4,
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false }],
      },
    );

    engine.playCard(welcomeToNightCityRetailPacificaNetrunner, { as: P1 });

    expect(engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2).meta.spent).toBe(
      false,
    );
  });
});
