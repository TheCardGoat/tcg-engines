import { describe, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  expectFailure,
  createMockUnit,
  activeResources,
  expectCardInTrash,
  expectCardInHand,
  markAsLinkUnit,
} from "@tcg/gundam-engine";
import { gd01CovertOperative122 } from "./122-covert-operative.ts";

describe("Covert Operative (GD01-122)", () => {
  describe("Main - Choose 1 enemy Unit with 2 or less HP. Return it to its owners hand.", () => {
    it("bounces a fragile (HP <= 2) enemy unit back to its owners hand", () => {
      const fragile = createMockUnit({ ap: 1, hp: 2 });
      const engine = GundamTestEngine.create(
        { hand: [gd01CovertOperative122], resourceArea: activeResources(4) },
        { play: [fragile] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [fragileId] = p2.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(gd01CovertOperative122, { targets: [fragileId!] }));

      expectCardInHand(engine, fragileId!, p2.playerId);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });

    it("cannot target an enemy unit with more than 2 HP (base case)", () => {
      const tough = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [gd01CovertOperative122], resourceArea: activeResources(4) },
        { play: [tough] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [toughId] = p2.getCardsInZone("battleArea");

      expectFailure(
        p1.playCommand(gd01CovertOperative122, { targets: [toughId!] }),
        "INVALID_TARGET",
      );
    });

    it("cannot be played during action-phase (main-only timing)", () => {
      const fragile = createMockUnit({ ap: 1, hp: 2 });
      const engine = GundamTestEngine.create(
        { hand: [gd01CovertOperative122], resourceArea: activeResources(4) },
        { play: [fragile] },
      );
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [fragileId] = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");

      expectFailure(
        p1.playCommand(gd01CovertOperative122, { targets: [fragileId!] }),
        "WRONG_TIMING",
      );
    });

    it("ConditionalDirective - with a Link Unit, targets HP <= 4 instead of HP <= 2", () => {
      const medium = createMockUnit({ ap: 2, hp: 3 });
      const friendlyUnit = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd01CovertOperative122],
          play: [friendlyUnit],
          resourceArea: activeResources(4),
        },
        { play: [medium] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [friendlyId] = p1.getCardsInZone("battleArea");
      const [mediumId] = p2.getCardsInZone("battleArea");

      // Without a link unit, HP 3 target should be rejected (HP <= 2 branch).
      expectFailure(
        p1.playCommand(gd01CovertOperative122, { targets: [mediumId!] }),
        "INVALID_TARGET",
      );

      // Mark the friendly unit as a link unit.
      markAsLinkUnit(engine, friendlyId!);

      // Now with a link unit in play, the HP <= 4 branch applies.
      expectSuccess(p1.playCommand(gd01CovertOperative122, { targets: [mediumId!] }));

      expectCardInHand(engine, mediumId!, p2.playerId);
    });
  });
});
