import { describe, expect, it } from "vite-plus/test";

import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
  welcomeToNightCityRetailNetwatchNetdriver,
  welcomeToNightCityRetailOffdutyMalfini,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("NetWatch Netdriver (registration)", () => {
  it("is registered with the ingested card data", () => {
    expect(welcomeToNightCityRetailNetwatchNetdriver).toBeDefined();
    expect(welcomeToNightCityRetailNetwatchNetdriver.slug).toBe("netwatch-netdriver");
    expect(welcomeToNightCityRetailNetwatchNetdriver.type).toBe("gear");
    expect(welcomeToNightCityRetailNetwatchNetdriver.color).toBe("blue");
    expect(welcomeToNightCityRetailNetwatchNetdriver.set.code).toBe("welcometonightcityretail");
    expect(welcomeToNightCityRetailNetwatchNetdriver.cost).toBe(3);
    expect(welcomeToNightCityRetailNetwatchNetdriver.power).toBe(2);
  });
});

describe("NetWatch Netdriver — When this Unit or Legend is spent, draw 1", () => {
  it("draws 1 when the equipped Unit attacks a rival Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity],
        field: [
          {
            card: welcomeToNightCityRetailOffdutyMalfini,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailNetwatchNetdriver],
          },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
      },
    );

    const handBefore = engine.getCardsInZone("hand", P1).length;

    engine.attackUnit(
      welcomeToNightCityRetailOffdutyMalfini,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );

    expect(engine.getCardsInZone("hand", P1)).toHaveLength(handBefore + 1);
  });

  it("draws 1 on a direct attack (spend-based, not win-fight based)", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity],
        field: [
          {
            card: welcomeToNightCityRetailOffdutyMalfini,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailNetwatchNetdriver],
          },
        ],
      },
      {},
    );

    const handBefore = engine.getCardsInZone("hand", P1).length;

    engine.attackRival(welcomeToNightCityRetailOffdutyMalfini, { as: P1 });

    expect(engine.getCardsInZone("hand", P1)).toHaveLength(handBefore + 1);
  });

  it("emits a draw action log when the host is spent", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: 20,
        field: [
          {
            card: welcomeToNightCityRetailOffdutyMalfini,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailNetwatchNetdriver],
          },
        ],
      },
      {},
    );

    engine.attackRival(welcomeToNightCityRetailOffdutyMalfini, { as: P1 });

    const drawLogs = engine
      .getEvents("actionLog")
      .filter((event) => event.messageKey === "effect.draw.resolved");
    expect(drawLogs).toHaveLength(1);
  });

  it("declares the spend trigger and a single draw effect", () => {
    const ability = welcomeToNightCityRetailNetwatchNetdriver.abilities[0]!;
    expect(ability.trigger).toMatchObject({
      trigger: "event",
      event: { event: "cardSpent", player: "friendly", target: { selector: "host" } },
    });
    expect(ability.effects.map((effect) => effect.effect)).toEqual(["draw"]);
    expect(ability.effects[0]).toMatchObject({ effect: "draw", amount: 1 });
  });

  it("does not draw while the host is idle (no spend)", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity],
        field: [
          {
            card: welcomeToNightCityRetailOffdutyMalfini,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailNetwatchNetdriver],
          },
        ],
      },
      {},
    );

    const handBefore = engine.getCardsInZone("hand", P1).length;

    expect(engine.getCardsInZone("hand", P1)).toHaveLength(handBefore);
  });

  it("equips to a face-up Legend as host and binds the trigger to it", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: 20,
        legendArea: [
          {
            card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
            faceDown: false,
            attachedGears: [welcomeToNightCityRetailNetwatchNetdriver],
          },
        ],
      },
      {},
    );

    const legend = engine.getCard(
      welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
      "legendArea",
      P1,
    );
    expect(legend.meta.attachedGearIds).toHaveLength(1);

    const ability = welcomeToNightCityRetailNetwatchNetdriver.abilities[0]!;
    expect(ability.trigger!.trigger).toBe("event");
    expect(ability.source?.selector).toBe("host");
  });

  it("fires again next turn after the host readies and attacks again", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: 20,
        field: [
          {
            card: welcomeToNightCityRetailOffdutyMalfini,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailNetwatchNetdriver],
          },
        ],
      },
      {},
    );

    engine.attackRival(welcomeToNightCityRetailOffdutyMalfini, { as: P1 });
    engine.resolveFullSteal({ as: P1 });
    const handAfterFirst = engine.getCardsInZone("hand", P1).length;

    engine.completeTurn();
    engine.completeTurn();

    const handBeforeSecond = engine.getCardsInZone("hand", P1).length;
    engine.attackRival(welcomeToNightCityRetailOffdutyMalfini, { as: P1 });

    expect(engine.getCardsInZone("hand", P1)).toHaveLength(handBeforeSecond + 1);
    expect(handAfterFirst).toBeGreaterThan(0);
  });
});
