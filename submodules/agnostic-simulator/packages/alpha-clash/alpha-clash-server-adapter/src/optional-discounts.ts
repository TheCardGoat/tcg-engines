import { optionalSelfCostReductionCountLimit } from "@tcg/alpha-clash-engine";
import type { AcCardDefinition } from "@tcg/alpha-clash-types";
import type { AcCommand, MatchState, PlayerId, ProjectedState } from "@tcg/alpha-clash-engine";
import type { InteractionAction, InteractionInput, InteractionSubmission } from "@tcg/protocol";
import { resourcePaymentInput } from "./resource-payment";

type Declaration = Pick<
  Extract<AcCommand, { type: "respond" }>,
  "declineSelfCostReduction" | "declinedConditionalDiscounts" | "selfCostReductionCount"
>;

/** The route is validated against the projected options before translation. */
export function optionalDiscountDeclaration(route: string): Declaration {
  if (route === "all") return { declineSelfCostReduction: false };
  if (route === "none") return { declineSelfCostReduction: true };
  if (/^count:\d+$/.test(route)) return { selfCostReductionCount: Number(route.slice(6)) };
  if (!/^skip:\d+(,\d+)*$/.test(route)) throw new Error("Invalid optional reduction route.");
  return {
    declineSelfCostReduction: false,
    declinedConditionalDiscounts: route.slice(5).split(",").map(Number),
  };
}

export function optionalDiscountRoute(values: InteractionSubmission["values"]): string | undefined {
  const value = values.optionalDiscounts;
  if (value === undefined) return;
  if (!Array.isArray(value) || value.length !== 1 || typeof value[0] !== "string")
    throw new Error("Choose one optional reduction route.");
  return value[0];
}

export function optionalDiscountInput(definition: AcCardDefinition): InteractionInput | undefined {
  const discount = "selfCostReduction" in definition ? definition.selfCostReduction : undefined;
  if (!discount?.optional) return;
  const options = [
    { id: "all", text: { key: "Apply all eligible reductions" }, enabled: true },
    { id: "none", text: { key: "Decline all optional reductions" }, enabled: true },
  ];
  const independent = discount.conditionalPips ?? [];
  let subsets: number[][] = [[]];
  for (const index of independent.keys())
    subsets = subsets.flatMap((indices) => [indices, [...indices, index]]);
  for (const skipped of subsets) {
    if (
      !skipped.length ||
      (skipped.length === independent.length && !discount.pips && !discount.amount)
    )
      continue;
    const applied = independent.filter((_, index) => !skipped.includes(index));
    const labels = applied.map((entry) => {
      const amount = Object.entries(entry.pips)
        .map(([color, count]) => `${count} ${color}`)
        .join(" and ");
      const condition = entry.condition;
      const selector =
        condition.type === "cardCount" && condition.target.type === "card"
          ? condition.target
          : undefined;
      const kind = selector?.subtypes?.[0] ?? selector?.cardTypes?.[0];
      return kind
        ? `${amount} for controlling a ${kind === "clashground" ? "Clashground" : kind === "trap" ? "Trap" : kind}`
        : amount;
    });
    options.push({
      id: `skip:${skipped.join(",")}`,
      text: { key: `Apply ${labels.join(" and ") || "base"} reduction only when eligible` },
      enabled: true,
    });
  }
  return {
    kind: "option-selection",
    id: "optionalDiscounts",
    text: { key: "Optional cost reductions" },
    required: false,
    min: 1,
    max: 1,
    options,
  };
}

/** Native counts keep partial per-card choices aligned with declaration validation. */
export function withOptionalDiscountCounts(
  state: MatchState,
  seat: PlayerId,
  action: InteractionAction,
): InteractionAction {
  const sourceId = action.source?.instanceId;
  const limit = sourceId ? optionalSelfCostReductionCountLimit(state, seat, sourceId) : undefined;
  if (limit === undefined) return action;
  return {
    ...action,
    inputs: action.inputs.map((input) =>
      input.id === "optionalDiscounts" && input.kind === "option-selection"
        ? {
            ...input,
            options: [
              ...input.options,
              ...Array.from({ length: Math.max(0, limit - 1) }, (_, i) => ({
                id: `count:${i + 1}`,
                text: { key: `Apply ${i + 1} optional reduction${i ? "s" : ""}` },
                enabled: true,
              })),
            ],
          }
        : input,
    ),
  };
}

export function optionalDiscountPaymentInputs(
  state: MatchState,
  view: ProjectedState,
  seat: PlayerId,
  action: InteractionAction,
): InteractionInput[] {
  const input = action.inputs.find((i) => i.id === "optionalDiscounts");
  if (input?.kind !== "option-selection") return [];
  return input.options.flatMap((option) => {
    const payment = resourcePaymentInput(
      state,
      view,
      seat,
      action,
      optionalDiscountDeclaration(option.id),
    );
    return payment
      ? [
          {
            ...payment,
            id: option.id === "all" ? "resourcePayment" : `discountResourcePayment:${option.id}`,
            required: false,
            requiredWhen: [{ all: [{ inputId: "optionalDiscounts", value: [option.id] }] }],
          },
        ]
      : [];
  });
}
