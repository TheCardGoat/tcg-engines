import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/iyslander.generated.ts";

export const iyslander = defineCard(fabCardIdentitiesByCanonicalId["TmKrpP8tDg8bmpnqMPtgj"], {
  keywords: [
    {
      name: "essence",
      supertypes: ["Ice"],
    },
  ],
  abilities: {
    notTurnPlayBlueNonAttackActionArsenalThoughWereInstant: {
      // Printed: not-your-turn arsenal play-as-instant for blue non-attack actions.
      // Modeled as a static play permission (Dash I/O family) so continuous
      // rules evaluation grants asType:instant on matching arsenal cards —
      // not an optional play-card effect on a continuous shell.
      kind: "static",
      staticKind: "play",
      condition: {
        type: "has-status",
        status: "not-your-turn",
      },
      playEffect: {
        role: "permission",
        fromZones: ["arsenal"],
        filter: {
          typeBox: {
            types: ["Action"],
            excludeSubtypes: ["Attack"],
          },
          color: ["blue"],
        },
        asType: "instant",
        optional: true,
      },
    },
    wheneverPlayIceDuringOpponentsTurnCreateFrostbiteToken: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "play",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "played-card",
            relationship: {
              kind: "any",
            },
            filter: {
              typeBox: {
                supertypes: ["Ice"],
              },
            },
            bindAs: "it",
          },
        },
        state: {
          type: "has-status",
          status: "not-your-turn",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "frostbite",
          controller: "opponent",
        },
      },
    },
  },
});
