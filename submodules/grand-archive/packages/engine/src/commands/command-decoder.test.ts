import { describe, expect, it } from "vitest";
import {
  decodeGrandArchiveCommand,
  GRAND_ARCHIVE_MOVE_NAMES,
  type GrandArchiveMoveName,
} from "./commands.ts";

const validPayloads = {
  pass: {},
  concede: {},
  "skip-materialization": {},
  "return-preserved-card": {
    cardId: "preserved-1",
  },
  materialize: {
    cardId: "material-1",
    modeIds: ["mode-a"],
    targets: { chosen: ["object-1", "player-2"] },
    reservePayment: [
      { kind: "card", cardId: "reserve-card" },
      { kind: "reservable", objectId: "reservable-object" },
    ],
    floatingMemoryCardIds: ["floating-card"],
    paymentContributions: [
      {
        ruleId: "contribution-1",
        reservePayment: [{ kind: "card", cardId: "contribution-card" }],
        costSelections: [["selected-object"]],
        costPaymentOrders: [{ path: [0], order: [1, 0] }],
        costOptionIndex: 0,
        payOptionalCost: true,
        paymentSourceIds: ["payment-source"],
      },
    ],
    costSelections: [["cost-object"]],
    costPaymentOrders: [{ path: [], order: [0] }],
    costOptionIndex: 1,
    payOptionalCost: false,
    variables: { X: 2 },
  },
  "bestow-boon": { cardId: "boon-1", targets: {} },
  "start-pregame-card": { cardId: "pregame-1" },
  "complete-pregame-actions": {},
  "activate-card": {
    cardId: "card-1",
    attackAttackerId: "attacker-1",
    activationMethod: "brew",
    brewIngredientIds: ["ingredient-1"],
    revealForImbue: true,
    kindleCardIds: ["fire-1"],
    floatingMemoryCardIds: ["floating-1"],
    prepareAbilityIndexes: [0],
  },
  "activate-ability": { sourceId: "source-1", abilityId: "ability-1", modeIds: [] },
  "declare-attack": {
    attackerId: "attacker-1",
    targetIds: ["defender-1"],
    delegatePlayerId: "player-2",
    cleavePlayerId: "player-3",
    attackCardId: "attack-card-1",
    weaponIds: ["weapon-1"],
  },
  "answer-decision": { decisionId: "decision-1", stateVersion: 4, answer: null },
} as const satisfies Readonly<Record<GrandArchiveMoveName, unknown>>;

describe("Grand Archive command decoder", () => {
  it("strictly decodes every command variant and its nested declarations", () => {
    expect(Object.keys(validPayloads)).toEqual(GRAND_ARCHIVE_MOVE_NAMES);
    for (const move of GRAND_ARCHIVE_MOVE_NAMES) {
      expect(decodeGrandArchiveCommand(move, validPayloads[move]), move).toMatchObject({ move });
    }
    expect(decodeGrandArchiveCommand("materialize", validPayloads.materialize)).toMatchObject({
      targets: { chosen: ["object-1", "player-2"] },
      reservePayment: [
        { kind: "card", cardId: "reserve-card" },
        { kind: "reservable", objectId: "reservable-object" },
      ],
      paymentContributions: [
        expect.objectContaining({
          ruleId: "contribution-1",
          paymentSourceIds: ["payment-source"],
        }),
      ],
      variables: { X: 2 },
    });
  });

  it.each([
    ["pass", null],
    ["pass", { extra: true }],
    ["concede", { reason: 2 }],
    ["return-preserved-card", { cardId: "" }],
    ["return-preserved-card", { cardId: "preserved-1", materialization: null }],
    [
      "return-preserved-card",
      { cardId: "preserved-1", materialization: { cardId: "material-1", extra: true } },
    ],
    ["activate-ability", { sourceId: "source-1", abilityId: "ability-1", cardId: "legacy" }],
    ["activate-card", { cardId: "card-1", activationMethod: "unknown" }],
    ["activate-card", { cardId: "card-1", prepareAbilityIndexes: [] }],
    ["activate-card", { cardId: "card-1", prepareAbilityIndexes: [0, 0] }],
    ["activate-card", { cardId: "card-1", prepareAbilityIndexes: [-1] }],
    ["activate-card", { cardId: "card-1", prepareAbilityIndexes: ["0"] }],
    ["declare-attack", { attackerId: "attacker-1" }],
    ["declare-attack", { attackerId: "attacker-1", targetIds: "defender-1" }],
    ["materialize", { cardId: "card-1", targets: { chosen: null } }],
    ["materialize", { cardId: "card-1", costSelections: [null] }],
    ["materialize", { cardId: "card-1", targets: { chosen: [""] } }],
    [
      "materialize",
      { cardId: "card-1", reservePayment: [{ kind: "card", cardId: "cost", extra: true }] },
    ],
    ["materialize", { cardId: "card-1", variables: { Q: 1 } }],
    ["answer-decision", { decisionId: "decision-1", stateVersion: -1, answer: true }],
  ] as const)("rejects malformed %s payloads", (move, payload) => {
    expect(decodeGrandArchiveCommand(move, payload)).toBeNull();
  });
});
