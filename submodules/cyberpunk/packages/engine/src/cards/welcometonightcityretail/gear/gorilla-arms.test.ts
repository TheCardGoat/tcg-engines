import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailEvelynParkerBeautifulEnigma,
  welcomeToNightCityRetailGorillaArms,
  welcomeToNightCityRetailOffdutyMalfini,
  welcomeToNightCityRetailRidingNomad,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

/**
 * Resolves any pending `chooseTrigger` choices in arrival order. Used when a
 * card-driven steal queues multiple mandatory friendly triggers at once (e.g.
 * Gorilla Arms + Evelyn Parker both listening on `gigStolen`).
 */
function drainChooseTrigger(engine: CyberpunkTestEngine): void {
  for (;;) {
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTrigger") return;
    const first = choice.payload.options[0];
    if (!first) return;
    engine.executeMove(
      "resolveTrigger",
      { args: { triggerId: first.triggerId } },
      choice.chooserId,
    );
  }
}

function resolveFirstPendingGigTarget(
  engine: CyberpunkTestEngine,
  opts?: { allowPendingChoice?: boolean },
): string {
  const choice = engine.getState().G.turnMetadata.pendingChoice;
  expect(choice?.type).toBe("chooseTarget");
  if (!choice || choice.type !== "chooseTarget") {
    throw new Error("Expected a chooseTarget pending choice.");
  }
  expect(choice.payload.type).toBe("effectTarget");
  expect(choice.payload.targetKind).toBe("gig");
  const eligibleIds = choice.payload.eligibleIds ?? [];
  const targetId = eligibleIds[0];
  expect(targetId).toBeDefined();
  if (opts?.allowPendingChoice) {
    engine.resolveEffectTargetIds([targetId!], {
      as: P1,
      allowPendingChoice: true,
      reason: "Gorilla Arms can queue follow-up gigStolen triggers.",
    });
  } else {
    engine.resolveEffectTargetIds([targetId!], { as: P1 });
  }
  return targetId!;
}

describe("Gorilla Arms", () => {
  it("attaches to a unit and contributes four power", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailGorillaArms],
      field: [{ card: welcomeToNightCityRetailOffdutyMalfini, spent: false }],
      eddies: 4,
    });

    expect(
      engine.attachGear(
        welcomeToNightCityRetailGorillaArms,
        welcomeToNightCityRetailOffdutyMalfini,
        {
          as: P1,
        },
      ),
    ).toMatchObject({
      success: true,
    });
    const host = engine.getCard(welcomeToNightCityRetailOffdutyMalfini, "field", P1);
    expect(host.meta.attachedGearIds).toHaveLength(1);
  });

  it("is limited to the first extra steal whose value is not shared by a friendly Gig", () => {
    const ability = welcomeToNightCityRetailGorillaArms.abilities[0]!;
    expect(ability.trigger).toMatchObject({ trigger: "event", event: { event: "gigStolen" } });
    expect(ability.limits).toContain("firstTimeEachTurn");
    expect(ability.effects[0]).toMatchObject({
      effect: "stealGig",
      target: {
        controller: "rival",
        valueNotSharedBy: {
          controller: "friendly",
        },
        selection: {
          mode: "choose",
          min: 1,
          max: 1,
        },
      },
    });
  });

  it("lets the player choose which unshared-value rival Gig Gorilla Arms steals", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailRidingNomad, spent: false, hasLag: false }],
        hand: [welcomeToNightCityRetailGorillaArms],
        eddies: 4,
        gigArea: [
          { dieType: "d4", faceValue: 3 },
          { dieType: "d6", faceValue: 5 },
          { dieType: "d12", faceValue: 10 },
        ],
      },
      {
        gigArea: [
          { dieType: "d4", faceValue: 2 },
          { dieType: "d12", faceValue: 9 },
          { dieType: "d6", faceValue: 5 },
        ],
      },
    );

    engine.attachGear(welcomeToNightCityRetailGorillaArms, welcomeToNightCityRetailRidingNomad, {
      as: P1,
    });
    const stolenFive = engine.getGigDice(P2).find((die) => die.faceValue === 5);
    expect(stolenFive).toBeDefined();

    engine.attackRival(welcomeToNightCityRetailRidingNomad, { as: P1 });
    engine.resolveAttack({ as: P1 });
    engine.resolveAttack({ as: P2, pass: true });
    engine.resolveAttack({ as: P1, gigIdsToSteal: [stolenFive!.id] });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    if (!choice || choice.type !== "chooseTarget") {
      throw new Error("Expected Gorilla Arms to ask for a Gig target.");
    }
    expect(choice.payload.type).toBe("effectTarget");
    expect(choice.payload.targetKind).toBe("gig");
    expect(choice.payload.min).toBe(1);
    expect(choice.payload.max).toBe(1);

    const eligibleIds = choice.payload.eligibleIds ?? [];
    const eligibleValues = eligibleIds
      .map((id) => engine.getState().G.gigDice[id]?.faceValue)
      .sort((a, b) => (a ?? 0) - (b ?? 0));
    expect(eligibleValues).toEqual([2, 9]);

    const nine = eligibleIds.find((id) => engine.getState().G.gigDice[id]?.faceValue === 9);
    expect(nine).toBeDefined();
    engine.resolveEffectTargetIds([nine!], { as: P1 });

    expect(
      engine
        .getGigDice(P1)
        .map((die) => die.faceValue)
        .sort((a, b) => a - b),
    ).toEqual([3, 5, 5, 9, 10]);
    expect(engine.getGigDice(P2).map((die) => die.faceValue)).toEqual([2]);
  });

  it("attributes a card-driven steal to the host Unit (Change A) and bounds the cascade", () => {
    // Host (Offduty Malfini, power 5) + Gorilla Arms (+3) = power 8 → direct
    // attack steals 1 Gig. Gorilla Arms then steals one rival Gig whose value
    // is not shared by a friendly Gig. P2's gigs use distinct values so exactly
    // one qualifies for the cascade after the direct steal takes the first.
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailGorillaArms],
        field: [{ card: welcomeToNightCityRetailOffdutyMalfini, spent: false, hasLag: false }],
        eddies: 4,
      },
      {
        gigArea: [
          { dieType: "d4", faceValue: 2 },
          { dieType: "d6", faceValue: 1 },
        ],
      },
    );

    engine.attachGear(welcomeToNightCityRetailGorillaArms, welcomeToNightCityRetailOffdutyMalfini, {
      as: P1,
    });
    engine.attackRival(welcomeToNightCityRetailOffdutyMalfini, { as: P1 });
    engine.resolveFullSteal({ as: P1 });
    resolveFirstPendingGigTarget(engine);

    const host = engine.getCard(welcomeToNightCityRetailOffdutyMalfini, "field", P1);

    // 1 direct-attack steal + 1 Gorilla Arms cascade steal.
    expect(engine.getGigCount(P1)).toBe(2);

    // The card-driven steal must be attributed to the host Unit (not the Gear)
    // so `source.host`/`source.self`/`source.card` filters match it (Change A).
    const lastSteal = engine.getLastEvent("gigStolen");
    expect(lastSteal).toBeDefined();
    expect((lastSteal as { sourceCardId: string }).sourceCardId).toBe(host.instanceId as string);

    // Exactly two gigStolen events total — Gorilla Arms fired once (its own
    // re-trigger is blocked by firstTimeEachTurn) and the cascade is bounded.
    expect(engine.getEvents("gigStolen")).toHaveLength(2);
  });

  it("routes the card-driven steal to gigStolen listeners so Evelyn Parker readies off the cascade (Change B)", () => {
    // Offduty Malfini (Ganger) hosts Gorilla Arms. Evelyn Parker readies 1
    // Eddie whenever a friendly Corpo/Ganger Unit steals. Change A attributes
    // both the direct steal and the Gorilla Arms cascade to the host, and
    // Change B routes the cascade's gigStolen through the trigger queue so
    // Evelyn Parker fires on it too. Without Change B only the direct-attack
    // steal reaches her (performGigSteal dispatches that one explicitly), so
    // she would ready only 1 Eddie instead of 2.
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [
          { card: welcomeToNightCityRetailEvelynParkerBeautifulEnigma, faceDown: false },
        ],
        field: [{ card: welcomeToNightCityRetailOffdutyMalfini, spent: false, hasLag: false }],
        hand: [welcomeToNightCityRetailGorillaArms],
        eddies: 4,
      },
      {
        gigArea: [
          { dieType: "d4", faceValue: 2 },
          { dieType: "d6", faceValue: 1 },
        ],
      },
    );

    engine.attachGear(welcomeToNightCityRetailGorillaArms, welcomeToNightCityRetailOffdutyMalfini, {
      as: P1,
    });
    // Playing the Gear costs 4 Eddies → 4 spentEddies available to ready.
    expect(engine.getEddies(P1)).toBe(0);

    engine.attackRival(welcomeToNightCityRetailOffdutyMalfini, { as: P1 });
    engine.resolveFullSteal({ as: P1 });
    drainChooseTrigger(engine);
    if (engine.getState().G.turnMetadata.pendingChoice?.type === "chooseTarget") {
      resolveFirstPendingGigTarget(engine, { allowPendingChoice: true });
    }

    // The direct steal queues Gorilla Arms + Evelyn Parker (two mandatory P1
    // triggers), so a chooseTrigger choice suspends. The cascade re-queues
    // Evelyn Parker via Change B regardless of resolution order.
    drainChooseTrigger(engine);

    // 1 readyEddies from the direct steal + 1 from the Gorilla Arms cascade.
    expect(engine.getEddies(P1)).toBe(2);
  });
});
