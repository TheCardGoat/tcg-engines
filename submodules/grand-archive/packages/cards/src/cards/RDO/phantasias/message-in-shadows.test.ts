import { describe } from "vitest";
import { messageInShadows } from "./message-in-shadows.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { proveIntrinsicLink } from "../../../testing/intrinsic-link.ts";

/** @covers RgloaA6YV2-a1 */
describe("Message in Shadows — Ally Link", () => {
  proveIntrinsicLink({
    card: messageInShadows,
    host: woodlandSquirrels,
    invalidHost: trainingSword,
  });
});

import { proveEntryGlimpse } from "../../../testing/entry-glimpse.ts";
/** @covers RgloaA6YV2-a2 */
describe("Message in Shadows entry Glimpse", () => proveEntryGlimpse(messageInShadows, 2, 2, true));

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { snowFairy } from "../../DOA/allies/snow-fairy.ts";
import { conceal } from "../../DOA/actions/conceal.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers RgloaA6YV2-a3 */
describe("Message in Shadows linked power", () => {
  for (const matching of [false, true])
    for (const mode of ["none", "printed", "temporary"] as const)
      it(`buffs only the linked ally while it has stealth: class=${matching}, mode=${mode}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(messageInShadows, matching, "activation-discount"),
        );
        const hostCard = mode === "printed" ? snowFairy : woodlandSquirrels;
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [hostCard, snowFairy],
              hand: [
                messageInShadows,
                conceal,
                ...Array.from({ length: 4 }, () => woodlandSquirrels),
              ],
              "main-deck": [],
            },
          },
          playerTwo: { champion, zones: { field: [snowFairy], "main-deck": [woodlandSquirrels] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const host = p.cards(hostCard, { zone: "field" })[0]!;
        const other = p
          .zone("field")
          .find(
            (ref) => ref.objectId !== host.objectId && ref.definitionId === snowFairy.canonicalId,
          )!;
        const stat = (id: typeof host.objectId) =>
          deriveGrandArchiveNumericProperty(game.state.objects[id]!, "power", {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          });
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
        p.activate(messageInShadows, {
          reservePayment: pay(2),
          targets: { "intrinsic-link-target": [host.objectId] },
        });
        passEffectsStack(game);
        expect(stat(host.objectId)).toBe(mode === "printed" ? 3 : 1);
        expect(stat(other.objectId)).toBe(1);
        expect(stat(q.card(snowFairy).objectId)).toBe(1);
        if (mode === "temporary") {
          p.activate(conceal, { reservePayment: pay(2) });
          passEffectsStack(game);
          expect(stat(host.objectId)).toBe(3);
          expect(stat(other.objectId)).toBe(1);
          advanceToMain(game, q.id);
          expect(stat(host.objectId)).toBe(1);
        }
      });
});
