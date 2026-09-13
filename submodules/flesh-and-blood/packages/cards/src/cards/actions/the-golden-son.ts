import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/the-golden-son.generated.ts";
import { overpower } from "../shared/keywords.ts";

export const theGoldenSon = definePitchFamily(fabPitchFamilies["the-golden-son"], {
  keywords: [
    {
      name: "specialization",
      hero: "Victor",
    },
    overpower,
  ],
  abilities: () => ({
    asAdditionalCostPlayDestroyGoldControlDoGetsNumber3PowerOverpower: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "destroy",
          filter: {
            name: "Gold",
          },
        },
        optional: true,
        then: {
          type: "sequence",
          steps: [
            {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 3,
              target: {
                selector: "self",
              },
              duration: "permanent",
            },
            {
              type: "grant-property",
              property: {
                kind: "keyword",
                keyword: overpower,
              },
              target: {
                selector: "self",
              },
              duration: "permanent",
            },
          ],
        },
      },
    },
    whenWinClashRevealingCreateGoldToken: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "clash-win",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "revealed-card",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "gold",
          controller: "controller",
        },
      },
    },
  }),
});

export const { yellow: theGoldenSonYellow } = theGoldenSon.cards;
