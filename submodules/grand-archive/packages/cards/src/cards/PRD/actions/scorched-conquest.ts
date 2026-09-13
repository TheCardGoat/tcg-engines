import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const scorchedConquest: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "HPDawzCDdr",
  slug: "scorched-conquest",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "HPDawzCDdr:face:default",
      catalogId: "HPDawzCDdr",
      name: "Scorched Conquest",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["EXALTED", "FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)\n\nDestroy up to three target domains.",
      abilities: [
        {
          id: "HPDawzCDdr-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)",
          keyword: {
            name: "exalted",
          },
        },
        {
          id: "HPDawzCDdr-a2",
          kind: "card-resolution",
          text: "Destroy up to three target domains.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 3,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["DOMAIN"],
                },
              },
            },
          ],
          effect: {
            kind: "destroy",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
          },
        },
      ],
    },
  },
};

export default scorchedConquest;
