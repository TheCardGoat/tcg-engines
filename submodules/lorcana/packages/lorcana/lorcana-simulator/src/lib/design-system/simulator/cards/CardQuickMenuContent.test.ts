import { describe, expect, it } from "bun:test";
import { render } from "svelte/server";
import type { CardActionView, LorcanaCardSnapshot } from "@/features/simulator/model/contracts.js";
import CardQuickMenuContentTestHost from "./CardQuickMenuContent.test-host.svelte";

function createCharacterSnapshot(
  overrides: Partial<LorcanaCardSnapshot> = {},
): LorcanaCardSnapshot {
  return {
    cardId: "luisa-1",
    definitionId: "luisa",
    facePresentation: "faceUp",
    isMasked: false,
    label: "Luisa Madrigal - Confident Climber",
    ownerId: "player-one",
    ownerSide: "playerOne",
    zoneId: "play",
    cardType: "character",
    strength: 6,
    baseStrength: 6,
    willpower: 4,
    baseWillpower: 4,
    loreValue: 1,
    baseLoreValue: 1,
    readyState: "ready",
    damage: 0,
    inkType: ["amethyst"],
    text: "",
    textEntries: [
      { title: "Shift 3 {I}", description: "You may pay 3 ink to play this on another Luisa." },
      {
        title: "I CAN TAKE IT",
        description: "{E} - Move up to 1 damage from chosen character of yours to this character.",
      },
    ],
    ...overrides,
  };
}

describe("CardQuickMenuContent", () => {
  it("labels activated ability rows by printed ability title instead of raw ability index", () => {
    const activateAbilityAction: CardActionView = {
      id: "activate-ability:luisa-1",
      cardId: "luisa-1",
      categoryId: "activate-ability",
      label: "Activate Ability",
      interaction: "execute-or-select",
      enabled: true,
      moves: [
        {
          id: "activateAbility:luisa-1:0",
          label: "Luisa Madrigal - Confident Climber: I CAN TAKE IT",
          moveId: "activateAbility",
          params: { cardId: "luisa-1", abilityIndex: 0 },
          presentation: {
            kind: "targeted",
            categoryId: "activate-ability",
            categoryLabel: "Activate Ability",
            optionLabel: "Luisa Madrigal - Confident Climber: I CAN TAKE IT",
          },
        },
      ],
    };

    const { body } = render(CardQuickMenuContentTestHost, {
      props: {
        card: createCharacterSnapshot(),
        actions: [activateAbilityAction],
      },
    });

    expect(body).toContain("I CAN TAKE IT");
    expect(body).toContain("Move up to 1 damage");
    expect(body).not.toContain("Shift 3");
  });
});
