import { describe, expect, test } from "vite-plus/test";
import type { EventCard } from "@tcg/op-types";
import { eb01Doma005, eb01MountainGod018, eb01OffWhite019 } from "@tcg/op-cards";
import { op10Perona036 } from "../../../../../cards/src/cards/OP10/characters/036-perona.ts";
import { registerCards } from "../../../../../cards/src/runtime-catalog.ts";

import { OnePieceTestEngine } from "../../../index.ts";

const restCharacter: EventCard = {
  ...eb01OffWhite019,
  id: "TEST-OP10-036-REST",
  canonicalId: "TEST-OP10-036-REST",
  name: "Perona Rest Review",
  cost: 0,
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "rest",
            target: { player: "opponent", zones: ["character"], count: { amount: 1, upTo: true } },
          },
        ],
      },
    ],
  },
};
registerCards([restCharacter]);

describe("OP10-036 Perona", () => {
  test("once per turn activates a rested DON!! when its effect rests a Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [restCharacter, restCharacter], character: [op10Perona036], restedDon: 2 },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const targets = engine
      .getView("south")
      .players.north.characters.flatMap((card) => (card ? [card.instanceId] : []));

    engine.playCard(restCharacter, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targets[0]!] }, "south");
    engine.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 1, restedDon: 1 });

    engine.playCard(restCharacter, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targets[1]!] }, "south");
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 1, restedDon: 1 });
  });
});
