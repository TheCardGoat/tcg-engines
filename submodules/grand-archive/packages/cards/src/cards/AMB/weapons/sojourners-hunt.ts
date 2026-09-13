import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sojournersHunt: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "aqlbuznsz4",
  slug: "sojourners-hunt",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "aqlbuznsz4:face:default",
      catalogId: "aqlbuznsz4",
      name: "Sojourner's Hunt",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "BOW"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        durability: 4,
      },
      rulesText:
        "(Bow — Must be loaded to use for an attack and can't be used with an attack card.)\n\nREST: Sojourner's Hunt becomes a weapon subtype of your choice in addition to its other types until end of turn.",
      abilities: [
        {
          id: "aqlbuznsz4-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Bow — Must be loaded to use for an attack and can't be used with an attack card.)",
          keyword: {
            name: "bow",
          },
        },
        {
          id: "aqlbuznsz4-a2",
          kind: "activated",
          text: "REST: Sojourner's Hunt becomes a weapon subtype of your choice in addition to its other types until end of turn.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "choose-value",
                selection: {
                  id: "chosen-weapon-subtype",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  unique: true,
                  candidates: {
                    kind: "characteristic",
                    characteristic: "subtype",
                    optionsFrom: {
                      kind: "type",
                      oneOf: ["WEAPON"],
                    },
                  },
                },
                trackAs: "chosen-weapon-subtype",
              },
              {
                kind: "continuous",
                subjects: {
                  kind: "source",
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
                },
                layer: {
                  layer: "B",
                  modifies: "type",
                },
                change: {
                  kind: "add-tracked-characteristic",
                  characteristic: "subtype",
                  key: "chosen-weapon-subtype",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default sojournersHunt;
