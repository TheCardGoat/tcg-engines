import { describe, expect, it } from "vitest";
import { treacleDrownedMouse } from "./treacle-drowned-mouse.ts";

import { proveEphemeralStealth } from "../../../testing/ephemeral-stealth.ts";
/** @covers 6emPe9OEUn-a1 @covers 6emPe9OEUn-a3 */
describe("treacle-drowned-mouse — ephemeral Stealth", () => {
  proveEphemeralStealth(treacleDrownedMouse, 2, true);
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { sparkAlight } from "../../DOA/actions/spark-alight.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 6emPe9OEUn-a3 */
for (const matching of [false, true])
  it(`Treacle Ephemerate requires Alice and a separate valid hand discard, Alice=${matching}`, () => {
    const champion = enableAllTestElements(lineageTestChampion(matching ? "Alice" : "Other", 0));
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [sparkAlight, woodlandSquirrels, woodlandSquirrels],
          graveyard: [treacleDrownedMouse, sparkAlight],
        },
      },
      playerTwo: { champion, zones: { hand: [sparkAlight] } },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      source = p.card(treacleDrownedMouse),
      discard = p.card(sparkAlight, { zone: "hand" });
    const reservePayment = p
      .cards(woodlandSquirrels)
      .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
    const before = game.state;
    for (const invalid of [
      [],
      [q.card(sparkAlight).objectId],
      [p.card(sparkAlight, { zone: "graveyard" }).objectId],
      [discard.objectId, discard.objectId],
      [reservePayment[0]!.cardId],
    ]) {
      expect(() =>
        p.activate(source, {
          activationMethod: "ephemerate",
          reservePayment,
          costSelections: [invalid],
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
    }
    const activate = () =>
      p.activate(source, {
        activationMethod: "ephemerate",
        reservePayment,
        costSelections: [[discard.objectId]],
      });
    if (!matching) {
      expect(activate).toThrow();
      expect(game.state).toEqual(before);
    } else {
      activate();
      expect(game.state.objects[discard.objectId]!.zone).toBe("graveyard");
      expect(p.zone("memory")).toHaveLength(2);
      passEffectsStack(game);
      expect(game.state.objects[source.objectId]!.zone).toBe("field");
      expect(game.state.objects[source.objectId]!.states.has("ephemeral")).toBe(true);
    }
  });
