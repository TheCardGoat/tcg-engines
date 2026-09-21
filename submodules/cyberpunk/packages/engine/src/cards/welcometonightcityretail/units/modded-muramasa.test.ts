import { describe, expect, it } from "vite-plus/test";
import { welcomeToNightCityRetailModdedMuramasa } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const muramasa = welcomeToNightCityRetailModdedMuramasa;

describe("Modded Muramasa", () => {
  it("is the exact blue 5-cost 4-power Vehicle with its conditional end-turn ready", () => {
    expect(muramasa).toMatchObject({
      canonicalId: "modded-muramasa",
      slug: "modded-muramasa",
      name: "Modded Muramasa",
      displayName: "Modded Muramasa",
      type: "unit",
      color: "blue",
      classifications: ["Vehicle"],
      cost: 5,
      power: 4,
      ram: 2,
      hasSellTag: false,
      printNumber: "121",
      rulesText:
        "At the end of your turn, if you have less ☆ (Street Cred) than a Rival, ready this Unit.",
      abilities: [
        {
          kind: "triggered",
          trigger: { trigger: "event", event: { event: "turnEnded", player: "friendly" } },
          source: { selector: "self" },
          effects: [
            {
              effect: "ready",
              target: { selector: "self" },
              conditions: [
                {
                  condition: "streetCredComparison",
                  controller: "friendly",
                  comparison: "lt",
                  other: "rival",
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it("readies at the end of your turn when you have less Street Cred than a Rival", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: muramasa, spent: true, hasLag: false }],
        gigArea: [{ dieType: "d6", faceValue: 2 }],
      },
      {
        gigArea: [{ dieType: "d8", faceValue: 8 }],
      },
    );

    expect(engine.getCard(muramasa, "field", P1).meta.spent).toBe(true);
    engine.completeTurn({ as: P1 });
    expect(engine.getCard(muramasa, "field", P1).meta.spent).toBe(false);
  });

  it.each([
    {
      label: "equal",
      friendlyGigs: [{ dieType: "d8" as const, faceValue: 6 }],
      rivalGigs: [{ dieType: "d10" as const, faceValue: 6 }],
    },
    {
      label: "greater",
      friendlyGigs: [{ dieType: "d10" as const, faceValue: 9 }],
      rivalGigs: [{ dieType: "d8" as const, faceValue: 8 }],
    },
    {
      label: "friendly Null",
      friendlyGigs: [],
      rivalGigs: [{ dieType: "d8" as const, faceValue: 8 }],
    },
    {
      label: "rival Null",
      friendlyGigs: [{ dieType: "d4" as const, faceValue: 2 }],
      rivalGigs: [],
    },
  ])(
    "does not ready when Street Cred is $label rather than less",
    ({ friendlyGigs, rivalGigs }) => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: muramasa, spent: true, hasLag: false }],
          gigArea: friendlyGigs,
        },
        {
          gigArea: rivalGigs,
        },
      );

      engine.completeTurn({ as: P1 });
      expect(engine.getCard(muramasa, "field", P1).meta.spent).toBe(true);
    },
  );

  it("does not trigger at the end of a rival's turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: muramasa, spent: true, hasLag: false }],
        gigArea: [{ dieType: "d4", faceValue: 2 }],
      },
      { gigArea: [{ dieType: "d8", faceValue: 8 }] },
      { activePlayerId: P2 },
    );
    const muramasaId = engine.getCard(muramasa, "field", P1).instanceId;

    engine.completeTurn({ as: P2 });

    expect(engine.getCard(muramasa, "field", P1).meta.spent).toBe(false);
    expect(
      engine.getEvents("effectTriggered").filter((event) => event.sourceCardId === muramasaId),
    ).toHaveLength(0);
  });

  it("leaves an already-ready Muramasa ready when the condition is true", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: muramasa, spent: false, hasLag: false }],
        gigArea: [{ dieType: "d4", faceValue: 2 }],
      },
      { gigArea: [{ dieType: "d8", faceValue: 8 }] },
    );

    engine.completeTurn({ as: P1 });

    expect(engine.getCard(muramasa, "field", P1).meta.spent).toBe(false);
    expect(engine.getEvents("cardReadied")).toHaveLength(0);
  });
});
