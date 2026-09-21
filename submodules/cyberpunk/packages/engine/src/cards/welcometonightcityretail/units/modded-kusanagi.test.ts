import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDyingNightVSPistol,
  welcomeToNightCityRetailModdedKusanagi,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const kusanagi = welcomeToNightCityRetailModdedKusanagi;

describe("Modded Kusanagi retail printing", () => {
  it("is the exact blue 6-cost 8-power Tyger Claws Vehicle with ADRENALINE and end-turn return", () => {
    expect(kusanagi).toMatchObject({
      canonicalId: "modded-kusanagi",
      slug: "modded-kusanagi",
      name: "Modded Kusanagi",
      displayName: "Modded Kusanagi",
      type: "unit",
      color: "blue",
      classifications: ["Tyger Claws", "Vehicle"],
      cost: 6,
      power: 8,
      ram: 2,
      hasSellTag: false,
      printNumber: "120",
      keywords: ["adrenaline"],
      rulesText:
        "{Adrenaline} (This Unit can attack the turn it's played.)\nAt the end of your turn, return this Unit to its owner's hand.",
    });
    expect(kusanagi.abilities).toEqual([
      expect.objectContaining({
        kind: "keyword",
        keyword: "adrenaline",
        source: { selector: "self" },
        effects: [],
      }),
      expect.objectContaining({
        kind: "triggered",
        trigger: { trigger: "event", event: { event: "turnEnded", player: "friendly" } },
        source: { selector: "self" },
        effects: [
          {
            effect: "returnToHand",
            target: { selector: "self" },
            destinationOwner: "owner",
          },
        ],
      }),
    ]);
  });

  it("pays 6 Eddies and attacks on the played turn through ADRENALINE", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [kusanagi],
        eddies: 6,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, hasLag: false }],
      },
    );

    engine.playCard(kusanagi, { as: P1 });
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCard(kusanagi, "field", P1).meta.hasLag).toBe(true);
    const prompt = engine.getPrompt(P1);
    const attackMove = prompt.availableMoves.find((move) => move.moveId === "attackUnit");
    expect(attackMove?.inputSpec.type).toBe("selectPair");
    if (!attackMove || attackMove.inputSpec.type !== "selectPair") {
      throw new Error("Expected Kusanagi attack command");
    }
    expect(attackMove.inputSpec.fromCandidates).toContain(
      engine.getCard(kusanagi, "field", P1).instanceId,
    );

    engine.attackUnit(kusanagi, welcomeToNightCityRetailCorpoSecurity, {
      as: P1,
    });
    expect(engine.getAttackState()?.defenderId).toBe(
      engine.findCardId(welcomeToNightCityRetailCorpoSecurity, "field", P2),
    );
  });

  it("returns to its owner's hand at the end of its controller's turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: kusanagi, spent: true }],
    });

    engine.completeTurn({ as: P1 });

    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).not.toContain(
      kusanagi.id,
    );
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      kusanagi.id,
    );
    expect(engine.getActivePlayerId()).toBe(P2);
  });

  it("returns attached Gear to the owner's hand with the Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        {
          card: kusanagi,
          spent: true,
          attachedGears: [welcomeToNightCityRetailDyingNightVSPistol],
        },
      ],
    });

    engine.completeTurn({ as: P1 });

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toEqual(
      expect.arrayContaining([kusanagi.id, welcomeToNightCityRetailDyingNightVSPistol.id]),
    );
    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toEqual([]);
  });

  it("does not return at the end of a rival's turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: kusanagi, spent: false }] },
      {},
      { activePlayerId: P2 },
    );

    engine.completeTurn({ as: P2 });

    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      kusanagi.id,
    );
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).not.toContain(
      kusanagi.id,
    );
  });
});
