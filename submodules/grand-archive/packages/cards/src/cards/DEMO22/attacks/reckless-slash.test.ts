import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { morriganLostSpirit } from "../../P23/champions/morrigan-lost-spirit.ts";
import { shiraLostSpirit } from "../../P24/champions/shira-lost-spirit.ts";
import { recklessSlash } from "./reckless-slash.ts";

/** @covers-card NaGi9nBjJA */
describe("Reckless Slash", () => {
  it("pays two reserve, enters intent, and declares a three-power attack", () => {
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: morriganLostSpirit,
        zones: { hand: [recklessSlash, woodlandSquirrels, giantTortoise] },
      },
      playerTwo: { champion: shiraLostSpirit },
    });
    const player = game.player("player-one");
    const attacker = player.card(morriganLostSpirit, { zone: "field" });
    const target = game.player("player-two").card(shiraLostSpirit, { zone: "field" });
    const reservePayment = [woodlandSquirrels, giantTortoise].map((card) => ({
      kind: "card" as const,
      cardId: player.card(card, { zone: "hand" }).objectId,
    }));

    player.activate(recklessSlash, { attackAttackerId: attacker.objectId, reservePayment });
    expect(game.resolveStackUntilChoice()).toBe("decision");
    const attack = player.card(recklessSlash, { zone: "intent" });

    player.executeLegal(
      (candidate) =>
        candidate.command.move === "answer-decision" &&
        typeof candidate.command.answer === "object" &&
        candidate.command.answer !== null &&
        "attackerId" in candidate.command.answer &&
        candidate.command.answer.attackerId === attacker.objectId &&
        !("delegatePlayerId" in candidate.command.answer) &&
        "targetIds" in candidate.command.answer &&
        Array.isArray(candidate.command.answer.targetIds) &&
        candidate.command.answer.targetIds.includes(target.objectId),
      "declare Reckless Slash against the opposing champion",
    );

    expect(game.state.combat?.attackerId).toBe(attacker.objectId);
    expect(game.state.combat?.intentIds).toContain(attack.objectId);
    const face =
      recklessSlash.layout.kind === "single-faced"
        ? recklessSlash.layout.face
        : recklessSlash.layout.defaultFace;
    expect(face.stats.power).toBe(3);

    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]?.damage).toBe(3);
    expect(game.state.objects[attack.objectId]?.zone).toBe("graveyard");
    expect(game.state.objects[attacker.objectId]?.states.has("rested")).toBe(true);
    expect(game.state.combat).toBeNull();
  });
});
