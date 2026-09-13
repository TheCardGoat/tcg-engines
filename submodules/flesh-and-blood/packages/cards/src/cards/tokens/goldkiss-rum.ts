import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/tokens/goldkiss-rum.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const goldkissRum = defineCard(fabCardIdentitiesByCanonicalId["9KpmmRGnpbdND9Q8GJnT6"], {
  abilities: {
    destroyToGrantGoAgain: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "effect",
            type: "tap-hero",
          },
          {
            class: "effect",
            type: "destroy-self",
          },
        ],
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: goAgain,
            },
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  types: ["Action"],
                },
              },
            },
          },
          {
            type: "conditional",
            condition: {
              type: "not",
              condition: {
                type: "has-status",
                status: "hero-is-pirate",
              },
            },
            then: {
              type: "rule-modification",
              mode: "restrict",
              action: "untap",
              subject: {
                selector: "controller",
              },
              duration: "this-turn",
            },
          },
        ],
      },
    },
  },
});
