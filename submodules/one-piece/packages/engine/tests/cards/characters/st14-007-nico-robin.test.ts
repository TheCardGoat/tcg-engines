import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op01Shanks120,
  prb02NicoRobinSt14007PirateFoil007,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST14-007 Nico Robin", () => {
  test("on play reduces an opposing Character by 5 cost when it controls a cost-8 Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [prb02NicoRobinSt14007PirateFoil007],
        character: [op01Shanks120],
        activeDon: prb02NicoRobinSt14007PirateFoil007.cost,
      },
      { character: [eb01MountainGod018] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(prb02NicoRobinSt14007PirateFoil007, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.cost,
    ).toBe(0);
  });

  test("when attacking applies the same cost reduction for the turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: prb02NicoRobinSt14007PirateFoil007, playedOnTurn: 0 }, op01Shanks120],
      },
      { character: [eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const robinId = engine.findCardInZone("south", "character", prb02NicoRobinSt14007PirateFoil007);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(robinId, engine.leader("north"), "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.cost,
    ).toBe(0);
  });
});
