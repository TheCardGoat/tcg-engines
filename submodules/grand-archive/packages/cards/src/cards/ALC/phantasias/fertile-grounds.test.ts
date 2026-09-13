import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../items/potion-of-healing.ts";
import { blightroot } from "../tokens/blightroot.ts";
import { fertileGrounds } from "./fertile-grounds.ts";

/** @covers 8bls6g7xgw-a1 */
describe("Fertile Grounds — controlled Herb token copy", () => {
  it("triggers only on its controller's recollection and copies only a controlled Herb Item", () => {
    const champion = lineageTestChampion("Fertile Grounds test", 0);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [fertileGrounds, blightroot, potionOfHealing],
          "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: [blightroot],
          "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const original = player.card(blightroot, { zone: "field" });
    advanceToRecollection(game, opponent.id);
    expect(game.state.stack).toHaveLength(0);

    advanceToRecollection(game, player.id);
    expect(game.state.stack).toMatchObject([
      { kind: "triggered-ability", ability: { id: "8bls6g7xgw-a1" } },
    ]);
    passEffectsStack(game);
    expect(game.state.decision?.kind).toBe("resolve-effect-choice");
    for (const invalid of [
      player.card(potionOfHealing, { zone: "field" }),
      opponent.card(blightroot, { zone: "field" }),
    ]) {
      const before = game.state;
      expect(() => answerDecision(game, "resolve-effect-choice", [invalid.objectId])).toThrow();
      expect(game.state).toEqual(before);
    }
    answerDecision(game, "resolve-effect-choice", [original.objectId]);
    passEffectsStack(game);

    const herbs = player.cards(blightroot, { zone: "field" });
    expect(herbs).toHaveLength(2);
    const copy = herbs.find((card) => card.objectId !== original.objectId);
    if (!copy) throw new Error("Expected a distinct Blightroot copy");
    expect(game.state.objects[copy.objectId]).toMatchObject({
      isToken: true,
      controllerId: player.id,
      ownerId: player.id,
      zone: "field",
    });
    expect(game.state.objects[copy.objectId]!.states.has("rested")).toBe(false);
  });
});
