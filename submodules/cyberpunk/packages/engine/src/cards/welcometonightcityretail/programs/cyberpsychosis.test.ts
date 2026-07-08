import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCyberpsychosis,
  welcomeToNightCityRetailKiroshiOptics,
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailRidingNomad,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

function resolveFirstTriggerIfPending(engine: CyberpunkTestEngine): void {
  const choice = engine.getState().G.turnMetadata.pendingChoice;
  if (!choice || choice.type !== "chooseTrigger") return;
  const first = choice.payload.options[0];
  if (!first) return;
  engine.executeMove("resolveTrigger", { args: { triggerId: first.triggerId } }, choice.chooserId);
}

function resolveFirstEffectTargetIfPending(engine: CyberpunkTestEngine): void {
  const choice = engine.getState().G.turnMetadata.pendingChoice;
  if (!choice || choice.type !== "chooseTarget" || choice.payload.type !== "effectTarget") return;
  const first = choice.payload.eligibleIds?.[0];
  if (!first) return;
  engine.resolveEffectTargetIds([first], { as: choice.chooserId });
}

describe("Cyberpsychosis", () => {
  it("gives an equipped Unit +3 power per attached Gear and defeats it after it steals", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailCyberpsychosis],
        field: [
          {
            card: welcomeToNightCityRetailRidingNomad,
            spent: false,
            playedThisTurn: false,
            attachedGears: [
              welcomeToNightCityRetailKiroshiOptics,
              welcomeToNightCityRetailMantisBlades,
            ],
          },
        ],
        eddies: 3,
      },
      {
        gigArea: [{ dieType: "d6", faceValue: 2 }],
      },
    );
    const host = engine.getCard(welcomeToNightCityRetailRidingNomad, "field", P1);

    engine.playCard(welcomeToNightCityRetailCyberpsychosis, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailRidingNomad, { as: P1 });

    expect(getEffectivePower(engine.getState(), host.instanceId)).toBe(
      welcomeToNightCityRetailRidingNomad.power +
        welcomeToNightCityRetailKiroshiOptics.power +
        welcomeToNightCityRetailMantisBlades.power +
        6,
    );

    engine.attackRival(welcomeToNightCityRetailRidingNomad, { as: P1 });
    resolveFirstTriggerIfPending(engine);
    resolveFirstEffectTargetIfPending(engine);
    engine.resolveFullSteal({ as: P1 });
    expect(engine.getGigDice(P1).map((die) => die.dieType)).toContain("d6");

    engine.completeTurn({ as: P1 });

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailRidingNomad.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCyberpsychosis.id,
    );
  });

  it("does not prompt when no equipped Unit exists", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailCyberpsychosis],
      field: [{ card: welcomeToNightCityRetailRidingNomad, spent: false, playedThisTurn: false }],
      eddies: 3,
    });

    engine.playCard(welcomeToNightCityRetailCyberpsychosis, { as: P1 });

    engine.expectNoPendingChoice();
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCyberpsychosis.id,
    );
  });
});
