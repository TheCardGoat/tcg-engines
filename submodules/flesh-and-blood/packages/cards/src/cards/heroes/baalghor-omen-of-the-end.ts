import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/baalghor-omen-of-the-end.generated.ts";

export const baalghorOmenOfTheEnd = defineCard(
  fabCardIdentitiesByCanonicalId["FmWWpM8FLJCCzQLKBwwKk"],
  {
    abilities: {
      wheneverPitchBanish: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "pitch",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "event-object",
              selector: "pitched-card",
              relationship: {
                kind: "any",
              },
              bindAs: "it",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "banish",
            target: {
              selector: "binding",
              binding: "it",
            },
          },
        },
      },
      attackActionPlayedBanishedZoneGet3Power: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 3,
          target: {
            selector: "object",
            declared: "at-resolution",
            zones: ["stack", "combat-chain"],
            filter: attackActionFilter({ playedFromZones: ["banished"] }),
            count: {
              type: "all",
            },
          },
          duration: "while-in-arena",
        },
      },
    },
  },
);
