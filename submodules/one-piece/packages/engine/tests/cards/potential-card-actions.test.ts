import { st01Nami007 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";

import { getLegalCommands, getPotentialCardCommands, OnePieceTestEngine } from "../../src/index.ts";

describe("getPotentialCardCommands", () => {
  test("keeps a structurally applicable but unaffordable card with an engine reason", () => {
    const engine = OnePieceTestEngine.create({ hand: [st01Nami007], activeDon: 0 });
    const instanceId = engine.findCardInZone("south", "hand", st01Nami007);

    expect(
      getLegalCommands(engine.getState(), "south").some(
        (command) => command.type === "playCard" && command.sourceId === instanceId,
      ),
    ).toBe(false);
    expect(
      getPotentialCardCommands(engine.getState(), "south").find(
        (command) => command.type === "playCard" && command.sourceId === instanceId,
      ),
    ).toMatchObject({
      enabled: false,
      disabledReason: "Not enough active DON!! to pay the cost.",
      disabledReasonCode: "insufficient-don",
    });
  });

  test("uses the same predicate to enable a legal card action", () => {
    const engine = OnePieceTestEngine.create({ hand: [st01Nami007], activeDon: 10 });
    const instanceId = engine.findCardInZone("south", "hand", st01Nami007);

    expect(
      getPotentialCardCommands(engine.getState(), "south").find(
        (command) => command.type === "playCard" && command.sourceId === instanceId,
      ),
    ).toMatchObject({
      enabled: true,
    });
  });
});
