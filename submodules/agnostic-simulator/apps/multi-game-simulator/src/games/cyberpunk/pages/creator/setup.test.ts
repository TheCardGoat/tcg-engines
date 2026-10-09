import { describe, expect, it } from "vite-plus/test";
import { P1, P2 } from "@tcg/cyberpunk-engine";
import { buildCreatorEngine, creatorCards, emptySetup, setupSchema } from "./setup";

describe("creator scene setup", () => {
  it("round trips a setup and builds independent restart engines", () => {
    const setup = emptySetup();
    setup.player.eddies = 11;
    setup.opponent.eddies = 7;
    setup.activeSide = "opponent";
    const loaded = setupSchema.parse(JSON.parse(JSON.stringify(setup)));
    const first = buildCreatorEngine(loaded);
    const second = buildCreatorEngine(loaded);
    expect(first).not.toBe(second);
    expect(first.getCardsInZone("deck", P1)).toHaveLength(0);
    expect(first.getCardsInZone("deck", P2)).toHaveLength(0);
    expect(first.getState().G.players[P1].eddies).toBe(11);
    expect(first.getState().G.players[P2].eddies).toBe(7);
    expect(first.getState().G.turnMetadata.activePlayerId).toBe(P2);
  });
  it("keeps authored deck order, duplicate units, status and attached gear", () => {
    const setup = emptySetup();
    const unit = creatorCards.find((c) => c.type === "unit");
    const gear = creatorCards.find((c) => c.type === "gear");
    const program = creatorCards.find((c) => c.type === "program");
    if (!unit || !gear || !program) throw new Error("Incomplete catalog");
    const entry = (id: string) => ({ id, spent: false, faceDown: false, damage: 0, gearIds: [] });
    setup.player.field = [
      { ...entry(unit.id), spent: true, damage: 2, gearIds: [gear.id] },
      entry(unit.id),
    ];
    setup.player.deck = [entry(program.id), entry(unit.id)];
    const engine = buildCreatorEngine(setup);
    expect(engine.getCardsInZone("deck", P1).map((c) => c.definitionId)).toEqual([
      program.id,
      unit.id,
    ]);
    const units = engine.getCardsInZone("field", P1).filter((c) => c.definitionId === unit.id);
    expect(units).toHaveLength(2);
    expect(units[0].meta).toMatchObject({ spent: true, damage: 2 });
    expect(units[0].meta.attachedGearIds).toHaveLength(1);
  });
  it("rejects unknown cards, invalid Gigs, and cards in the wrong zone", () => {
    const setup = emptySetup();
    setup.player.hand.push({
      id: "missing",
      spent: false,
      faceDown: false,
      damage: 0,
      gearIds: [],
    });
    expect(setupSchema.safeParse(setup).success).toBe(false);
    setup.player.hand = [];
    setup.player.gigArea = [{ dieType: "d4", faceValue: 5 }];
    expect(setupSchema.safeParse(setup).success).toBe(false);
    setup.player.gigArea = [];
    const gear = creatorCards.find((c) => c.type === "gear");
    if (!gear) throw new Error("No gear in catalog");
    setup.player.field.push({ id: gear.id, spent: false, faceDown: false, damage: 0, gearIds: [] });
    expect(setupSchema.safeParse(setup).success).toBe(false);
  });
});
