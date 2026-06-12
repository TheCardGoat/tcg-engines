import { describe, expect, it } from "vite-plus/test";
import {
  alphaKiroshiOptics,
  alphaMantisBlades,
  alphaSwordwiseHuscle,
  spoilerCyberpsychosis,
  welcomeToNightCityRetailCyberpsychosis,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Cyberpsychosis", () => {
  it("is an attack-window Quickhack that scales power by equipped Gear count", () => {
    const ability = spoilerCyberpsychosis.abilities[0]!;
    expect(ability.kind).toBe("triggered");
    expect(ability.trigger).toMatchObject({ trigger: "event", event: { event: "cardAttacks" } });
    expect(ability.costs).toHaveLength(2);
    expect(ability.effects.map((effect) => effect.effect)).toEqual(["modifyPower", "delayed"]);
  });

  it("keeps the selected equipped unit available as a concrete fixture target", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [spoilerCyberpsychosis],
      field: [
        {
          card: alphaSwordwiseHuscle,
          spent: false,
          playedThisTurn: false,
          attachedGears: [alphaKiroshiOptics, alphaMantisBlades],
        },
      ],
      eddies: 2,
    });

    const host = engine.getCard(alphaSwordwiseHuscle, "field", P1);
    expect(host.meta.attachedGearIds).toHaveLength(2);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      spoilerCyberpsychosis.id,
    );
  });

  it("retail version defeats the selected unit at end of turn only after it attacks", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailCyberpsychosis],
        field: [
          {
            card: alphaSwordwiseHuscle,
            spent: false,
            playedThisTurn: false,
            attachedGears: [alphaMantisBlades],
          },
        ],
        eddies: 3,
      },
      {
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );

    engine.playCard(welcomeToNightCityRetailCyberpsychosis, { as: P1 });
    engine.resolveEffectTarget(alphaSwordwiseHuscle, { as: P1 });
    engine.attackRival(alphaSwordwiseHuscle, { as: P1 });
    engine.resolveAttack({ as: P1 });
    engine.resolveAttack({ as: P2, pass: true });
    engine.resolveAttack({
      as: P1,
      gigIdsToSteal: [engine.findGigIdByType(P2, "d4")],
    });
    engine.passPhase({ as: P1 });

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      alphaSwordwiseHuscle.id,
    );
  });

  it("retail version does not defeat the selected unit if it never fights or steals", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailCyberpsychosis],
      field: [
        {
          card: alphaSwordwiseHuscle,
          spent: false,
          playedThisTurn: false,
          attachedGears: [alphaKiroshiOptics],
        },
      ],
      eddies: 3,
    });

    engine.playCard(welcomeToNightCityRetailCyberpsychosis, { as: P1 });
    engine.resolveEffectTarget(alphaSwordwiseHuscle, { as: P1 });
    engine.passPhase({ as: P1 });

    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      alphaSwordwiseHuscle.id,
    );
  });
});
