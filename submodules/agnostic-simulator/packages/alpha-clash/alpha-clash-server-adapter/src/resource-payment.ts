import {
  previewResourceCost,
  type AcCommand,
  type AcResourcePayment,
  type MatchState,
  type PlayerId,
  type ProjectedState,
} from "@tcg/alpha-clash-engine";
import { getCard } from "@tcg/alpha-clash-cards";
import type { InteractionAction, InteractionInput, InteractionOption } from "@tcg/protocol";

const colors = ["white", "blue", "black", "red", "green"] as const;
export function readResourcePayment(value: unknown): AcResourcePayment[] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) throw new Error("Invalid resource payment.");
  return value.map((entry) => {
    if (
      !entry ||
      typeof entry !== "object" ||
      typeof entry.cardId !== "string" ||
      !colors.some((color) => color === entry.color)
    )
      throw new Error("Invalid resource payment.");
    const color = colors.find((color) => color === entry.color)!;
    return { cardId: entry.cardId, color };
  });
}

/** Payment options contain only the acting seat's visible, ready resources. */
export function resourcePaymentInput(
  state: MatchState,
  view: ProjectedState,
  seat: PlayerId,
  action: InteractionAction,
  healthReduction?: number,
): InteractionInput | undefined {
  const [type, cardId] = action.id.split(":");
  if ((type !== "playCard" && type !== "respond") || !cardId) return;
  // Inputs which change the cost need a fresh native quote after their declaration.
  if (action.inputs.some((i) => i.id === "xValue" || i.id === "alternateCostCardIds")) return;
  const target = action.inputs.find((i) => i.id === "targetId");
  const targetId =
    target?.kind === "entity-selection" ? target.candidates[0]?.entity.instanceId : undefined;
  const command: AcCommand = {
    type,
    playerId: seat,
    cardId,
    ...(targetId ? { targetId } : {}),
    ...(healthReduction === undefined ? {} : { healthReduction }),
  };
  const cost = previewResourceCost(state, command);
  if (!cost || cost.total === 0) return;
  const resources = view.cards.filter(
    (card) => card.controller === seat && card.zone === "resource",
  );
  const options: InteractionOption[] = resources.flatMap((card, resourceIndex) => {
    if (
      card.controller !== seat ||
      card.zone !== "resource" ||
      !card.ready ||
      card.faceDown ||
      !card.definitionId
    )
      return [];
    return getCard(card.definitionId).colors.map((color) => ({
      id: JSON.stringify([card.instanceId, color]),
      entity: { kind: "card" as const, instanceId: card.instanceId },
      text: { key: `${card.name ?? "Resource"} (${resourceIndex + 1}) · ${color}` },
      enabled: true,
    }));
  });
  if (options.length < cost.total) return;
  const pips = colors.flatMap((color) =>
    Array.from({ length: cost.pips?.[color] ?? 0 }, () => color),
  );
  const slots = Array.from({ length: cost.total }, (_, index) => {
    const color = pips[index];
    return {
      text: { key: color ? `${color} resource` : "Any resource" },
      color,
      optionIds: options
        .filter((option) => !color || JSON.parse(option.id)[1] === color)
        .map((option) => option.id),
    };
  });
  return {
    kind: "option-selection",
    id: "resourcePayment",
    text: { key: "Assign resources to the cost" },
    required: true,
    min: cost.total,
    max: cost.total,
    options,
    presentation: { kind: "cost-slots", slots },
  };
}

export function paymentFromOptionIds(value: unknown): AcResourcePayment[] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) throw new Error("Invalid resource payment.");
  return readResourcePayment(
    value.map((id) => {
      if (typeof id !== "string") throw new Error("Invalid resource payment.");
      const [cardId, color] = JSON.parse(id);
      return { cardId, color };
    }),
  );
}

/** Quote each bounded health declaration with native cost logic. Existing
 * conditional inputs select the matching payment without shared UI game rules. */
export function healthResourcePaymentInputs(
  state: MatchState,
  view: ProjectedState,
  seat: PlayerId,
  action: InteractionAction,
): InteractionInput[] {
  const amount = action.inputs.find((input) => input.id === "healthReduction");
  if (amount?.kind !== "number" || amount.max === undefined) return [];
  const inputs: InteractionInput[] = [];
  for (let health = amount.min ?? 0; health <= amount.max; health += amount.step ?? 1) {
    const payment = resourcePaymentInput(state, view, seat, action, health);
    if (!payment) continue;
    inputs.push({
      ...payment,
      id: health === 0 ? "resourcePayment" : `healthResourcePayment:${health}`,
      required: false,
      requiredWhen: [{ all: [{ inputId: "healthReduction", value: health }] }],
    });
  }
  return inputs;
}
