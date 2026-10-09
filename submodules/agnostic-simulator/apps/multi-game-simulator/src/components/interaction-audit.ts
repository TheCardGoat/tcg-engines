/** Source audit, 2026-10-06. These mappings do not certify live-game coverage. */
export const interactionGameAudit = [
  {
    game: "Disney Lorcana",
    boundary:
      "Separate PlayerInteractionView; Svelte simulator. Shared protocol bridge still needed.",
    families:
      "Target, discard, choice, optional, name-card search, scry; play, ink, quest, challenge, sing, shift, move to location, activate, mulligan, turn actions.",
    cases: [
      "single-target",
      "multi-target",
      "optional-target",
      "options",
      "boolean",
      "search",
      "partition",
      "payment",
      "ready-action",
    ],
  },
  {
    game: "Cyberpunk",
    boundary: "EngineInteractionView → custom ChoiceModal and payment/target controls in BoardV2.",
    families:
      "Scry, reveal destination, choose target/effect/trigger/gigs/card to play/card to move/card type, gain gig, redirect defeat, sacrificial gear, prevent gig steal, first player; numeric gig adjustment, payments, combat, mulligan.",
    cases: [
      "single-target",
      "multi-target",
      "optional-target",
      "options",
      "boolean",
      "number",
      "payment",
      "conditional",
      "spatial-target",
    ],
  },
  {
    game: "Gundam",
    boundary:
      "EngineInteractionView → shared draft and InteractionResolutionPrompt; setup and combat also have custom controls.",
    families:
      "Target selection, optional, choose one, ordering, deck look; select cost, mode and target; first player, mulligan, pilot pairing, attack, blocker, action/priority.",
    cases: [
      "single-target",
      "multi-target",
      "boolean",
      "options",
      "partition",
      "automatic-remainder",
      "payment",
      "spatial-target",
    ],
  },
  {
    game: "Flesh and Blood",
    boundary:
      "Native decisions → EngineInteractionView → shared prompt and game-owned board controls.",
    families:
      "Boolean, option, entity target, ordering, numeric, partition, payment, effect resolution, group choice; play, activate, defend, pass, end turn.",
    cases: [
      "boolean",
      "options",
      "single-target",
      "ordering",
      "number",
      "partition",
      "payment",
      "conditional",
      "queue",
    ],
  },
  {
    game: "One Piece",
    boundary:
      "Native prompt steps → EngineInteractionView; game renderer and submission conversion remain game-owned.",
    families:
      "Choose option/entity/action, confirm, pay cost, order items; play, attach DON, declare attack, activate effect, end turn, mulligan, first player and Jo Ken Po.",
    cases: [
      "options",
      "single-target",
      "multi-target",
      "boolean",
      "payment",
      "ordering",
      "ready-action",
    ],
  },
  {
    game: "Grand Archive",
    boundary:
      "Native decisions → EngineInteractionView → shared draft prompt through GrandArchiveInteractionLayer; separate Three board.",
    families:
      "Replacement, unique object, preserve destination, retaliators/damage order, critical, attack/defender, influence discard, recollection, triggers/order, optional/choice/payment, retarget/remode, level/direction, distribution, move partition, counter allocation, materialization, activation, glimpse.",
    cases: [
      "boolean",
      "options",
      "single-target",
      "number",
      "ordering",
      "partition",
      "allocation",
      "payment",
      "queue",
    ],
  },
  {
    game: "Naruto",
    boundary: "EngineInteractionView with custom game controls.",
    families:
      "Mulligan, summon, set/activate support, activate from hand, character/leader effect, recovery, declare attack, pass counter, resolve choice, end turn. Current emitted inputs are boolean and entity selection.",
    cases: ["boolean", "single-target", "multi-target", "spatial-target", "ready-action"],
  },
  {
    game: "Alpha Clash",
    boundary:
      "Native choice → EngineInteractionView → shared action menu and draft prompt in practice and live.",
    families:
      "Option, modal, target, count, division; play/respond/set, activate, attach/detach weapon, clash, obstructors, resource, mulligan and phase passes.",
    cases: [
      "boolean",
      "options",
      "single-target",
      "multi-target",
      "number",
      "allocation",
      "payment",
      "ready-action",
    ],
  },
  {
    game: "Riftbound",
    boundary:
      "Manual tabletop action reducer. No shared prompt projection found in its server engine.",
    families:
      "Tabletop actions and viewer-safe state. Do not mark shared prompt support from protocol registration alone.",
    cases: [],
  },
] as const;
