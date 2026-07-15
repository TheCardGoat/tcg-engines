import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  createMockUnit,
  expectAttackCandidate,
  expectNotAttackCandidate,
} from "@cyberpunk-engine/testing/index.ts";
import {
  boxTopperRetailGoroTakemuraHandsUnclean,
  welcomeToNightCityRetailChromeReverie,
} from "@tcg/cyberpunk-cards";

const chromeReverie = welcomeToNightCityRetailChromeReverie;

// Mock rival Units (no built-in cantAttack) so the optional cantAttack the
// Program grants is the ONLY thing controlling whether they can attack. Real
// Units like Corpo Security carry a static "this Unit can't attack" rule, which
// would mask the Program's effect.
const rivalAttacker = createMockUnit({ id: "cr-rival-attacker", name: "Rival Attacker", power: 3 });
const rivalOther = createMockUnit({ id: "cr-rival-other", name: "Rival Other", power: 4 });

describe("Chrome Reverie", () => {
  it("makes a targeted rival Unit unable to attack until the caster's next turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [chromeReverie],
        eddies: chromeReverie.cost,
        gigArea: [{ dieType: "d4", faceValue: 1 }], // min Gig, so the Legend choice follows
        legendArea: [{ card: boxTopperRetailGoroTakemuraHandsUnclean, faceDown: true }],
      },
      {
        field: [{ card: rivalAttacker, spent: false, hasLag: false }],
      },
    );

    engine.playCard(chromeReverie, { as: P1 });
    // Apply cantAttack to the rival Unit (the optional grantRule target choice).
    engine.resolveEffectTarget(rivalAttacker, {
      as: P1,
      allowPendingChoice: true,
      reason: "Chrome Reverie still offers the free Legend call after cantAttack",
    });
    // Skip the optional free Legend call.
    engine.executeMove("resolveEffectTarget", { args: { pass: true } }, P1);

    // Hand control to the rival so we can observe the attack restriction.
    engine.skipToNextPlayerTurn(P1);

    expectNotAttackCandidate(engine, rivalAttacker, { as: P2 });
  });

  it("may skip the cantAttack so the rival Unit can still attack", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [chromeReverie],
        eddies: chromeReverie.cost,
        gigArea: [{ dieType: "d6", faceValue: 3 }], // no min Gig -> no Legend choice
      },
      {
        field: [{ card: rivalAttacker, spent: false, hasLag: false }],
      },
    );

    engine.playCard(chromeReverie, { as: P1 });
    // Decline the optional cantAttack.
    engine.executeMove("resolveEffectTarget", { args: { pass: true } }, P1);

    engine.skipToNextPlayerTurn(P1);

    // The rival Unit never received cantAttack, so it remains an attack candidate.
    expectAttackCandidate(engine, rivalAttacker, { as: P2 });
  });

  it("Calls a Legend for free (0 extra eddies) when a min Gig is controlled", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [chromeReverie],
        eddies: chromeReverie.cost,
        gigArea: [{ dieType: "d4", faceValue: 1 }], // min Gig
        legendArea: [{ card: boxTopperRetailGoroTakemuraHandsUnclean, faceDown: true }],
      },
      {
        field: [{ card: rivalAttacker, spent: false, hasLag: false }],
      },
    );

    engine.playCard(chromeReverie, { as: P1 });
    // cantAttack target choice comes first.
    engine.resolveEffectTarget(rivalAttacker, {
      as: P1,
      allowPendingChoice: true,
      reason: "Chrome Reverie offers the free Legend call after cantAttack",
    });
    // A normal callLegend move would spend 1 eddie. Capture eddies now (after the
    // Program's cost was paid) and assert the free call leaves them untouched.
    const eddiesBeforeCall = engine.getEddies(P1);
    // Take the free Legend call (choose the face-down Legend).
    engine.resolveEffectTarget(boxTopperRetailGoroTakemuraHandsUnclean, {
      as: P1,
      zone: "legendArea",
    });

    // The Legend is flipped face-up (observable) and no extra eddies were spent.
    expect(engine.getCard(boxTopperRetailGoroTakemuraHandsUnclean).meta.faceDown).toBe(false);
    expect(engine.getEddies(P1)).toBe(eddiesBeforeCall);
  });

  it("does not offer a free Legend call when no min Gig is controlled", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [chromeReverie],
        eddies: chromeReverie.cost,
        gigArea: [{ dieType: "d6", faceValue: 3 }], // not a min Gig
        legendArea: [{ card: boxTopperRetailGoroTakemuraHandsUnclean, faceDown: true }],
      },
      {
        field: [{ card: rivalAttacker, spent: false, hasLag: false }],
      },
    );

    engine.playCard(chromeReverie, { as: P1 });
    engine.resolveEffectTarget(rivalAttacker, { as: P1 });

    // No min Gig => the callLegend branch is gated off. The Legend stays
    // face-down and the Program resolves fully to trash.
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getCard(boxTopperRetailGoroTakemuraHandsUnclean).meta.faceDown).toBe(true);
    expect(
      engine.getCardsInZone("trash", P1).some((card) => card.definitionId === chromeReverie.id),
    ).toBe(true);
  });

  it("offers rival field Units as the cantAttack target", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [chromeReverie],
        eddies: chromeReverie.cost,
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      },
      {
        field: [
          { card: rivalAttacker, spent: false, hasLag: false },
          { card: rivalOther, spent: false, hasLag: false },
        ],
      },
    );

    engine.playCard(chromeReverie, { as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    const eligibleIds = (choice?.payload.eligibleIds ?? []) as string[];
    const rivalAttackerId = engine.getCard(rivalAttacker, "field", P2).instanceId as string;
    const rivalOtherId = engine.getCard(rivalOther, "field", P2).instanceId as string;
    expect(eligibleIds).toContain(rivalAttackerId);
    expect(eligibleIds).toContain(rivalOtherId);
  });
});
