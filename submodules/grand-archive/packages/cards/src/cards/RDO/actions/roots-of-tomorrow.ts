import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const rootsOfTomorrow: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "MkhP6iKyLX",
  slug: "roots-of-tomorrow",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "MkhP6iKyLX:face:default",
      catalogId: "MkhP6iKyLX",
      name: "Roots of Tomorrow",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SKILL"],
      },
      elements: ["TERA"],
      speed: "fast",
      stats: {},
      rulesText:
        "Reveal the top card of your deck and put it into your material deck preserved.\n\nDraw a card into your memory. ",
      abilities: [
        {
          id: "MkhP6iKyLX-a1",
          kind: "card-resolution",
          text: "Reveal the top card of your deck and put it into your material deck preserved.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "reveal",
                player: "controller",
                selection: {
                  id: "revealed-top-card",
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
                kind: "move",
                subject: {
                  kind: "bound",
                  binding: "revealed-top-card",
                },
                from: "main-deck",
                destination: {
                  zone: "material-deck",
                },
              },
              {
                kind: "set-object-state",
                subject: {
                  kind: "bound",
                  binding: "revealed-top-card",
                },
                state: "preserved",
                value: true,
              },
            ],
          },
        },
        {
          id: "MkhP6iKyLX-a2",
          kind: "card-resolution",
          text: "Draw a card into your memory.",
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
      ],
    },
  },
};

export default rootsOfTomorrow;
