import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { screamCanister } from "./139-scream-canister";

const screamTarget = createMockCharacter({
  id: "scream-canister-target",
  name: "Scream Target",
  cost: 2,
  strength: 2,
});

describe("Scream Canister", () => {
  it("exerts all cards in your inkwell and the chosen opposing low-strength character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: 3,
        play: [screamCanister],
      },
      {
        play: [screamTarget],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(screamCanister, {
        targets: [screamTarget],
      }),
    ).toBeSuccessfulCommand();

    const state = testEngine.getAuthoritativeState();
    const inkwellIds = testEngine.getCardInstanceIdsInZone("inkwell", PLAYER_ONE);
    expect(inkwellIds).toHaveLength(3);

    for (const cardId of inkwellIds) {
      expect(state.ctx.zones.private.cardMeta[cardId]?.state).toBe("exerted");
    }
    expect(testEngine.asPlayerTwo().isExerted(screamTarget)).toBe(true);
  });
});
