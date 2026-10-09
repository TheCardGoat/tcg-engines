import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-001 Portgas.D.Ace", () => {
  test("[Activate:Main] [Once Per Turn] grants [Rush] to a WB 8000-power Character", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP16-001", character: ["OP16-004"], activeDon: 5 },
      {},
    );
    const aceId = engine.leader("south");
    engine.activateEffect(aceId, "activateMain", "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the rush target.");
    const curielId = target.candidates.find((c) => c.publicInfo?.cardId === "OP16-004")?.ref.id;
    if (!curielId) throw new Error("Expected Curiel candidate.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [curielId] }, "south");

    // [Rush]: the Character can attack even though it just gained the keyword.
    const lifeBefore = engine.getView("south").players.north.lifeCount;
    engine.asSouth().attack("OP16-004", engine.asNorth().leader());
    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 1);
  });

  test("both named Luffy and Whitebeard alternatives require current power at least 8000", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP16-001", character: ["OP02-062", "OP16-004", "OP02-018"] },
      {},
    );
    e.asSouth().activateMain(e.leader("south"));
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step.kind !== "selectEntity") throw new Error("Expected Rush target");
    expect(step.candidates.map((c) => c.publicInfo?.cardId)).toEqual(["OP16-004"]);
    e.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    const result = e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: e.leader("south"),
      trigger: "activateMain",
    });
    expect(result.reason).toMatch(/already|once/i);
  });
  test("a newly played Luffy reaching 8000 with DON gains Rush and can attack", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "OP16-001",
        character: [{ cardId: "OP02-062", playedOnTurn: 3 }],
        activeDon: 1,
        hand: [],
      },
      {},
      { turnNumber: 3 },
    );
    const luffy = e.findCardInZone("south", "character", "OP02-062");
    e.asSouth().attachDon(luffy, 1);
    e.asSouth().activateMain(e.leader("south"));
    e.resolveDecision("effectTargetSelection", { selectedIds: [luffy] }, "south");
    const life = e.getView("south").players.north.lifeCount;
    e.asSouth().attack(luffy, e.leader("north"));
    expect(e.getView("south").players.north.lifeCount).toBe(life - 1);
  });
});
