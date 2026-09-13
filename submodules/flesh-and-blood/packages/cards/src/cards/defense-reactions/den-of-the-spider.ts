import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/den-of-the-spider.generated.ts";

export const denOfTheSpider = definePitchFamily(fabPitchFamilies["den-of-the-spider"], {
  abilities: () => ({
    markAttackingHero: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
        },
        state: {
          type: "object-numeric-comparison",
          target: { selector: "this-attack" },
          property: "power",
          left: "current",
          op: "gt",
          right: "base",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "mark",
          target: {
            selector: "attacking-hero",
          },
        },
      },
    },
  }),
});

export const { red: denOfTheSpiderRed } = denOfTheSpider.cards;
