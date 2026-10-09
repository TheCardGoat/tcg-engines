import { describe } from "vitest";
import { synthDisrupter } from "./synth-disrupter.ts";
import { proveTemporaryEntryReplacement } from "../../../testing/temporary-entry-replacement.ts";
/** @covers z1vdxi74wa-a1 */
describe("Synth Disrupter's temporary rested entries", () =>
  proveTemporaryEntryReplacement(synthDisrupter, "z1vdxi74wa-a1", false));

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { settleEntryReplacements } from "../../../testing/temporary-entry-replacement.ts";
import { summonSentinels } from "../../ALC/actions/summon-sentinels.ts";
import { automatonDrone } from "../../ALC/tokens/automaton-drone.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";

for (const own of [false, true])
  it(`summons both Automaton tokens rested while retaining their printed buff counters: own=${own}`, () => {
    const champion = enableAllTestElements(
      createClassBonusTestChampion(synthDisrupter, false, "activation-discount"),
    );
    const game = GrandArchiveTestEngine.startFixture({
      definitions: [automatonDrone],
      firstPlayer: own ? "playerOne" : "playerTwo",
      playerOne: {
        champion,
        zones: {
          field: [synthDisrupter, automatonDrone],
          hand: [summonSentinels, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: [automatonDrone],
          hand: [summonSentinels, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
        },
      },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      recipient = own ? p : q;
    const existing = [p.card(automatonDrone), q.card(automatonDrone)];
    if (!own) q.pass();
    p.activateAbility(synthDisrupter, "z1vdxi74wa-a1");
    settleEntryReplacements(game);
    recipient.activate(summonSentinels, {
      reservePayment: recipient
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((c) => ({ kind: "card", cardId: c.objectId })),
    });
    expect(recipient.cards(automatonDrone, { zone: "field" })).toHaveLength(1);
    settleEntryReplacements(game);
    const tokens = recipient
      .cards(automatonDrone, { zone: "field" })
      .filter((c) => !existing.some((e) => e.objectId === c.objectId));
    expect(tokens).toHaveLength(2);
    for (const token of tokens) {
      expect(game.state.objects[token.objectId]).toMatchObject({
        ownerId: recipient.id,
        controllerId: recipient.id,
        isToken: true,
      });
      expect(game.state.objects[token.objectId]!.states.has("rested")).toBe(true);
      expect(game.state.objects[token.objectId]!.counters.buff).toBe(1);
    }
    for (const original of existing)
      expect(game.state.objects[original.objectId]!.states.has("rested")).toBe(false);
  });
