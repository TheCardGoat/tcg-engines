import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/mist-hunter.generated.ts";

export const mistHunter = definePitchFamily(fabPitchFamilies["mist-hunter"], {
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
    hitsMysticSearchDeckAnyNumberInnerChiBanishThenShuffle: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "attack",
            relationship: {
              kind: "any",
            },
            filter: {
              typeBox: {
                supertypes: ["Mystic"],
              },
            },
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
              type: "search",
              zones: ["deck"],
              player: "attack-target",
              filter: {
                name: "Inner Chi",
              },
              count: {
                type: "all",
              },
              to: {
                zone: "banished",
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
  }),
});

export const { red: mistHunterRed } = mistHunter.cards;
