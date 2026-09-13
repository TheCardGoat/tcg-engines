import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/lair-of-the-spider.generated.ts";

export const lairOfTheSpider = definePitchFamily(fabPitchFamilies["lair-of-the-spider"], {
  abilities: () => ({
    markAttackingHero: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "defended-attack",
            relationship: {
              kind: "any",
            },
            filter: {
              hasKeyword: "go-again",
            },
          },
          target: {
            kind: "any",
          },
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
      label: {
        name: "mark",
      },
    },
  }),
});

export const { red: lairOfTheSpiderRed } = lairOfTheSpider.cards;
