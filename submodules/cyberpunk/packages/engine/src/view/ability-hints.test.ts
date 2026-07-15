import { describe, expect, test } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  createMockLegend,
  createMockProgram,
} from "../testing/index.ts";
import { getAbilityHints } from "./ability-hints.ts";

describe("player-safe ability hints", () => {
  test("derives timing, roles, requirements, and nested effects from structured abilities", () => {
    const program = createMockProgram({
      keywords: ["quick"],
      abilities: [
        {
          kind: "triggered",
          text: "Protect against an attacker and draw.",
          trigger: { trigger: "play" },
          effects: [
            {
              effect: "grantRule",
              target: { selector: "attacker" },
              rule: "stealsOneFewerGig",
              duration: "turn",
            },
            {
              effect: "ifYouDo",
              doEffect: {
                effect: "draw",
                player: "friendly",
                amount: 1,
              },
              ifEffects: [
                {
                  effect: "readyEddies",
                  player: "friendly",
                  amount: 1,
                  conditions: [
                    {
                      condition: "cardName",
                      target: { selector: "host" },
                      name: "V",
                    },
                  ],
                },
              ],
            },
            {
              effect: "draw",
              player: "friendly",
              amount: 1,
              conditions: [
                {
                  condition: "hasDistinctGigValues",
                  controller: "friendly",
                  minCount: 3,
                },
              ],
            },
          ],
        },
      ],
    });

    expect(getAbilityHints(program)).toEqual([
      expect.objectContaining({
        abilityIndex: 0,
        timing: "play",
        reactive: true,
        effects: ["draw", "grantRule", "ifYouDo", "readyEddies"],
        conditions: ["cardName", "hasDistinctGigValues"],
        conditionThresholds: [{ condition: "hasDistinctGigValues", minCount: 3 }],
        requiredHostNames: ["V"],
        requirements: ["attackContext"],
        roles: ["cardAdvantage", "combat", "economy"],
      }),
    ]);
  });

  test("projects hints for the owner's hand without leaking hidden rival cards", () => {
    const program = createMockProgram({
      id: "visible-engine-program",
      abilities: [
        {
          kind: "triggered",
          text: "Draw 1.",
          trigger: { trigger: "play" },
          effects: [{ effect: "draw", player: "friendly", amount: 1 }],
        },
      ],
    });
    const hiddenLegend = createMockLegend({
      id: "hidden-ability-legend",
      abilities: [
        {
          kind: "triggered",
          text: "Steal a Gig.",
          trigger: { trigger: "call" },
          effects: [
            {
              effect: "stealGig",
              target: {
                selector: "gig",
                controller: "rival",
                selection: { mode: "choose", min: 1, max: 1 },
              },
            },
          ],
        },
      ],
    });
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [program],
      legendArea: [{ card: hiddenLegend, faceDown: true }],
    });

    const owner = engine.getFilteredView(P1).players.p1!;
    const rival = engine.getFilteredView(P2).players.p1!;
    expect(owner.zones.hand).toEqual([
      expect.objectContaining({
        abilityHints: [expect.objectContaining({ roles: ["cardAdvantage"] })],
      }),
    ]);
    expect(rival.zones.hand).toBe(1);
    expect(owner.zones.legendArea).toEqual([
      expect.objectContaining({ faceDown: true, abilityHints: [] }),
    ]);
    expect(rival.zones.legendArea).toEqual([
      expect.objectContaining({ faceDown: true, abilityHints: [] }),
    ]);
  });
});
