import { describe, expect, it } from "vite-plus/test";
import { welcomeToNightCityRetailMaxtacAv } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const av = welcomeToNightCityRetailMaxtacAv;

describe("MaxTac AV", () => {
  it("is the exact green 5-cost 8-power NCPD/Vehicle Unit with its optional Play swap", () => {
    expect(av).toMatchObject({
      canonicalId: "maxtac-av",
      slug: "maxtac-av",
      name: "MaxTac AV",
      displayName: "MaxTac AV",
      type: "unit",
      color: "green",
      classifications: ["NCPD", "Vehicle"],
      cost: 5,
      power: 8,
      ram: 2,
      hasSellTag: false,
      printNumber: "080",
      timingTriggers: ["play"],
      rulesText: "{Play} You may swap a friendly Gig with a rival Gig.",
    });
    expect(av.abilities).toEqual([
      expect.objectContaining({
        trigger: { trigger: "play" },
        source: { selector: "self" },
        bindings: [
          {
            id: "friendlyGig",
            target: {
              selector: "gig",
              controller: "friendly",
              amount: 1,
              selection: { mode: "choose", min: 1, max: 1 },
            },
          },
          {
            id: "rivalGig",
            target: {
              selector: "gig",
              controller: "rival",
              amount: 1,
              selection: { mode: "choose", min: 1, max: 1 },
            },
          },
        ],
        effects: [
          {
            effect: "swapGigs",
            friendly: { selector: "bound", id: "friendlyGig" },
            rival: { selector: "bound", id: "rivalGig" },
            optional: true,
          },
        ],
      }),
    ]);
  });

  it("may accept the Play trigger and swaps exactly the chosen friendly and rival Gigs", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [av],
        eddies: 5,
        gigArea: [
          { dieType: "d4", faceValue: 2 },
          { dieType: "d6", faceValue: 5 },
        ],
      },
      {
        gigArea: [
          { dieType: "d8", faceValue: 6 },
          { dieType: "d10", faceValue: 9 },
        ],
      },
    );
    const friendly = engine.findGigIdByType(P1, "d4");
    const friendlyOther = engine.findGigIdByType(P1, "d6");
    const rival = engine.findGigIdByType(P2, "d8");
    const rivalOther = engine.findGigIdByType(P2, "d10");

    engine.playCard(av, { as: P1 });
    const triggerChoice = engine.getState().G.turnMetadata.pendingChoice;
    expect(triggerChoice?.type).toBe("chooseTrigger");
    if (!triggerChoice || triggerChoice.type !== "chooseTrigger") {
      throw new Error("Expected optional MaxTac AV Play trigger");
    }
    const trigger = triggerChoice.payload.options.find(
      (option) => option.sourceCardId === engine.getCard(av, "field", P1).instanceId,
    );
    if (!trigger) throw new Error("Expected MaxTac AV trigger option");
    engine.executeMove("resolveTrigger", { args: { triggerId: trigger.triggerId } }, P1);

    const friendlyChoice = engine.getState().G.turnMetadata.pendingChoice;
    expect(friendlyChoice).toMatchObject({
      type: "chooseTarget",
      payload: { eligibleIds: expect.arrayContaining([friendly, friendlyOther]), min: 1, max: 1 },
    });
    if (!friendlyChoice || friendlyChoice.type !== "chooseTarget") {
      throw new Error("Expected friendly Gig choice");
    }
    expect(friendlyChoice.payload.eligibleIds).not.toContain(rival);
    expect(
      engine.executeMove("resolveEffectTarget", { args: { targetIds: [rival] } }, P1),
    ).toMatchObject({ success: false, errorCode: "INVALID_CHOICE" });
    engine.resolveEffectTargetIds([friendly], {
      as: P1,
      allowPendingChoice: true,
      reason: "MaxTac AV still needs the rival Gig",
    });

    const rivalChoice = engine.getState().G.turnMetadata.pendingChoice;
    expect(rivalChoice).toMatchObject({
      type: "chooseTarget",
      payload: { eligibleIds: expect.arrayContaining([rival, rivalOther]), min: 1, max: 1 },
    });
    if (!rivalChoice || rivalChoice.type !== "chooseTarget") {
      throw new Error("Expected rival Gig choice");
    }
    expect(rivalChoice.payload.eligibleIds).not.toContain(friendlyOther);
    engine.resolveEffectTargetIds([rival], { as: P1 });

    expect(engine.getGigDice(P1).map((die) => die.id)).toContain(rival);
    expect(engine.getGigDice(P1).map((die) => die.id)).toContain(friendlyOther);
    expect(engine.getGigDice(P2).map((die) => die.id)).toContain(friendly);
    expect(engine.getGigDice(P2).map((die) => die.id)).toContain(rivalOther);
    expect(engine.getGigDice(P1).find((die) => die.id === rival)?.faceValue).toBe(6);
    expect(engine.getGigDice(P2).find((die) => die.id === friendly)?.faceValue).toBe(2);
  });

  it("may decline the Play trigger without swapping either Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [av], eddies: 5, gigArea: [{ dieType: "d4", faceValue: 2 }] },
      { gigArea: [{ dieType: "d8", faceValue: 6 }] },
    );
    const friendly = engine.findGigIdByType(P1, "d4");
    const rival = engine.findGigIdByType(P2, "d8");

    engine.playCard(av, { as: P1 });
    const triggerChoice = engine.getState().G.turnMetadata.pendingChoice;
    expect(triggerChoice).toMatchObject({ type: "chooseTrigger", payload: { canPass: true } });
    engine.executeMove("resolveTrigger", { args: { pass: true } }, P1);

    expect(engine.getGigDice(P1).map((die) => die.id)).toEqual([friendly]);
    expect(engine.getGigDice(P2).map((die) => die.id)).toEqual([rival]);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(av.id);
  });

  it("enters the field without a prompt when there is no rival Gig to swap", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [av],
      eddies: 5,
      gigArea: [{ dieType: "d4", faceValue: 2 }],
    });

    engine.playCard(av, { as: P1 });
    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(av.id);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });

  it("enters the field without a prompt when there is no friendly Gig to swap", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [av], eddies: 5 },
      { gigArea: [{ dieType: "d8", faceValue: 6 }] },
    );

    engine.playCard(av, { as: P1 });

    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(av.id);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });
});
