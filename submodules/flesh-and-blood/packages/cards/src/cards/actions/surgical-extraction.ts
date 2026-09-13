import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/surgical-extraction.generated.ts";

export const surgicalExtraction = definePitchFamily(fabPitchFamilies["surgical-extraction"], {
  abilities: () => ({
    contractedBanishOpponentsBlue: {
      kind: "resolution",
      effect: {
        type: "contract-task",
        task: "banish opponents' blue cards",
        completeOn: "banish",
        filter: { color: ["blue"] },
      },
      label: {
        name: "contract",
      },
    },
    wheneverCompleteContractCreateSilverToken: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "complete-contract",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "silver",
          controller: "controller",
        },
      },
      label: {
        name: "contract",
      },
    },
    whenHitsHeroBanishTopTheirDeckLookAtTheirHandBanish: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "banish",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "opponent",
                zones: ["deck"],
                position: "top",
                count: 1,
              },
              outputBinding: "banished",
            },
            {
              type: "sequence",
              steps: [
                {
                  type: "look",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "opponent",
                    zones: ["hand"],
                    count: {
                      type: "all",
                    },
                  },
                },
                {
                  type: "banish",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "opponent",
                    zones: ["hand"],
                    count: 1,
                  },
                },
              ],
            },
          ],
        },
      },
    },
  }),
});

export const { blue: surgicalExtractionBlue } = surgicalExtraction.cards;
