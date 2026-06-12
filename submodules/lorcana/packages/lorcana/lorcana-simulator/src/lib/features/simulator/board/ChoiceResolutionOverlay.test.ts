import { describe, expect, it } from "bun:test";
import { render } from "svelte/server";
import type { CardInstanceId, PlayerId } from "@tcg/lorcana-engine";
import type { PlayerInteractionView } from "@tcg/lorcana-interaction";
import type { LorcanaCardSnapshot } from "@/features/simulator/model/contracts.js";
import ChoiceResolutionOverlay from "./ChoiceResolutionOverlay.svelte";

const PLAYER_ONE = "player_one" as PlayerId;
const EDUCATION_OR_ELIMINATION_INSTANCE = "education-or-elimination-1" as CardInstanceId;

const view: PlayerInteractionView = {
  viewerId: PLAYER_ONE,
  surface: "choice-modal",
  viewerRole: "chooser",
  activePrompt: {
    requestId: "choice-1",
    kind: "choice-selection",
    controllerId: PLAYER_ONE,
    sourceCardId: EDUCATION_OR_ELIMINATION_INSTANCE,
    chooserId: PLAYER_ONE,
    selectedCardIds: [],
    expectedSlottedKind: null,
    activeSlotIndex: null,
    slots: null,
    autoResolvedSlotCount: 0,
    minSelections: 1,
    maxSelections: 1,
    declaredMaxSelections: null,
    autoRejected: false,
    scryDestinations: null,
    scryRevealed: null,
  },
  interactions: [
    {
      kind: "select-choice",
      index: 0,
      label:
        "Draw a card. Chosen character of yours gets +1 {L} and gains Evasive until the start of your next turn.",
      legal: true,
      payload: { choiceIndex: 0 },
    },
    {
      kind: "select-choice",
      index: 1,
      label: "Banish chosen damaged character.",
      legal: true,
      payload: { choiceIndex: 1 },
    },
  ],
  submission: {
    requestId: "choice-1",
    canSubmit: false,
    canCancel: false,
    autoRejected: false,
    submitPayload: null,
    cancelPayload: null,
  },
  copy: {
    titleKey: "prompt.choice.choose-one",
    titleParams: {},
    badges: [],
  },
  promptQueue: [
    {
      requestId: "choice-1",
      kind: "choice-selection",
      chooserId: PLAYER_ONE,
      sourceCardId: EDUCATION_OR_ELIMINATION_INSTANCE,
    },
  ],
  activeQueueIndex: 0,
  rawContext: {
    origin: "pending-effect",
    requestId: "choice-1",
    kind: "choice-selection",
    sourceCardId: EDUCATION_OR_ELIMINATION_INSTANCE,
    chooserId: PLAYER_ONE,
    currentSelection: {},
    submitField: "choiceIndex",
    options: [
      {
        index: 0,
        label:
          "Draw a card. Chosen character of yours gets +1 {L} and gains Evasive until the start of your next turn.",
        legal: true,
      },
      {
        index: 1,
        label: "Banish chosen damaged character.",
        legal: true,
      },
    ],
  },
};

const sourceCard: LorcanaCardSnapshot = {
  cardId: EDUCATION_OR_ELIMINATION_INSTANCE,
  definitionId: "y2L",
  isMasked: false,
  label: "Education or Elimination",
  ownerId: "player_one",
  ownerSide: "playerOne",
  zoneId: "limbo",
  cardType: "action",
  actionSubtype: "song",
  cost: 4,
  inkType: ["emerald"],
  inkable: true,
  text: "Choose one:\n* Draw a card. Chosen character of yours gets +1 {L} and gains Evasive until the start of your next turn.\n* Banish chosen damaged character.",
  textEntries: [
    {
      title: "FOLLOW THE CLUES",
      description:
        "Choose one:\n* Draw a card. Chosen character of yours gets +1 {L} and gains Evasive until the start of your next turn.\n* Banish chosen damaged character.",
    },
  ],
  facePresentation: "faceUp",
};

const targetCard: LorcanaCardSnapshot = {
  cardId: "simba-protective-cub-1",
  definitionId: "simba-protective-cub",
  isMasked: false,
  label: "Simba - Protective Cub",
  ownerId: "player_two",
  ownerSide: "playerTwo",
  zoneId: "play",
  cardType: "character",
  cost: 2,
  inkType: ["steel"],
  inkable: true,
  strength: 2,
  willpower: 3,
  loreValue: 1,
  text: "Bodyguard",
  textEntries: [{ title: "Bodyguard" }],
  facePresentation: "faceUp",
};

describe("ChoiceResolutionOverlay", () => {
  it("renders the source card, ability title, selected target, and choice labels", () => {
    const { body } = render(ChoiceResolutionOverlay, {
      props: {
        view,
        sourceCard,
        targetCard,
        selectedChoiceIndex: null,
      },
    });

    expect(body).toContain("Choose outcome");
    expect(body).toContain("Education or Elimination");
    expect(body).toContain("FOLLOW THE CLUES");
    expect(body).toContain("Simba - Protective Cub");
    expect(body).toContain("Bodyguard");
    expect(body).toContain("Draw a card.");
    expect(body).toContain("Banish chosen damaged character.");
    expect(body).toContain("Open Education or Elimination preview");
    expect(body).toContain("Open Simba - Protective Cub preview");
    expect(body.match(/Open Education or Elimination preview/g)?.length).toBe(2);
    expect(body.match(/Open Simba - Protective Cub preview/g)?.length).toBe(3);
  });
});
