import { legendary } from "../shared/keywords.ts";
import { definePitchFamily, modalAbility } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/sacred-art-jade-tiger-domain.generated.ts";

export const sacredArtJadeTigerDomain = definePitchFamily(
  fabPitchFamilies["sacred-art-jade-tiger-domain"],
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
          create2CrouchingTigersHand: {
            kind: "resolution",
            effect: {
              type: "create-token",
              token: "crouching-tiger",
              controller: "controller",
              count: 2,
              to: {
                zone: "hand",
              },
            },
          },
          crouchingTigersGet1Turn: {
            kind: "resolution",
            effect: {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 1,
              target: {
                selector: "object",
                declared: "at-resolution",
                zones: ["combat-chain"],
                filter: {
                  name: "Crouching Tiger",
                },
                count: {
                  type: "all",
                },
              },
              duration: "this-turn",
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

export const { blue: sacredArtJadeTigerDomainBlue } = sacredArtJadeTigerDomain.cards;
