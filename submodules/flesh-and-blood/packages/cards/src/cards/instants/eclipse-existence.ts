import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/eclipse-existence.generated.ts";

export const eclipseExistence = definePitchFamily(fabPitchFamilies["eclipse-existence"], {
  abilities: () => ({
    untilEndTurnWheneverAttackHitsLightHeroMay: {
      kind: "resolution",
      effect: {
        type: "delayed-trigger",
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
            },
            target: {
              kind: "hero",
              filter: {
                typeBox: {
                  supertypes: ["Light"],
                },
              },
            },
          },
        },
        policy: {
          kind: "windowed",
          duration: "this-turn",
          matching: "every",
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
                player: "attack-target",
                zones: ["soul"],
                count: 1,
              },
            },
            then: {
              type: "lose-life",
              amount: 1,
              target: {
                selector: "attack-target",
              },
            },
          },
        },
      },
    },
    ifHaveMoreThanOpposingLightHeroMayBanish: {
      kind: "resolution",
      condition: {
        type: "and",
        conditions: [
          {
            type: "life-comparison",
            player: "self",
            vs: "opponent",
            op: "gt",
          },
          {
            type: "zone-count",
            zone: "hero",
            player: "opponent",
            filter: {
              typeBox: {
                supertypes: ["Light"],
              },
            },
            comparison: {
              op: "gte",
              value: 1,
            },
          },
        ],
      },
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
              typeBox: {
                types: ["Action"],
              },
            },
            count: 1,
          },
          outputBinding: "banished",
        },
      },
    },
  }),
});

export const { blue: eclipseExistenceBlue } = eclipseExistence.cards;
