import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op15Hotori072, op15Kotori064, op15Satori066 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-064 Kotori / OP15-072 Hotori named pair", () => {
  test("Kotori rests an opposing Character of 5000 or less with Satori and Hotori present", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op15Kotori064 }, { card: op15Satori066 }, { cardId: "OP15-072" }],
        activeDon: 4,
      },
      {
        character: [
          { cardId: "OP13-013", rested: false, attachedDon: 1 },
          { cardId: "OP16-096", rested: false, attachedDon: 1 },
        ],
      },
    );
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    engine.activateEffect(
      engine.findCardInZone("south", "character", op15Kotori064),
      "activateMain",
      "south",
    );
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const rest = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (rest?.kind !== "selectEntity") throw new Error("Expected the rest target.");
    const candidates = rest.candidates.map((candidate) => candidate.ref.id);
    expect(candidates).toContain(higumaId);
    expect(candidates).not.toContain(engine.findCardInZone("north", "character", "OP16-096"));
    engine.resolveDecision("effectTargetSelection", { selectedIds: [higumaId] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === higumaId)
        ?.rested,
    ).toBe(true);
    expect(engine.getView("south").players.south.activeDon).toBe(2);
    expect(engine.getView("south").players.south.restedDon).toBe(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Hotori debuffs an opposing Character by 3000 with the pair present", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op15Hotori072 }, { card: op15Satori066 }, { cardId: "OP15-064" }],
        activeDon: 4,
      },
      { character: [{ card: eb01Doma005, rested: false }] },
    );
    const domaId = engine.getView("south").players.north.characters[0]!.instanceId!;

    engine.activateEffect(
      engine.findCardInZone("south", "character", op15Hotori072),
      "activateMain",
      "south",
    );
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the debuff target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [domaId] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === domaId)?.power,
    ).toBe(0);
    expect(engine.getView("south").players.south.activeDon).toBe(2);
    expect(engine.getView("south").players.south.restedDon).toBe(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("declining the windows leaves DON!! and characters untouched", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op15Kotori064 },
          { card: op15Hotori072 },
          { card: op15Satori066 },
          { cardId: "OP15-064" },
        ],
        activeDon: 4,
      },
      { character: [{ cardId: "OP13-013", rested: false }] },
    );
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    for (const id of ["OP15-064", "OP15-072"]) {
      const cardId = engine.findCardInZone("south", "character", id);
      if (cardId === undefined) continue;
      engine.activateEffect(cardId, "activateMain", "south");
      engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    }

    const south = engine.getView("south").players.south;
    expect(south.activeDon).toBe(4);
    expect(south.characters.find((c) => c?.cardId === "OP15-064")?.rested ?? false).toBe(false);
    expect(south.characters.find((c) => c?.cardId === "OP15-072")?.rested ?? false).toBe(false);
    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === higumaId)
        ?.rested ?? false,
    ).toBe(false);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test.each(["OP15-064", "OP15-072"])(
    "%s returns rested and attached DON!! without active DON!!",
    (cardId) => {
      const otherId = cardId === "OP15-064" ? "OP15-072" : "OP15-064";
      const engine = OnePieceTestEngine.create(
        { character: [{ cardId, attachedDon: 1 }, "OP15-066", otherId], restedDon: 1 },
        { character: [eb01Doma005] },
      );
      const source = engine.findCardInZone("south", "character", cardId);
      const beforeDonDeck = engine.getView("south").players.south.donDeckCount;
      engine.activateEffect(source, "activateMain", "south");
      engine.acceptLeadingOptional("south");
      engine.resolveDecision(
        "effectTargetSelection",
        { selectedIds: [engine.findCardInZone("north", "character", eb01Doma005)] },
        "south",
      );
      const south = engine.getView("south").players.south;
      expect(south.activeDon).toBe(0);
      expect(south.restedDon).toBe(0);
      expect(south.donDeckCount).toBe(beforeDonDeck + 2);
      expect(south.characters.find((c) => c?.instanceId === source)?.attachedDon).toBe(0);
      expect(south.characters.find((c) => c?.instanceId === source)?.rested).toBe(true);
      expect(engine.getView("south").prompts).toHaveLength(0);
    },
  );
});
