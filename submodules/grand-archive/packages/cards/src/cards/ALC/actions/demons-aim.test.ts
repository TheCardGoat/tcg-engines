import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { caretakerDrone } from "../allies/caretaker-drone.ts";
import { shimmercloakAssassin } from "../allies/shimmercloak-assassin.ts";
import { waveriderProtector } from "../allies/waverider-protector.ts";
import { demonsAim } from "./demons-aim.ts";

function setup(
  field: readonly (
    | typeof caretakerDrone
    | typeof shimmercloakAssassin
    | typeof waveriderProtector
  )[],
) {
  const baseChampion = createClassBonusTestChampion(demonsAim, false, "activation-discount");
  if (baseChampion.layout.kind !== "single-faced") throw new Error("Expected test champion");
  const champion = {
    ...baseChampion,
    layout: {
      kind: "single-faced" as const,
      face: {
        ...baseChampion.layout.face,
        stats: { ...baseChampion.layout.face.stats, power: 2 },
      },
    },
  };
  const defendingChampion = createClassBonusTestChampion(
    waveriderProtector,
    true,
    "activation-discount",
  );
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: { hand: [demonsAim, woodlandSquirrels, woodlandSquirrels] },
    },
    playerTwo: { champion: defendingChampion, zones: { field } },
  });
  const player = game.player("player-one");
  const source = player.card(demonsAim, { zone: "hand" });
  const attacker = player.card(champion, { zone: "field" });
  player.activate(source, {
    reservePayment: player
      .cards(woodlandSquirrels, { zone: "hand" })
      .map((card) => ({ kind: "card", cardId: card.objectId })),
  });
  passEffectsStack(game);
  return { game, player, opponent: game.player("player-two"), source, attacker };
}

/** @covers 6g7xgwve1d-a1 @covers 6g7xgwve1d-a2 */
describe("Demon's Aim — inherited penalty and unrestricted champion attacks", () => {
  it("ignores Taunt and uses True Sight to attack a Stealth unit", () => {
    const { game, player, opponent, source, attacker } = setup([
      waveriderProtector,
      shimmercloakAssassin,
    ]);
    const stealthTarget = opponent.card(shimmercloakAssassin, { zone: "field" });
    expect(game.state.objects[source.objectId]!).toMatchObject({
      zone: "inner-lineage",
      hostId: attacker.objectId,
    });
    expect(
      deriveGrandArchiveNumericProperty(game.state.objects[attacker.objectId]!, "life", {
        program: game.program,
        state: game.state,
        controllerId: player.id,
        bindings: {},
      }),
    ).toBe(13);
    player.declareAttack(attacker, stealthTarget);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[stealthTarget.objectId]!.zone).toBe("graveyard");
  });

  it("does not allow Intercept to redirect the champion's attack", () => {
    const { game, player, opponent, attacker } = setup([caretakerDrone]);
    const target = opponent.card(
      createClassBonusTestChampion(waveriderProtector, true, "activation-discount"),
      { zone: "field" },
    );
    const interceptor = opponent.card(caretakerDrone, { zone: "field" });
    player.declareAttack(attacker, target);
    expect(
      game.state.stack.some(
        (item) => item.kind === "triggered-ability" && item.sourceId === interceptor.objectId,
      ),
    ).toBe(true);
    passEffectsStack(game);
    answerDecision(game, "resolve-optional-effect", true);
    passEffectsStack(game);
    expect(game.state.combat?.targetIds).toEqual([target.objectId]);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBeGreaterThan(0);
    expect(game.state.objects[interceptor.objectId]!.damage).toBe(0);
  });
});
