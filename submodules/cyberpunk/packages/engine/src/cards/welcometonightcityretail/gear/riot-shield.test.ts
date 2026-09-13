import { describe, expect, it } from "vite-plus/test";

import {
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
  welcomeToNightCityRetailOffdutyMalfini,
  welcomeToNightCityRetailRiotShield,
  welcomeToNightCityRetailVStreetkid,
} from "@tcg/cyberpunk-cards";
import { getEffectiveRules } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Riot Shield (registration)", () => {
  it("is registered with the ingested card data", () => {
    expect(welcomeToNightCityRetailRiotShield).toBeDefined();
    expect(welcomeToNightCityRetailRiotShield.slug).toBe("riot-shield");
    expect(welcomeToNightCityRetailRiotShield.type).toBe("gear");
    expect(welcomeToNightCityRetailRiotShield.color).toBe("green");
    expect(welcomeToNightCityRetailRiotShield.set.code).toBe("welcometonightcityretail");
    expect(welcomeToNightCityRetailRiotShield.cost).toBe(2);
    expect(welcomeToNightCityRetailRiotShield.power).toBe(1);
  });
});

describe("Riot Shield — Blocker + Rivals pay +2 €$ for Go Solo", () => {
  it("grants Blocker to the equipped friendly Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailRiotShield],
          },
        ],
      },
      {},
    );
    const host = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1);

    expect(getEffectiveRules(engine.getState(), host.instanceId)).toContain("blocker");
  });

  it("registers a rival Go Solo cost increase while attached", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailRiotShield],
          },
        ],
      },
      {},
    );

    const modifier = engine
      .getState()
      .G.activeEffects.find((e) => e.kind === "rivalGoSoloCostIncrease");
    expect(modifier).toBeDefined();
    expect(modifier?.amount).toBe(2);
    expect(modifier?.playerId).toBe(P1);
  });

  it("does not increase the controller's own Go Solo cost", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailRiotShield],
          },
        ],
        legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: false }],
        eddies: 5,
      },
      {},
    );
    const vId = engine.findCardId(welcomeToNightCityRetailVStreetkid, "legendArea", P1);

    const result = engine.executeMove("goSolo", { args: { cardId: vId as string } }, P1);

    expect(result.success).toBe(true);
  });

  it("lets a rival Go Solo once they pay the +2 €$ (7 eddies covers cost 5 + 2)", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailRiotShield],
          },
        ],
      },
      {
        legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: false }],
        eddies: 7,
      },
    );

    engine.completeTurn();
    const vId = engine.findCardId(welcomeToNightCityRetailVStreetkid, "legendArea", P2);
    const eddiesBefore = engine.getEddies(P2);

    const result = engine.executeMove("goSolo", { args: { cardId: vId as string } }, P2);

    expect(result.success).toBe(true);
    expect(engine.getEddies(P2)).toBe(eddiesBefore - 7);
  });

  it("equips to a face-up Legend as host and projects the cost modifier", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [
          {
            card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
            faceDown: false,
            attachedGears: [welcomeToNightCityRetailRiotShield],
          },
        ],
      },
      {},
    );

    const modifier = engine
      .getState()
      .G.activeEffects.find((e) => e.kind === "rivalGoSoloCostIncrease");
    expect(modifier).toBeDefined();
    const host = engine.getCard(
      welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
      "legendArea",
      P1,
    );
    expect(getEffectiveRules(engine.getState(), host.instanceId)).toContain("blocker");
  });

  it("does not project a cost modifier while not in play", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
      },
      {},
    );

    const modifier = engine
      .getState()
      .G.activeEffects.find((e) => e.kind === "rivalGoSoloCostIncrease");
    expect(modifier).toBeUndefined();
  });

  it("redirects a rival direct attack into a fight when the host Blocks", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailRiotShield],
          },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailOffdutyMalfini, spent: false, hasLag: false }],
      },
    );

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(welcomeToNightCityRetailOffdutyMalfini, { as: P2 });
    engine.resolveAttack({ as: P2 });
    engine.useBlocker(welcomeToNightCityRetailFieldOperator, { as: P1 });

    expect(engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1).meta.spent).toBe(
      true,
    );
    expect(engine.getState().G.attackState).toMatchObject({ kind: "fight" });
  });

  it("declares a host Blocker keyword and a +2 rival Go Solo cost modifier", () => {
    const card = welcomeToNightCityRetailRiotShield;
    expect(card.abilities).toContainEqual(
      expect.objectContaining({
        kind: "keyword",
        keyword: "blocker",
        source: { selector: "host" },
      }),
    );

    const staticAbility = card.abilities.find((a) => a.kind === "static")!;
    expect(staticAbility.effects[0]).toMatchObject({
      effect: "grantRivalGoSoloCostIncrease",
      amount: 2,
      duration: "continuous",
    });
  });
});
