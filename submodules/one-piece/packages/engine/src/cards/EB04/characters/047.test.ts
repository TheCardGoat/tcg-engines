import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-047", () => {
  test("[Activate: Main] trashes itself to play a {SWORD} Character with cost 3 or less", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "EB04-047", rested: false }], hand: ["EB03-008"], activeDon: 5 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const selfId = engine.findCardInZone("south", "character", "EB04-047");

    engine.activateEffect(selfId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected the play choice.");
    const hibariId = play.candidates[0]!.ref.id;
    engine.resolveDecision("effectPlaySelection", { selectedIds: [hibariId] }, "south");
    // Hibari's own [On Play] offers an optional target: decline it.
    const hibari = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (hibari?.kind === "selectEntity") {
      engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    }

    expect(engine.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(selfId);
    expect(engine.getView("south").players.south.characters.map((c) => c?.instanceId)).toContain(
      hibariId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Activate: Main] declined leaves the Character in play", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "EB04-047", rested: false }], hand: ["EB03-008"], activeDon: 5 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const selfId = engine.findCardInZone("south", "character", "EB04-047");

    engine.activateEffect(selfId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south.trash).toHaveLength(0);
    expect(engine.getView("south").players.south.characters.map((c) => c?.instanceId)).toContain(
      selfId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
