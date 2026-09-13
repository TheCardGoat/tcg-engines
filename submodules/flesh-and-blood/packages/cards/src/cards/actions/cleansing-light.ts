import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/cleansing-light.generated.ts";

export const cleansingLight = definePitchFamily(fabPitchFamilies["cleansing-light"], {
  parameters: pitchMap({
    red: { targetFilter: { and: [{ typeBox: { subtypes: ["Aura"] } }, { color: ["red"] }] } },
    yellow: { targetFilter: { typeBox: { subtypes: ["Aura"] }, color: ["yellow"] } },
    blue: { targetFilter: { and: [{ typeBox: { subtypes: ["Aura"] } }, { color: ["blue"] }] } },
  }),
  abilities: ({ targetFilter }) => ({
    staticPlayPerformedTurnPutIntoSoul: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "performed-this-turn",
        event: "put-card-into-soul",
        player: "controller",
      },
      playEffect: {
        role: "permission",
        fromZones: ["hand", "arsenal"],
        asType: "instant",
        optional: true,
      },
    },
    resolutionDestroy: {
      kind: "resolution",
      effect: {
        type: "destroy",
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["permanent"],
          filter: targetFilter,
          count: 1,
        },
      },
    },
  }),
});

export const {
  red: cleansingLightRed,
  yellow: cleansingLightYellow,
  blue: cleansingLightBlue,
} = cleansingLight.cards;
