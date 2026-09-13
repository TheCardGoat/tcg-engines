import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import {
  advanceToMain,
  declareResolvedAttack,
  passEffectsStack,
} from "../../../testing/decisions.ts";
import { mordredFlawlessBlade } from "./mordred-flawless-blade.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { cleanCut } from "../attacks/clean-cut.ts";
import { baubleOfMending } from "../items/bauble-of-mending.ts";
/** @covers WI2owxIw0z-a1 */
describe("Mordred grants usable Floating Memory only to own graveyard attacks", () => {
  it("pays with existing and newly resolved attacks while rejecting other owners, zones, and types", () => {
    const starter = lineageTestChampion("Mordred", 0),
      game = GrandArchiveTestEngine.startFixture({
        phase: "materialize",
        playerOne: {
          champion: starter,
          lineage: [lineageTestChampion("Mordred", 1), mordredFlawlessBlade],
          zones: {
            hand: [cleanCut, woodlandSquirrels, woodlandSquirrels],
            graveyard: [cleanCut, woodlandSquirrels],
            banishment: [cleanCut],
            "material-deck": [baubleOfMending, baubleOfMending],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion: starter,
          zones: {
            graveyard: [cleanCut],
            "material-deck": [baubleOfMending],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
      });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      first = p.cards(baubleOfMending, { zone: "material-deck" })[0]!,
      grave = p.card(cleanCut, { zone: "graveyard" }),
      held = p.card(cleanCut, { zone: "hand" }),
      before = game.state;
    for (const bad of [
      q.card(cleanCut),
      held,
      p.card(cleanCut, { zone: "banishment" }),
      p.card(woodlandSquirrels, { zone: "graveyard" }),
    ]) {
      expect(() => p.materialize(first, { floatingMemoryCardIds: [bad.objectId] })).toThrow();
      expect(game.state).toEqual(before);
    }
    p.materialize(first, { floatingMemoryCardIds: [grave.objectId] });
    expect(game.state.objects[grave.objectId]!.zone).toBe("banishment");
    expect(p.zone("memory")).toHaveLength(0);
    passEffectsStack(game);
    expect(game.state.objects[first.objectId]!.zone).toBe("field");
    advanceToMain(game, p.id);
    p.activate(held, {
      reservePayment: p
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 2)
        .map((c) => ({ kind: "card", cardId: c.objectId })),
      attackAttackerId: p.card(starter).objectId,
    });
    passEffectsStack(game);
    declareResolvedAttack(
      game,
      p.card(starter).objectId,
      q.card(starter).objectId,
      "Resolve the next Floating Memory attack",
    );
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[held.objectId]!.zone).toBe("graveyard");
    for (let step = 0; step < 64; step++) {
      const wait = game.waitState();
      if (wait.kind === "materialization-choice" && wait.playerId === q.id) break;
      if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
      game.player(wait.playerId).pass();
    }
    const opponentState = game.state;
    expect(() =>
      q.materialize(baubleOfMending, { floatingMemoryCardIds: [q.card(cleanCut).objectId] }),
    ).toThrow();
    expect(game.state).toEqual(opponentState);
    q.execute({ move: "skip-materialization" });
    advanceToMain(game, q.id);
    for (let step = 0; step < 64; step++) {
      const wait = game.waitState();
      if (wait.kind === "materialization-choice" && wait.playerId === p.id) break;
      if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
      game.player(wait.playerId).pass();
    }
    const second = p.card(baubleOfMending, { zone: "material-deck" });
    p.materialize(second, { floatingMemoryCardIds: [held.objectId] });
    passEffectsStack(game);
    expect(game.state.objects[held.objectId]!.zone).toBe("banishment");
    expect(game.state.objects[second.objectId]!.zone).toBe("field");
    expect(q.card(cleanCut, { zone: "graveyard" })).toBeDefined();
  });
});
