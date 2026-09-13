import { legendary } from "../shared/keywords.ts";
import { definePitchFamily, modalAbility } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/sacred-art-undercurrent-desires.generated.ts";

export const sacredArtUndercurrentDesires = definePitchFamily(
  fabPitchFamilies["sacred-art-undercurrent-desires"],
  {
    keywords: [legendary],
    abilities: () => ({
      ifVePlayedAnotherBlueTurnChoose3Otherwise: modalAbility({
        kind: "modal",
        modal: {
          choose: {
            type: "conditional",
            condition: {
              type: "performed-this-turn",
              event: "play-another-blue-card",
              player: "controller",
            },
            then: 3,
            else: 1,
          },
        },
        modes: {
          createFangStrikeSlitherHand: {
            kind: "resolution",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "create-token",
                  token: "fang-strike",
                  controller: "controller",
                  to: { zone: "hand" },
                },
                {
                  type: "create-token",
                  token: "slither",
                  controller: "controller",
                  to: { zone: "hand" },
                },
              ],
            },
          },
          banishUp2OpposingHeroSGraveyard: {
            kind: "resolution",
            effect: {
              type: "banish",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "opponent",
                zones: ["graveyard"],
                count: {
                  type: "up-to",
                  amount: 2,
                },
              },
            },
          },
          transcend: {
            kind: "resolution",
            effect: {
              type: "transcend",
              target: {
                selector: "self",
              },
            },
          },
        },
        label: {
          name: "transcend",
        },
      }),
    }),
  },
);

export const { blue: sacredArtUndercurrentDesiresBlue } = sacredArtUndercurrentDesires.cards;
