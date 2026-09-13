import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/shock-striker.generated.ts";

const abilities = {
  activatedGrantProperty: {
    kind: "activated",
    limit: {
      count: 1,
      per: "turn",
    },
    abilityType: "instant",
    cost: {
      class: "asset",
      type: "resources",
      amount: 2,
    },
    effect: {
      type: "grant-property",
      property: {
        kind: "ability",
        ability: {
          kind: "static",
          staticKind: "triggered",
          id: "triggeredEffect",
          text: "",
          trigger: {
            kind: "event",
            event: {
              name: "hit",
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
              type: "deal-damage",
              damageType: "generic",
              amount: 1,
              target: {
                selector: "attack-target",
              },
            },
          },
        },
      },
      target: {
        selector: "self",
      },
      duration: "this-turn",
    },
  },
} as const;

export const shockStriker = definePitchFamily(fabPitchFamilies["shock-striker"], {
  abilities: () => abilities,
});

export const {
  red: shockStrikerRed,
  yellow: shockStrikerYellow,
  blue: shockStrikerBlue,
} = shockStriker.cards;
