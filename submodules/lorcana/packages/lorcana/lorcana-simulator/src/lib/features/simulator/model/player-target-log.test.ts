import { expect, it } from "bun:test";
import type { CardInstanceId, MoveLog, PlayerId } from "@tcg/lorcana-engine";
import type { MoveLogEntrySnapshot } from "./contracts";
import { formatEventLogBody } from "./event-log-formatting";

for (const third of ["player_three", "third-seat-uuid"]) {
  it(`formats known opponent ${third} as a player while retaining card targets`, () => {
    const source = "chemical-source" as CardInstanceId;
    const item = "own-item" as CardInstanceId;
    const log: MoveLog = {
      moveType: "resolveEffect",
      playerId: "player_two" as PlayerId,
      timestamp: 1,
      public: [
        {
          key: "lorcana.effect.resolve.targetSelection",
          values: {
            playerId: "player_two" as PlayerId,
            sourceCardId: source,
            targets: [third as PlayerId, item],
          },
        },
      ],
    };
    const entry: MoveLogEntrySnapshot = {
      id: "choice",
      timestamp: 1,
      turnNumber: 2,
      moveId: "resolveEffect",
      title: "",
      playerId: "player_two",
      typedLogEntry: log,
      knownPlayerIds: ["player_one", "player_two", third],
    };
    const lookedUp: string[] = [];
    const result = formatEventLogBody(entry, "playerTwo", "en", (id) => {
      lookedUp.push(id);
      return { label: id === source ? "Chemical Reaction" : "Inkcaster Skates" };
    });
    expect(result.segments).toContainEqual({
      kind: "player",
      text: third,
      tone: "opponent",
      playerId: third,
    });
    expect(
      result.segments.some((segment) => segment.kind === "card" && segment.cardId === item),
    ).toBe(true);
    expect(lookedUp).not.toContain(third);
    expect(result.text).toContain(third);
    expect(result.text).toContain("Inkcaster Skates");
  });
}
