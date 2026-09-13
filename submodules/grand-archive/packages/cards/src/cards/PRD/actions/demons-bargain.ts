import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const demonsBargain: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "nRtmc2wmBI",
  slug: "demons-bargain",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "nRtmc2wmBI:face:default",
      catalogId: "nRtmc2wmBI",
      name: "Demon's Bargain",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SPELL"],
      },
      elements: ["EXALTED", "FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)\n\nGain control of target ally you don't control unless its controller has you draw two cards.",
      abilities: [
        {
          id: "nRtmc2wmBI-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)",
          keyword: {
            name: "exalted",
          },
        },
        {
          id: "nRtmc2wmBI-a2",
          kind: "card-resolution",
          text: "Gain control of target ally you don't control unless its controller has you draw two cards.",
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
                relationship: "controlled-by",
                player: "opponent",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "unless-performed",
            player: {
              controllerOf: "target-1",
            },
            alternative: {
              kind: "draw",
              player: "controller",
              amount: 2,
            },
            otherwise: {
              kind: "change-control",
              subject: {
                kind: "bound",
                binding: "target-1",
              },
              controller: "controller",
            },
          },
        },
      ],
    },
  },
};

export default demonsBargain;
