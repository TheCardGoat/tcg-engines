import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const maidenOfWaningBloom: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "xkzLY4vWMk",
  slug: "maiden-of-waning-bloom",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "xkzLY4vWMk:face:default",
      catalogId: "xkzLY4vWMk",
      name: "Maiden of Waning Bloom",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA", "ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["TERA"],
      stats: {
        power: 3,
        life: 4,
      },
      rulesText:
        "[Diao Chan Bonus] On Enter: Up to one target opponent summons two Flowerbud tokens. (Apply this effect only if your champion is Diao Chan.)\n\n[Diao Chan Bonus] On Attack: The defending player sacrifices a Flowerbud. If they do, they summon your choice of an Acerbica, Floodbloom, Nightshade, or Washuru token.",
      abilities: [
        {
          id: "xkzLY4vWMk-a1",
          kind: "triggered",
          text: "[Diao Chan Bonus] On Enter: Up to one target opponent summons two Flowerbud tokens. (Apply this effect only if your champion is Diao Chan.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          targets: [
            {
              id: "target-opponent",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "player",
                players: ["opponent"],
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Diao Chan",
              },
            },
          ],
          effect: {
            kind: "summon",
            object: "Flowerbud",
            controller: {
              binding: "target-opponent",
            },
            amount: 2,
          },
        },
        {
          id: "xkzLY4vWMk-a2",
          kind: "triggered",
          text: "[Diao Chan Bonus] On Attack: The defending player sacrifices a Flowerbud. If they do, they summon your choice of an Acerbica, Floodbloom, Nightshade, or Washuru token.",
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
                name: "Diao Chan",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "attempt",
                bindSucceededAs: "flowerbud-sacrificed",
                effect: {
                  kind: "choose",
                  selection: {
                    id: "sacrificed-flowerbud",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "defending-player",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    candidates: {
                      kind: "object",
                      zones: ["field"],
                      relationship: "controlled-by",
                      player: "defending-player",
                      filter: {
                        kind: "name",
                        value: "Flowerbud",
                      },
                    },
                  },
                  effect: {
                    kind: "sacrifice",
                    subject: {
                      kind: "bound",
                      binding: "sacrificed-flowerbud",
                    },
                  },
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "effect-succeeded",
                  binding: "flowerbud-sacrificed",
                },
                then: {
                  kind: "summon-one-of",
                  chooser: "controller",
                  controller: "defending-player",
                  objects: ["Acerbica", "Floodbloom", "Nightshade", "Washuru"],
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default maidenOfWaningBloom;
