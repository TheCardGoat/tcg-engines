import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const mirrordepthsBlade: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "efTHWeXscP",
  slug: "mirrordepths-blade",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "efTHWeXscP:face:default",
      catalogId: "efTHWeXscP",
      name: "Mirrordepth's Blade",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        durability: 2,
      },
      rulesText:
        "On Banish: Look at the top card of your deck. You may put it into your graveyard.",
      abilities: [
        {
          id: "efTHWeXscP-a1",
          kind: "triggered",
          text: "On Banish: Look at the top card of your deck. You may put it into your graveyard.",
          trigger: {
            kind: "event",
            event: {
              name: "card-banished",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "look-at",
                player: "controller",
                selection: {
                  id: "referenced-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["main-deck"],
                    relationship: "zone-of",
                    player: "controller",
                    fromTop: true,
                  },
                },
              },
              {
                kind: "optional",
                player: "controller",
                allOrNothing: true,
                effect: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "referenced-cards",
                  },
                  destination: {
                    zone: "graveyard",
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default mirrordepthsBlade;
