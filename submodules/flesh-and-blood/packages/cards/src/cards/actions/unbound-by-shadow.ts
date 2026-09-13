import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/unbound-by-shadow.generated.ts";
import { bloodDebt } from "../shared/keywords.ts";

export const unboundByShadow = definePitchFamily(fabPitchFamilies["unbound-by-shadow"], {
  keywords: [bloodDebt],
  abilities: () => ({
    whenAttacksWasPlayedFromBanishedZoneCreateGateIArathaelToken: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
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
        state: {
          type: "played-this",
          per: "turn",
          onlySource: true,
          filter: { playedFromZones: ["banished"] },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "gate-to-i-arathael",
          controller: "controller",
        },
      },
    },
  }),
});

export const { red: unboundByShadowRed } = unboundByShadow.cards;
