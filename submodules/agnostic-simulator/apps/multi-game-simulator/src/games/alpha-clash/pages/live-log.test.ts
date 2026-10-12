import { describe, expect, it } from "vitest";
import { logLinesFromEngineLogs, mergeLiveLogLines } from "./live-log";

describe("Alpha Clash live event log", () => {
  it("shows canonical correction records with actor and before/after values", () => {
    const log = {
      timestamp: 123,
      sequence: 21,
      public: [{ defaultMessage: "Correction by player-two: player-one health: 28 → 27" }],
    };
    expect(
      logLinesFromEngineLogs(
        [
          { stateVersion: 4, log },
          { stateVersion: 4, tag: "engine_log", data: log },
        ],
        4,
      ),
    ).toEqual({
      lines: [
        { id: 5, key: "4:123:21", text: "Correction by player-two: player-one health: 28 → 27" },
        { id: 6, key: "4:123:21", text: "Correction by player-two: player-one health: 28 → 27" },
      ],
      nextId: 6,
    });
  });

  it("shows an acknowledgement and room update once, while retaining repeated messages from distinct commands", () => {
    const first = {
      id: 1,
      key: "4:123:21",
      text: "Correction by player-one: Portal: closed → open",
    };
    const second = { ...first, id: 2, key: "5:124:22" };
    expect(mergeLiveLogLines([first], [first, second], 200)).toEqual([second, first]);
  });

  it("does not read private appendices or display malformed records", () => {
    expect(
      logLinesFromEngineLogs(
        [
          null,
          {},
          {
            log: {
              public: [],
              privateByPlayerId: {
                opponent: [{ defaultMessage: "Secret card name" }],
              },
            },
          },
          { log: { public: [null, { defaultMessage: 3 }] } },
        ],
        7,
      ),
    ).toEqual({ lines: [], nextId: 7 });
  });
});
