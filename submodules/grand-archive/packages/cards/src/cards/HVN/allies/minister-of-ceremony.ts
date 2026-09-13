import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ministerOfCeremony: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7gz0j8p4sx",
  slug: "minister-of-ceremony",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7gz0j8p4sx:face:default",
      catalogId: "7gz0j8p4sx",
      name: "Minister of Ceremony",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "REST: As a Spell, deal 3 damage to target unit. Activate this ability only at slow speed and only if your Shifting Currents face East.",
      abilities: [
        {
          id: "7gz0j8p4sx-a1",
          kind: "activated",
          text: "REST: As a Spell, deal 3 damage to target unit. Activate this ability only at slow speed and only if your Shifting Currents face East.",
          activation: "ability",
          speed: "slow",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          condition: {
            kind: "player-state",
            player: "controller",
            state: {
              named: "shifting-currents",
              value: "East",
            },
          },
          effect: {
            kind: "perform-as",
            sourceKind: "spell",
            effect: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "bound",
                binding: "target-1",
              },
              amount: 3,
            },
          },
        },
      ],
    },
  },
};

export default ministerOfCeremony;
