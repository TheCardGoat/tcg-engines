import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/glistening-steelblade.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const glisteningSteelblade = definePitchFamily(fabPitchFamilies["glistening-steelblade"], {
  keywords: [
    {
      name: "specialization",
      hero: "Dorinthea",
    },
    goAgain,
  ],
  abilities: () => ({
    nextDawnbladeAttackTurnHasGoAgain: {
      kind: "resolution",
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        // Printed "next Dawnblade attack" — moniker match, not a FAB subtype.
        appliesTo: {
          next: {
            nameContains: "Dawnblade",
          },
        },
      },
    },
    wheneverDawnbladeHitsHeroTurnPut1Counter: {
      kind: "resolution",
      effect: {
        type: "delayed-trigger",
        trigger: {
          kind: "event",
          event: {
            name: "hit",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "event-object",
              selector: "attack",
              relationship: {
                kind: "any",
              },
              filter: {
                nameContains: "Dawnblade",
              },
              bindAs: "it",
            },
            target: {
              kind: "hero",
            },
          },
        },
        policy: {
          kind: "windowed",
          duration: "this-turn",
          matching: "every",
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "add-counter",
            counter: {
              kind: "numeric",
              value: 1,
              property: "power",
            },
            count: 1,
            target: {
              selector: "binding",
              binding: "it",
            },
          },
        },
      },
    },
  }),
});
export const { yellow: glisteningSteelbladeYellow } = glisteningSteelblade.cards;
