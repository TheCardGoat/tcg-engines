import { describe, expect, it } from "vitest";
import { cintariSellsword } from "../../../cards/src/cards/tokens/cintari-sellsword.ts";
import { bravo } from "../../../cards/src/cards/heroes/bravo.ts";
import { dash } from "../../../cards/src/cards/heroes/dash.ts";
import { snatchRed } from "../../../cards/src/cards/actions/snatch.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import { quoteFabAttackTargets } from "./legality-quotes.ts";
import { snapshotDeclaredAttackTarget } from "./combat-target.ts";

describe("declared combat target identity", () => {
  it("does not follow an ally through a new incarnation", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, arena: [cintariSellsword], deck: 6 },
    );
    const attacker = game.as(bravo);
    const defender = game.as(dash);
    const attackId = attacker.findCardInZone("hand", snatchRed);
    const allyId = defender.findCardInZone("arena", cintariSellsword);
    const target = quoteFabAttackTargets(game.getState(), {
      actorId: attacker.id,
      attackInstanceId: attackId,
    }).candidates.find((candidate) => candidate.targetId === allyId)?.target;
    if (!target || target.kind === "hero") throw new Error("Expected an ally attack target.");
    const declared = {
      kind: "object" as const,
      ref: target.ref,
      controllerIdAtDeclaration: target.controllerId,
    };

    expect(snapshotDeclaredAttackTarget(game.getState(), declared)).not.toBeNull();
    const live = game.getState().objects[allyId]!;
    game.getState().objects[allyId] = { ...live, incarnation: live.incarnation + 1 };

    expect(snapshotDeclaredAttackTarget(game.getState(), declared)).toBeNull();
  });
});
