import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/jack-be-quick.generated.ts";

export const jackBeQuick = definePitchFamily(fabPitchFamilies["jack-be-quick"], {
  keywords: [goAgain],
  abilities: () => ({
    attacksBanishNimblismGraveyardGets1PowerGoAgain: {
      kind: "static",
      staticKind: "triggered",
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
          type: "optional",
          effect: {
            type: "banish",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["graveyard"],
              filter: {
                name: "Nimblism",
              },
              count: 1,
            },
            outputBinding: "banished",
          },
          then: {
            type: "sequence",
            steps: [
              {
                type: "modify-numeric",
                property: "power",
                op: "add",
                amount: 1,
                target: {
                  selector: "self",
                },
                duration: "permanent",
              },
              {
                type: "grant-property",
                property: {
                  kind: "keyword",
                  keyword: goAgain,
                },
                target: {
                  selector: "self",
                },
                duration: "permanent",
              },
            ],
          },
        },
      },
      label: {
        name: "steal",
      },
    },
    hitsUAllyThenStealEndActionPhase: {
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
              type: "untap",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "opponent",
                zones: ["permanent"],
                filter: {
                  typeBox: {
                    subtypes: ["Ally"],
                  },
                },
                count: 1,
              },
              outputBinding: "it",
            },
            {
              type: "gain-control",
              target: {
                selector: "binding",
                binding: "it",
              },
              controller: "controller",
              duration: "until-end-of-action-phase",
            },
          ],
        },
      },
      label: {
        name: "steal",
      },
    },
  }),
});

export const { red: jackBeQuickRed } = jackBeQuick.cards;
