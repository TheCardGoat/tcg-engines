import { describe } from "vitest";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../../ALC/items/potion-of-healing.ts";

import { proveIntrinsicLink } from "../../../testing/intrinsic-link.ts";
import { markOfFervor } from "./mark-of-fervor.ts";

/** @covers 80mttsvbgl-a1 */
describe("Mark of Fervor — Link", () => {
  proveIntrinsicLink({
    card: markOfFervor,
    host: woodlandSquirrels,
    invalidHost: potionOfHealing,
  });
});

import { proveLinkedVigor } from "../../../testing/linked-vigor.ts";

/** @covers 80mttsvbgl-a2 */
describe("markOfFervor — linked Vigor", () => {
  proveLinkedVigor(markOfFervor, { statBonus: 1 });
});

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";

/** @covers 80mttsvbgl-a2 */
describe("Mark of Fervor — multiple Vigor instances", () => {
  it("stacks both stat bonuses and creates two distinct end-step triggers", () => {
    const champion = enableAllTestElements(
      createClassBonusTestChampion(markOfFervor, false, "activation-discount"),
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [
            markOfFervor,
            markOfFervor,
            woodlandSquirrels,
            woodlandSquirrels,
            woodlandSquirrels,
            woodlandSquirrels,
          ],
          field: [giantTortoise, giantTortoise],
        },
      },
      playerTwo: { champion },
    });
    const p = game.player("player-one"),
      q = game.player("player-two");
    const [host, other] = p.cards(giantTortoise);
    for (const card of p.cards(markOfFervor)) {
      p.activate(card, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
        targets: { "intrinsic-link-target": [host!.objectId] },
      });
      passEffectsStack(game);
    }
    expect(
      deriveGrandArchiveNumericProperty(game.state.objects[host!.objectId]!, "life", {
        program: game.program,
        state: game.state,
        controllerId: p.id,
        bindings: {},
      }),
    ).toBe(8);
    p.declareAttack(host!, q.card(champion));
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(3);
    p.declareAttack(other!, q.card(champion));
    game.resolveCombatWithoutRetaliation();
    for (let step = 0; step < 32 && game.state.turn.phase !== "end"; step++) {
      const wait = game.waitState();
      if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind} before end`);
      game.player(wait.playerId).pass();
    }
    expect(game.state.turn.phase).toBe("end");
    expect(game.state.objects[host!.objectId]!.states.has("rested")).toBe(true);
    const decision = game.state.decision;
    expect(decision?.kind).toBe("order-triggered-abilities");
    if (decision?.kind !== "order-triggered-abilities")
      throw new Error("Expected both Vigor triggers to be ordered");
    expect(decision.pendingTriggerIds).toHaveLength(2);
    answerDecision(game, "order-triggered-abilities", decision.pendingTriggerIds);
    expect(game.state.stack).toHaveLength(2);
    passEffectsStack(game);
    expect(game.state.objects[host!.objectId]!.states.has("rested")).toBe(false);
    expect(game.state.objects[other!.objectId]!.states.has("rested")).toBe(true);
    expect(game.state.stack).toHaveLength(0);
  });
});
