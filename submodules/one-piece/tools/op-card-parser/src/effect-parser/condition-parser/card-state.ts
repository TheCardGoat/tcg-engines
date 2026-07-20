import type { Condition, OPColor, Zone } from "@tcg/op-types";
import { parseComparison } from "../helpers.ts";

export function parseCardStateCondition(text: string): Condition | null {
  const t = text.trim();
  let m: RegExpExecArray | null;

  // Own Leader power is a field-card condition, not the source Character.
  m = /^your Leader has (\d+) power(?:\s+or\s+(more|less))?$/i.exec(t);
  if (m) {
    return {
      condition: "hasCard",
      player: "self",
      zone: "leader",
      filters: [
        {
          filter: "power",
          comparison: parseComparison(m[2]),
          value: parseInt(m[1]!, 10),
        },
      ],
    };
  }

  // CardState (power): this Character/Leader or your Character has N power.
  m =
    /^(?:this (?:Character|Leader)|your Character) has (\d+) power(?:\s+or\s+(more|less))?$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "cardState",
      target: "this",
      property: "power",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
    };
  }

  // Has active/rested Leader: your Leader is active/rested
  m = /^your Leader is (active|rested)$/i.exec(t);
  if (m) {
    return {
      condition: "hasCard",
      player: "self",
      zone: "leader",
      filters: [{ filter: "state", value: m[1]!.toLowerCase() as "active" | "rested" }],
    };
  }

  // CardState (state): this Character/Leader/Stage is active/rested
  m = /^this (?:Character|Leader|Stage) is (active|rested)$/i.exec(t);
  if (m) {
    return {
      condition: "cardState",
      target: "this",
      property: "state",
      comparison: "eq",
      value: m[1]!.toLowerCase() as "rested" | "active",
    };
  }

  // Has card (cost): you/your opponent have/has a Character with a cost of N (or more/less)
  m =
    /^(you|your\s+opponent)\s+ha(?:ve|s)\s+a\s+Character\s+with\s+a\s+cost\s+of\s+(\d+)(?:\s+or\s+(less|more))?(?:\s+on\s+your\s+field)?$/i.exec(
      t,
    );
  if (m) {
    const player = /^you$/i.test(m[1]!) ? "self" : "opponent";
    const value = parseInt(m[2]!, 10);
    const comparison = m[3] ? parseComparison(m[3]) : "eq";
    return {
      condition: "hasCard",
      player,
      zone: "character",
      filters: [{ filter: "cost", comparison, value }],
    };
  }

  // Has card with name: you have a [X] Character
  m = /^you\s+have\s+an?\s+(active|rested)\s+\[([^\]]+)\](?:\s+Character)?$/i.exec(t);
  if (m) {
    return {
      condition: "hasCard",
      player: "self",
      zone: "character",
      filters: [
        { filter: "state", value: m[1]!.toLowerCase() as "active" | "rested" },
        { filter: "name", value: m[2]! },
      ],
    };
  }

  // Has card with name: you have a [X] Character
  m = /^you\s+have\s+a\s+\[([^\]]+)\]\s+or\s+\[([^\]]+)\]\s+Character$/i.exec(t);
  if (m) {
    return {
      condition: "compound",
      operator: "or",
      conditions: [m[1]!, m[2]!].map((name) => ({
        condition: "hasCard" as const,
        player: "self" as const,
        zone: "character" as const,
        filters: [{ filter: "name" as const, value: name }],
      })),
    };
  }

  // Has card with name: you have a [X] Character
  m = /^you\s+have\s+a\s+\[([^\]]+)\]\s+Character$/i.exec(t);
  if (m) {
    return {
      condition: "hasCard",
      player: "self",
      zone: "character",
      filters: [{ filter: "name", value: m[1]! }],
    };
  }

  // Has card: your opponent has a Leader or Character with a base power of N or more/less
  m =
    /^your\s+opponent\s+has\s+a\s+(Leader\s+or\s+)?Character\s+with\s+a\s+base\s+power\s+of\s+(\d+)(?:\s+or\s+(less|more))?$/i.exec(
      t,
    );
  if (m) {
    const value = parseInt(m[2]!, 10);
    const comparison = m[3] ? parseComparison(m[3]) : "eq";
    const filters = [{ filter: "basePower" as const, comparison, value }];
    if (m[1]) {
      return {
        condition: "compound",
        operator: "or",
        conditions: [
          { condition: "hasCard", player: "opponent", zone: "leader", filters },
          { condition: "hasCard", player: "opponent", zone: "character", filters },
        ],
      };
    }
    return {
      condition: "hasCard",
      player: "opponent",
      zone: "character",
      filters,
    };
  }

  // Has card: your opponent has a Character with N effective power or more/less
  m =
    /^your\s+opponent\s+has\s+a\s+Character\s+with\s+(\d+)\s+power(?:\s+or\s+(less|more))?$/i.exec(
      t,
    );
  if (m) {
    const value = parseInt(m[1]!, 10);
    const comparison = m[2] ? parseComparison(m[2]) : "eq";
    return {
      condition: "hasCard",
      player: "opponent",
      zone: "character",
      filters: [{ filter: "power", comparison, value }],
    };
  }

  // Opponent has Character with a cost of N (or more/less)
  m =
    /^your\s+opponent\s+has\s+a\s+Character\s+with\s+a\s+cost\s+of\s+(\d+)(?:\s+or\s+(less|more))?$/i.exec(
      t,
    );
  if (m) {
    const value = parseInt(m[1]!, 10);
    const comparison = m[2] ? parseComparison(m[2]) : "eq";
    return {
      condition: "hasCard",
      player: "opponent",
      zone: "character",
      filters: [{ filter: "cost", comparison, value }],
    };
  }

  // Played this turn: this Character was/has played on this turn
  m = /^this\s+Character\s+(?:was|has)\s+played\s+on\s+this\s+turn$/i.exec(t);
  if (m) return { condition: "playedThisTurn" };

  // Face-up life: you have a face-up Life card
  m = /^you\s+have\s+a\s+face-up\s+Life\s+card$/i.exec(t);
  if (m) return { condition: "faceUpLife", player: "self" };

  // Exists on field (compound): there is / your opponent has a Character with one of two costs.
  m =
    /^(there\s+is|your\s+opponent\s+has)\s+a\s+Character\s+with\s+a\s+cost\s+of\s+(\d+)\s+or\s+with\s+a\s+cost\s+of\s+(\d+)(?:\s+or\s+(less|more))?$/i.exec(
      t,
    );
  if (m) {
    const opponentOnly = /^your\s+opponent/i.test(m[1]!);
    return {
      condition: "compound",
      operator: "or",
      conditions: [
        opponentOnly
          ? {
              condition: "hasCard",
              player: "opponent",
              zone: "character" as Zone,
              filters: [
                { filter: "cost" as const, comparison: "eq" as const, value: parseInt(m[2]!, 10) },
              ],
            }
          : {
              condition: "existsOnField",
              zone: "character" as Zone,
              filters: [
                { filter: "cost" as const, comparison: "eq" as const, value: parseInt(m[2]!, 10) },
              ],
            },
        opponentOnly
          ? {
              condition: "hasCard",
              player: "opponent",
              zone: "character" as Zone,
              filters: [
                {
                  filter: "cost" as const,
                  comparison: m[4] ? parseComparison(m[4]) : ("eq" as const),
                  value: parseInt(m[3]!, 10),
                },
              ],
            }
          : {
              condition: "existsOnField",
              zone: "character" as Zone,
              filters: [
                {
                  filter: "cost" as const,
                  comparison: m[4] ? parseComparison(m[4]) : ("eq" as const),
                  value: parseInt(m[3]!, 10),
                },
              ],
            },
      ],
    };
  }

  // Exists on field (cost): there is a Character with a cost of N (or more/less)
  m = /^there\s+is\s+a\s+Character\s+with\s+a\s+cost\s+of\s+(\d+)(?:\s+or\s+(less|more))?$/i.exec(
    t,
  );
  if (m) {
    return {
      condition: "existsOnField",
      zone: "character",
      filters: [
        {
          filter: "cost",
          comparison: m[2] ? parseComparison(m[2]) : ("eq" as const),
          value: parseInt(m[1]!, 10),
        },
      ],
    };
  }

  // Exists on field (power): there is a Character with N power or more/less
  m = /^there\s+is\s+a\s+Character\s+with\s+(\d+)\s+power\s+or\s+(more|less)$/i.exec(t);
  if (m) {
    return {
      condition: "existsOnField",
      zone: "character",
      filters: [{ filter: "power", comparison: parseComparison(m[2]), value: parseInt(m[1]!, 10) }],
    };
  }

  // Has card with trait: you have a {X} type Character, optionally constrained
  // by color and excluding the source card or a named Character.
  m =
    /^you\s+have\s+a\s+(?:(red|green|blue|purple|black|yellow)\s+)?(?:[[{"\u201c])([^\]}\u201d"]+)(?:[\]}\u201d"])\s+type\s+Character(?:\s+other\s+than\s+(this\s+card|this\s+Character|\[([^\]]+)\]))?$/i.exec(
      t,
    );
  if (m) {
    const exclusion = m[3]
      ? /^this\s+/i.test(m[3])
        ? ({ filter: "excludeSelf" } as const)
        : ({ filter: "excludeName", value: m[4]! } as const)
      : undefined;
    return {
      condition: "hasCard",
      player: "self",
      zone: "character",
      filters: [
        ...(m[1] ? [{ filter: "color", value: m[1].toLowerCase() as OPColor } as const] : []),
        { filter: "trait", value: m[2]!, match: "includes" },
        ...(exclusion ? [exclusion] : []),
      ],
    };
  }

  // Has card with trait and power: you have a {X} type Character with N power or more/less
  m =
    /^you\s+have\s+a\s+(?:[[{"\u201c])([^\]}\u201d"]+)(?:[\]}\u201d"])\s+type\s+Character\s+with\s+(\d+)\s+power\s+or\s+(more|less)$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "hasCard",
      player: "self",
      zone: "character",
      filters: [
        { filter: "trait", value: m[1]! },
        { filter: "power", comparison: parseComparison(m[3]), value: parseInt(m[2]!, 10) },
      ],
    };
  }

  // Has card with power: you have a Character with N power or more/less,
  // optionally excluding the effect source.
  m =
    /^you\s+have\s+a\s+Character\s+with\s+(\d+)\s+power\s+or\s+(more|less)(?:\s+other\s+than\s+(this\s+card|this\s+Character))?$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "hasCard",
      player: "self",
      zone: "character",
      filters: [
        ...(m[3] ? ([{ filter: "excludeSelf" }] as const) : []),
        { filter: "power", comparison: parseComparison(m[2]), value: parseInt(m[1]!, 10) },
      ],
    };
  }

  // Has card with trait and cost: you have a {X} type Character with a cost of N (or more)
  m =
    /^you\s+have\s+a\s+(?:[[{"\u201c])([^\]}\u201d"]+)(?:[\]}\u201d"])\s+type\s+Character\s+with\s+a\s+cost\s+of\s+(\d+)(?:\s+or\s+(less|more))?$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "hasCard",
      player: "self",
      zone: "character",
      filters: [
        { filter: "trait", value: m[1]! },
        {
          filter: "cost",
          comparison: m[3] ? parseComparison(m[3]) : ("eq" as const),
          value: parseInt(m[2]!, 10),
        },
      ],
    };
  }

  // Not has card with base power: you have no Characters with N base power or more
  m = /^you\s+have\s+no\s+Characters?\s+with\s+(\d+)\s+base\s+power\s+or\s+(more|less)$/i.exec(t);
  if (m) {
    return {
      condition: "notHasCard",
      player: "self",
      zone: "character",
      filters: [
        { filter: "basePower", comparison: parseComparison(m[2]), value: parseInt(m[1]!, 10) },
      ],
    };
  }

  // CardState (rested/active): this Character is rested/active (without "and" compound)
  m = /^this\s+Character\s+is\s+(rested|active)$/i.exec(t);
  if (m) {
    return {
      condition: "cardState",
      target: "this",
      property: "state",
      comparison: "eq",
      value: m[1]!.toLowerCase() as "rested" | "active",
    };
  }

  // CannotBeKod in battle: this Character cannot be K.O.'d in battle
  m = /^this\s+Character\s+cannot\s+be\s+K\.O\.\u2019?'?d\s+in\s+battle$/i.exec(t);
  if (m) return null; // Handled as action, not condition — return null to let it fall through

  // Has another card by name: you have a [X] other than this Character
  m = /^you\s+have\s+(?:a\s+)?\[([^\]]+)\]\s+other\s+than\s+this\s+Character$/i.exec(t);
  if (m) {
    return {
      condition: "hasCard",
      player: "self",
      zone: "field",
      filters: [{ filter: "excludeSelf" }, { filter: "name", value: m[1]! }],
    };
  }

  // Has card by name: you have [X] (without "a" or "Character" after)
  m = /^you\s+have\s+\[([^\]]+)\]$/i.exec(t);
  if (m) {
    return {
      condition: "hasCard",
      player: "self",
      zone: "field",
      filters: [{ filter: "name", value: m[1]! }],
    };
  }

  // Not has card by name: you don't have [X]
  m = /^you\s+don[''\u2019]t\s+have\s+\[([^\]]+)\]$/i.exec(t);
  if (m) {
    return {
      condition: "notHasCard",
      player: "self",
      zone: "field",
      filters: [{ filter: "name", value: m[1]! }],
    };
  }

  // Not has card by name with cost: you have no other [X] with a base cost of N
  m =
    /^you\s+have\s+no\s+other\s+\[([^\]]+)\](?:\s+Characters?)?\s+with\s+a\s+base\s+cost\s+of\s+(\d+)(?:\s+or\s+(less|more))?$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "notHasCard",
      player: "self",
      zone: "field",
      filters: [
        { filter: "excludeSelf" },
        { filter: "name", value: m[1]! },
        {
          filter: "baseCost",
          comparison: m[3] ? parseComparison(m[3]) : ("eq" as const),
          value: parseInt(m[2]!, 10),
        },
      ],
    };
  }

  // Not has card by name: you have no other [X] (Characters)?
  m = /^you\s+have\s+no\s+other\s+\[([^\]]+)\](?:\s+Characters?)?$/i.exec(t);
  if (m) {
    return {
      condition: "notHasCard",
      player: "self",
      zone: /Characters?$/i.test(t) ? "character" : "field",
      filters: [{ filter: "excludeSelf" }, { filter: "name", value: m[1]! }],
    };
  }

  // DON!! given: you have any DON!! cards given
  m = /^you\s+have\s+any\s+DON!!\s+cards?\s+given$/i.exec(t);
  if (m) {
    return { condition: "donGiven", player: "self" };
  }

  // Attribute condition: that Character has the (Attribute) attribute
  m = /^that\s+Character\s+has\s+the\s+\(([^)]+)\)\s+attribute$/i.exec(t);
  if (m) {
    return {
      condition: "triggerEventCard",
      filters: [
        {
          filter: "attribute",
          value: m[1]!.toLowerCase() as import("@tcg/op-types").OPAttribute,
        },
      ],
    };
  }

  // Played this turn (duplicate): this Character was played on this turn
  m = /^this\s+Character\s+was\s+played\s+on\s+this\s+turn$/i.exec(t);
  if (m) return { condition: "playedThisTurn" };

  // Event-like condition: a Character is rested by your effect
  m = /^a\s+Character\s+is\s+rested\s+by\s+your\s+effect$/i.exec(t);
  if (m) {
    return { condition: "triggerEvent", event: "whenCharacterRestedByEffect" } as any;
  }

  // Battle conditions: this Leader/Character battles your opponent's Character (during this turn)?
  m =
    /^this\s+(?:Leader|Character)\s+battles\s+your\s+opponent[''\u2019]s\s+Character(?:\s+(?:during\s+this\s+turn|with\s+.+))?$/i.exec(
      t,
    );
  if (m) {
    return { condition: "triggerEvent", event: "whenAttacking" } as any;
  }

  // Battle conditions: at the end of a battle in which this Character battles your opponent's Character
  m =
    /^at\s+the\s+end\s+of\s+a\s+battle\s+in\s+which\s+this\s+Character\s+battles\s+your\s+opponent[''\u2019]s\s+Character(?:\s+with\s+.+)?$/i.exec(
      t,
    );
  if (m) {
    return { condition: "triggerEvent", event: "whenAttacking" } as any;
  }

  // Battle conditions: a battle in which this Character battles your opponent's Character
  m =
    /^a\s+battle\s+in\s+which\s+this\s+Character\s+battles\s+your\s+opponent[''\u2019]s\s+Character(?:\s+with\s+.+)?$/i.exec(
      t,
    );
  if (m) {
    return { condition: "triggerEvent", event: "whenAttacking" } as any;
  }

  return null;
}
