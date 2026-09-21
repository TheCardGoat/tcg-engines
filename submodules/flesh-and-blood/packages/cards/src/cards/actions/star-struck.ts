import { crushAbility } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/star-struck.generated.ts";

export const starStruck = definePitchFamily(fabPitchFamilies["star-struck"], {
  keywords: [
    {
      name: "specialization",
      hero: "Bravo",
    },
  ],
  abilities: () => ({
    crushAbility: crushAbility({
      effect: {
        type: "sequence",
        steps: [
          {
            type: "rule-modification",
            mode: "restrict",
            action: "play",
            subject: {
              selector: "attack-target",
            },
            filter: {
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
              numeric: [
                {
                  property: "power",
                  basis: "base",
                  comparison: {
                    op: "lte",
                    value: {
                      type: "event-amount",
                    },
                  },
                },
              ],
            },
            duration: "until-end-of-their-next-turn",
          },
          {
            type: "rule-modification",
            mode: "restrict",
            action: "activate",
            subject: {
              selector: "attack-target",
            },
            filter: {
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
              numeric: [
                {
                  property: "power",
                  basis: "base",
                  comparison: {
                    op: "lte",
                    value: {
                      type: "event-amount",
                    },
                  },
                },
              ],
            },
            duration: "until-end-of-their-next-turn",
          },
        ],
      },
    }),
    whenDefendsTogetherWithFromHandCreateSeismicSurgeTokenUnderAny: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
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
          cohort: {
            kind: "together-with",
            filter: {
              playedFromZones: ["hand"],
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "seismic-surge",
          creator: "effect-controller",
          controller: "any",
        },
      },
      label: {
        name: "unity",
      },
    },
  }),
});

export const { yellow: starStruckYellow } = starStruck.cards;
