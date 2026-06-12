import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  expectSuccess,
  expectFailure,
  activeResources,
  createMockUnit,
} from "@tcg/gundam-engine";
import { gd01ThePathToVictoryOrDefeat109 } from "./109-the-path-to-victory-or-defeat.ts";

describe("The Path to Victory or Defeat (GD01-109)", () => {
  describe("【Main】Look at top 5 cards. Reveal 1 (Operation Meteor)/(G Team) Unit/Pilot and add to hand.", () => {
    it("cannot be played during action-phase (main-only timing)", () => {
      const engine = GundamTestEngine.create({
        hand: [gd01ThePathToVictoryOrDefeat109],
        resourceArea: activeResources(5),
      });
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(gd01ThePathToVictoryOrDefeat109), "WRONG_TIMING");
    });

    it("tutors an (Operation Meteor) Unit from top 5 — first OR branch", () => {
      const meteor = createMockUnit({ name: "Wing", traits: ["operation meteor"] });
      const engine = GundamTestEngine.create({
        hand: [gd01ThePathToVictoryOrDefeat109],
        resourceArea: activeResources(5),
        deck: [meteor],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const handBefore = p1.getHand().length;
      const deckBefore = p1.getCardsInZone("deck").length;
      const [meteorId] = p1.getCardsInZone("deck");

      expectSuccess(p1.playCommand(gd01ThePathToVictoryOrDefeat109));
      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: { 0: { tutorCardId: meteorId! } },
        }),
      );

      // Command played (-1 from hand), meteor unit tutored (+1) → net 0.
      expect(p1.getHand().length).toBe(handBefore);
      expect(p1.getCardsInZone("deck").length).toBe(deckBefore - 1);
    });

    it("tutors a (G Team) Unit from top 5 — second OR branch", () => {
      const gTeam = createMockUnit({ name: "Shenlong", traits: ["g team"] });
      const engine = GundamTestEngine.create({
        hand: [gd01ThePathToVictoryOrDefeat109],
        resourceArea: activeResources(5),
        deck: [gTeam],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const handBefore = p1.getHand().length;
      const [gTeamId] = p1.getCardsInZone("deck");

      expectSuccess(p1.playCommand(gd01ThePathToVictoryOrDefeat109));
      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: { 0: { tutorCardId: gTeamId! } },
        }),
      );

      expect(p1.getHand().length).toBe(handBefore);
    });

    it("does NOT tutor a non-matching trait unit — both OR branches fail", () => {
      const other = createMockUnit({ name: "GM", traits: ["earth federation"] });
      const engine = GundamTestEngine.create({
        hand: [gd01ThePathToVictoryOrDefeat109],
        resourceArea: activeResources(5),
        deck: [other],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const handBefore = p1.getHand().length;
      const deckBefore = p1.getCardsInZone("deck").length;
      const [otherId] = p1.getCardsInZone("deck");

      expectSuccess(p1.playCommand(gd01ThePathToVictoryOrDefeat109));
      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: { 0: { toBottom: [otherId!] } },
        }),
      );

      // Command played and trashed, no tutor — hand -1 net. Deck preserved
      // (non-matching card returned to bottom).
      expect(p1.getHand().length).toBe(handBefore - 1);
      expect(p1.getCardsInZone("deck").length).toBe(deckBefore);
    });
  });
});
