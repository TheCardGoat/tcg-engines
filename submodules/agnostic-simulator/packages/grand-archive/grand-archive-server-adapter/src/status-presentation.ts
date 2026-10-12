import type {
  GrandArchiveActivationState,
  GrandArchiveObjectState,
} from "@tcg/grand-archive-types";
import type { SimulatorEntityDecoration } from "@tcg/simulator-contract";

const LABELS = {
  awake: "Awake",
  rested: "Rested",
  attacking: "Attacking",
  defending: "Defending",
  retaliating: "Retaliating",
  damaged: "Damaged",
  intercepting: "Intercepting",
  distant: "Distant",
  fostered: "Fostered",
  loaded: "Loaded",
  brewed: "Brewed",
  imbued: "Imbued",
  prepared: "Prepared",
  preserved: "Preserved",
  ephemeral: "Ephemeral",
  wielded: "Wielded",
  empowered: "Empowered",
  copy: "Copy",
  negated: "Negated",
  starcalled: "Starcalled",
  "entered-from-banishment": "Entered from banishment",
} satisfies Record<GrandArchiveObjectState | GrandArchiveActivationState, string>;

/** CR Properties and States: object and activation properties remain separate. */
export function grandArchiveStatusDecorations(
  states: readonly GrandArchiveObjectState[],
  activationStates: readonly GrandArchiveActivationState[],
  keywords: readonly { readonly name: string; readonly value?: string | number }[] = [],
): SimulatorEntityDecoration[] {
  return [
    ...[
      ...new Map(
        keywords.map((keyword) => [`${keyword.name}:${keyword.value ?? ""}`, keyword]),
      ).values(),
    ].map((keyword) => {
      const label = `${keyword.name.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())}${keyword.value === undefined ? "" : ` ${keyword.value}`}`;
      return {
        id: `ga:keyword:${keyword.name}:${keyword.value ?? ""}`,
        slot: "top-start" as const,
        content: { kind: "text" as const, text: label },
        ariaLabel: `Active keyword: ${label}`,
        tone: "neutral" as const,
      };
    }),
    // Orientation already has a contract state and card rotation. Avoid an Awake badge on every card.
    ...states
      .filter((state) => state !== "awake" && state !== "rested")
      .map((state) => ({
        id: `ga:state:${state}`,
        slot: "top-start" as const,
        content: { kind: "text" as const, text: LABELS[state] },
        ariaLabel: `Object state: ${LABELS[state]}`,
        tone: "neutral" as const,
      })),
    ...[...new Set(activationStates)].map((state) => ({
      id: `ga:activation:${state}`,
      slot: "top-start" as const,
      content: { kind: "text" as const, text: LABELS[state] },
      ariaLabel: `Activation state: ${LABELS[state]}`,
      tone: state === "negated" ? ("negative" as const) : ("neutral" as const),
    })),
  ];
}
