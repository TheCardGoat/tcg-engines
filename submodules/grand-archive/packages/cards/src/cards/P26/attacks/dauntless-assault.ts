import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dauntlessAssault: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ixIY36Ck37",
  slug: "dauntless-assault",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ixIY36Ck37:face:default",
      catalogId: "ixIY36Ck37",
      name: "Dauntless Assault",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["EXALTED", "NORM"],
      stats: {
        power: 4,
      },
      rulesText:
        "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)\n\n[Mordred Bonus] On Attack: Wake up the attacker.",
      abilities: [
        {
          id: "ixIY36Ck37-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)",
          keyword: {
            name: "exalted",
          },
        },
        {
          id: "ixIY36Ck37-a2",
          kind: "triggered",
          text: "[Mordred Bonus] On Attack: Wake up the attacker.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Mordred",
              },
            },
          ],
          effect: {
            kind: "wake",
            subject: {
              kind: "event-attacker",
            },
          },
        },
      ],
    },
  },
};

export default dauntlessAssault;
