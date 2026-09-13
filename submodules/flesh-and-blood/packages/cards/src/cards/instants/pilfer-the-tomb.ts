import { definePitchFamily, modalAbility } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/pilfer-the-tomb.generated.ts";

export const pilferTheTomb = definePitchFamily(fabPitchFamilies["pilfer-the-tomb"], {
  abilities: () => ({
    chooseModes: modalAbility({
      kind: "modal",
      modal: {
        choose: {
          type: "up-to",
          amount: 2,
        },
      },
      modes: {
        banishTargetInstantFromOpposingHeroSGraveyard: {
          kind: "resolution",
          effect: {
            type: "banish",
            target: {
              selector: "object",
              declared: "on-stack",
              player: "opponent",
              zones: ["graveyard"],
              filter: {
                typeBox: {
                  types: ["Instant"],
                },
              },
              count: 1,
            },
          },
        },
        banishTargetYellowFromOpposingHeroSGraveyard: {
          kind: "resolution",
          effect: {
            type: "banish",
            target: {
              selector: "object",
              declared: "on-stack",
              player: "opponent",
              zones: ["graveyard"],
              filter: {
                color: ["yellow"],
              },
              count: 1,
            },
          },
        },
      },
    }),
  }),
});

export const { blue: pilferTheTombBlue } = pilferTheTomb.cards;
