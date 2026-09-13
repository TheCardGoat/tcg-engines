import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/plow-under.generated.ts";

export const plowUnder = definePitchFamily(fabPitchFamilies["plow-under"], {
  abilities: () => ({
    there4MoreEarthBanishedZoneGets4Power: {
      kind: "resolution",
      condition: {
        type: "zone-count",
        zone: "banished",
        player: "controller",
        filter: {
          typeBox: {
            supertypes: ["Earth"],
          },
        },
        comparison: {
          op: "gte",
          value: 4,
        },
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 4,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
    attacksBanish2EarthActionGraveyardPutsArsenalBottomDeck: {
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
            type: "sequence",
            steps: [
              {
                type: "banish",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["graveyard"],
                  filter: {
                    typeBox: {
                      supertypes: ["Earth"],
                    },
                  },
                  count: 2,
                },
              },
              {
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
              },
            ],
          },
          then: {
            type: "for-each",
            target: {
              selector: "each-hero",
            },
            effect: {
              type: "move-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                zones: ["arsenal"],
                count: 1,
              },
              to: {
                zone: "deck",
                position: "bottom",
              },
            },
          },
        },
      },
      label: {
        name: "decompose",
      },
    },
  }),
});

export const { yellow: plowUnderYellow } = plowUnder.cards;
