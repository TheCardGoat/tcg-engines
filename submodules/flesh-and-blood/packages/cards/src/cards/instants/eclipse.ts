import { legendary } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/eclipse.generated.ts";

export const eclipse = definePitchFamily(fabPitchFamilies["eclipse"], {
  keywords: [
    legendary,
    {
      name: "specialization",
      hero: "Chane",
    },
  ],
  abilities: () => ({
    playEclipseOnlyIfHavePlayed6MoreBlood: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "played-this",
        per: "turn",
        filter: {
          hasKeyword: "blood-debt",
        },
        comparison: {
          op: "gte",
          value: 6,
        },
      },
      playEffect: {
        role: "condition",
      },
    },
    ifHaveMayPlayEclipseFromBanishedZone: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "played-this",
        per: "turn",
        filter: {
          hasKeyword: "blood-debt",
        },
        comparison: {
          op: "gte",
          value: 6,
        },
      },
      playEffect: {
        role: "permission",
        fromZones: ["banished"],
        optional: true,
      },
    },
    createUrsurSoulReaperToken: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "ursur-the-soul-reaper",
        controller: "controller",
      },
    },
  }),
});

export const { blue: eclipseBlue } = eclipse.cards;
