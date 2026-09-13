import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const pantheonBarrier: GrandArchiveCard<
  GrandArchiveAbilityDefinition,
  "token-representation"
> = {
  canonicalId: "WyNvyDHFdB",
  slug: "pantheon-barrier",
  definitionKind: "token-representation",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "WyNvyDHFdB:face:default",
      catalogId: "WyNvyDHFdB",
      name: "Pantheon Barrier",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA", "DOMAIN"],
        classes: ["SPIRIT"],
        subtypes: ["SPIRIT", "SIEGEABLE", "BARRIER"],
      },
      elements: ["NORM"],
      stats: {
        durability: 6,
      },
      rulesText:
        "(In a Pantheon game, each player summons this token at the beginning of the game.)\n\nOmnishroud\n\nIf damage would be dealt to another object you control, that damage is dealt to Pantheon Barrier instead.\n",
      abilities: [
        {
          id: "WyNvyDHFdB-a1",
          kind: "game-setup",
          text: "(In a Pantheon game, each player summons this token at the beginning of the game.)",
          rule: {
            kind: "summon-source-token",
            gameMode: "pantheon",
            players: "each-player",
            timing: "game-beginning",
          },
        },
        {
          id: "WyNvyDHFdB-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Omnishroud",
          keyword: {
            name: "omnishroud",
          },
        },
        {
          id: "WyNvyDHFdB-a3",
          kind: "static",
          staticKind: "effects",
          text: "If damage would be dealt to another object you control, that damage is dealt to Pantheon Barrier instead.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "damage-dealt",
                recipient: {
                  kind: "event-object",
                  controller: "controller",
                  filter: {
                    kind: "not-source",
                  },
                },
              },
              operation: {
                kind: "redirect",
                recipient: {
                  kind: "source",
                },
              },
              duration: {
                kind: "while-source-on-field",
              },
            },
          ],
        },
      ],
    },
  },
};

export default pantheonBarrier;
