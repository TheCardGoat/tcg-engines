import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/spring-tidings.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const springTidings = definePitchFamily(fabPitchFamilies["spring-tidings"], {
  keywords: [
    {
      name: "specialization",
      hero: "Benji",
    },
    goAgain,
  ],
  abilities: () => ({
    whenHitsDrawForEachOtherAttackActionWithNumber2LessBase: {
      kind: "static",
      staticKind: "triggered",
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
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "draw",
          count: {
            type: "count",
            what: "cards-in-zone",
            zone: "combat-chain",
            player: "controller",
            filter: attackActionFilter({
              power: {
                op: "lte",
                value: 2,
              },
              hasStatus: "other-than-self",
            }),
          },
          player: "controller",
        },
      },
    },
  }),
});

export const { yellow: springTidingsYellow } = springTidings.cards;
