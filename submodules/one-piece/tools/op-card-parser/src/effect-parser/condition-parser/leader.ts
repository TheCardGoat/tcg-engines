import type { Condition } from "@tcg/op-types";

export function parseLeaderCondition(text: string): Condition | null {
  const t = text.trim();
  let m: RegExpExecArray | null;

  // Leader trait (multi): your Leader has the {X} or {Y} type
  m = /^your Leader has the [""[{]([^""\]}]+)[""\]}]\s+or\s+[""[{]([^""\]}]+)[""\]}]\s+type$/i.exec(
    t,
  );
  if (m) {
    return {
      condition: "compound",
      operator: "or",
      conditions: [
        { condition: "leaderTrait", trait: m[1]! },
        { condition: "leaderTrait", trait: m[2]! },
      ],
    };
  }

  // Leader trait (compound): your Leader has the {X} type or a type including "Y"
  m =
    /^your Leader has the [""[{]([^""\]}]+)[""\]}]\s+type\s+or\s+a\s+type\s+including\s+[""]([^""]+)[""]$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "compound",
      operator: "or",
      conditions: [
        { condition: "leaderTrait", trait: m[1]! },
        { condition: "leaderTrait", trait: m[2]! },
      ],
    };
  }

  // Leader trait: your Leader has the "X" / [X] / {X} type
  m = /^your Leader has the [""[{]([^""\]}]+)[""\]}]\s+type$/i.exec(t);
  if (m) return { condition: "leaderTrait", trait: m[1]! };

  // Leader trait: your Leader's type includes "X"
  m = /^your Leader's type includes [""]([^""]+)[""]$/i.exec(t);
  if (m) return { condition: "leaderTrait", trait: m[1]! };

  // Leader name (multi): your Leader is [X], [Y] or [Z]
  m = /^your\s+Leader\s+is\s+(\[.+?\](?:,\s*\[.+?\])*\s+or\s+\[.+?\])$/i.exec(t);
  if (m) {
    const namesText = m[1]!;
    const names = [...namesText.matchAll(/\[([^\]]+)\]/g)].map((x) => x[1]!);
    if (names.length > 1) {
      return {
        condition: "compound",
        operator: "or",
        conditions: names.map((name) => ({ condition: "leaderName" as const, name })),
      };
    }
  }

  // Leader name or multicolored: "your Leader is [X] or multicolored"
  m = /^your\s+Leader\s+is\s+\[([^\]]+)\]\s+or\s+multicolored$/i.exec(t);
  if (m) {
    return {
      condition: "compound",
      operator: "or",
      conditions: [{ condition: "leaderName", name: m[1]! }, { condition: "leaderMulticolored" }],
    };
  }

  // Leader name: your Leader is [X] or "X"
  m = /^your Leader is (?:\[([^\]]+)\]|[""]([^""]+)[""])$/i.exec(t);
  if (m) return { condition: "leaderName", name: (m[1] ?? m[2])! };

  // Leader multi-trait: your Leader has the [X] or [X] type / {X} or {X} type
  m =
    /^your\s+Leader\s+has\s+the\s+(?:[[{"\u201c])([^\]}\u201d"]+)(?:[\]}\u201d"])\s+or\s+(?:[[{"\u201c])([^\]}\u201d"]+)(?:[\]}\u201d"])\s+type$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "compound",
      operator: "or",
      conditions: [
        { condition: "leaderTrait", trait: m[1]! },
        { condition: "leaderTrait", trait: m[2]! },
      ],
    };
  }

  // Leader multicolored: your Leader is multicolored
  m = /^your\s+Leader\s+is\s+multicolored$/i.exec(t);
  if (m) {
    return { condition: "leaderMulticolored" };
  }

  // Leader attribute: "your Leader has the (Attribute) attribute"
  m = /^your\s+Leader\s+has\s+the\s+\(([^)]+)\)\s+attribute$/i.exec(t);
  if (m) {
    return { condition: "leaderTrait", trait: m[1]!.toLowerCase() } as any;
  }

  // Leader color: "your Leader's colors include blue/red/..."
  m =
    /^your\s+Leader[''\u2019]s\s+colors?\s+includes?\s+(red|green|blue|purple|black|yellow)$/i.exec(
      t,
    );
  if (m) {
    return { condition: "leaderColor", color: m[1]!.toLowerCase() } as any;
  }

  // "your Leader's type includes "X""
  m = /^your\s+Leader[''\u2019]s\s+type\s+includes?\s+[""\u201c]([^""\u201d]+)[""\u201d]$/i.exec(t);
  if (m) {
    return { condition: "leaderTrait", trait: m[1]! };
  }

  return null;
}
