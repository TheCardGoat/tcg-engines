import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailMaxtacSuppressionTeam,
  welcomeToNightCityRetailRidingNomad,
} from "@tcg/cyberpunk-cards";
import { getEffectiveRules } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2, expectNotAttackCandidate } from "../../../testing/index.ts";

describe("MaxTac Suppression Team", () => {
  it("is a yellow NCPD unit with cost 5 and power 7", () => {
    const card = welcomeToNightCityRetailMaxtacSuppressionTeam;
    expect(card.type).toBe("unit");
    expect(card.color).toBe("yellow");
    expect(card.classifications).toEqual(["NCPD"]);
    expect(card.cost).toBe(5);
    expect(card.power).toBe(7);
    expect(card.printNumber).toBe("050");
    expect(card.abilities[0]?.trigger).toMatchObject({
      trigger: "event",
      event: { event: "cardPlayed", player: "rival" },
    });
  });

  it("plays as a normal unit with lag", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailMaxtacSuppressionTeam],
      eddies: 5,
    });

    engine.playCard(welcomeToNightCityRetailMaxtacSuppressionTeam, { as: P1 });

    const maxTac = engine.getCard(welcomeToNightCityRetailMaxtacSuppressionTeam, "field", P1);
    expect(maxTac.meta.hasLag).toBe(true);
    expect(engine.getEddies(P1)).toBe(0);
  });

  it("grants cantAttack to a rival ADRENALINE unit played while MaxTac is on the field", () => {
    // Riding Nomad has ADRENALINE and would otherwise attack the turn it's played.
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailMaxtacSuppressionTeam,
            spent: false,
            hasLag: false,
          },
        ],
      },
      {
        hand: [welcomeToNightCityRetailRidingNomad],
        eddies: 4,
      },
    );

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.playCard(welcomeToNightCityRetailRidingNomad, { as: P2 });

    const nomad = engine.getCard(welcomeToNightCityRetailRidingNomad, "field", P2);
    const rules = getEffectiveRules(engine.getState(), nomad.instanceId as string);
    expect(rules).toContain("cantAttack");
    expectNotAttackCandidate(engine, welcomeToNightCityRetailRidingNomad, { as: P2 });
  });
});
