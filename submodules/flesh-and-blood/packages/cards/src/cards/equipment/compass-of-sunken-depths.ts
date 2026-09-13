import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/compass-of-sunken-depths.generated.ts";

export const compassOfSunkenDepths = defineCard(
  fabCardIdentitiesByCanonicalId["cPR8tmfTh9wKmwtzbtRKR"],
  {
    abilities: {
      instantLookAtTopDeck: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "effect",
          type: "tap-self",
        },
        effect: {
          type: "look",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["deck"],
            position: "top",
            count: 1,
          },
          outputBinding: "it",
        },
      },
      firstWateryGravePlayFromGraveyardEachTurnGets: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: goAgain,
          },
          target: {
            selector: "self",
          },
          duration: "while-in-arena",
          appliesTo: {
            next: {
              hasKeyword: "watery-grave",
              playedFromZones: ["graveyard"],
            },
            perTurn: true,
          },
        },
      },
    },
  },
);
