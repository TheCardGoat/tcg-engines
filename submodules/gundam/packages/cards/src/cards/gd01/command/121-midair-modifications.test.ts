import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  asPlayerId,
  expectSuccess,
  expectFailure,
  createMockUnit,
  activeResources,
  expectCardInTrash,
  hasContinuousRestriction,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd01MidairModifications121 } from "./121-midair-modifications.ts";

describe("Midair Modifications (GD01-121)", () => {
  it("burstActivatesMain — burst fires the Main effect with target selection", () => {
    const chosen = createMockUnit({
      ap: 2,
      hp: 3,
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const otherBlocker = createMockUnit({
      ap: 2,
      hp: 3,
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const engine = GundamTestEngine.create(
      { deck: [gd01MidairModifications121] },
      {
        play: [
          { card: chosen, exhausted: true },
          { card: otherBlocker, exhausted: true },
        ],
      },
    );
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");
    engine
      .getRuntime()
      .registerCardInstance(
        shieldId,
        gd01MidairModifications121.cardNumber,
        asPlayerId(PLAYER_ONE),
      );

    const p2 = engine.asPlayer(PLAYER_TWO);
    const [chosenId, otherId] = p2.getCardsInZone("battleArea");

    // Burst fires → Main effect enqueued → engine halts for target selection
    engine.fireShieldBurst(shieldId, { targets: [chosenId!] });

    // Chosen unit: set active AND cannot-attack.
    expect(engine.getG().exhausted[chosenId!]).toBeFalsy();
    expect(hasContinuousRestriction(engine, chosenId!, "cannot-attack")).toBe(true);
    // Non-chosen Blocker: untouched (still rested, no restriction).
    expect(engine.getG().exhausted[otherId!]).toBe(true);
    expect(hasContinuousRestriction(engine, otherId!, "cannot-attack")).toBe(false);
  });

  describe("【Main】Choose 1 rested Unit with <Blocker>. Set it as active.", () => {
    it("sets the chosen rested friendly <Blocker> to active AND applies cannot-attack — other Blockers untouched", () => {
      const chosen = createMockUnit({
        ap: 2,
        hp: 3,
        keywordEffects: [{ keyword: "Blocker" }],
      });
      const otherBlocker = createMockUnit({
        ap: 2,
        hp: 3,
        keywordEffects: [{ keyword: "Blocker" }],
      });
      const engine = GundamTestEngine.create({
        hand: [gd01MidairModifications121],
        play: [
          { card: chosen, exhausted: true },
          { card: otherBlocker, exhausted: true },
        ],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [chosenId, otherId] = p1.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(gd01MidairModifications121, { targets: [chosenId!] }));

      // Chosen unit: set active AND cannot-attack.
      expect(engine.getG().exhausted[chosenId!]).toBeFalsy();
      expect(hasContinuousRestriction(engine, chosenId!, "cannot-attack")).toBe(true);
      // Non-chosen Blocker: untouched (still rested, no restriction).
      expect(engine.getG().exhausted[otherId!]).toBe(true);
      expect(hasContinuousRestriction(engine, otherId!, "cannot-attack")).toBe(false);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });

    it("also accepts a rested enemy <Blocker> (target owner: any)", () => {
      const enemyBlocker = createMockUnit({
        ap: 2,
        hp: 4,
        keywordEffects: [{ keyword: "Blocker" }],
      });
      const engine = GundamTestEngine.create(
        {
          hand: [gd01MidairModifications121],
          resourceArea: activeResources(3),
        },
        { play: [{ card: enemyBlocker, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(gd01MidairModifications121, { targets: [enemyId!] }));

      expect(engine.getG().exhausted[enemyId!]).toBeFalsy();
      expect(hasContinuousRestriction(engine, enemyId!, "cannot-attack")).toBe(true);
    });

    it("cannot target an active (non-rested) unit", () => {
      const blocker = createMockUnit({
        ap: 2,
        hp: 3,
        keywordEffects: [{ keyword: "Blocker" }],
      });
      const engine = GundamTestEngine.create({
        hand: [gd01MidairModifications121],
        play: [blocker],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [blockerId] = p1.getCardsInZone("battleArea");

      expectFailure(
        p1.playCommand(gd01MidairModifications121, { targets: [blockerId!] }),
        "INVALID_TARGET",
      );
    });

    it("cannot target a unit without the Blocker keyword", () => {
      const nonBlocker = createMockUnit({
        ap: 2,
        hp: 3,
        keywordEffects: [],
      });
      const engine = GundamTestEngine.create({
        hand: [gd01MidairModifications121],
        play: [{ card: nonBlocker, exhausted: true }],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [nonBlockerId] = p1.getCardsInZone("battleArea");

      expectFailure(
        p1.playCommand(gd01MidairModifications121, { targets: [nonBlockerId!] }),
        "INVALID_TARGET",
      );
    });

    it("cannot be played during action-phase (main-only timing)", () => {
      const blocker = createMockUnit({
        ap: 2,
        hp: 3,
        keywordEffects: [{ keyword: "Blocker" }],
      });
      const engine = GundamTestEngine.create({
        hand: [gd01MidairModifications121],
        play: [{ card: blocker, exhausted: true }],
        resourceArea: activeResources(3),
      });
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [blockerId] = p1.getCardsInZone("battleArea");

      expectFailure(
        p1.playCommand(gd01MidairModifications121, { targets: [blockerId!] }),
        "WRONG_TIMING",
      );
    });

    it("applies cannot-attack restriction to the target unit for this turn", () => {
      const blocker = createMockUnit({
        ap: 2,
        hp: 3,
        keywordEffects: [{ keyword: "Blocker" }],
      });
      const engine = GundamTestEngine.create({
        hand: [gd01MidairModifications121],
        play: [{ card: blocker, exhausted: true }],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [blockerId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(gd01MidairModifications121, { targets: [blockerId!] }));

      expect(hasContinuousRestriction(engine, blockerId!, "cannot-attack")).toBe(true);
    });
  });
});
