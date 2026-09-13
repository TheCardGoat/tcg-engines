import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailDeadmanTransmitter,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailRidingNomad,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const transmitter = welcomeToNightCityRetailDeadmanTransmitter;

describe("Deadman Transmitter", () => {
  it("is a red Cyberware/Trauma Team gear", () => {
    expect(transmitter).toMatchObject({
      type: "gear",
      color: "red",
      classifications: ["Cyberware", "Trauma Team"],
      cost: 3,
      power: 1,
      printNumber: "024",
    });
  });

  it("is defeated instead of its host when the host would be defeated in a fight", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: true,
            hasLag: false,
            attachedGears: [transmitter],
          },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailRidingNomad, spent: false, hasLag: false }],
      },
    );

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackUnit(welcomeToNightCityRetailRidingNomad, welcomeToNightCityRetailFieldOperator, {
      as: P2,
    });
    engine.resolveFullFight({ as: P2 });

    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      transmitter.id,
    );
  });
});
