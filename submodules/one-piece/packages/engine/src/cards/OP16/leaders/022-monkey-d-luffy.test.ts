import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op16CatarinaDevon104 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-022 Monkey.D.Luffy", () => {
  test("with only {Impel Down} Characters it sets 2 DON!! active", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP16-022",
        character: [{ card: op16CatarinaDevon104, rested: true }],
        restedDon: 3,
      },
      {},
    );
    const luffyId = engine.leader("south");

    engine.activateEffect(luffyId, "activateMain", "south");
    engine.resolveDecision("effectSetActiveDon", { optionId: "2" }, "south");

    const view = engine.getView("south").players.south;
    expect(view.activeDon).toBe(2);
    expect(view.restedDon).toBe(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("is illegal while a non-{Impel Down} Character is on the field", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP16-022",
        character: [
          { card: op16CatarinaDevon104, rested: true },
          { card: eb01Doma005, rested: true },
        ],
        restedDon: 3,
      },
      {},
    );

    expect(() => engine.activateEffect(engine.leader("south"), "activateMain", "south")).toThrow();
    const view = engine.getView("south").players.south;
    expect(view.activeDon).toBe(0);
    expect(view.restedDon).toBe(3);
  });

  test("activates only once per turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP16-022",
        character: [{ card: op16CatarinaDevon104, rested: true }],
        restedDon: 3,
      },
      {},
    );
    const luffyId = engine.leader("south");

    engine.activateEffect(luffyId, "activateMain", "south");
    engine.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");
    expect(() => engine.activateEffect(luffyId, "activateMain", "south")).toThrow();

    const view = engine.getView("south").players.south;
    expect(view.activeDon).toBe(1);
    expect(view.restedDon).toBe(2);
  });

  test("keeps the up-to decline legal without touching DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP16-022",
        character: [{ card: op16CatarinaDevon104, rested: true }],
        restedDon: 3,
      },
      {},
    );
    const luffyId = engine.leader("south");

    engine.activateEffect(luffyId, "activateMain", "south");
    engine.resolveDecision("effectSetActiveDon", { optionId: "0" }, "south");

    const view = engine.getView("south").players.south;
    expect(view.activeDon).toBe(0);
    expect(view.restedDon).toBe(3);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
