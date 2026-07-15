import type { Condition } from "@tcg/op-types";
import { parseComparison } from "../helpers.ts";

export function parseCountCondition(text: string): Condition | null {
  const t = text;
  let m: RegExpExecArray | null;

  // Life count: you/your opponent have/has N or less/more Life cards
  m = /^(your opponent|you)\s+ha(?:ve|s)\s+(\d+)\s+or\s+(less|more)\s+Life\s+cards?$/i.exec(t);
  if (m) {
    return {
      condition: "lifeCount",
      player: m[1]!.toLowerCase() === "you" ? "self" : "opponent",
      comparison: parseComparison(m[3]),
      value: parseInt(m[2]!, 10),
    };
  }

  // Hand count: you have N or less/more cards in your hand
  m = /^you\s+have\s+(\d+)\s+or\s+(less|more)\s+cards?\s+in\s+your\s+hand$/i.exec(t);
  if (m) {
    return {
      condition: "handCount",
      player: "self",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
    };
  }

  // Hand count (exact): you have N cards in your hand
  m = /^you\s+have\s+(\d+)\s+cards?\s+in\s+your\s+hand$/i.exec(t);
  if (m) {
    return {
      condition: "handCount",
      player: "self",
      comparison: "eq",
      value: parseInt(m[1]!, 10),
    };
  }

  // Zone count (rested characters): you have N or more rested Characters
  // Must be before generic characters to avoid shadowing
  m = /^you\s+have\s+(\d+)\s+or\s+(less|more)\s+rested\s+Characters$/i.exec(t);
  if (m) {
    return {
      condition: "zoneCount",
      player: "self",
      zone: "character",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
      filters: [{ filter: "state", value: "rested" as const }],
    };
  }

  // Zone count (characters on field): you have N or more Characters
  m = /^you\s+have\s+(\d+)\s+or\s+(less|more)\s+Characters$/i.exec(t);
  if (m) {
    return {
      condition: "zoneCount",
      player: "self",
      zone: "character",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
    };
  }

  // Zone count (exact characters): you have N Characters
  m = /^you\s+have\s+(\d+)\s+Characters$/i.exec(t);
  if (m) {
    return {
      condition: "zoneCount",
      player: "self",
      zone: "character",
      comparison: "eq",
      value: parseInt(m[1]!, 10),
    };
  }

  // Zone count (rested typed characters): you have N or more rested "X" type Characters
  m =
    /^you\s+have\s+(\d+)\s+or\s+(less|more)\s+rested\s+[""[{]([^""\]}]+)[""\]}]\s+type\s+Characters$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "zoneCount",
      player: "self",
      zone: "character",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
      filters: [
        { filter: "state", value: "rested" as const },
        { filter: "trait", value: m[3]! },
      ],
    };
  }

  // Zone count (typed characters): you have N or more/less "X" type Characters
  m =
    /^you\s+have\s+(\d+)\s+or\s+(less|more)\s+[""[{]([^""\]}]+)[""\]}]\s+type\s+Characters$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "zoneCount",
      player: "self",
      zone: "character",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
      filters: [{ filter: "trait", value: m[3]! }],
    };
  }

  // Zone count (typed trash): you have N or more Events/Characters/Stages in your trash
  const cardTypeMap: Record<string, "event" | "character" | "stage"> = {
    event: "event",
    events: "event",
    character: "character",
    characters: "character",
    stage: "stage",
    stages: "stage",
  };
  m =
    /^you\s+have\s+(\d+)\s+or\s+(less|more)\s+(Events?|Characters?|Stages?)\s+in\s+your\s+trash$/i.exec(
      t,
    );
  if (m) {
    const cardType = cardTypeMap[m[3]!.toLowerCase()];
    if (cardType) {
      return {
        condition: "zoneCount",
        player: "self",
        zone: "trash",
        comparison: parseComparison(m[2]),
        value: parseInt(m[1]!, 10),
        filters: [{ filter: "cardCategory", value: cardType }],
      };
    }
  }

  // Zone count (trash): you have N or more cards in your trash
  m = /^you\s+have\s+(\d+)\s+or\s+(less|more)\s+cards?\s+in\s+your\s+trash$/i.exec(t);
  if (m) {
    return {
      condition: "zoneCount",
      player: "self",
      zone: "trash",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
    };
  }

  // Zone count (deck): you have N or less/more cards in your deck
  m = /^you\s+have\s+(\d+)\s+or\s+(less|more)\s+cards?\s+in\s+your\s+deck$/i.exec(t);
  if (m) {
    return {
      condition: "zoneCount",
      player: "self",
      zone: "deck",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
    };
  }

  // Opponent hand count: your opponent has N or more/less cards in their hand
  m = /^your\s+opponent\s+has\s+(\d+)\s+or\s+(less|more)\s+cards?\s+in\s+their\s+hand$/i.exec(t);
  if (m) {
    return {
      condition: "handCount",
      player: "opponent",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
    };
  }

  // Compound DON!! field count: you have 0 or N or more DON!! cards on your field
  m =
    /^you\s+have\s+(\d+)\s+or\s+(\d+)\s+or\s+(less|more)\s+DON!!\s+cards?\s+on\s+your\s+field$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "compound",
      operator: "or",
      conditions: [
        {
          condition: "donFieldCount",
          player: "self",
          comparison: "eq",
          value: parseInt(m[1]!, 10),
        },
        {
          condition: "donFieldCount",
          player: "self",
          comparison: parseComparison(m[3]),
          value: parseInt(m[2]!, 10),
        },
      ],
    };
  }

  // DON!! field count: you have N or more/less DON!! cards on your field
  m = /^you\s+have\s+(\d+)\s+or\s+(less|more)\s+DON!!\s+cards?\s+on\s+your\s+field$/i.exec(t);
  if (m) {
    return {
      condition: "donFieldCount",
      player: "self",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
    };
  }

  // DON!! field count (exact): you have N DON!! cards on your field
  m = /^you\s+have\s+(\d+)\s+DON!!\s+cards?\s+on\s+your\s+field$/i.exec(t);
  if (m) {
    return {
      condition: "donFieldCount",
      player: "self",
      comparison: "eq",
      value: parseInt(m[1]!, 10),
    };
  }

  // DON!! field count (active): you have N or more active DON!! cards
  m = /^you\s+have\s+(\d+)\s+or\s+(less|more)\s+active\s+DON!!\s+cards?$/i.exec(t);
  if (m) {
    return {
      condition: "donFieldCount",
      player: "self",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
    };
  }

  // Opponent DON!! field count: your opponent has N or more/less DON!! cards on their field
  m =
    /^your\s+opponent\s+has\s+(\d+)\s+or\s+(less|more)\s+DON!!\s+cards?\s+on\s+their\s+field$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "donFieldCount",
      player: "opponent",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
    };
  }

  // Opponent rested cards/Characters: your opponent has N or more rested cards/Characters
  m = /^your\s+opponent\s+has\s+(\d+)\s+or\s+(less|more)\s+rested\s+(cards?|Characters?)$/i.exec(t);
  if (m) {
    return {
      condition: "zoneCount",
      player: "opponent",
      zone: /^Characters?$/i.test(m[3]!) ? "character" : "field",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
      filters: [{ filter: "state", value: "rested" as const }],
    };
  }

  // DON!! field comparison: the number of DON!! cards on your field is equal to or less than the number on your opponent's field
  m =
    /^the\s+number\s+of\s+DON!!\s+cards?\s+on\s+your\s+field\s+is\s+equal\s+to\s+or\s+(less|more)\s+than\s+the\s+number\s+on\s+your\s+opponent's\s+field$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "donFieldComparison",
      selfComparison: parseComparison(m[1]),
    };
  }

  // DON!! field comparison: your opponent has more DON!! cards on their field than you
  m =
    /^your\s+opponent\s+has\s+(more|less)\s+DON!!\s+cards?\s+on\s+their\s+field\s+than\s+you$/i.exec(
      t,
    );
  if (m) {
    // "opponent has more" means self has less
    const oppComp = m[1]!.toLowerCase();
    return {
      condition: "donFieldComparison",
      selfComparison: oppComp === "more" ? "lt" : "gt",
    };
  }

  // Compound life count: you and your opponent have a total of N or less Life cards
  m =
    /^you\s+and\s+your\s+opponent\s+have\s+a\s+total\s+of\s+(\d+)\s+or\s+(less|more)\s+Life\s+cards?$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "lifeCount",
      player: "self",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
    };
  }

  // Life comparison: you have less/more life cards than your opponent
  m = /^you\s+have\s+(less|more|fewer)\s+life\s+cards?\s+than\s+your\s+opponent$/i.exec(t);
  if (m) {
    const comp = m[1]!.toLowerCase();
    return {
      condition: "lifeComparison",
      selfComparison: comp === "more" ? "gt" : "lt",
    };
  }

  // Life comparison: the number of your life cards is equal to or less/more than your opponent's
  m =
    /^the\s+number\s+of\s+your\s+life\s+cards?\s+is\s+equal\s+to\s+or\s+(less|more)\s+than\s+(?:the\s+number\s+of\s+)?your\s+opponent's(?:\s+life\s+cards?)?$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "lifeComparison",
      selfComparison: parseComparison(m[1]),
    };
  }

  // DON!! given: you have any DON!! cards given
  m = /^you\s+have\s+any\s+DON!!\s+cards?\s+given$/i.exec(t);
  if (m) {
    return { condition: "donGiven", player: "self" };
  }

  // Zone count with trait filter: you have N or more {Trait}/{[Trait]} type Characters (on your field)?
  m =
    /^you\s+have\s+(\d+)\s+or\s+(less|more)\s+(?:[[{"\u201c])([^\]}\u201d"]+)(?:[\]}\u201d"])\s+type\s+Characters?(?:\s+on\s+your\s+field)?$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "zoneCount",
      player: "self",
      zone: "character",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
      filters: [{ filter: "trait", value: m[3]! }],
    };
  }

  // Zone count with multi-trait filter: you have N or more [X] or [Y] type Characters on your field
  m =
    /^you\s+have\s+(\d+)\s+or\s+(less|more)\s+(?:[[{"\u201c])([^\]}\u201d"]+)(?:[\]}\u201d"])\s+or\s+(?:[[{"\u201c])([^\]}\u201d"]+)(?:[\]}\u201d"])\s+type\s+Characters?(?:\s+on\s+your\s+field)?$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "zoneCount",
      player: "self",
      zone: "character",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
      filters: [
        { filter: "trait", value: m[3]! },
        { filter: "trait", value: m[4]! },
      ],
    };
  }

  // Opponent zone count (characters): your opponent has N or more Characters
  m = /^your\s+opponent\s+has\s+(\d+)\s+or\s+(less|more)\s+Characters$/i.exec(t);
  if (m) {
    return {
      condition: "zoneCount",
      player: "opponent",
      zone: "character",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
    };
  }

  // Opponent has N or more Characters with a base power of N or more
  m =
    /^your\s+opponent\s+has\s+(\d+)\s+or\s+(less|more)\s+Characters?\s+with\s+a\s+base\s+power\s+of\s+(\d+)(?:\s+or\s+(less|more))?$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "zoneCount",
      player: "opponent",
      zone: "character",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
      filters: [
        {
          filter: "basePower",
          comparison: m[4] ? parseComparison(m[4]) : ("eq" as const),
          value: parseInt(m[3]!, 10),
        },
      ],
    };
  }

  // Only type on field: the only Characters on your field are [X] type Characters
  m =
    /^the\s+only\s+Characters?\s+on\s+your\s+field\s+are\s+(?:[[{"\u201c])([^\]}\u201d"]+)(?:[\]}\u201d"])\s+type\s+Characters?$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "zoneCount",
      player: "self",
      zone: "character",
      comparison: "eq",
      value: 0,
      filters: [{ filter: "trait", value: m[1]!, negate: true }],
    };
  }

  // Has card (Characters with power): you have N or less Characters with N power or more
  m =
    /^you\s+have\s+(\d+)\s+or\s+(less|more)\s+Characters?\s+with\s+(\d+)\s+power\s+or\s+(less|more)$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "zoneCount",
      player: "self",
      zone: "character",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
      filters: [{ filter: "power", comparison: parseComparison(m[4]), value: parseInt(m[3]!, 10) }],
    };
  }

  // Total given DON!!: "you have a total of N or more given DON!! cards"
  m = /^you\s+have\s+a\s+total\s+of\s+(\d+)\s+or\s+(more|less)\s+given\s+DON!!\s+cards?$/i.exec(t);
  if (m) {
    return {
      condition: "donFieldCount",
      player: "self",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
    };
  }

  // Character count comparison: "the number of your Characters is at least N less than the number of your opponent's Characters"
  m =
    /^the\s+number\s+of\s+your\s+Characters\s+is\s+at\s+least\s+(\d+)\s+less\s+than\s+the\s+number\s+of\s+your\s+opponent[''\u2019]s\s+Characters$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "zoneCountComparison",
      zone: "character",
      selfComparison: "lt",
      difference: parseInt(m[1]!, 10),
    } as any;
  }

  // Total cards in Life area and hand: "you have a total of N or less cards in your Life area and hand"
  m =
    /^you\s+have\s+a\s+total\s+of\s+(\d+)\s+or\s+(less|more)\s+cards?\s+in\s+your\s+Life\s+area\s+and\s+hand$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "compound",
      operator: "and",
      conditions: [
        {
          condition: "lifeCount",
          player: "self",
          comparison: parseComparison(m[2]),
          value: parseInt(m[1]!, 10),
        },
        {
          condition: "handCount",
          player: "self",
          comparison: parseComparison(m[2]),
          value: parseInt(m[1]!, 10),
        },
      ],
    };
  }

  // Zone count (trash duplicate): "you have N or more cards in your trash"
  m = /^you\s+have\s+(\d+)\s+or\s+(more|less)\s+cards?\s+in\s+your\s+trash$/i.exec(t);
  if (m) {
    return {
      condition: "zoneCount",
      player: "self",
      zone: "trash",
      comparison: parseComparison(m[2]),
      value: parseInt(m[1]!, 10),
    };
  }

  return null;
}
