import { describe, expect, it } from "vite-plus/test";
import {
  theHeistRetailStarterDeckMt0d12Flathead,
  welcomeToNightCityRetailCorpoSecurity,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const flathead = theHeistRetailStarterDeckMt0d12Flathead;
const blocker = welcomeToNightCityRetailCorpoSecurity;

describe("MT0D12 Flathead (The Heist retail starter)", () => {
  it("is the exact blue 5-cost 7-power Militech Drone with conditional unblockability", () => {
    expect(flathead).toMatchObject({
      canonicalId: "mt0d12-flathead",
      slug: "mt0d12-flathead",
      name: "MT0D12 Flathead",
      displayName: "MT0D12 Flathead",
      type: "unit",
      color: "blue",
      classifications: ["Drone", "Militech"],
      cost: 5,
      power: 7,
      ram: 3,
      hasSellTag: true,
      printNumber: "015",
      rulesText: "If you have less ☆ (Street Cred) than a Rival, this Unit can't be blocked.",
      abilities: [
        {
          kind: "static",
          text: "If you have less ☆ (Street Cred) than a Rival, this Unit can't be blocked.",
          effects: [
            {
              effect: "grantRule",
              target: { selector: "self" },
              rule: "cantBeBlocked",
              duration: "continuous",
              conditions: [
                {
                  condition: "streetCredComparison",
                  controller: "friendly",
                  comparison: "lt",
                  other: "rival",
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it("pays exactly 5 Eddies and enters the field with Lag", () => {
    const engine = CyberpunkTestEngine.createWithFixture({ hand: [flathead], eddies: 5 });

    engine.playCard(flathead, { as: P1 });

    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCard(flathead, "field", P1).meta.hasLag).toBe(true);
    engine.expectNoPendingChoice();
  });

  it("can't be blocked while friendly Street Cred is less than a Rival's", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: flathead, spent: false, hasLag: false }],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      {
        field: [{ card: blocker, spent: false, hasLag: false }],
        gigArea: [{ dieType: "d8", faceValue: 7 }],
      },
    );

    engine.attackRival(flathead, { as: P1 });
    engine.resolveAttack({ as: P1 });

    const blockerId = engine.findCardId(blocker, "field", P2);
    const blockerMove = engine
      .getPrompt(P2)
      .availableMoves.find((move) => move.moveId === "useBlocker");
    if (blockerMove?.inputSpec.type === "selectCard") {
      expect(blockerMove.inputSpec.candidates).not.toContain(blockerId);
    }
    const failure = engine.expectFailure(() => engine.useBlocker(blocker, { as: P2 }));
    expect(failure.errorCode).toBe("CANT_BE_BLOCKED");
  });

  it("can be blocked when friendly Street Cred is not less than a Rival's", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: flathead, spent: false, hasLag: false }],
        gigArea: [{ dieType: "d8", faceValue: 7 }],
      },
      {
        field: [{ card: blocker, spent: false, hasLag: false }],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );

    engine.attackRival(flathead, { as: P1 });
    engine.resolveAttack({ as: P1 });

    expect(engine.useBlocker(blocker, { as: P2 })).toMatchObject({
      success: true,
    });
    expect(engine.getState().G.attackState?.kind).toBe("fight");
  });

  it("can be blocked at the exact Street Cred tie (condition is strict `lt`)", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: flathead, spent: false, hasLag: false }],
        gigArea: [{ dieType: "d8", faceValue: 5 }],
      },
      {
        field: [{ card: blocker, spent: false, hasLag: false }],
        gigArea: [{ dieType: "d8", faceValue: 5 }],
      },
    );

    engine.attackRival(flathead, { as: P1 });
    engine.resolveAttack({ as: P1 });

    expect(engine.useBlocker(blocker, { as: P2 })).toMatchObject({
      success: true,
    });
    expect(engine.getState().G.attackState?.kind).toBe("fight");
  });

  it.each([
    {
      label: "friendly Null",
      friendlyGigs: [],
      rivalGigs: [{ dieType: "d8" as const, faceValue: 7 }],
    },
    {
      label: "rival Null",
      friendlyGigs: [{ dieType: "d4" as const, faceValue: 1 }],
      rivalGigs: [],
    },
  ])(
    "can be blocked when Street Cred is $label rather than a number",
    ({ friendlyGigs, rivalGigs }) => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: flathead, spent: false, hasLag: false }],
          gigArea: friendlyGigs,
        },
        {
          field: [{ card: blocker, spent: false, hasLag: false }],
          gigArea: rivalGigs,
        },
      );

      engine.attackRival(flathead, { as: P1 });
      engine.resolveAttack({ as: P1 });

      expect(engine.useBlocker(blocker, { as: P2 })).toMatchObject({ success: true });
      expect(engine.getState().G.attackState?.kind).toBe("fight");
    },
  );
});
