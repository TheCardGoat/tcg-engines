import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const vanishingEclipse: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "gamylrj1fc",
  slug: "vanishing-eclipse",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "gamylrj1fc:face:default",
      catalogId: "gamylrj1fc",
      name: "Vanishing Eclipse",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "AETHERCHARGE", "SPELL"],
      },
      elements: ["ASTRA"],
      speed: "fast",
      stats: {
        power: 2,
      },
      rulesText:
        "[Element Bonus] Aethercalling (As you're looking at this card while glimpsing, you may load it into an Aetherwing weapon you control.)\n\nReturn target ally to the top of its owner's deck. Your champion becomes distant.",
      abilities: [
        {
          id: "gamylrj1fc-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Element Bonus] Aethercalling (As you're looking at this card while glimpsing, you may load it into an Aetherwing weapon you control.)",
          keyword: {
            name: "aethercalling",
          },
          restrictions: [
            {
              kind: "static",
              name: "element-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "element",
              },
            },
          ],
        },
        {
          id: "gamylrj1fc-a2",
          kind: "card-resolution",
          text: "Return target ally to the top of its owner's deck. Your champion becomes distant.",
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
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "move",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                destination: {
                  zone: "main-deck",
                  placement: {
                    kind: "top",
                  },
                },
              },
              {
                kind: "set-object-state",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                state: "distant",
                value: true,
              },
            ],
          },
        },
      ],
    },
  },
};

export default vanishingEclipse;
