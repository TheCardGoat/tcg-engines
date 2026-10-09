import { describe, expect, it } from "vite-plus/test";

import { replayChatMessagesForBoard } from "./replayChat";

describe("replayChatMessagesForBoard", () => {
  const players = ["server-p1", "server-p2"] as const;

  it("maps presets, text, and system events onto the projected seats", () => {
    const messages = replayChatMessagesForBoard(
      [
        {
          id: "preset-1",
          senderPlayerId: "server-p1",
          senderSeat: 1,
          kind: "preset",
          presetKey: "good_luck",
          timestamp: 10,
        },
        {
          id: "text-1",
          senderPlayerId: "server-p2",
          senderSeat: 2,
          kind: "text",
          text: "Nice line",
          timestamp: 20,
        },
        {
          id: "system-1",
          senderPlayerId: "server-p1",
          senderSeat: 0,
          kind: "system",
          systemEvent: "undo_proposed",
          timestamp: 30,
        },
      ],
      players,
    );

    expect(messages).toEqual([
      expect.objectContaining({ kind: "preset", senderSide: "player", presetKey: "good_luck" }),
      expect.objectContaining({ kind: "text", senderSide: "opponent", text: "Nice line" }),
      expect.objectContaining({ kind: "system", text: "Undo requested." }),
    ]);
  });
});
