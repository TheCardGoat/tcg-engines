import { describe, expect, test } from "vite-plus/test";
import { getCard } from "../../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../index.ts";

// Synthetic named-Leader boundary proof using existing alternateNames support.
// The catalog has no all-name Leader. These fixtures do not add wildcard semantics.
function withLeaderNames(cardId: string, names: string[], run: () => void) {
  const leader = getCard(cardId);
  const original = leader.alternateNames;
  leader.alternateNames = names;
  try {
    run();
  } finally {
    if (original === undefined) delete leader.alternateNames;
    else leader.alternateNames = original;
  }
}

describe("OP16 synthetic named-Leader boundaries", () => {
  test("OP16-058 changes a named Leader's base power for the current turn", () => {
    withLeaderNames("OP01-001", ["Prisoner of Impel Down"], () => {
      const engine = OnePieceTestEngine.create({
        leaderCardId: "OP01-001",
        hand: ["OP16-058"],
        activeDon: 10,
        character: ["OP16-042", "EB01-005"],
      });
      const before = engine.getView("south").players.south;
      engine.asSouth().play("OP16-058");
      const after = engine.getView("south").players.south;
      expect(after.leader.power).toBe(7000);
      expect(after.characters.find((c) => c?.cardId === "OP16-042")?.power).toBe(7000);
      expect(after.characters.find((c) => c?.cardId === "EB01-005")?.power).toBe(
        before.characters.find((c) => c?.cardId === "EB01-005")?.power,
      );
      engine.endTurn("south");
      expect(engine.getView("south").players.south.leader.power).toBe(before.leader.power);
    });
  });

  test.each([true, false])(
    "OP16-057 counts a named Leader plus one Prisoner Character: %s (Q1316)",
    (namedLeader) => {
      withLeaderNames("OP01-001", namedLeader ? ["Prisoner of Impel Down"] : [], () => {
        const engine = OnePieceTestEngine.create(
          {
            leaderCardId: "OP01-001",
            hand: ["OP16-057"],
            character: ["OP16-042"],
            activeDon: 5,
          },
          { character: ["OP16-004"] },
          { activeSeat: "north" },
        );
        const lifeBefore = engine.getView("south").players.south.lifeCount;
        engine.asNorth().attack("OP16-004", engine.leader("south"));
        engine.asSouth().chooseCounter("OP16-057");
        if (namedLeader) {
          engine.resolveDecision(
            "effectTargetSelection",
            { selectedIds: [engine.leader("south")] },
            "south",
          );
        }
        const view = engine.getView("south");
        expect(view.players.south.lifeCount).toBe(lifeBefore - (namedLeader ? 0 : 1));
        expect(view.players.south.trash.map((card) => card.cardId)).toContain("OP16-057");
        expect(view.prompts).toHaveLength(0);
      });
    },
  );

  test.each([true, false])(
    "OP16-087 can grant +20 cost to a Leader named Kouzuki Momonosuke: %s",
    (namedLeader) => {
      withLeaderNames("OP01-031", namedLeader ? ["Kouzuki Momonosuke"] : [], () => {
        const engine = OnePieceTestEngine.create(
          { leaderCardId: "OP01-031", hand: ["OP16-087"], activeDon: 5 },
          {},
        );
        const deckBefore = engine.getView("south").players.south.deckCount;
        engine.asSouth().play("OP16-087");
        engine.asSouth().acceptOptional();
        if (namedLeader) {
          engine.resolveDecision(
            "effectTargetSelection",
            { selectedIds: [engine.leader("south")] },
            "south",
          );
        }
        const view = engine.getView("south");
        expect(view.players.south.deckCount).toBe(deckBefore - 1);
        expect(view.players.south.trash.map((card) => card.cardId)).toContain("OP16-087");
        // Leaders have no printed cost in the projection; the public log proves application.
        const leaderCostGrants = view.logs.filter(
          (log) =>
            log.sourceCardId === "OP16-087" &&
            log.targetIds.includes(engine.leader("south")) &&
            log.message.includes("+20 cost"),
        );
        expect(leaderCostGrants).toHaveLength(namedLeader ? 1 : 0);
        expect(view.prompts).toHaveLength(0);
      });
    },
  );
});
