import { legendary } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/doomsday.generated.ts";

export const doomsday = definePitchFamily(fabPitchFamilies["doomsday"], {
  keywords: [
    legendary,
    {
      name: "specialization",
      hero: "Levia",
    },
  ],
  abilities: () => ({
    playDoomsdayOnlyIfThereAre6MoreBlood: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "zone-count",
        zone: "banished",
        player: "controller",
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
    createBlasmophetSoulHarvesterToken: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "blasmophet-the-soul-harvester",
        controller: "controller",
      },
    },
  }),
});

export const { blue: doomsdayBlue } = doomsday.cards;
