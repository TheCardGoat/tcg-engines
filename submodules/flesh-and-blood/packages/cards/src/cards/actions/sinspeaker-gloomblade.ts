import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sinspeaker-gloomblade.generated.ts";
import { bloodDebt, usurp } from "../shared/keywords.ts";

export const sinspeakerGloomblade = definePitchFamily(fabPitchFamilies["sinspeaker-gloomblade"], {
  keywords: [usurp, bloodDebt],
  abilities: () => ({
    playFromBanishedZone: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "permission",
        fromZones: ["banished"],
      },
    },
    wasPlayedFromBanishedZoneGetsWhenAttacksSearchDeckForAura: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "played-this",
        per: "turn",
        onlySource: true,
        filter: { playedFromZones: ["banished"] },
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "whenAttacksSearchDeckForAuraWithRunechantInNamePutInto",
            text: "",
            trigger: {
              kind: "event",
              event: {
                name: "attack",
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
                type: "sequence",
                steps: [
                  {
                    type: "optional",
                    effect: {
                      type: "search",
                      zones: ["deck"],
                      filter: {
                        typeBox: {
                          subtypes: ["Aura"],
                        },
                        moniker: "Runechant",
                      },
                      mayFail: true,
                      to: {
                        zone: "permanent",
                      },
                    },
                  },
                  {
                    type: "shuffle",
                    zone: "deck",
                  },
                ],
              },
            },
          },
        },
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
  }),
});

export const { red: sinspeakerGloombladeRed } = sinspeakerGloomblade.cards;
