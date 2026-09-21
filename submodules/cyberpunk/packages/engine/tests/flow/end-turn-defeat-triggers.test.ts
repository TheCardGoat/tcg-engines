/**
 * Regression: end-of-turn defeats must resolve the defeated card's triggers
 * before the turn flips.
 *
 * `finishEndTurn` used to run `defeatCardsMarkedForEndTurn` (which queues the
 * defeated card's `{Defeated}` triggers and opens a `chooseTrigger` prompt)
 * and then immediately call `resetTurnFlags`, which wiped `triggerQueue` and
 * `currentTrigger` but left the prompt open. Every later `resolveTrigger`
 * was a silent no-op against the emptied queue, so the match wedged on the
 * same prompt forever (surfaced as `repeatedState` automation concessions in
 * bot-lab round-robins: Dexter DeShawn: One Last Chance defeated at
 * end-of-turn by Cyberpsychosis alongside a second defeat trigger).
 */
import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCyberpsychosis,
  welcomeToNightCityRetailKiroshiOptics,
} from "@tcg/cyberpunk-cards";
import type { Ability } from "@tcg/cyberpunk-types";
import { CyberpunkTestEngine, P1, P2, createMockUnit } from "../../src/testing/index.ts";

const CONDITIONAL_DRAW_2 =
  "{Defeated} If your ☆ (Street Cred) differs from a Rival's by 1+, draw 2.";
const UNCONDITIONAL_DRAW_1 = "{Defeated} Draw 1.";

const doomedFixer = createMockUnit({
  id: "doomed_fixer",
  name: "Doomed Fixer",
  cost: 3,
  power: 4,
  abilities: [
    {
      kind: "triggered",
      text: CONDITIONAL_DRAW_2,
      trigger: { trigger: "defeated" },
      source: { selector: "self" },
      effects: [
        {
          effect: "draw",
          player: "friendly",
          amount: 2,
          conditions: [
            {
              condition: "streetCredDifference",
              controller: "friendly",
              comparison: "gte",
              other: "rival",
              value: 1,
            },
          ],
        },
      ],
    } satisfies Ability,
    {
      kind: "triggered",
      text: UNCONDITIONAL_DRAW_1,
      trigger: { trigger: "defeated" },
      source: { selector: "self" },
      effects: [{ effect: "draw", player: "friendly", amount: 1 }],
    } satisfies Ability,
  ],
});

function resolveFirstTriggerIfPending(engine: CyberpunkTestEngine): void {
  const choice = engine.getState().G.turnMetadata.pendingChoice;
  if (!choice || choice.type !== "chooseTrigger") return;
  const first = choice.payload.options[0];
  if (!first) return;
  engine.executeMove("resolveTrigger", { args: { triggerId: first.triggerId } }, choice.chooserId);
}

function resolveFirstEffectTargetIfPending(engine: CyberpunkTestEngine): void {
  const choice = engine.getState().G.turnMetadata.pendingChoice;
  if (!choice || choice.type !== "chooseTarget" || choice.payload.type !== "effectTarget") return;
  const first = choice.payload.eligibleIds?.[0];
  if (!first) return;
  engine.resolveEffectTargetIds([first], { as: choice.chooserId });
}

function resolveTriggerByAbilityText(engine: CyberpunkTestEngine, abilityText: string): void {
  const choice = engine.getState().G.turnMetadata.pendingChoice;
  if (!choice || choice.type !== "chooseTrigger") {
    throw new Error(`Expected chooseTrigger prompt, got ${choice?.type ?? "none"}`);
  }
  const option = choice.payload.options.find((entry) => entry.abilityText === abilityText);
  if (!option) {
    throw new Error(`Trigger with ability text "${abilityText}" is not pending`);
  }
  engine.executeMove("resolveTrigger", { args: { triggerId: option.triggerId } }, choice.chooserId);
}

describe("Flow — end-of-turn defeat triggers", () => {
  it("resolves both defeated triggers after an end-of-turn defeat and flips the turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailCyberpsychosis],
        field: [
          {
            card: doomedFixer,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailKiroshiOptics],
          },
        ],
        eddies: 3,
      },
      {
        gigArea: [
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 4 },
        ],
      },
    );

    engine.playCard(welcomeToNightCityRetailCyberpsychosis, { as: P1 });
    engine.resolveEffectTarget(doomedFixer, { as: P1 });
    engine.attackRival(doomedFixer, { as: P1 });
    resolveFirstTriggerIfPending(engine);
    resolveFirstEffectTargetIfPending(engine);
    engine.resolveFullSteal({ as: P1 });
    resolveFirstTriggerIfPending(engine);
    resolveFirstEffectTargetIfPending(engine);

    const handBefore = engine.getCardsInZone("hand", P1).length;
    engine.completeTurn({ as: P1 });

    // The defeat queued both {Defeated} triggers; the end of turn suspends
    // until they resolve instead of wiping them mid-prompt.
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTrigger");
    expect(
      choice && choice.type === "chooseTrigger"
        ? choice.payload.options.map((o) => o.abilityText)
        : [],
    ).toEqual([CONDITIONAL_DRAW_2, UNCONDITIONAL_DRAW_1]);

    // Resolving the first queued trigger is enough — the remaining single
    // non-optional trigger auto-resolves, and the suspended end of turn then
    // completes instead of wedging on a prompt whose queue was wiped.
    resolveTriggerByAbilityText(engine, CONDITIONAL_DRAW_2);

    // The Street Cred difference is ≥ 1 after the steal, so both triggers
    // queue and both draws fire: 2 from the conditional, 1 unconditional.
    expect(engine.getCardsInZone("hand", P1).length).toBe(handBefore + 3);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getState().G.turnMetadata.currentTrigger).toBeUndefined();
    expect(engine.getState().G.turnMetadata.triggerQueue).toHaveLength(0);
    expect(engine.getState().G.turnMetadata.activePlayerId).toBe(P2);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      doomedFixer.id,
    );
  });
});
