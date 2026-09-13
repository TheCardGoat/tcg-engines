import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/demi-heroes/arakni-trap-door.generated.ts";

export const arakniTrapDoor = defineCard(fabCardIdentitiesByCanonicalId.dkzRfmwLkcGrgmnzTQzcJ, {
  abilities: {
    searchAndBanishOnBecoming: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "become",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "object",
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
                type: "sequence",
                steps: [
                  {
                    type: "search",
                    zones: ["deck"],
                    filter: {},
                    mayFail: true,
                    to: { zone: "banished" },
                    faceDown: true,
                    outputBinding: "trap-door-card",
                  },
                  {
                    type: "conditional",
                    condition: {
                      type: "binding-matches",
                      binding: "trap-door-card",
                      filter: {
                        typeBox: {
                          subtypes: ["Trap"],
                        },
                      },
                    },
                    then: {
                      type: "play-card",
                      fromZones: ["banished"],
                      source: { selector: "binding", binding: "trap-door-card" },
                      duration: "until-start-of-own-next-turn",
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    },
    returnToBrood: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "end-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: { type: "return-to-brood" },
      },
    },
  },
});
