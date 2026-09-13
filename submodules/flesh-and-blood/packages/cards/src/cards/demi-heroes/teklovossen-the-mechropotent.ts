import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/demi-heroes/teklovossen-the-mechropotent.generated.ts";
import { battleworn, goAgain } from "../shared/keywords.ts";

export const teklovossenTheMechropotent = defineCard(
  fabCardIdentitiesByCanonicalId.BRpMLJdMBPgfJNJLJWDFg,
  {
    keywords: [battleworn],
    abilities: {
      attack: {
        kind: "activated",
        abilityType: "attack",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            {
              class: "asset",
              type: "resources",
              amount: 3,
            },
            {
              class: "effect",
              type: "banish",
              from: "soul",
              count: 2,
            },
          ],
        },
        effect: {
          type: "attack-with",
          target: {
            selector: "self",
          },
        },
      },
      discardOnAttack: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "attack",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "source",
              selector: "attack",
            },
            target: {
              kind: "hero",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "discard",
            target: {
              selector: "attack-target",
            },
          },
        },
      },
      grantMechanologistAttacksGoAgain: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: goAgain,
          },
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["stack", "combat-chain"],
            filter: {
              typeBox: {
                supertypes: ["Mechanologist"],
                types: ["Action"],
                subtypes: ["Attack"],
              },
            },
            count: {
              type: "all",
            },
          },
          duration: "while-in-arena",
        },
      },
      countAsFourEvos: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "rule-modification",
          mode: "allow",
          action: "count-as-equipped",
          filter: {
            typeBox: {
              subtypes: ["Evo"],
            },
          },
          limit: {
            count: 4,
          },
          duration: "while-in-arena",
        },
      },
    },
  },
);
