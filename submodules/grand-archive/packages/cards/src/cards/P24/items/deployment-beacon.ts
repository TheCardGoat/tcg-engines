import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const deploymentBeacon: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "klryvfq3hu",
  slug: "deployment-beacon",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "klryvfq3hu:face:default",
      catalogId: "klryvfq3hu",
      name: "Deployment Beacon",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "DEVICE"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "On Enter: Summon an Automaton Drone token.\n\n[Class Bonus] On Leave: Summon an Automaton Drone token. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "klryvfq3hu-a1",
          kind: "triggered",
          text: "On Enter: Summon an Automaton Drone token.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "summon",
            object: "Automaton Drone",
            controller: "controller",
            bindResultAs: "summoned-token",
          },
        },
        {
          id: "klryvfq3hu-a2",
          kind: "triggered",
          text: "[Class Bonus] On Leave: Summon an Automaton Drone token. (Apply this effect only if your champion's class matches this card's class.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-left-field",
              subject: {
                kind: "source",
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effect: {
            kind: "summon",
            object: "Automaton Drone",
            controller: "controller",
            bindResultAs: "summoned-token",
          },
        },
      ],
    },
  },
};

export default deploymentBeacon;
