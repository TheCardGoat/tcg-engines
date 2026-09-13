import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/scrap-prospector.generated.ts";
import { scrap } from "../shared/keywords.ts";

export const scrapProspector = definePitchFamily(fabPitchFamilies["scrap-prospector"], {
  keywords: [scrap],
  abilities: () => ({
    triggeredStaticOnAttackEffect: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
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
        },
        state: {
          type: "compare-amount",
          amount: {
            type: "count",
            what: "cards-scrapped-by-this",
          },
          comparison: {
            op: "gte",
            value: 1,
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "gain-resources",
          amount: 1,
        },
      },
    },
  }),
});

export const {
  red: scrapProspectorRed,
  yellow: scrapProspectorYellow,
  blue: scrapProspectorBlue,
} = scrapProspector.cards;
