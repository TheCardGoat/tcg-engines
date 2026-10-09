import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST02-009 Law", () => {
  test("readies a rested cost<=5 Supernovas or Heart Pirates only", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST02-009"],
      activeDon: 5,
      character: [
        { cardId: "ST02-012", rested: true },
        { cardId: "ST02-003", rested: true },
        { cardId: "ST02-006", rested: true },
        "ST02-003",
      ],
    });
    const bepo = e.findCardInZone("south", "character", "ST02-012");
    const urouge = e
      .getView("south")
      .players.south.characters.find((c) => c?.cardId === "ST02-003" && c.rested)!.instanceId;
    e.playCard("ST02-009", "south");
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw Error("ready choice");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([bepo, urouge]);
    e.resolveDecision("effectTargetSelection", { selectedIds: [bepo] }, "south");
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === bepo)?.rested,
    ).toBe(false);
  });
  test("may choose no Character to set active with an eligible rested target", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST02-009"],
      activeDon: 5,
      character: [{ cardId: "ST02-012", rested: true }],
    });
    const target = e.findCardInZone("south", "character", "ST02-012");
    e.playCard("ST02-009", "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === target)?.rested,
    ).toBe(true);
    expect(e.getView("south").players.south.characters.some((c) => c?.cardId === "ST02-009")).toBe(
      true,
    );
    expect(e.getView("south").players.south).toMatchObject({ activeDon: 0, restedDon: 5 });
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
