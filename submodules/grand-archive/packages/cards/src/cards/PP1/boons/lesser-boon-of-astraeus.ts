import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lesserBoonOfAstraeus: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4ZpWIJAmSC",
  slug: "lesser-boon-of-astraeus",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "4ZpWIJAmSC:face:default",
      catalogId: "4ZpWIJAmSC",
      name: "Lesser Boon of Astraeus",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["LESSER BOON"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["WIND"],
      speed: "slow",
      stats: {},
      rulesText:
        "(3): As a Spell, suppress target ally, item, or weapon. Activate this ability only once. (To suppress an object, banish it and return it to the field under its owner’s control at the beginning of the next end phase.)\n",
      abilities: [
        {
          id: "4ZpWIJAmSC-a1",
          kind: "activated",
          text: "(3): As a Spell, suppress target ally, item, or weapon. Activate this ability only once. (To suppress an object, banish it and return it to the field under its owner’s control at the beginning of the next end phase.)",
          activation: "ability",
          cost: {
            kind: "pay-reserve",
            amount: 3,
          },
          limit: {
            count: 1,
            per: "source-instance",
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
                  oneOf: ["ALLY", "ITEM", "WEAPON"],
                },
              },
            },
          ],
          effect: {
            kind: "perform-as",
            sourceKind: "spell",
            effect: {
              kind: "keyword-action",
              action: "suppress",
              subject: {
                kind: "bound",
                binding: "target-1",
              },
            },
          },
        },
      ],
    },
  },
};

export default lesserBoonOfAstraeus;
