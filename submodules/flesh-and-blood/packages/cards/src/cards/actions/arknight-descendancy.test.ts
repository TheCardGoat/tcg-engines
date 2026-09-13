import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { viserai } from "../heroes/viserai.ts";
import { dash } from "../heroes/dash.ts";
import { embraceUrsurBlue } from "./embrace-ursur.ts";
import { arknightDescendancyBlue } from "./arknight-descendancy.ts";

/**
 * Arknight Descendancy — Shadow Runeblade Action - Attack, cost 5, 6{p}.
 *
 * Printed: Viserai Specialization. This costs {r} less to play for each
 * Runechant you control. When this is banished from anywhere, you may pay
 * up to 3{h}. Create that many Runechant tokens. Blood Debt
 */

describe("Arknight Descendancy AAA", () => {
  it("happy: each controlled Runechant reduces the play cost by {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [arknightDescendancyBlue],
        arena: [
          fabToken("runechant"),
          fabToken("runechant"),
          fabToken("runechant"),
          fabToken("runechant"),
          fabToken("runechant"),
        ],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(viserai).attackWith(arknightDescendancyBlue);
    expectCombat(game).toBeOpen().toHaveAttackPower(6);
  });

  it("boundary: without Runechants the printed {r}{r}{r}{r}{r} cost cannot be paid", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [arknightDescendancyBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    expectFabUnplayable(
      () => Viserai.playAttack(arknightDescendancyBlue),
      /cannot be paid|unpayable/i,
    );
    expectFabCard(Viserai, arknightDescendancyBlue).toBeIn("hand");
  });

  it("UST notes: triggers when banished from hand and creates Runechants equal to life paid", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [embraceUrsurBlue, arknightDescendancyBlue],
        resourcePoints: 1,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.playAttack(embraceUrsurBlue, { stopAt: "on-attack" });
    Viserai.accept();
    game.advanceToDecision(Viserai, "boolean");
    Viserai.accept();
    game.advanceToDecision(Viserai, "effect-resolution");
    Viserai.choose("2");
    game.advanceUntil({ stopAt: "defend", optionals: "throw", entityTargets: "throw" });

    expectFabCard(Viserai, arknightDescendancyBlue).toBeBanished();
    expectFabPlayer(Viserai).toHaveLife(18).toHaveTokenCount("runechant", 3);
    expectCombat(game).toHaveAttackPower(1).toHaveKeyword("go-again");
  });
});
