import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cooktechMixer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "yZBIpXIDIo",
  slug: "cooktech-mixer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "yZBIpXIDIo:face:default",
      catalogId: "yZBIpXIDIo",
      name: "CookTech Mixer",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "VELTECH", "KITCHEN", "DEVICE"],
      },
      elements: ["FIRE"],
      stats: {},
      rulesText:
        "REST: The next Food card you activate this turn costs 2 less to activate.\n\nSacrifice CookTech Mixer and a Powercell: Deal 3 damage to each champion and draw a card into your memory.",
      abilities: [
        {
          id: "yZBIpXIDIo-a1",
          kind: "activated",
          text: "REST: The next Food card you activate this turn costs 2 less to activate.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          effect: {
            kind: "rule-modification",
            mode: "modify-cost",
            action: "activate",
            subject: {
              kind: "player",
              player: "controller",
            },
            filter: {
              kind: "subtype",
              oneOf: ["FOOD"],
            },
            costKind: "reserve",
            costOperation: "subtract",
            amount: 2,
            duration: {
              kind: "for-next-event",
              event: "card-activated",
              expires: {
                kind: "this-turn",
              },
            },
          },
        },
        {
          id: "yZBIpXIDIo-a2",
          kind: "activated",
          text: "Sacrifice CookTech Mixer and a Powercell: Deal 3 damage to each champion and draw a card into your memory.",
          activation: "ability",
          cost: {
            kind: "select-and-sacrifice",
            player: "controller",
            count: {
              kind: "exactly",
              amount: 1,
            },
            bindResultAs: "sacrificed-object",
            filter: {
              kind: "subtype",
              oneOf: ["POWERCELL"],
            },
          },
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "each",
              collection: {
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
            amount: 3,
          },
        },
      ],
    },
  },
};

export default cooktechMixer;
