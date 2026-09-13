import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/mask-of-wizened-whiskers.generated.ts";

export const maskOfWizenedWhiskers = defineCard(
  fabCardIdentitiesByCanonicalId["W9G8Kpb9cNTqNqpm8nJdz"],
  {
    keywords: [bladeBreak],
    abilities: {
      whenDefendsPutComboFromGraveyardBottomDeck: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "defend",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "source",
              selector: "defender",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["graveyard"],
              filter: {
                hasKeyword: "combo",
              },
              count: 1,
            },
            to: {
              zone: "deck",
              position: "bottom",
            },
          },
        },
      },
    },
  },
);
