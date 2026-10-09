import { describe, expect, it } from "vite-plus/test";
import { P1 } from "@tcg/cyberpunk-engine";
import { buildCreatorEngine, captureCreatorSetup, creatorCards, emptySetup } from "./setup";
import { placeCard } from "./placement";

const unit = creatorCards.find((card) => card.type === "unit")!;
const gear = creatorCards.find((card) => card.type === "gear")!;
const legend = creatorCards.find((card) => card.type === "legend")!;

describe("interactive scene placement", () => {
  it("places duplicates independently and moves status and attachments between players", () => {
    const original = emptySetup();
    let setup = placeCard(original, { id: unit.id }, { side: "player", zone: "field" });
    setup = placeCard(setup, { id: unit.id }, { side: "player", zone: "field" });
    setup.player.field[0].damage = 3;
    setup = placeCard(setup, { id: gear.id }, { side: "player", zone: "field", hostIndex: 0 });
    setup = placeCard(
      setup,
      { id: unit.id, location: { side: "player", zone: "field", index: 0 } },
      { side: "opponent", zone: "field" },
    );
    expect(original.player.field).toHaveLength(0);
    expect(setup.player.field).toHaveLength(1);
    expect(setup.opponent.field[0]).toMatchObject({ damage: 3, gearIds: [gear.id] });
    const engine = buildCreatorEngine(setup);
    expect(captureCreatorSetup(engine.getState(), setup.name)).toEqual(setup);
  });
  it("moves gear from hand onto a host and excludes the attachment as a standalone field card", () => {
    let setup = placeCard(emptySetup(), { id: unit.id }, { side: "player", zone: "field" });
    setup = placeCard(setup, { id: gear.id }, { side: "player", zone: "hand" });
    setup = placeCard(
      setup,
      { id: gear.id, location: { side: "player", zone: "hand", index: 0 } },
      { side: "player", zone: "field", hostIndex: 0 },
    );
    expect(setup.player.hand).toHaveLength(0);
    const engine = buildCreatorEngine(setup);
    expect(engine.getCardsInZone("field", P1)).toHaveLength(2);
    const captured = captureCreatorSetup(engine.getState(), "Edited scene");
    expect(captured.player.field).toHaveLength(1);
    expect(captured.player.field[0].gearIds).toEqual([gear.id]);
  });
  it("rejects invalid drops without changing the draft and defaults new Legends face down", () => {
    const setup = emptySetup();
    expect(() => placeCard(setup, { id: gear.id }, { side: "player", zone: "field" })).toThrow(
      "Drop gear",
    );
    expect(() => placeCard(setup, { id: unit.id }, { side: "player", zone: "legendArea" })).toThrow(
      "Only Legends",
    );
    expect(setup.player.field).toHaveLength(0);
    expect(
      placeCard(setup, { id: legend.id }, { side: "player", zone: "legendArea" }).player
        .legendArea[0].faceDown,
    ).toBe(true);
  });
});
