import type { GrandArchiveCounterKind } from "@tcg/grand-archive-types";
import type { SimulatorEntityDecoration } from "@tcg/simulator-contract";

type NamedKind = Extract<GrandArchiveCounterKind, string> | "temporary-damage" | "damage-counters";
const COUNTERS = {
  damage: ["Damage", "Damage already marked."],
  "temporary-damage": ["Temporary damage", "Damage dealt to an ally. Clears during the end phase."],
  "damage-counters": [
    "Damage counters",
    "These counters have no inherent effect on a non-champion.",
  ],
  buff: ["Buff", "Each counter gives +1 power and +1 life to stats this object has."],
  debuff: ["Debuff", "Each counter gives −1 power and −1 life to stats this object has."],
  bulwark: [
    "Bulwark",
    "Prevents a combat-damage instance unless unpreventable; consumes one counter either way.",
  ],
  durability: ["Durability", "Current durability counters; may exceed the printed starting value."],
  enlighten: ["Enlighten", "Remove three counters to draw a card."],
  level: ["Level counters", "Each counter gives a champion +1 level."],
  omen: ["Omen", "A card with an omen counter in banishment is an Omen."],
  preparation: [
    "Preparation",
    "May be paid as an additional cost when activating a card with Prepare; distinct from the Prepared state.",
  ],
  static: [
    "Static",
    "May be removed for its damage trigger when an arcane unit deals combat damage.",
  ],
  wither: [
    "Wither",
    "At the beginning of its controller’s main phase, pay one reserve per counter or sacrifice this object.",
  ],
} as const satisfies Record<NamedKind, readonly [string, string]>;

function isKnownCounter(kind: string): kind is NamedKind {
  return Object.hasOwn(COUNTERS, kind);
}

/** Permanent counters and temporary damage are separate rules properties. */
export function grandArchiveCounterDecorations(input: {
  readonly damage: number;
  readonly temporaryDamage: number;
  readonly counters: Readonly<Record<string, number>>;
  readonly damageLifetime?: "champion" | "ally";
}): SimulatorEntityDecoration[] {
  const entries: [string, number][] = [
    ...(input.damage > 0
      ? [
          [
            input.damageLifetime === "champion" ? "damage" : "damage-counters",
            input.damage,
          ] satisfies [string, number],
        ]
      : []),
    ...(input.temporaryDamage > 0
      ? [["temporary-damage", input.temporaryDamage] satisfies [string, number]]
      : []),
    ...Object.entries(input.counters)
      .filter(
        ([kind, value]) =>
          kind !== "damage" && (value > 0 || (kind === "durability" && value === 0)),
      )
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)),
  ];
  return entries.map(([kind, value]) => {
    const [label, explanation] = isKnownCounter(kind)
      ? COUNTERS[kind]
      : [kind.replace(/^named:/, ""), "Card-defined counter."];
    const lifetime =
      kind === "damage" || kind === "damage-counters"
        ? " Persists until removed by an effect."
        : "";
    return {
      id: `ga:counter:${kind}`,
      slot: "bottom-end",
      content: { kind: "text", text: String(value) },
      ariaLabel: `${label}: ${value}. ${explanation}${lifetime}`,
      tone:
        kind === "damage" || kind === "temporary-damage" || kind === "debuff"
          ? "negative"
          : "neutral",
    };
  });
}

/** Shared detail surfaces retain a numeric readout without parsing accessible prose. */
export function grandArchiveCounterStats(decorations: readonly SimulatorEntityDecoration[]) {
  return decorations.flatMap((counter) => {
    if (counter.content.kind !== "text") return [];
    const kind = counter.id.slice("ga:counter:".length);
    return [
      {
        label: isKnownCounter(kind) ? COUNTERS[kind][0] : kind.replace(/^named:/, ""),
        value: counter.content.text,
      },
    ];
  });
}
