import { describe, expect, it } from "vitest";
import { practiceLogLines } from "./Practice.page";

describe("practice event-log extraction", () => {
  it("reads player-facing lines from adapter EngineLogRecords", () => {
    // Shape proven by the adapter: each record envelopes the canonical log
    // on `.log`, whose public messages carry defaultMessage.
    const records = [
      {
        gameId: "probe",
        stateVersion: 1,
        timestamp: 1,
        sourceAuthority: "server",
        log: {
          moveType: "mulligan",
          playerId: "human",
          timestamp: 1,
          public: [
            {
              key: "alpha-clash.log.entry",
              values: { logType: "framework.mulligan" },
              defaultMessage: "human takes a mulligan.",
            },
          ],
        },
      },
      {
        gameId: "probe",
        stateVersion: 2,
        timestamp: 2,
        sourceAuthority: "server",
        log: {
          moveType: "playCard",
          playerId: "human",
          timestamp: 2,
          public: [
            { key: "alpha-clash.log.entry", defaultMessage: "human plays Undying Juggernaut." },
          ],
        },
      },
    ];
    expect(practiceLogLines(records)).toEqual([
      "human takes a mulligan.",
      "human plays Undying Juggernaut.",
    ]);
  });

  it("skips records without messages and tolerates junk input", () => {
    expect(practiceLogLines([{ log: { public: [] } }, { junk: true }, null, "str"])).toEqual([]);
    expect(practiceLogLines([])).toEqual([]);
  });
});
