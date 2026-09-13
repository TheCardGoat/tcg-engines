import { goAgain, temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/good-time-chapeau.generated.ts";

export const goodTimeChapeau = defineCard(fabCardIdentitiesByCanonicalId["JJqgR7zTPJmjWNtnFdQ88"], {
  keywords: [
    {
      name: "specialization",
      hero: "Betsy",
    },
    temper,
  ],
  abilities: {
    actionDestroyGoldControlNextAttackTurnGetsWhen: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "destroy",
        filter: {
          name: "Gold",
        },
      },
      layerKeywords: [goAgain],
      // Next *attack* (AAC or weapon): future-applicability observes announce-card
      // and attack events. subtypes Attack alone misses weapons; or Weapon.
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "whenAttacksHeroWagerMightVigorTokenThem",
            text: "",
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
                type: "sequence",
                steps: [
                  {
                    type: "wager",
                    stake: "might",
                    with: {
                      selector: "attack-target",
                    },
                  },
                  {
                    type: "wager",
                    stake: "vigor",
                    with: {
                      selector: "attack-target",
                    },
                  },
                ],
              },
            },
          },
        },
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            or: [
              {
                typeBox: {
                  subtypes: ["Attack"],
                },
              },
              {
                typeBox: {
                  types: ["Weapon"],
                },
              },
            ],
          },
        },
      },
    },
  },
});
