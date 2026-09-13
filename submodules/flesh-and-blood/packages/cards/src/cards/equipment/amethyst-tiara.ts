import { bladeBreak, spellvoid } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/amethyst-tiara.generated.ts";

export const amethystTiara = defineCard(fabCardIdentitiesByCanonicalId["tqL9KdjgkjfnQ98H97dJw"], {
  keywords: [bladeBreak],
  abilities: {
    instantDestroyAmethystTiaraRunechantsControlHaveSpellvoid1: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: spellvoid(1),
        },
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["permanent"],
          filter: {
            name: "Runechant",
          },
          count: {
            type: "all",
          },
        },
        duration: "this-turn",
      },
    },
  },
});
