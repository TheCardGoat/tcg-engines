import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/silver-talons.generated.ts";

export const silverTalons = definePitchFamily(fabPitchFamilies["silver-talons"], {
  abilities: () => ({
    triggeredStaticOnAttackEffect: {
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
          target: {
            kind: "hero",
          },
        },
        state: {
          type: "binding-matches",
          binding: "it",
          filter: {
            typeBox: {
              supertypes: ["Draconic"],
            },
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
                type: "deal-damage",
                damageType: "generic",
                amount: 1,
                target: {
                  selector: "attack-target",
                },
                source: {
                  selector: "object",
                  declared: "on-stack",
                  zones: ["combat-chain"],
                  filter: {
                    and: [
                      {
                        typeBox: {
                          subtypes: ["Dagger"],
                        },
                      },
                    ],
                  },
                  count: 1,
                },
              },
            },
            {
              type: "conditional",
              condition: {
                type: "binding-numeric",
                binding: "damage-dealt-this-way",
                comparison: { op: "gt", value: 0 },
              },
              then: {
                type: "set-status",
                status: "hit",
                target: {
                  selector: "binding",
                  binding: "it",
                },
              },
            },
            {
              type: "destroy",
              target: {
                selector: "binding",
                binding: "it",
              },
            },
          ],
        },
      },
    },
  }),
});

export const {
  red: silverTalonsRed,
  yellow: silverTalonsYellow,
  blue: silverTalonsBlue,
} = silverTalons.cards;
