import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04GnX075 } from "./075-gn-x.ts";

describe("GN-X (GD04-075)", () => {
  const matchingCommand = (trait: "un" | "superpower bloc", index: number) =>
    createMockCommand({ name: `${trait} Command ${index}`, traits: [trait] });

  it("reduces its hand cost by the number of UN/Superpower Bloc Command cards in your trash", () => {
    const engine = GundamTestEngine.create({
      hand: [gd04GnX075],
      trash: [
        matchingCommand("un", 1),
        matchingCommand("superpower bloc", 2),
        matchingCommand("un", 3),
      ],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const gnXId = p1.getCardsInZone("hand")[0]!;

    expectSuccess(p1.deployUnit(gnXId));

    expect(p1.getCardsInZone("battleArea")).toContain(gnXId);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(3);
  });

  it("does not count nonmatching trash cards", () => {
    const engine = GundamTestEngine.create({
      hand: [gd04GnX075],
      trash: [
        matchingCommand("un", 1),
        createMockCommand({ name: "Other Command", traits: ["mafty"] }),
        createMockUnit({ name: "UN Unit", traits: ["un"] }),
      ],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.deployUnit(gd04GnX075), "INSUFFICIENT_RESOURCES");
  });
});
