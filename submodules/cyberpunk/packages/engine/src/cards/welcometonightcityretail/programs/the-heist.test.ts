import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDyingNightVSPistol,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailKiroshiOptics,
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailOverwatchPanamSGift,
  welcomeToNightCityRetailTheHeist,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe('The Heist — "Trash 4. Add a Gear from among them to your hand. If that Gear\'s cost equals the value of a friendly Gig, you may play it for free instead."', () => {
  it("trashes exactly 4 cards from the controller's deck", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailTheHeist],
        deck: [
          welcomeToNightCityRetailKiroshiOptics,
          welcomeToNightCityRetailMantisBlades,
          welcomeToNightCityRetailDyingNightVSPistol,
          welcomeToNightCityRetailOverwatchPanamSGift,
        ],
        eddies: 5,
      },
      {},
      { preserveDeckOrder: true },
    );

    const trashBefore = engine.getCardsInZone("trash", P1).length;
    engine.playCard(welcomeToNightCityRetailTheHeist, { as: P1 });
    // Resolve the gear-selection choice (or decline). We expect a choice here.
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (choice && choice.type === "chooseTarget") {
      const eligible =
        (choice as { payload?: { eligibleIds?: string[] } }).payload?.eligibleIds ?? [];
      if (eligible.length > 0) {
        engine.resolveEffectTargetIds(eligible.slice(0, 1), { as: P1 });
      }
    }

    const trashAfter = engine.getCardsInZone("trash", P1);
    // 4 cards trashed from deck; 1 Gear recovered to hand; the other 3
    // trashed cards remain in trash, plus the Program itself after it
    // resolves → exactly 4 new cards in trash (3 trashed + the Program).
    const newTrashCount = trashAfter.length - trashBefore;
    expect(newTrashCount).toBe(4);
  });

  it("offers only Gear cards from among the trashed cards as the selection", () => {
    // Deck top 4: 1 Gear + 3 Units. Only the Gear should be selectable.
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailTheHeist],
        deck: [
          welcomeToNightCityRetailDyingNightVSPistol,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
        ],
        eddies: 5,
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailTheHeist, { as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    const payload = (choice as { payload?: { eligibleIds?: string[]; type?: string } }).payload;
    expect(payload?.type).toBe("effectTarget");
    const eligibleIds = payload?.eligibleIds ?? [];
    expect(eligibleIds.length).toBe(1);
    const chosenCard = engine.getState().G.cardIndex[eligibleIds[0]!]!;
    expect(chosenCard.definitionId).toBe(welcomeToNightCityRetailDyingNightVSPistol.id);
  });

  it("moves the chosen Gear to hand", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailTheHeist],
        deck: [
          welcomeToNightCityRetailDyingNightVSPistol,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
        ],
        eddies: 5,
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailTheHeist, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailDyingNightVSPistol, { as: P1 });

    const hand = engine.getCardsInZone("hand", P1).map((c) => c.definitionId);
    expect(hand).toContain(welcomeToNightCityRetailDyingNightVSPistol.id);
  });

  it("skips the gear-selection choice when no Gear is among the trashed cards", () => {
    // All 4 trashed cards are Units — no Gear to select.
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailTheHeist],
        deck: [
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
        ],
        eddies: 5,
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailTheHeist, { as: P1 });

    // With min:1 on the mandatory Gear recovery, the engine auto-skips the
    // selection entirely when no Gear is among the trashed cards (0 eligible
    // targets < min). No pending choice is presented to the player.
    engine.expectNoPendingChoice();

    // No gear should have been moved to hand.
    const hand = engine.getCardsInZone("hand", P1).map((c) => c.definitionId);
    expect(hand).not.toContain(welcomeToNightCityRetailCorpoSecurity.id);
  });

  it("can select from multiple Gears among the trashed cards", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailTheHeist],
        deck: [
          welcomeToNightCityRetailDyingNightVSPistol,
          welcomeToNightCityRetailMantisBlades,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
        ],
        eddies: 5,
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailTheHeist, { as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    const payload = (choice as { payload?: { eligibleIds?: string[] } }).payload;
    const eligibleIds = payload?.eligibleIds ?? [];
    expect(eligibleIds.length).toBe(2);

    engine.resolveEffectTarget(welcomeToNightCityRetailMantisBlades, { as: P1 });

    const hand = engine.getCardsInZone("hand", P1).map((c) => c.definitionId);
    expect(hand).toContain(welcomeToNightCityRetailMantisBlades.id);
    expect(hand).not.toContain(welcomeToNightCityRetailDyingNightVSPistol.id);
  });

  it("keeps non-selected trashed cards in trash", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailTheHeist],
        deck: [
          welcomeToNightCityRetailDyingNightVSPistol,
          welcomeToNightCityRetailMantisBlades,
          welcomeToNightCityRetailKiroshiOptics,
          welcomeToNightCityRetailCorpoSecurity,
        ],
        eddies: 5,
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailTheHeist, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailDyingNightVSPistol, { as: P1 });

    const trash = engine.getCardsInZone("trash", P1).map((c) => c.definitionId);
    expect(trash).toContain(welcomeToNightCityRetailMantisBlades.id);
    expect(trash).toContain(welcomeToNightCityRetailKiroshiOptics.id);
    expect(trash).toContain(welcomeToNightCityRetailCorpoSecurity.id);
    expect(trash).not.toContain(welcomeToNightCityRetailDyingNightVSPistol.id);
  });

  it("the played Program ends up in the controller's trash after resolving", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailTheHeist],
        deck: [
          welcomeToNightCityRetailDyingNightVSPistol,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
        ],
        eddies: 5,
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailTheHeist, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailDyingNightVSPistol, { as: P1 });

    const trash = engine.getCardsInZone("trash", P1).map((c) => c.definitionId);
    expect(trash).toContain(welcomeToNightCityRetailTheHeist.id);
  });

  it("emits an actionLog entry when it resolves", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailTheHeist],
        deck: [
          welcomeToNightCityRetailDyingNightVSPistol,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
        ],
        eddies: 5,
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailTheHeist, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailDyingNightVSPistol, { as: P1 });

    const last = engine.getLastActionLog();
    expect(last).toBeDefined();
  });

  it("handles a deck with fewer than 4 cards without error (clamps)", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailTheHeist],
        deck: [welcomeToNightCityRetailMantisBlades],
        eddies: 5,
      },
      {},
      { preserveDeckOrder: true },
    );

    // Should not throw — trashFromDeck clamps to available cards.
    engine.playCard(welcomeToNightCityRetailTheHeist, { as: P1 });

    // The gear from the 1-card deck should be selectable.
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (choice && choice.type === "chooseTarget") {
      const eligible =
        (choice as { payload?: { eligibleIds?: string[] } }).payload?.eligibleIds ?? [];
      if (eligible.length > 0) {
        engine.resolveEffectTargetIds(eligible.slice(0, 1), { as: P1 });
      }
    }

    const hand = engine.getCardsInZone("hand", P1).map((c) => c.definitionId);
    expect(hand).toContain(welcomeToNightCityRetailMantisBlades.id);
  });

  it("asks which friendly Unit should receive the free Gear when its cost matches a Gig", () => {
    // Mantis Blades costs 1; a friendly d4 Gig is set to faceValue 1 → match.
    // P1 also has a friendly Unit on the field to attach the Gear to.
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailTheHeist],
        deck: [
          welcomeToNightCityRetailMantisBlades,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
        ],
        field: [
          { card: welcomeToNightCityRetailCorpoSecurity, hasLag: false },
          { card: welcomeToNightCityRetailFieldOperator, hasLag: false },
        ],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
        eddies: 5,
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailTheHeist, { as: P1 });

    // Step 1: choose the Gear from among the trashed cards. This produces a
    // second pending choice (the optional free-play prompt), so we allow it.
    engine.resolveEffectTarget(welcomeToNightCityRetailMantisBlades, {
      as: P1,
      allowPendingChoice: true,
      reason: "the optional free-play effect fires after the Gear is added to hand",
    });

    // Step 2: the Gear is already fixed by the recovery binding. The next
    // choice must be the friendly Unit that receives it, rather than asking
    // the player to select the same Gear again.
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    const payload = (
      choice as {
        payload?: {
          eligibleIds?: string[];
          targetPurpose?: string;
          canDecline?: boolean;
        };
      }
    ).payload;
    const eligibleIds = payload?.eligibleIds ?? [];
    expect(payload?.targetPurpose).toBe("attachHost");
    expect(payload?.canDecline).toBe(true);
    expect(eligibleIds).toHaveLength(2);
    const fieldOperator = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1);
    expect(eligibleIds).toContain(fieldOperator.instanceId);

    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });

    engine.expectNoPendingChoice();

    // The Gear should no longer be in hand (it was played for free onto the
    // friendly Unit).
    const hand = engine.getCardsInZone("hand", P1).map((c) => c.definitionId);
    expect(hand).not.toContain(welcomeToNightCityRetailMantisBlades.id);

    // The Gear should be attached to the Unit the player selected, not the
    // first legal host returned by the target resolver.
    engine.expectAttachedGear(
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailMantisBlades,
      { as: P1 },
    );
    expect(
      engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P1).meta.attachedGearIds,
    ).toHaveLength(0);
  });

  it("keeps the recovered Gear in hand when the free attachment is declined", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailTheHeist],
        deck: [
          welcomeToNightCityRetailMantisBlades,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
        ],
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, hasLag: false }],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
        eddies: 5,
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailTheHeist, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailMantisBlades, {
      as: P1,
      allowPendingChoice: true,
      reason: "the free attachment may be declined",
    });
    engine.executeMove("resolveEffectTarget", { args: { pass: true } }, P1);

    engine.expectNoPendingChoice();
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailMantisBlades.id,
    );
  });

  it("does not offer the free-play prompt when no friendly Gig value matches the Gear cost", () => {
    // Dying Night VS Pistol costs 2; the only friendly Gig is a d4 at faceValue
    // 1 → no match, so the optional free-play effect is skipped entirely.
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailTheHeist],
        deck: [
          welcomeToNightCityRetailDyingNightVSPistol,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
        ],
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, hasLag: false }],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
        eddies: 5,
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailTheHeist, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailDyingNightVSPistol, { as: P1 });

    // No further pending choice — the optional free-play effect was skipped
    // because no friendly Gig value equals the Gear's cost (2).
    engine.expectNoPendingChoice();

    // The Gear remains in hand (free play was not offered).
    const hand = engine.getCardsInZone("hand", P1).map((c) => c.definitionId);
    expect(hand).toContain(welcomeToNightCityRetailDyingNightVSPistol.id);

    // The friendly Unit has no attached Gear.
    const field = engine.getCardsInZone("field", P1);
    expect(field.length).toBe(1);
    expect(field[0]!.meta.attachedGearIds).toHaveLength(0);
  });
});
