import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { venousCore } from "./venous-core.ts";
import { elysianOrphan } from "../allies/elysian-orphan.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { breakApart } from "../../P26/actions/break-apart.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers YTO70fFsBY-a1
 * @covers YTO70fFsBY-a3
 */
describe("Venous Core", () => {
  it("requires its controller's Elysian ally and grants life only while on the field", () => {
    const champion = enableAllTestElements(
      createClassBonusTestChampion(venousCore, true, "floating-memory"),
    );
    const game = GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      playerOne: {
        champion,
        zones: {
          "material-deck": [venousCore],
          memory: [woodlandSquirrels],
          field: [elysianOrphan, woodlandSquirrels],
          hand: [breakApart, ...Array.from({ length: 5 }, () => woodlandSquirrels)],
          "main-deck": [woodlandSquirrels],
        },
      },
      playerTwo: { champion, zones: { field: [elysianOrphan] } },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      source = p.card(venousCore),
      paid = p.card(elysianOrphan);
    const life = (playerId: string) => {
      const player = game.player(playerId),
        hero = player.card(champion);
      return deriveGrandArchiveNumericProperty(game.state.objects[hero.objectId]!, "life", {
        program: game.program,
        state: game.state,
        controllerId: player.id,
        bindings: {},
      });
    };
    expect(life(p.id)).toBe(15);
    for (const selection of [
      [],
      [p.card(woodlandSquirrels, { zone: "field" }).objectId],
      [q.card(elysianOrphan).objectId],
    ]) {
      const before = game.state;
      expect(() => p.materialize(source, { costSelections: [selection] })).toThrow();
      expect(game.state).toEqual(before);
    }
    p.materialize(source, { costSelections: [[paid.objectId]] });
    passEffectsStack(game);
    advanceToMain(game, p.id);
    expect(game.state.objects[paid.objectId]!.zone).toBe("graveyard");
    expect(life(p.id)).toBe(20);
    expect(life(q.id)).toBe(15);
    p.activate(breakApart, {
      reservePayment: p
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 5)
        .map((ref) => ({ kind: "card", cardId: ref.objectId })),
      targets: { "target-1": [source.objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
    expect(life(p.id)).toBe(15);
    expect(life(q.id)).toBe(15);
  });
});

import { proveElysianAura } from "../../../testing/elysian-aura.ts";
/** @covers YTO70fFsBY-a2 */
describe("venous-core — Elysian Aura", () => {
  proveElysianAura(venousCore);
});
