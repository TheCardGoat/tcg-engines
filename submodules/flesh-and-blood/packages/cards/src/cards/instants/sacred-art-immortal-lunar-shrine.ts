import { legendary } from "../shared/keywords.ts";
import { definePitchFamily, modalAbility } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/sacred-art-immortal-lunar-shrine.generated.ts";

export const sacredArtImmortalLunarShrine = definePitchFamily(
  fabPitchFamilies["sacred-art-immortal-lunar-shrine"],
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
          create2SpectralShieldTokens: {
            kind: "resolution",
            effect: {
              type: "create-token",
              token: "spectral-shield",
              controller: "controller",
              count: 2,
            },
          },
          put1CounterEachAuraWardControl: {
            kind: "resolution",
            effect: {
              type: "add-counter",
              counter: {
                kind: "numeric",
                value: 1,
                property: "power",
              },
              count: 1,
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["permanent"],
                filter: {
                  typeBox: {
                    subtypes: ["Aura"],
                  },
                  hasKeyword: "ward",
                },
                count: {
                  type: "all",
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

export const { blue: sacredArtImmortalLunarShrineBlue } = sacredArtImmortalLunarShrine.cards;
