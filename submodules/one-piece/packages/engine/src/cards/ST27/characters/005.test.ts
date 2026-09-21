import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("ST27-005", () => {
  test("[Activate: Main] rests itself to K.O. a Character with cost 3 or less", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "ST27-005", rested: false }], activeDon: 11 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const selfId = engine.findCardInZone("south", "character", "ST27-005");
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    engine.activateEffect(selfId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const ko = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (ko?.kind !== "selectEntity") throw new Error("Expected the K.O. target.");
    expect(ko.candidates.map((c) => c.ref.id)).toContain(higumaId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [higumaId] }, "south");

    expect(engine.getView("south").players.north.trash.map((c) => c.instanceId)).toContain(
      higumaId,
    );
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === selfId)
        ?.rested,
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Activate: Main] declined K.O.s nothing", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "ST27-005", rested: false }], activeDon: 11 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const selfId = engine.findCardInZone("south", "character", "ST27-005");
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    engine.activateEffect(selfId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.north.trash.map((c) => c.instanceId)).not.toContain(
      higumaId,
    );
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === selfId)
        ?.rested,
    ).toBe(false);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
