import { describe, expect, it } from "bun:test";
import { render } from "svelte/server";
import type { CardActionView, LorcanaCardSnapshot } from "@/features/simulator/model/contracts.js";
import CardHoverCardContentTestHost from "./CardHoverCardContent.test-host.svelte";

function createCardSnapshot(overrides: Partial<LorcanaCardSnapshot> = {}): LorcanaCardSnapshot {
  return {
    cardId: "card-1",
    definitionId: "def-card-1",
    facePresentation: "faceUp",
    isMasked: false,
    label: "Pride Lands - Pride Rock",
    ownerId: "player-one",
    ownerSide: "playerOne",
    zoneId: "play",
    cardType: "location",
    willpower: 7,
    baseWillpower: 7,
    loreValue: 2,
    baseLoreValue: 2,
    readyState: "ready",
    damage: 0,
    inkType: ["amber"],
    text: "",
    textEntries: [],
    ...overrides,
  };
}

describe("CardHoverCardContent", () => {
  it("shows lore for locations in hover content", () => {
    const { body } = render(CardHoverCardContentTestHost, {
      props: {
        card: createCardSnapshot(),
      },
    });

    expect(body).toContain("Location");
    expect(body).toContain('alt="Lore"');
    expect(body).toContain(">2</span>");
  });

  it("renders unavailable actions as disabled chips with tooltip reasons", () => {
    const disabledAction: CardActionView = {
      id: "disabled:move-to-location:card-1",
      cardId: "card-1",
      categoryId: "move-to-location",
      label: "Move to Location",
      interaction: "execute-or-select",
      enabled: false,
      reason: "No legal locations to move to right now.",
      moves: [],
    };

    const { body } = render(CardHoverCardContentTestHost, {
      props: {
        card: createCardSnapshot({
          cardType: "character",
          label: "Jasmine - Resourceful Infiltrator",
          loreValue: 1,
        }),
        actions: [disabledAction],
      },
    });

    expect(body).toContain('data-testid="card-hover-action-chip-move-to-location-disabled"');
    expect(body).toContain("disabled");
    expect(body).toContain("No legal locations to move to right now.");
  });

  it("renders unavailable actions alongside enabled actions in action order", () => {
    const enabledAction: CardActionView = {
      id: "enabled:ink:card-1",
      cardId: "card-1",
      categoryId: "ink-card",
      label: "Ink",
      interaction: "execute-or-select",
      enabled: true,
      moves: [],
    };

    const disabledAction: CardActionView = {
      id: "disabled:move-to-location:card-1",
      cardId: "card-1",
      categoryId: "move-to-location",
      label: "Move to Location",
      interaction: "execute-or-select",
      enabled: false,
      reason: "No legal locations to move to right now.",
      moves: [],
    };

    const { body } = render(CardHoverCardContentTestHost, {
      props: {
        card: createCardSnapshot({
          cardType: "character",
          label: "Mickey Mouse - Brave Little Tailor",
          loreValue: 4,
        }),
        actions: [enabledAction, disabledAction],
      },
    });

    const unavailableActionChipIndex = body.indexOf(
      'data-testid="card-hover-action-chip-move-to-location-disabled"',
    );
    const enabledActionChipIndex = body.indexOf('data-testid="card-hover-action-chip-ink-card"');

    expect(unavailableActionChipIndex).toBeGreaterThanOrEqual(0);
    expect(enabledActionChipIndex).toBeGreaterThanOrEqual(0);
    expect(enabledActionChipIndex).toBeLessThan(unavailableActionChipIndex);
  });

  it("renders an activated text entry as a button when the move option label matches", () => {
    const activateAction: CardActionView = {
      id: "activate-ability:angel-1",
      cardId: "angel-1",
      categoryId: "activate-ability",
      label: "Activate Ability",
      interaction: "execute-or-select",
      enabled: true,
      moves: [
        {
          id: "activateAbility:angel-1:0",
          label: "Angel - Experiment 624: UNTOUCHABLE",
          moveId: "activateAbility",
          params: { cardId: "angel-1", abilityIndex: 0 },
          presentation: {
            kind: "targeted",
            categoryId: "activate-ability",
            categoryLabel: "Activate Ability",
            optionLabel: "Angel - Experiment 624: GOOD AIM",
          },
        },
      ],
    };

    const { body } = render(CardHoverCardContentTestHost, {
      props: {
        card: createCardSnapshot({
          cardId: "angel-1",
          cardType: "character",
          label: "Angel - Experiment 624",
          strength: 3,
          baseStrength: 3,
          willpower: 3,
          baseWillpower: 3,
          loreValue: 1,
          baseLoreValue: 1,
          textEntries: [
            {
              title: "UNTOUCHABLE",
              description: "While you have no cards in your hand, this character gains Resist +2.",
            },
            {
              title: "GOOD AIM",
              description:
                "Once during your turn, you may choose and discard a card to deal 2 damage to chosen character.",
            },
          ],
        }),
        actions: [activateAction],
      },
    });

    expect(body).toContain("rules-entry--inline-ability");
    expect(body).toContain(">GOOD AIM<");
    expect(body).toContain("Once during your turn");
    expect(body).toContain("Use");
    expect(body).not.toContain('>UNTOUCHABLE</span><span class="ability-use-chip"');
  });

  it("renders discard-cost Shift entries as keyword rows", () => {
    const { body } = render(CardHoverCardContentTestHost, {
      props: {
        card: createCardSnapshot({
          cardType: "character",
          label: "Ursula - Eric's Bride",
          strength: 2,
          baseStrength: 2,
          willpower: 4,
          baseWillpower: 4,
          loreValue: 2,
          baseLoreValue: 2,
          keywords: ["Shift"],
          textEntries: [
            {
              title: "Shift: Discard a song card",
              description:
                "(You may discard a song card to play this on top of one of your characters named Ursula.)",
            },
          ],
        }),
      },
    });

    expect(body).toContain("rules-entry--keyword");
    expect(body).toContain("Shift: Discard a song card");
  });

  it("renders angle-bracketed rules text as bold italic keyword text", () => {
    const { body } = render(CardHoverCardContentTestHost, {
      props: {
        card: createCardSnapshot({
          cardType: "character",
          label: "Megavolt - Electrical Menace",
          strength: 1,
          baseStrength: 1,
          willpower: 4,
          baseWillpower: 4,
          textEntries: [
            {
              title: "FORCE FIELD",
              description:
                "While you have no cards in your hand, this character gains <Resist> +2.",
            },
          ],
        }),
      },
    });

    expect(body).toContain('<strong class="inline-keyword');
    expect(body).toContain(">Resist</strong>");
    expect(body).not.toContain("&lt;Resist&gt;");
  });
});
