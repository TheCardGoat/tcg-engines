import { describe, expect, it } from "vite-plus/test";
import { FabMatchRuntime } from "../../runtime.ts";
import { FAB_MANUAL_HARNESS } from "../../testing/harness-config.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { listLegalCommands } from "../legal-commands.ts";
import { CATALOG_TEST_DEFINITIONS, catalogIds } from "../catalog-test-cards.ts";
import { balanceOfJustice } from "../../../../cards/src/cards/equipment/balance-of-justice.ts";
import { fyendalSSpringTunic } from "../../../../cards/src/cards/equipment/fyendal-s-spring-tunic.ts";
import { rompingClub } from "../../../../cards/src/cards/weapons/romping-club.ts";
import { valueExtractStrategy } from "./goldfish.ts";

/**
 * Equipment defend economics: pristine equipment survives defending (CR
 * combat chain close leaves it equipped), so blocking with it is free and is
 * the Masterclass-preferred substitute for hand cards. Degradation keywords
 * price the defend: blade-break destroys the piece, temper burns a finite
 * defend, battleworn permanently decays one defense.
 */
function defendSeat(input: { defenderLife?: number; chest: readonly string[] }): FabTestEngine {
  return FabTestEngine.create(
    {
      seed: "equipment-defend",
      player1: {
        heroCardId: catalogIds.rhinar,
        hand: [],
        deck: 6,
        actionPoints: 1,
        resourcePoints: 2,
        weapon1: [rompingClub.canonicalId],
      },
      player2: {
        heroCardId: catalogIds.bravo,
        hand: [],
        deck: 6,
        ...(input.defenderLife === undefined ? {} : { life: input.defenderLife }),
        chest: input.chest,
      },
      cardDefinitions: {
        ...CATALOG_TEST_DEFINITIONS,
        [balanceOfJustice.canonicalId]: balanceOfJustice,
        [fyendalSSpringTunic.canonicalId]: fyendalSSpringTunic,
        [rompingClub.canonicalId]: rompingClub,
      },
    },
    FAB_MANUAL_HARNESS,
  );
}

function defendWithChestChoice(
  game: FabTestEngine,
  chestCanonicalId: string,
): { move: string; instanceIds: readonly string[] } {
  const runtime: FabMatchRuntime = game.getRuntime();
  game.as(catalogIds.rhinar).activateAttack(rompingClub);
  const legal = listLegalCommands(runtime, "player-2");
  const choice = valueExtractStrategy(runtime, "player-2", legal);
  expect(choice).not.toBeNull();
  const instanceIds =
    choice!.move === "defend" ? (choice!.payload.instanceIds as readonly string[]) : [];
  const chestInstance = game
    .getState()
    .containers.zonesByPlayerId["player-2"]!.chest.find(
      (id) => game.getState().objects[id]?.canonicalId === chestCanonicalId,
    );
  expect(chestInstance).toBeDefined();
  return { move: choice!.move, instanceIds };
}

describe("equipment defend economics", () => {
  it("blocks with pristine equipment at full life instead of taking the damage", () => {
    const game = defendSeat({ chest: [balanceOfJustice.canonicalId] });
    const choice = defendWithChestChoice(game, balanceOfJustice.canonicalId);
    expect(choice.move).toBe("defend");
    expect(choice.instanceIds).toHaveLength(1);
  });

  it("never trades a blade-break piece for a partial block at high life", () => {
    const game = defendSeat({ chest: [fyendalSSpringTunic.canonicalId] });
    const choice = defendWithChestChoice(game, fyendalSSpringTunic.canonicalId);
    expect(choice.instanceIds).toHaveLength(0);
  });

  it("spends a blade-break piece once life is desperate", () => {
    const game = defendSeat({
      defenderLife: 6,
      chest: [fyendalSSpringTunic.canonicalId],
    });
    const choice = defendWithChestChoice(game, fyendalSSpringTunic.canonicalId);
    expect(choice.move).toBe("defend");
    expect(choice.instanceIds).toHaveLength(1);
  });
});
