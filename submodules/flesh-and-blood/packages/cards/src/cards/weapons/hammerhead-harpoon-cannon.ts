import { goAgain, overpower } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/hammerhead-harpoon-cannon.generated.ts";

export const hammerheadHarpoonCannon = defineCard(
  fabCardIdentitiesByCanonicalId["mTpzzz7FRDn6pfwQkQtRw"],
  {
    abilities: {
      actionResourceResourceResourceResourceTapNextArrowAttackTurnGets4PowerHarpoonNameGetsOverpowerGoAgain:
        {
          kind: "activated",
          abilityType: "action",
          cost: {
            class: "mixed",
            type: "all",
            costs: [
              {
                class: "asset",
                type: "resources",
                amount: 4,
              },
              {
                class: "effect",
                type: "tap-self",
              },
            ],
          },
          layerKeywords: [goAgain],
          effect: {
            type: "sequence",
            steps: [
              {
                type: "modify-numeric",
                property: "power",
                op: "add",
                amount: 4,
                target: {
                  selector: "this-attack",
                },
                duration: "this-turn",
                appliesTo: {
                  next: {
                    typeBox: {
                      subtypes: ["Arrow"],
                    },
                  },
                },
              },
              {
                type: "conditional",
                condition: {
                  type: "binding-matches",
                  binding: "it",
                  filter: {
                    nameContains: "Harpoon",
                  },
                },
                then: {
                  type: "grant-property",
                  property: {
                    kind: "keyword",
                    keyword: overpower,
                  },
                  target: {
                    selector: "binding",
                    binding: "it",
                  },
                  duration: "permanent",
                },
              },
            ],
          },
        },
    },
  },
);
