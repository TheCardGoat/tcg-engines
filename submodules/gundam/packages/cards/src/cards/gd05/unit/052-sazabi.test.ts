import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd05Sazabi052 } from "./052-sazabi.ts";

describe("Sazabi (GD05-052)", () => {
  /** @behavioral-proof complete: optional sacrifice, exact mill provenance, tutor filters, and decline path are public. */
  describe("【Deploy】You may choose 1 of your other Units. Destroy it. If you do, place the top 3 cards of your deck into your trash. Add 1 (Neo Zeon) Unit card you placed from your deck with this effect to your hand.", () => {
    it("destroys another Unit, mills three, and offers only a newly milled Neo Zeon Unit", () => {
      const sacrifice = createMockUnit({ name: "Sacrifice" });
      const eligible = createMockUnit({ name: "Eligible Neo Zeon", traits: ["neo zeon"] });
      const wrongUnit = createMockUnit({ name: "Wrong Unit", traits: ["earth federation"] });
      const wrongType = createMockCommand({ name: "Neo Zeon Command", traits: ["neo zeon"] });
      const preexisting = createMockUnit({
        name: "Preexisting Neo Zeon",
        traits: ["neo zeon"],
      });
      const engine = GundamTestEngine.create({
        hand: [gd05Sazabi052],
        play: [sacrifice],
        trash: [preexisting],
        deck: [createMockUnit(), createMockCommand(), eligible, wrongUnit, wrongType],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const sacrificeId = p1.getCardsInZone("battleArea")[0]!;
      const preexistingId = p1.getCardsInZone("trash")[0]!;

      expectSuccess(p1.deployUnit(gd05Sazabi052));
      const optional = p1.getBoardView().pendingChoice;
      if (optional?.kind !== "targetSelection") {
        throw new Error("Expected Sazabi to offer its optional destruction");
      }
      expectSuccess(
        p1.resolveEffect({
          optionalAnswers: { [optional.directiveIndex]: true },
        }),
      );
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [sacrificeId],
      });
      expectSuccess(p1.resolveEffect({ targets: [sacrificeId] }));

      expect(p1.getCardZone(sacrificeId)).toBe(`trash:${PLAYER_ONE}`);
      const choice = p1.getBoardView().pendingChoice;
      expect(choice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: expect.not.arrayContaining([preexistingId]),
      });
      if (choice?.kind !== "targetSelection") {
        throw new Error("Expected the newly milled Neo Zeon choice");
      }
      expect(choice.legalTargetIds).toHaveLength(1);
      const eligibleId = choice.legalTargetIds[0]!;

      expectSuccess(p1.resolveEffect({ targets: [eligibleId] }));

      expect(p1.getCardZone(eligibleId)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getCardZone(preexistingId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(2);
    });

    it("may decline to destroy and leaves both the Unit and deck unchanged", () => {
      const sacrifice = createMockUnit({ name: "Sacrifice" });
      const engine = GundamTestEngine.create({
        hand: [gd05Sazabi052],
        play: [sacrifice],
        deck: [
          createMockUnit(),
          createMockCommand(),
          createMockUnit({ traits: ["neo zeon"] }),
          createMockUnit(),
          createMockCommand(),
        ],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const sacrificeId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(gd05Sazabi052));
      const optional = p1.getBoardView().pendingChoice;
      if (optional?.kind !== "targetSelection") {
        throw new Error("Expected Sazabi to offer its optional destruction");
      }
      expectSuccess(
        p1.resolveEffect({
          optionalAnswers: { [optional.directiveIndex]: false },
        }),
      );

      expect(p1.getCardZone(sacrificeId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(5);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });

    it("mills three and resolves without a choice when none is an eligible Neo Zeon Unit", () => {
      const sacrifice = createMockUnit({ name: "Sacrifice" });
      const engine = GundamTestEngine.create({
        hand: [gd05Sazabi052],
        play: [sacrifice],
        deck: [
          createMockUnit(),
          createMockCommand(),
          createMockUnit({ traits: ["earth federation"] }),
          createMockCommand({ traits: ["neo zeon"] }),
          createMockCommand(),
        ],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const sacrificeId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(gd05Sazabi052));
      const optional = p1.getBoardView().pendingChoice;
      if (optional?.kind !== "targetSelection") {
        throw new Error("Expected Sazabi to offer its optional destruction");
      }
      expectSuccess(
        p1.resolveEffect({
          optionalAnswers: { [optional.directiveIndex]: true },
        }),
      );
      expectSuccess(p1.resolveEffect({ targets: [sacrificeId] }));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(2);
      expect(p1.getBoardView().players[PLAYER_ONE]?.trashCount).toBe(4);
    });

    it("does nothing when Sazabi is deployed without another friendly Unit", () => {
      const engine = GundamTestEngine.create({
        hand: [gd05Sazabi052],
        deck: [
          createMockUnit(),
          createMockCommand(),
          createMockUnit({ traits: ["neo zeon"] }),
          createMockUnit(),
          createMockCommand(),
        ],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd05Sazabi052));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(5);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    });
  });
});
