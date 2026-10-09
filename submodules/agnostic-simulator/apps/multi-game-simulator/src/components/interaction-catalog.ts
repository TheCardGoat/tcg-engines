export const interactionArtCards = [
  {
    id: "LMyKyVC2O9",
    name: "Spirit of Fire",
    imageUrl:
      "https://cdn.tcg.online/public/grand-archive/assets/full/69bd5a60f246495ae13b650f2a085088f2069dc16f2fa97625769065fc6b6edb.webp",
  },
  {
    id: "pNiyaGlIe7",
    name: "Spirit of Wind",
    imageUrl:
      "https://cdn.tcg.online/public/grand-archive/assets/full/849eb44df61719b5d9a34ce406ee9c7c5e4cf583eece66ab2d2a8a00702e258c.webp",
  },
  {
    id: "DsiRzt0trX",
    name: "Hasty Messenger",
    imageUrl:
      "https://cdn.tcg.online/public/grand-archive/assets/full/0040acf8f5e0b0138d10b0e4deb6d647ba45361ce50e50639dd2e4e4eb79d32c.webp",
  },
] as const;

import type {
  EngineInteractionView,
  InteractionInput,
  InteractionSubmissionValue,
} from "@tcg/protocol";

/** Synthetic post-adapter examples. These are not engine or card-rule fixtures. */
export interface InteractionCatalogCase {
  id: string;
  title: string;
  description: string;
  view: EngineInteractionView;
  validValues: Record<string, InteractionSubmissionValue>;
  viewerId?: string;
  spatial?: boolean;
  cardImages?: Record<string, { name: string; imageUrl: string }>;
}

const text = (key: string) => ({ key });
const candidates = ["alpha", "beta", "gamma"].map((instanceId) => ({
  entity: { kind: "card" as const, instanceId },
  text: text(`Card ${instanceId}`),
  enabled: true,
}));
const selection: InteractionInput = {
  kind: "entity-selection",
  id: "cards",
  text: text("Choose a card"),
  required: true,
  role: "target",
  entityKinds: ["card"],
  min: 1,
  max: 1,
  ordered: false,
  candidates,
};
const options: InteractionInput = {
  kind: "option-selection",
  id: "mode",
  text: text("Choose a mode"),
  required: true,
  min: 1,
  max: 1,
  options: [
    { id: "draw", text: text("Draw a card"), enabled: true },
    { id: "ready", text: text("Ready a card"), enabled: true },
    {
      id: "disabled",
      text: text("Unavailable mode"),
      enabled: false,
      disabledText: text("No valid target"),
    },
  ],
};
const boolean: InteractionInput = {
  kind: "boolean",
  id: "accept",
  text: text("Use this effect?"),
  required: true,
  trueText: text("Use effect"),
  falseText: text("Skip effect"),
};
const number: InteractionInput = {
  kind: "number",
  id: "amount",
  text: text("Choose an amount"),
  required: true,
  min: 0,
  max: 4,
  step: 1,
};
const partition: InteractionInput = {
  kind: "entity-partition",
  id: "destinations",
  text: text("Assign cards to destinations"),
  entityKind: "card",
  candidates,
  assignment: "exhaustive",
  routes: [
    { id: "hand", text: text("Hand"), kind: "extract", ordered: false, min: 1, max: 1 },
    {
      id: "bottom",
      text: text("Bottom of deck"),
      kind: "destination",
      ordered: true,
      orderDirection: "bottom-first",
      min: 2,
      max: 2,
    },
  ],
};
function fixture(
  id: string,
  title: string,
  inputs: InteractionInput[],
  validValues: InteractionCatalogCase["validValues"],
  description: string,
): InteractionCatalogCase {
  return {
    id,
    title,
    description,
    validValues,
    view: {
      protocolVersion: 2,
      gameSlug: "gundam",
      actorId: "player",
      stateVersion: 7,
      status: "choosing",
      resolution: {
        actingPlayerId: "player",
        pendingCount: 1,
        currentEffect: { id, text: text(title) },
        currentStep: { index: 1, count: 1, text: text(title) },
      },
      actions: [
        {
          id,
          requestId: `${id}:7`,
          intent: "choose-option",
          text: text(title),
          enabled: true,
          inputs,
        },
      ],
    },
  };
}
const target = fixture(
  "single-target",
  "Single target",
  [selection],
  { cards: ["alpha"] },
  "Select one candidate and submit.",
);
const ready = fixture(
  "ready-action",
  "Ready action",
  [],
  {},
  "Inputless action drafted before a command is sent.",
);
const observer = fixture(
  "observer",
  "Observer",
  [],
  {},
  "Only public resolution context. No candidate identities or controls.",
);
const statusCase = (status: "idle" | "waiting" | "game-over"): InteractionCatalogCase => ({
  ...fixture(
    status,
    status,
    [],
    {},
    "No resolution prompt is expected. The game shell owns this state.",
  ),
  view: {
    protocolVersion: 2,
    gameSlug: "gundam",
    actorId: "player",
    stateVersion: 7,
    status,
    actions: [],
  },
});

export const interactionCatalog: readonly InteractionCatalogCase[] = [
  { ...ready, view: { ...ready.view, status: "ready", resolution: undefined } },
  fixture(
    "boolean",
    "Optional effect",
    [boolean],
    { accept: false },
    "False must remain a valid answer.",
  ),
  fixture(
    "options",
    "Mode selection",
    [options],
    { mode: ["draw"] },
    "Disabled options must not be submitted.",
  ),
  fixture(
    "multi-option",
    "Multiple modes",
    [{ ...options, max: 2 }],
    { mode: ["draw", "ready"] },
    "Select one or two modes.",
  ),
  fixture(
    "search",
    "Search options",
    [
      {
        ...options,
        presentation: {
          kind: "search",
          label: text("Card name"),
          placeholder: text("Search names"),
          confirmLabel: text("Confirm name"),
          resultLimit: 20,
        },
      },
    ],
    { mode: ["draw"] },
    "Search-style option presentation; also needed for a future Lorcana name-card bridge.",
  ),
  fixture(
    "search-many",
    "Long option list",
    [
      {
        ...options,
        text: text("Choose one option from the full list"),
        options: Array.from({ length: 40 }, (_, index) => ({
          id: `option-${index + 1}`,
          text: text(
            `Option ${index + 1} — A long descriptive choice that must remain readable on a small screen`,
          ),
          enabled: index % 7 !== 0,
        })),
        presentation: {
          kind: "search",
          label: text("Option"),
          placeholder: text("Search all 40 options"),
          confirmLabel: text("Confirm option"),
          resultLimit: 20,
        },
      },
    ],
    { mode: ["option-32"] },
    "Long labels, disabled choices, scrolling, empty search, and a result beyond the initial page.",
  ),
  fixture(
    "dense-candidates",
    "Large candidate list",
    [
      {
        ...selection,
        min: 2,
        max: 3,
        text: text("Choose two or three cards from the available candidates"),
        candidates: Array.from({ length: 18 }, (_, index) => ({
          entity: { kind: "card", instanceId: `candidate-${index + 1}` },
          text: text(`Card ${index + 1} — Keeper of the Last Light`),
          enabled: index % 5 !== 0,
        })),
      },
    ],
    { cards: ["candidate-2", "candidate-3"] },
    "A scrollable card-choice dialog with long labels, disabled entries, and a bounded selection.",
  ),
  fixture(
    "number",
    "Bounded amount",
    [number],
    { amount: 0 },
    "Zero is valid. Check minimum, maximum, and step.",
  ),
  target,
  {
    ...target,
    id: "spatial-target",
    title: "Board target bridge",
    spatial: true,
    description:
      "Select a 3D card or its keyboard-accessible button. Both submit the same validated singleton answer.",
  },
  fixture(
    "multi-target",
    "Multiple targets",
    [{ ...selection, max: 2 }],
    { cards: ["alpha", "beta"] },
    "Submit only within the selection bounds.",
  ),
  fixture(
    "optional-target",
    "Optional target",
    [{ ...selection, min: 0, required: false }],
    { cards: [] },
    "An empty selection is a valid decline.",
  ),
  fixture(
    "empty-target",
    "No valid targets",
    [{ ...selection, min: 0, max: 0, candidates: [], required: false }],
    { cards: [] },
    "No candidates; do not leave the player stuck.",
  ),
  fixture(
    "disabled-target",
    "Disabled candidate",
    [
      {
        ...selection,
        candidates: candidates.map((c, i) =>
          i === 2 ? { ...c, enabled: false, disabledText: text("Cannot target this card") } : c,
        ),
      },
    ],
    { cards: ["alpha"] },
    "An unavailable candidate remains visible but cannot be selected.",
  ),
  fixture(
    "player-target",
    "Player target",
    [
      {
        ...selection,
        entityKinds: ["player"],
        text: text("Choose a player"),
        role: "player",
        candidates: [
          {
            entity: { kind: "player", instanceId: "opponent" },
            text: text("Opponent"),
            enabled: true,
          },
        ],
      },
    ],
    { cards: ["opponent"] },
    "Entity references are not limited to cards.",
  ),
  fixture(
    "payment",
    "Select payment",
    [{ ...selection, role: "cost", max: 2, text: text("Choose cards to pay") }],
    { cards: ["alpha"] },
    "Payment is a selection role, not a separate protocol input kind.",
  ),
  fixture(
    "ordering",
    "Order cards",
    [
      {
        kind: "ordering",
        id: "order",
        text: text("Choose card order"),
        required: true,
        entityKind: "card",
        min: 3,
        max: 3,
        candidates,
      },
    ],
    { order: ["gamma", "alpha", "beta"] },
    "Preserve the submitted order.",
  ),
  fixture(
    "partition",
    "Choose destinations",
    [partition],
    { destinations: { hand: ["alpha"], bottom: ["gamma", "beta"] } },
    "Assign every candidate once and preserve destination order.",
  ),
  fixture(
    "automatic-remainder",
    "Automatic remainder",
    [
      {
        ...partition,
        assignment: "remainder-automatic",
        remainderText: text("Remaining cards stay in the deck"),
        routes: [partition.routes[0]!],
      },
    ],
    { destinations: { hand: ["alpha"] } },
    "Only the chosen card needs an explicit destination.",
  ),
  fixture(
    "direct-order",
    "Direct bottom ordering",
    [
      {
        ...partition,
        routes: [
          {
            id: "bottom",
            text: text("Bottom of deck"),
            kind: "destination",
            ordered: true,
            orderDirection: "bottom-first",
            min: 3,
            max: 3,
          },
        ],
      },
    ],
    { destinations: { bottom: ["gamma", "beta", "alpha"] } },
    "Check drag, arrow controls, and bottom-first order.",
  ),
  fixture(
    "allocation",
    "Distribute an amount",
    [
      {
        kind: "entity-allocation",
        id: "allocation",
        text: text("Distribute 3 points"),
        required: true,
        role: "target",
        entityKinds: ["card"],
        totalMin: 3,
        totalMax: 3,
        candidates: candidates.map((c) => ({ ...c, min: 0, max: 3 })),
      },
    ],
    { allocation: { alpha: 2, beta: 1 } },
    "Check per-candidate limits and the total.",
  ),
  fixture(
    "conditional",
    "Optional amount",
    [
      boolean,
      { ...number, required: false, requiredWhen: [{ all: [{ inputId: "accept", value: true }] }] },
    ],
    { accept: false },
    "Declining must not require the dependent amount.",
  ),
  {
    ...target,
    id: "queue",
    title: "Effect queue",
    view: {
      ...target.view,
      resolution: {
        ...target.view.resolution!,
        pendingCount: 3,
        currentStep: { index: 2, count: 3, text: text("Choose the next target") },
      },
    },
  },
  { ...observer, viewerId: "spectator", view: { ...observer.view, actions: [] } },
  statusCase("idle"),
  statusCase("waiting"),
  statusCase("game-over"),
  {
    ...statusCase("waiting"),
    id: "projection-failure",
    title: "Projection failure",
    description:
      "The host must show a retry state. The resolution component does not own this error.",
    view: {
      ...statusCase("waiting").view,
      projectionFailure: { code: "projection_failed", retryable: true },
    },
  },
  ...(["art-partition", "art-order"] as const).map((id) => {
    const cards = interactionArtCards;
    const artCandidates = cards.map((card, index) => ({
      ...candidates[index]!,
      text: text(card.name),
    }));
    const direct = id === "art-order";
    return {
      ...fixture(
        id,
        direct ? "Order cards with artwork" : "Choose destinations with artwork",
        [
          {
            ...partition,
            candidates: artCandidates,
            routes: direct
              ? [
                  {
                    id: "bottom",
                    text: text("Bottom of deck"),
                    kind: "destination",
                    ordered: true,
                    orderDirection: "bottom-first",
                    min: 3,
                    max: 3,
                  },
                ]
              : partition.routes,
          },
        ],
        direct
          ? { destinations: { bottom: ["gamma", "beta", "alpha"] } }
          : { destinations: { hand: ["alpha"], bottom: ["gamma", "beta"] } },
        "Real Grand Archive artwork in a synthetic shared prompt. Check complete artwork, destination buttons, and order at every viewport.",
      ),
      cardImages: Object.fromEntries(
        cards.map((card, index) => [candidates[index]!.entity.instanceId, card]),
      ),
    };
  }),
];
