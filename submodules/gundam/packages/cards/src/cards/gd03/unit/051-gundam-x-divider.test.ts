import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03GundamXDivider051 } from "./051-gundam-x-divider.ts";

describe("Gundam X Divider (GD03-051)", () => {
  describe("【When Linked】You may choose 1 Unit card that is Lv.4 or lower from your trash. Pay its cost to deploy it.", () => {
    it("may pay the chosen Lv.4-or-lower Unit's cost to deploy it from trash", () => {
      const pilot = createMockPilot({ name: "Garrod Ran", level: 1, cost: 1 });
      const trashUnit = createMockUnit({
        cardNumber: "TEST-DIVIDER-L4",
        level: 4,
        cost: 2,
      });
      const engine = GundamTestEngine.create({
        hand: [pilot],
        play: [gd03GundamXDivider051],
        trash: [trashUnit],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const trashUnitId = p1.getCardsInZone("trash")[0]!;

      expectSuccess(p1.assignPilot(pilot, gd03GundamXDivider051));
      expectSuccess(p1.resolveEffect({ targets: [trashUnitId], optionalAnswers: { 0: true } }));

      expect(p1.getCardsInZone("battleArea")).toContain(trashUnitId);
      expect(p1.getCardsInZone("trash")).not.toContain(trashUnitId);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(3);
    });

    it("leaves the trash Unit and resources untouched when declined", () => {
      const pilot = createMockPilot({ name: "Jamil Neate", level: 1, cost: 1 });
      const trashUnit = createMockUnit({
        cardNumber: "TEST-DIVIDER-DECLINE",
        level: 4,
        cost: 2,
      });
      const engine = GundamTestEngine.create({
        hand: [pilot],
        play: [gd03GundamXDivider051],
        trash: [trashUnit],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const trashUnitId = p1.getCardsInZone("trash")[0]!;

      expectSuccess(p1.assignPilot(pilot, gd03GundamXDivider051));
      expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: false } }));

      expect(p1.getCardsInZone("trash")).toContain(trashUnitId);
      expect(p1.getCardsInZone("battleArea")).not.toContain(trashUnitId);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(1);
    });

    it("only considers Unit cards that are Lv.4 or lower", () => {
      const pilot = createMockPilot({ name: "Garrod Ran", level: 1, cost: 1 });
      const tooHighLevel = createMockUnit({
        cardNumber: "TEST-DIVIDER-L5",
        level: 5,
        cost: 1,
      });
      const validUnit = createMockUnit({
        cardNumber: "TEST-DIVIDER-L3",
        level: 3,
        cost: 1,
      });
      const engine = GundamTestEngine.create({
        hand: [pilot],
        play: [gd03GundamXDivider051],
        trash: [tooHighLevel, validUnit],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [tooHighLevelId, validUnitId] = p1.getCardsInZone("trash");

      expectSuccess(p1.assignPilot(pilot, gd03GundamXDivider051));
      expectSuccess(p1.resolveEffect({ targets: [validUnitId!], optionalAnswers: { 0: true } }));

      expect(p1.getCardsInZone("battleArea")).toContain(validUnitId);
      expect(p1.getCardsInZone("trash")).toEqual([tooHighLevelId]);
    });

    it("does not deploy from trash when the chosen Unit's cost cannot be paid", () => {
      const pilot = createMockPilot({ name: "Garrod Ran", level: 1, cost: 1 });
      const expensiveUnit = createMockUnit({
        cardNumber: "TEST-DIVIDER-EXPENSIVE",
        level: 4,
        cost: 3,
      });
      const engine = GundamTestEngine.create({
        hand: [pilot],
        play: [gd03GundamXDivider051],
        trash: [expensiveUnit],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const trashUnitId = p1.getCardsInZone("trash")[0]!;

      expectSuccess(p1.assignPilot(pilot, gd03GundamXDivider051));
      expectSuccess(p1.resolveEffect({ targets: [trashUnitId], optionalAnswers: { 0: true } }));

      expect(p1.getCardsInZone("trash")).toContain(trashUnitId);
      expect(p1.getCardsInZone("battleArea")).not.toContain(trashUnitId);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(1);
    });
  });
});
