import { getCard } from "@tcg/alpha-clash-cards";
import { paymentFromOptionIds } from "./resource-payment";
import type { PlayerId, ProjectedState } from "@tcg/alpha-clash-engine";
import type { AcCardDefinition, AcTarget } from "@tcg/alpha-clash-types";
import type {
  EntityCandidate,
  InteractionAction,
  InteractionInput,
  InteractionSubmissionValue,
} from "@tcg/protocol";

type Values = Readonly<Record<string, InteractionSubmissionValue>>;
const selected = (values: Values, key: string): string[] => {
  const value = values[key];
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
};

/** Route selection precedes payments; the shared draft clears them on change. */
export function costRouteInputs(
  definition: AcCardDefinition,
  view: ProjectedState,
  seat: "player-one" | "player-two",
  sourceId: string,
  candidatesFor: (target: AcTarget) => EntityCandidate[],
): InteractionInput[] {
  const alternate = definition.cardType === "clash" ? definition.alternateCost : undefined;
  const discard = "additionalDiscard" in definition ? (definition.additionalDiscard ?? 0) : 0;
  const activationDiscard =
    "activationDiscard" in definition ? definition.activationDiscard : undefined;
  const send = "additionalSend" in definition ? definition.additionalSend : undefined;
  const discount =
    "discardCostReduction" in definition ? definition.discardCostReduction : undefined;
  if (!alternate && !discard && !activationDiscard && !send && !discount) return [];
  const hand = view.cards
    .filter((c) => c.controller === seat && c.zone === "hand" && c.instanceId !== sourceId)
    .map((c) => ({ entity: { kind: "card" as const, instanceId: c.instanceId }, enabled: true }));
  const when = (route: string) => [{ all: [{ inputId: "costRoute", value: [route] }] }];
  const alternateAvailable =
    alternate?.payments.every((p) => candidatesFor(p.target).length >= p.amount) ?? false;
  const normal =
    discard || activationDiscard || send
      ? "Required additional cost + resources"
      : "Normal resource cost";
  const inputs: InteractionInput[] = [
    {
      kind: "option-selection",
      id: "costRoute",
      text: { key: "Choose a cost route" },
      required: true,
      min: 1,
      max: 1,
      options: [
        { id: "normal", text: { key: normal }, enabled: true },
        ...(alternate
          ? [
              {
                id: "alternative",
                text: { key: `Alternative: ${alternate.text}` },
                enabled: alternateAvailable,
              },
            ]
          : []),
        ...(discount
          ? [
              {
                id: "additional",
                text: {
                  key: `Additional: discard ${discount.amount} to reduce the resource cost by ${discount.reduction}`,
                },
                enabled: hand.length >= discard + discount.amount,
              },
            ]
          : []),
      ],
    },
  ];
  const slot = (
    id: string,
    label: string,
    amount: number,
    candidates: EntityCandidate[],
    route?: string,
  ): InteractionInput => ({
    kind: "entity-selection",
    id,
    text: { key: label },
    role: "cost",
    entityKinds: ["card"],
    required: !route,
    ...(route ? { requiredWhen: when(route) } : {}),
    min: amount,
    max: amount,
    ordered: false,
    candidates,
  });
  if (alternateAvailable)
    alternate?.payments.forEach((payment, index) =>
      inputs.push(
        slot(
          `alternatePayment:${index}`,
          `Alternative payment ${index + 1}: ${payment.amount} card(s) to ${payment.destination === "hand" ? "hand" : "Oblivion"}`,
          payment.amount,
          candidatesFor(payment.target),
          "alternative",
        ),
      ),
    );
  if (discard)
    inputs.push(slot("discardCostIds", `Discard ${discard} as an additional cost`, discard, hand));
  if (activationDiscard) {
    const candidates = hand.filter((candidate) => {
      const card = view.cards.find((entry) => entry.instanceId === candidate.entity.instanceId);
      return (
        card?.definitionId &&
        (!activationDiscard.cardTypes ||
          activationDiscard.cardTypes.includes(getCard(card.definitionId).cardType))
      );
    });
    inputs.push(
      slot(
        "activationDiscardIds",
        `Discard ${activationDiscard.amount} as an activation cost`,
        activationDiscard.amount,
        candidates,
      ),
    );
  }
  if (send)
    inputs.push(
      slot(
        "sendCostCardIds",
        `Send ${send.amount} to Oblivion as an additional cost`,
        send.amount,
        candidatesFor(send.target),
      ),
    );
  if (discount && hand.length >= discard + discount.amount)
    inputs.push(
      slot(
        "discountDiscardIds",
        `Discard ${discount.amount} for the cost reduction`,
        discount.amount,
        hand,
        "additional",
      ),
    );
  return inputs;
}

/**
 * Route-scoped resource slots for the engine view seam. The shared plain
 * `resourcePaymentInput` quote would be wrong for route cards: the alternative
 * route waives the cost and the additional route reduces it, and neither is
 * known until the route input is staged. Slots come from the printed cost
 * (colored pips first, then any), so trimming from the end reduces the generic
 * portion exactly like the engine's final-cost computation.
 */
export function routeResourceInputs(
  view: ProjectedState,
  seat: PlayerId,
  action: InteractionAction,
): InteractionInput[] {
  const sourceId = action.source?.instanceId;
  const live = sourceId ? view.cards.find((card) => card.instanceId === sourceId) : undefined;
  const definition = live?.definitionId ? getCard(live.definitionId) : undefined;
  // AcCardDefinition does not type its printed cost yet; the adapter's costLabel
  // reads it through the same structural shape.
  const cost = (
    definition as
      | { cost?: { total: number; pips?: Partial<Record<string, number>>; x?: boolean } }
      | undefined
  )?.cost;
  if (!definition || !cost || cost.x || cost.total <= 0) return [];
  const resources = view.cards.filter(
    (card) =>
      card.controller === seat && card.zone === "resource" && card.ready && card.definitionId,
  );
  const options = resources.flatMap((card) =>
    getCard(card.definitionId!).colors.map((color) => ({
      id: JSON.stringify([card.instanceId, color]),
      entity: { kind: "card" as const, instanceId: card.instanceId },
      text: { key: `${card.name ?? "Resource"} · ${color}` },
      enabled: true,
    })),
  );
  if (options.length < cost.total) return [];
  const palette = ["white", "blue", "black", "red", "green"] as const;
  const pips = palette.flatMap((color) =>
    Array.from({ length: cost.pips?.[color] ?? 0 }, () => color),
  );
  const when = (route: string) => [{ all: [{ inputId: "costRoute", value: [route] }] }];
  const build = (total: number, id: string, route: string): InteractionInput => ({
    kind: "option-selection",
    id,
    text: { key: "Assign resources to the cost" },
    // Route-scoped: omitted (and skipped by validation) unless this route is
    // the staged one; requiredWhen then makes it mandatory.
    required: false,
    min: total,
    max: total,
    options,
    requiredWhen: when(route),
    presentation: {
      kind: "cost-slots",
      slots: Array.from({ length: total }, (_, index) => {
        const color = pips[index];
        return {
          text: { key: color ? `${color} resource` : "Any resource" },
          color,
          optionIds: options
            .filter((option) => !color || JSON.parse(option.id)[1] === color)
            .map((option) => option.id),
        };
      }),
    },
  });
  const inputs: InteractionInput[] = [build(cost.total, "costResources", "normal")];
  const reduction =
    "discardCostReduction" in definition ? (definition.discardCostReduction?.reduction ?? 0) : 0;
  const reduced = cost.total - reduction;
  if (reduction > 0 && reduced > 0) {
    inputs.push(build(reduced, "discountResources", "additional"));
  }
  return inputs;
}

export function costRoutePayload(values: Values): Record<string, unknown> {
  if (!values.costRoute) return {};
  const route = selected(values, "costRoute")[0];
  const payload: Record<string, unknown> = {};
  if (route === "alternative")
    payload.alternateCostCardIds = Object.keys(values)
      .filter((key) => key.startsWith("alternatePayment:"))
      .flatMap((key) => selected(values, key));
  payload.discardCostIds = [
    ...selected(values, "discardCostIds"),
    ...selected(values, "activationDiscardIds"),
    ...(route === "additional" ? selected(values, "discountDiscardIds") : []),
  ];
  payload.sendCostCardIds = selected(values, "sendCostCardIds");
  if (route === "alternative") {
    // The waived cost is declared with an empty payment; never fall back to
    // automatic payment for it.
    payload.resourcePayment = [];
  } else {
    const payment = paymentFromOptionIds(
      selected(values, route === "additional" ? "discountResources" : "costResources"),
    );
    if (payment) payload.resourcePayment = payment;
  }
  return payload;
}
