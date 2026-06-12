import { describe, it, expect } from "vite-plus/test";
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
  enumerateAvailableMovesDetailed,
  asPlayerId,
} from "@tcg/gundam-engine";
import { st04HawkOfEndymion013 } from "./013-hawk-of-endymion.ts";

describe("Hawk of Endymion (ST04-013)", () => {
  describe("【Main】/【Action】Choose 1 enemy Unit with 3 or less HP. Return it to its owner's hand.", () => {
    it("bounces an enemy unit with HP ≤ 3 back to its owner's hand", () => {
      const fragile = createMockUnit({ ap: 2, hp: 3 });
      const engine = GundamTestEngine.create(
        { hand: [st04HawkOfEndymion013], resourceArea: activeResources(3) },
        { play: [fragile] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [fragileId] = p2.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(st04HawkOfEndymion013, { targets: [fragileId!] }));

      expectCardInHand(engine, fragileId!, p2.playerId);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });

    it("is also playable at action-phase timing", () => {
      const fragile = createMockUnit({ ap: 2, hp: 3 });
      const engine = GundamTestEngine.create(
        { hand: [st04HawkOfEndymion013], resourceArea: activeResources(3) },
        { play: [fragile] },
      );
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [fragileId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(st04HawkOfEndymion013, { targets: [fragileId!] }));
      expectCardInHand(engine, fragileId!, p2.playerId);
    });

    // Regression for rule 10-1-8-1-1: a Command whose effect requires
    // choosing a target cannot be played when no legal target exists.
    // Guards against `enumerateCandidates` (which feeds the simulator's
    // playable-card hint) approving cards with an empty candidate pool.
    describe("rule 10-1-8-1-1 — playability when no legal target exists", () => {
      it("is not playable when the opponent has no units on the field", () => {
        const engine = GundamTestEngine.create(
          { hand: [st04HawkOfEndymion013], resourceArea: activeResources(3) },
          { play: [] },
        );
        const p1 = engine.asPlayer(PLAYER_ONE);
        const cmdId = p1.getHand()[0]!;

        expectFailure(p1.playCommand(st04HawkOfEndymion013), "NO_LEGAL_TARGETS");

        const moves = enumerateAvailableMovesDetailed(
          engine.runtime.getState(),
          asPlayerId(PLAYER_ONE),
          engine.runtime.getStaticResources(),
        );
        // The simulator highlights any card present in *any* move's
        // selectableCardIds, so flatten across moves: the regression
        // is "no current move surfaces this card as playable".
        const allSelectableIds = moves.flatMap((m) => [...m.selectableCardIds]);
        expect(allSelectableIds).not.toContain(cmdId);
      });

      it("is not playable when the only enemy unit has more than 3 HP", () => {
        const tough = createMockUnit({ ap: 2, hp: 5 });
        const engine = GundamTestEngine.create(
          { hand: [st04HawkOfEndymion013], resourceArea: activeResources(3) },
          { play: [tough] },
        );
        const p1 = engine.asPlayer(PLAYER_ONE);
        const cmdId = p1.getHand()[0]!;

        expectFailure(p1.playCommand(st04HawkOfEndymion013), "NO_LEGAL_TARGETS");

        const moves = enumerateAvailableMovesDetailed(
          engine.runtime.getState(),
          asPlayerId(PLAYER_ONE),
          engine.runtime.getStaticResources(),
        );
        // The simulator highlights any card present in *any* move's
        // selectableCardIds, so flatten across moves: the regression
        // is "no current move surfaces this card as playable".
        const allSelectableIds = moves.flatMap((m) => [...m.selectableCardIds]);
        expect(allSelectableIds).not.toContain(cmdId);
      });

      // Regression for the live-game bug: enemy Units sitting in the
      // opponent's trash / shield area / hand were leaking through the
      // target filter because `cardMatchesFilter` only enforced `zone`
      // when the filter set it explicitly. "Choose 1 enemy Unit" implies
      // a Unit on the field (rule 1-2 / 10-2), so off-board Units must
      // not be candidates for `returnToHand`.
      it("is not playable when the only HP≤3 enemy unit lives in the opponent's trash", () => {
        const fragileInTrash = createMockUnit({ ap: 2, hp: 3, name: "Trashed Mock" });
        const engine = GundamTestEngine.create(
          { hand: [st04HawkOfEndymion013], resourceArea: activeResources(3) },
          { play: [], trash: [fragileInTrash] },
        );
        const p1 = engine.asPlayer(PLAYER_ONE);
        const cmdId = p1.getHand()[0]!;

        expectFailure(p1.playCommand(st04HawkOfEndymion013), "NO_LEGAL_TARGETS");

        const moves = enumerateAvailableMovesDetailed(
          engine.runtime.getState(),
          asPlayerId(PLAYER_ONE),
          engine.runtime.getStaticResources(),
        );
        const allSelectableIds = moves.flatMap((m) => [...m.selectableCardIds]);
        expect(allSelectableIds).not.toContain(cmdId);
      });
    });

    it("cannot target an enemy unit with more than 3 HP", () => {
      const tough = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [st04HawkOfEndymion013], resourceArea: activeResources(3) },
        { play: [tough] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [toughId] = p2.getCardsInZone("battleArea");

      expectFailure(
        p1.playCommand(st04HawkOfEndymion013, { targets: [toughId!] }),
        "INVALID_TARGET",
      );
    });
  });
});
