import { definePitchFamily, modalAbility } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/skyward-serenade.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const skywardSerenade = definePitchFamily(fabPitchFamilies["skyward-serenade"], {
  keywords: [goAgain],
  abilities: () => ({
    chooseNumber2CreateEmbodimentLightningTokenSearchDeckForSkyzykBanishShuffle: modalAbility({
      kind: "modal",
      modal: {
        choose: 2,
      },
      modes: {
        createEmbodimentLightningToken: {
          kind: "resolution",
          effect: {
            type: "create-token",
            token: "embodiment-of-lightning",
            controller: "controller",
          },
        },
        searchDeckForSkyzykBanishShufflePlayTurn: {
          kind: "resolution",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "search",
                zones: ["deck"],
                filter: {
                  name: "Skyzyk",
                },
                mayFail: true,
                to: {
                  zone: "banished",
                },
              },
              {
                type: "shuffle",
                zone: "deck",
              },
              {
                type: "optional",
                effect: {
                  type: "play-card",
                  fromZones: ["banished"],
                  source: {
                    selector: "binding",
                    binding: "it",
                  },
                  duration: "this-turn",
                },
              },
            ],
          },
        },
        nextAttackTurnGetsNumber1Power: {
          kind: "resolution",
          effect: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  subtypes: ["Attack"],
                },
              },
            },
          },
        },
      },
    }),
  }),
});

export const { yellow: skywardSerenadeYellow } = skywardSerenade.cards;
