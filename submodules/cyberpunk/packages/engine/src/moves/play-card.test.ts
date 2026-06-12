import { beforeAll, describe, expect, it } from "vite-plus/test";
import "../testing/matchers.d.ts";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  createMockGear,
  createMockLegend,
  createMockProgram,
  createMockUnit,
  registerMatchers,
} from "../testing/index.ts";

beforeAll(() => {
  registerMatchers();
});

const moveIds = (engine: CyberpunkTestEngine, pid = P1) =>
  engine.getPrompt(pid).availableMoves.map((m) => m.moveId);

function playCardCandidateIds(engine: CyberpunkTestEngine, pid = P1): string[] {
  const move = engine.getPrompt(pid).availableMoves.find((entry) => entry.moveId === "playCard");
  if (!move || move.inputSpec.type !== "playCard") return [];
  return move.inputSpec.candidates.map((candidate) => candidate.cardId);
}

function spendFirstLegends(engine: CyberpunkTestEngine, count: number) {
  const legends = engine.getCardsInZone("legendArea", P1);
  for (const legend of legends.slice(0, count)) {
    engine.judgeSpendCard(legend, { as: P1 });
  }
}

describe("playCard", () => {
  describe("available()", () => {
    it("is listed when the active player has cards in hand during main phase", () => {
      const unit = createMockUnit({ cost: 1 });
      const engine = CyberpunkTestEngine.createWithFixture({ hand: [unit], eddies: 5 });
      expect(moveIds(engine)).toContain("playCard");
    });

    it("is not listed when the player has no cards in hand", () => {
      const engine = CyberpunkTestEngine.createWithFixture({ hand: [], eddies: 5 });
      expect(moveIds(engine)).not.toContain("playCard");
    });

    it("is not listed for the non-active player", () => {
      const unit = createMockUnit({ cost: 1 });
      const engine = CyberpunkTestEngine.createWithFixture({}, { hand: [unit], eddies: 5 });
      expect(moveIds(engine, P2)).not.toContain("playCard");
    });

    it("lists a cost-2 hand card when one Eddie and one face-down Legend can pay", () => {
      const unit = createMockUnit({ cost: 2 });
      const legends = [
        createMockLegend({ name: "Legend A" }),
        createMockLegend({ name: "Legend B" }),
        createMockLegend({ name: "Legend C" }),
      ];
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [unit],
        legendArea: legends,
        eddies: 1,
      });
      spendFirstLegends(engine, 2);

      expect(playCardCandidateIds(engine)).toContain(engine.findCardId(unit, "hand", P1));
    });
  });

  describe("validate()", () => {
    it("succeeds for a unit with sufficient eddies", () => {
      const unit = createMockUnit({ cost: 2, power: 3 });
      const engine = CyberpunkTestEngine.createWithFixture({ hand: [unit], eddies: 5 });
      expect(engine.playCard(unit)).toBeSuccessfulCommand();
    });

    it("fails with INSUFFICIENT_EDDIES when cost > eddies", () => {
      const unit = createMockUnit({ cost: 5 });
      const engine = CyberpunkTestEngine.createWithFixture({ hand: [unit], eddies: 1 });
      engine.spendAllLegends();
      const failure = engine.expectFailure(() => engine.playCard(unit));
      expect(failure.errorCode).toBe("INSUFFICIENT_EDDIES");
    });

    it("allows ready face-down legends to pay card costs", () => {
      const unit = createMockUnit({ cost: 2 });
      const legends = [
        createMockLegend({ name: "Legend A" }),
        createMockLegend({ name: "Legend B" }),
        createMockLegend({ name: "Legend C" }),
      ];
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [unit],
        legendArea: legends,
        eddies: 1,
      });
      spendFirstLegends(engine, 2);

      expect(engine.playCard(unit)).toBeSuccessfulCommand();
    });

    it("does not count spent face-down legends toward card costs", () => {
      const unit = createMockUnit({ cost: 3 });
      const legends = [
        createMockLegend({ name: "Legend A" }),
        createMockLegend({ name: "Legend B" }),
        createMockLegend({ name: "Legend C" }),
      ];
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [unit],
        legendArea: legends,
        eddies: 1,
      });
      spendFirstLegends(engine, 2);

      const failure = engine.expectFailure(() => engine.playCard(unit));
      expect(failure.errorCode).toBe("INSUFFICIENT_EDDIES");
    });

    it("fails with CARD_NOT_IN_HAND when the card is in another zone", () => {
      const unit = createMockUnit({ cost: 1 });
      const engine = CyberpunkTestEngine.createWithFixture({ field: [unit], eddies: 5 });
      const cardId = engine.findCardId(unit, "field", P1);
      const result = engine.executeMove("playCard", { args: { cardId: cardId as string } }, P1);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errorCode).toBe("CARD_NOT_IN_HAND");
      }
    });

    it("fails with WRONG_PHASE outside the main phase", () => {
      const unit = createMockUnit({ cost: 1 });
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [unit], eddies: 5 },
        {},
        { skipSetup: false },
      );
      const failure = engine.expectFailure(() => engine.playCard(unit));
      expect(failure.errorCode).toBe("WRONG_PHASE");
    });

    it("fails with NOT_YOUR_TURN when the rival tries to play a card", () => {
      const unit = createMockUnit({ cost: 1 });
      const engine = CyberpunkTestEngine.createWithFixture({}, { hand: [unit], eddies: 5 });
      const failure = engine.expectFailure(() => engine.playCard(unit, { as: P2 }));
      expect(failure.errorCode).toBe("NOT_YOUR_TURN");
    });
  });

  describe("execute()", () => {
    it("moves a unit from hand to field and decrements eddies by cost", () => {
      const unit = createMockUnit({ cost: 2 });
      const engine = CyberpunkTestEngine.createWithFixture({ hand: [unit], eddies: 5 });

      engine.playCard(unit);

      expect(engine.getCard(unit, "field", P1)).toBeInZone("field");
      expect(engine.getState()).toHaveEddies({ player: "p1", count: 3 });
      expect(engine.getState()).toHaveZoneCounts({ player: "p1", hand: 0, field: 1 });
    });

    it("plays multiple unit instances with the same name without attach targets", () => {
      const unit = createMockUnit({ id: "same-name-unit", name: "Mirror Runner", cost: 0 });
      const host = createMockUnit({ id: "existing-host-unit", name: "Mirror Runner", cost: 0 });
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [unit, unit, unit],
        field: [host],
        eddies: 5,
      });

      const promptMove = engine
        .getPrompt(P1)
        .availableMoves.find((move) => move.moveId === "playCard");
      expect(promptMove?.inputSpec.type).toBe("playCard");
      if (promptMove?.inputSpec.type !== "playCard") return;

      const sameNameCandidates = promptMove.inputSpec.candidates.filter((candidate) => {
        const card = engine.getState().G.cardIndex[candidate.cardId];
        return card?.definitionId === unit.id;
      });
      expect(sameNameCandidates).toHaveLength(3);
      expect(sameNameCandidates.every((candidate) => candidate.attachTargets === undefined)).toBe(
        true,
      );

      for (let i = 0; i < 3; i++) {
        const nextUnitId = engine
          .getCardsInZone("hand", P1)
          .find((card) => card.definitionId === unit.id)?.instanceId;
        expect(nextUnitId).toBeDefined();

        const result = engine.executeMove(
          "playCard",
          { args: { cardId: nextUnitId as string } },
          P1,
        );
        expect(result).toBeSuccessfulCommand();
        expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
      }

      expect(
        engine.getCardsInZone("field", P1).filter((card) => card.definitionId === unit.id),
      ).toHaveLength(3);
    });

    it("spends a ready face-down legend for the portion not covered by eddies", () => {
      const unit = createMockUnit({ cost: 2 });
      const legends = [
        createMockLegend({ name: "Legend A" }),
        createMockLegend({ name: "Legend B" }),
        createMockLegend({ name: "Legend C" }),
      ];
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [unit],
        legendArea: legends,
        eddies: 1,
      });
      spendFirstLegends(engine, 2);

      engine.playCard(unit);

      expect(engine.getCard(unit, "field", P1)).toBeInZone("field");
      expect(engine.getState()).toHaveEddies({ player: "p1", count: 0 });
      expect(engine.getSpentLegends(P1)).toHaveLength(3);
      expect(engine.getFaceDownLegends(P1)).toHaveLength(3);
    });

    it("stamps a played unit with playedThisTurn", () => {
      const unit = createMockUnit({ cost: 0 });
      const engine = CyberpunkTestEngine.createWithFixture({ hand: [unit], eddies: 5 });

      engine.playCard(unit);

      const inst = engine.getCard(unit, "field", P1);
      expect(inst.meta.playedThisTurn).toBe(true);
    });

    it("sends a played program to trash (one-shot)", () => {
      const program = createMockProgram({ cost: 1 });
      const engine = CyberpunkTestEngine.createWithFixture({ hand: [program], eddies: 5 });

      engine.playCard(program);

      expect(engine.getCard(program, "trash", P1)).toBeInZone("trash");
      expect(engine.getState()).toHaveZoneCounts({ player: "p1", hand: 0, field: 0, trash: 1 });
    });

    it("attaches gear to a friendly unit when attachToId is provided", () => {
      const host = createMockUnit({ cost: 1 });
      const gear = createMockGear({ cost: 1 });
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [gear],
        field: [host],
        eddies: 5,
      });

      engine.attachGear(gear, host);

      expect(engine.getCard(gear, "field", P1)).toBeInZone("field");
      const hostInst = engine.getCard(host, "field", P1);
      expect(hostInst.meta.attachedGearIds).toContain(engine.findCardId(gear, "field", P1));
      const gearInst = engine.getCard(gear, "field", P1);
      expect(gearInst.meta.attachedToId).toBe(engine.findCardId(host, "field", P1));
    });

    it("emits cardPlayed and actionLog events", () => {
      const unit = createMockUnit({ cost: 2, name: "Stryker" });
      const engine = CyberpunkTestEngine.createWithFixture({ hand: [unit], eddies: 5 });

      engine.playCard(unit);

      const cardPlayed = engine.getEvents("cardPlayed");
      expect(cardPlayed).toHaveLength(1);
      expect(cardPlayed[0]).toMatchObject({ type: "cardPlayed", playerId: P1, cost: 2 });

      const log = engine.getLastActionLog();
      expect(log?.messageKey).toBe("move.playCard");
    });
  });
});
