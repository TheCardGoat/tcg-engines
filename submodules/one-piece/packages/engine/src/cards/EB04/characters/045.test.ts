import { describe, expect, test } from "vite-plus/test";
import { getCard } from "../../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-045", () => {
  test("[Activate: Main] rests itself and boosts a {Revolutionary Army} card when two 8-cost Characters exist", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ cardId: "EB04-045", rested: false }, "OP16-003", "OP17-005", "OP16-093"],
        activeDon: 5,
      },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const selfId = engine.findCardInZone("south", "character", "EB04-045");
    const kumaId = engine.findCardInZone("south", "character", "OP16-093");
    const kumaPower = engine
      .getView("south")
      .players.south.characters.find((c) => c?.instanceId === kumaId)?.power;

    engine.activateEffect(selfId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const boost = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (boost?.kind !== "selectEntity") throw new Error("Expected the boost target.");
    expect(boost.candidates.map((c) => c.ref.id)).toContain(kumaId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [kumaId] }, "south");

    const boosted = engine
      .getView("south")
      .players.south.characters.find((c) => c?.instanceId === kumaId);
    expect(boosted?.power).toBe((kumaPower ?? 0) + 1000);
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === selfId)
        ?.rested,
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("may rest below the threshold, with no power gain", () => {
    const engine = OnePieceTestEngine.create({ character: ["EB04-045"] });
    const id = engine.findCardInZone("south", "character", "EB04-045");
    engine.activateEffect(id, "activateMain");
    engine.resolveDecision("effectOptional", { optionId: "yes" });
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === id),
    ).toMatchObject({ rested: true, power: 2000 });
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test.each(["split", "opponent"] as const)("counts large Characters on %s fields", (placement) => {
    const engine = OnePieceTestEngine.create(
      { character: placement === "split" ? ["EB04-045", "OP17-005"] : ["EB04-045"] },
      { character: placement === "split" ? ["OP17-005"] : ["OP17-005", "OP17-005"] },
    );
    const id = engine.findCardInZone("south", "character", "EB04-045");
    engine.activateEffect(id, "activateMain");
    engine.resolveDecision("effectOptional", { optionId: "yes" });
    engine.resolveDecision("effectTargetSelection", { selectedIds: [id] });
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === id)?.power,
    ).toBe(3000);
  });

  test("can activate again after a synthetic ready effect; no once-per-turn limit is printed", () => {
    const event = getCard("OP01-059");
    const original = event.effects;
    try {
      // Synthetic ready action isolates reactivation of the same physical Ginny.
      event.effects = {
        effects: [
          {
            trigger: "main",
            actions: [
              {
                action: "setActive",
                target: { player: "self", zones: ["character"], count: { amount: 1, upTo: true } },
              },
            ],
          },
        ],
      };
      const engine = OnePieceTestEngine.create(
        { character: ["EB04-045"], hand: ["OP01-059"], activeDon: 3 },
        { character: ["OP17-005", "OP17-005"] },
      );
      const id = engine.findCardInZone("south", "character", "EB04-045");
      engine.activateEffect(id, "activateMain");
      engine.resolveDecision("effectOptional", { optionId: "yes" });
      engine.resolveDecision("effectTargetSelection", { selectedIds: [id] });
      engine.playCard("OP01-059");
      engine.resolveDecision("effectTargetSelection", { selectedIds: [id] });
      engine.activateEffect(id, "activateMain");
      engine.resolveDecision("effectOptional", { optionId: "yes" });
      engine.resolveDecision("effectTargetSelection", { selectedIds: [id] });
      expect(
        engine.getView("south").players.south.characters.find((c) => c?.instanceId === id)?.power,
      ).toBe(4000);
    } finally {
      event.effects = original;
    }
  });

  test("can decline the optional rest cost", () => {
    const engine = OnePieceTestEngine.create({ character: ["EB04-045", "OP17-005", "OP17-005"] });
    const id = engine.findCardInZone("south", "character", "EB04-045");
    engine.activateEffect(id, "activateMain");
    engine.resolveDecision("effectOptional", { optionId: "no" });
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === id),
    ).toMatchObject({ rested: false, power: 2000 });
  });
});
