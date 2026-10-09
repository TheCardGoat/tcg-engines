import { describe, expect, it } from "bun:test";

import {
  getBagEffectPayloadMeta,
  getResolutionEffectInstanceReferences,
} from "./pending-effect-payload.js";

describe("getResolutionEffectInstanceReferences", () => {
  it("extracts trigger-subject references from instance-bound effects", () => {
    const references = getResolutionEffectInstanceReferences({
      sourceCardId: "belle_7",
      effect: {
        type: "put-into-inkwell",
        source: {
          selector: "all",
          count: 1,
          reference: "trigger-subject",
          zones: ["discard"],
        },
      },
      resolutionInput: {
        eventSnapshot: {
          subjectCardId: "belle_7",
        },
      },
    });

    expect(references).toEqual([
      {
        kind: "trigger-subject",
        cardIds: ["belle_7"],
      },
    ]);
  });

  it("resolves chosen-or-source references from the chosen card first", () => {
    const references = getResolutionEffectInstanceReferences({
      sourceCardId: "source_2",
      effect: {
        type: "play-card",
        targetRef: "chosen-or-source",
      },
      resolutionInput: {
        eventSnapshot: {
          chosenCardId: "chosen_4",
        },
      },
    });

    expect(references).toEqual([
      {
        kind: "chosen-or-source",
        cardIds: ["chosen_4"],
      },
    ]);
  });
});

describe("getBagEffectPayloadMeta", () => {
  it("preserves the text of an unindexed temporary trigger", () => {
    const abilityName = "Whenever this character challenges another character, draw a card.";
    const meta = getBagEffectPayloadMeta({ abilityName, effect: { type: "draw", amount: 1 } });
    expect(meta.abilityName).toBe(abilityName);
    expect(meta.abilityIndex).toBeUndefined();
    expect(meta.effectType).toBe("draw");
  });
});
