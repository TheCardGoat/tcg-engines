import { describe, expect, it } from "vite-plus/test";

import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
  welcomeToNightCityRetailNetwatchNetdriver,
  welcomeToNightCityRetailOffdutyMalfini,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const netdriver = welcomeToNightCityRetailNetwatchNetdriver;

function getAttachTargets(engine: CyberpunkTestEngine): string[] {
  const gearId = engine.getCard(netdriver, "hand", P1).instanceId;
  const playMove = engine.getPrompt(P1).availableMoves.find((move) => move.moveId === "playCard");
  if (!playMove || playMove.inputSpec.type !== "playCard") return [];
  return (
    playMove.inputSpec.candidates.find((candidate) => candidate.cardId === gearId)?.attachTargets ??
    []
  );
}

describe("NetWatch Netdriver", () => {
  it("is the exact blue 3-cost 2-power Netwatch Netrunner Cyberware Gear", () => {
    expect(netdriver).toMatchObject({
      canonicalId: "netwatch-netdriver",
      slug: "netwatch-netdriver",
      name: "NetWatch Netdriver",
      displayName: "NetWatch Netdriver",
      type: "gear",
      color: "blue",
      classifications: ["Cyberware", "Netrunner", "Netwatch"],
      cost: 3,
      power: 2,
      ram: 2,
      hasSellTag: true,
      printNumber: "129",
      rulesText:
        "(Equip to a friendly Unit or face-up Legend.)\nWhen this Unit or Legend is spent, draw 1.",
      attachment: {
        target: {
          selector: "card",
          controller: "friendly",
          zones: ["field", "legendArea"],
          cardTypes: ["unit", "legend"],
          face: "faceUp",
        },
      },
      abilities: [
        {
          kind: "triggered",
          trigger: {
            trigger: "event",
            event: {
              event: "cardSpent",
              player: "friendly",
              target: { selector: "host" },
            },
          },
          source: { selector: "host" },
          effects: [{ effect: "draw", player: "friendly", amount: 1 }],
        },
      ],
    });
  });

  it("offers only a friendly Unit and friendly face-up Legend as attachment hosts", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [netdriver],
        field: [{ card: welcomeToNightCityRetailOffdutyMalfini, spent: false }],
        legendArea: [
          { card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, faceDown: false },
          { card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, faceDown: true },
        ],
        eddies: 3,
      },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false }] },
    );
    const targets = getAttachTargets(engine);
    expect(targets).toContain(
      engine.findCardId(welcomeToNightCityRetailOffdutyMalfini, "field", P1),
    );
    expect(targets).toContain(
      engine.getCardsInZone("legendArea", P1).find((card) => card.meta.faceDown === false)
        ?.instanceId,
    );
    expect(targets).not.toContain(
      engine.getCardsInZone("legendArea", P1).find((card) => card.meta.faceDown === true)
        ?.instanceId,
    );
    expect(targets).not.toContain(
      engine.findCardId(welcomeToNightCityRetailCorpoSecurity, "field", P2),
    );
  });

  it("rejects a face-down friendly Legend and rival Unit without paying or moving the Gear", () => {
    const faceDownEngine = CyberpunkTestEngine.createWithFixture({
      hand: [netdriver],
      legendArea: [{ card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, faceDown: true }],
      eddies: 3,
    });
    const faceDownFailure = faceDownEngine.expectFailure(() =>
      faceDownEngine.attachGear(netdriver, welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, {
        as: P1,
      }),
    );
    expect(faceDownFailure.errorCode).toBe("INVALID_CHOICE");
    expect(faceDownEngine.getEddies(P1)).toBe(3);
    expect(faceDownEngine.getCard(netdriver, "hand", P1)).toBeDefined();

    const rivalEngine = CyberpunkTestEngine.createWithFixture(
      { hand: [netdriver], eddies: 3 },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false }] },
    );
    const rivalFailure = rivalEngine.expectFailure(() =>
      rivalEngine.attachGear(netdriver, welcomeToNightCityRetailCorpoSecurity, { as: P1 }),
    );
    expect(rivalFailure.errorCode).toBe("INVALID_CHOICE");
    expect(rivalEngine.getEddies(P1)).toBe(3);
    expect(rivalEngine.getCard(netdriver, "hand", P1)).toBeDefined();
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

  it("pays 3, attaches to a friendly Unit, adds 2 power, and draws 1 on a direct attack", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [netdriver],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        field: [{ card: welcomeToNightCityRetailOffdutyMalfini, spent: false, hasLag: false }],
        eddies: 3,
      },
      {},
    );

    const handBefore = engine.getCardsInZone("hand", P1).length;
    engine.attachGear(netdriver, welcomeToNightCityRetailOffdutyMalfini, { as: P1 });
    const host = engine.getCard(welcomeToNightCityRetailOffdutyMalfini, "field", P1);
    const gear = engine.getCard(netdriver, "field", P1);
    expect(engine.getEddies(P1)).toBe(0);
    expect(host.meta.attachedGearIds).toContain(gear.instanceId);
    expect(gear.meta.attachedToId).toBe(host.instanceId);
    expect(getEffectivePower(engine.getState(), host.instanceId)).toBe(
      welcomeToNightCityRetailOffdutyMalfini.power + 2,
    );

    engine.attackRival(welcomeToNightCityRetailOffdutyMalfini, { as: P1 });

    expect(engine.getCardsInZone("hand", P1)).toHaveLength(handBefore);
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

  it("does not draw when a different friendly Unit is spent", () => {
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
          { card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false },
        ],
      },
      {},
    );

    const handBefore = engine.getCardsInZone("hand", P1).length;
    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });

    expect(engine.getCardsInZone("hand", P1)).toHaveLength(handBefore);
  });

  it("pays 3, equips to a face-up Legend, and draws when that Legend spends", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [netdriver],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
        legendArea: [
          {
            card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
            faceDown: false,
            spent: false,
          },
        ],
        eddies: 4,
      },
      {},
    );

    engine.attachGear(netdriver, welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, {
      as: P1,
    });
    const handBeforeSpend = engine.getCardsInZone("hand", P1).length;
    engine.activateAbility(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, 1, { as: P1 });

    const legend = engine.getCard(
      welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
      "legendArea",
      P1,
    );
    expect(legend.meta.attachedGearIds).toHaveLength(1);
    expect(legend.meta.spent).toBe(true);
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCardsInZone("hand", P1)).toHaveLength(handBeforeSpend + 1);
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
