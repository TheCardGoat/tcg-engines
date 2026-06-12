import { describe, expect, it } from "bun:test";
import { buildResolutionAmountSelectionState } from "./resolution-amount-selection";

describe("resolution amount selection", () => {
  it("defaults remove-damage selections to the chosen target's damage", () => {
    const selection = buildResolutionAmountSelectionState({
      payload: {
        effect: {
          type: "remove-damage",
          amount: { type: "up-to", value: 3 },
        },
      },
      selectedTargets: ["card-1"],
      cardSnapshotsById: {
        "card-1": {
          cardId: "card-1",
          definitionId: "card-1",
          facePresentation: "faceUp",
          isMasked: false,
          label: "Damaged Ally",
          ownerId: "player-one",
          ownerSide: "playerOne",
          zoneId: "play",
          damage: 2,
        },
      },
    });

    expect(selection).toEqual({
      label: "Damage to remove",
      min: 0,
      max: 2,
      value: 2,
    });
  });

  it("uses selected-target self-replacement to cap Darkwing's Chair Set at 4", () => {
    const selection = buildResolutionAmountSelectionState({
      payload: {
        effect: {
          type: "remove-damage",
          amount: { type: "up-to", value: 2 },
          selfReplacement: {
            condition: {
              type: "selected-target-name",
              name: "Darkwing Duck",
            },
            value: 4,
          },
        },
      },
      selectedTargets: ["darkwing"],
      cardSnapshotsById: {
        darkwing: {
          cardId: "darkwing",
          definitionId: "Zlv",
          facePresentation: "faceUp",
          isMasked: false,
          label: "Darkwing Duck - Dashing Gadgeteer",
          ownerId: "player-one",
          ownerSide: "playerOne",
          zoneId: "play",
          damage: 4,
        },
      },
    });

    expect(selection).toEqual({
      label: "Damage to remove",
      min: 0,
      max: 4,
      value: 4,
    });
  });

  it("clamps move-damage selections to the chosen source's damage", () => {
    const selection = buildResolutionAmountSelectionState({
      payload: {
        effect: {
          type: "move-damage",
          amount: { type: "up-to", value: 3 },
        },
      },
      selectedTargets: ["card-1", "card-2"],
      currentAmount: 3,
      cardSnapshotsById: {
        "card-1": {
          cardId: "card-1",
          definitionId: "card-1",
          facePresentation: "faceUp",
          isMasked: false,
          label: "Source",
          ownerId: "player-one",
          ownerSide: "playerOne",
          zoneId: "play",
          damage: 1,
        },
        "card-2": {
          cardId: "card-2",
          definitionId: "card-2",
          facePresentation: "faceUp",
          isMasked: false,
          label: "Destination",
          ownerId: "player-two",
          ownerSide: "playerTwo",
          zoneId: "play",
          damage: 0,
        },
      },
    });

    expect(selection).toEqual({
      label: "Damage to move",
      min: 0,
      max: 1,
      value: 1,
    });
  });

  it("descends into a sequence wrapping an optional remove-damage (Julieta SIGNATURE RECIPE shape)", () => {
    const selection = buildResolutionAmountSelectionState({
      payload: {
        effect: {
          type: "sequence",
          steps: [
            {
              type: "optional",
              effect: {
                type: "remove-damage",
                amount: { type: "up-to", value: 2 },
              },
            },
            { type: "conditional" },
          ],
        },
      },
      selectedTargets: ["card-1"],
      cardSnapshotsById: {
        "card-1": {
          cardId: "card-1",
          definitionId: "card-1",
          facePresentation: "faceUp",
          isMasked: false,
          label: "Damaged Ally",
          ownerId: "player-one",
          ownerSide: "playerOne",
          zoneId: "play",
          damage: 2,
        },
      },
    });

    expect(selection).toEqual({
      label: "Damage to remove",
      min: 0,
      max: 2,
      value: 2,
    });
  });

  it("descends into a sequence wrapping a move-damage with up-to (Luisa I CAN TAKE IT shape)", () => {
    const selection = buildResolutionAmountSelectionState({
      payload: {
        effect: {
          type: "sequence",
          steps: [
            {
              type: "move-damage",
              amount: { type: "up-to", value: 1 },
              from: "CHOSEN_CHARACTER_OF_YOURS",
              to: "SELF",
            },
            { type: "conditional" },
          ],
        },
      },
      selectedTargets: ["card-1"],
      cardSnapshotsById: {
        "card-1": {
          cardId: "card-1",
          definitionId: "card-1",
          facePresentation: "faceUp",
          isMasked: false,
          label: "Source",
          ownerId: "player-one",
          ownerSide: "playerOne",
          zoneId: "play",
          damage: 2,
        },
      },
    });

    expect(selection).toEqual({
      label: "Damage to move",
      min: 0,
      max: 1,
      value: 1,
    });
  });

  it("skips earlier non-up-to steps in a sequence (Miracle Candle ABUELA'S GIFT shape)", () => {
    // Miracle Candle: sequence([gain-lore 2, remove-damage up-to 2]).
    // The amount picker must reflect the remove-damage step's up-to range,
    // not be hidden by the leading gain-lore.
    const selection = buildResolutionAmountSelectionState({
      payload: {
        effect: {
          type: "sequence",
          steps: [
            { type: "gain-lore", amount: 2 },
            {
              type: "remove-damage",
              amount: { type: "up-to", value: 2 },
            },
          ],
        },
      },
      selectedTargets: ["card-1"],
      cardSnapshotsById: {
        "card-1": {
          cardId: "card-1",
          definitionId: "card-1",
          facePresentation: "faceUp",
          isMasked: false,
          label: "Damaged Location",
          ownerId: "player-one",
          ownerSide: "playerOne",
          zoneId: "play",
          damage: 2,
        },
      },
    });

    expect(selection).toEqual({
      label: "Damage to remove",
      min: 0,
      max: 2,
      value: 2,
    });
  });

  it("ignores fixed move-damage effects", () => {
    expect(
      buildResolutionAmountSelectionState({
        payload: {
          effect: {
            type: "move-damage",
            amount: 1,
          },
        },
        selectedTargets: ["card-1"],
        cardSnapshotsById: {},
      }),
    ).toBeNull();
  });
});
