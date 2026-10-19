import { playActionCommand, type PlayDeclaration } from "./play-action-command";
import {
  previewResourceCost,
  resourceColors,
  type AcResourcePayment,
  type MatchState,
  type PlayerId,
  type ProjectedState,
} from "@tcg/alpha-clash-engine";
import type { InteractionAction, InteractionInput, InteractionOption } from "@tcg/protocol";

const colors = ["white", "blue", "black", "red", "green"] as const;
const paymentColors = [...colors, "colorless"] as const;

/** Native resource types, including colorless without treating it as a card color. */
export function resourcePaymentColors(
  state: MatchState,
  cardId: string,
): readonly AcResourcePayment["color"][] {
  const available = resourceColors(state, state.cards[cardId]);
  return available.length ? available : ["colorless"];
}
export function readResourcePayment(value: unknown): AcResourcePayment[] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) throw new Error("Invalid resource payment.");
  return value.map((entry) => {
    if (
      !entry ||
      typeof entry !== "object" ||
      typeof entry.cardId !== "string" ||
      !paymentColors.some((color) => color === entry.color)
    )
      throw new Error("Invalid resource payment.");
    const color = paymentColors.find((color) => color === entry.color)!;
    return { cardId: entry.cardId, color };
  });
}

/** Variable costs cannot use fixed slot counts before X and other choices are
 * declared. Offer an explicit resource selection; native payment validation
 * checks the final count and colors. Omission preserves automatic payment. */
export function withVariableResourcePayment(
  action: InteractionAction,
  state: MatchState,
  view: ProjectedState,
  seat: PlayerId,
): InteractionAction {
  if (!playActionCommand(action, seat) || !action.inputs.some((input) => input.id === "xValue"))
    return action;
  const resources = view.cards.filter(
    (card) => card.controller === seat && card.zone === "resource" && card.ready,
  );
  if (!resources.length) return action;
  return {
    ...action,
    inputs: [
      ...action.inputs,
      {
        kind: "option-selection",
        id: "xResourcePayment",
        text: { key: "Choose resources for the declared cost, or skip to pay automatically" },
        required: false,
        min: 0,
        max: resources.length,
        options: resources.flatMap((card, index) =>
          resourcePaymentColors(state, card.instanceId).map((color) => ({
            id: JSON.stringify([card.instanceId, color]),
            entity: { kind: "card", instanceId: card.instanceId },
            text: { key: `${card.name ?? "Resource"} (${index + 1}) · ${color}` },
            enabled: true,
          })),
        ),
      },
    ],
  };
}

/** Payment options contain only the acting seat's visible, ready resources. */
export function resourcePaymentInput(
  state: MatchState,
  view: ProjectedState,
  seat: PlayerId,
  action: InteractionAction,
  declarations: PlayDeclaration = {},
): InteractionInput | undefined {
  const choiceId = action.id.startsWith("resolveChoice:")
    ? action.id.slice("resolveChoice:".length)
    : undefined;
  const choice = choiceId
    ? state.pendingChoices.find((candidate) => candidate.id === choiceId)
    : undefined;
  const paidChoice = choice?.kind === "option" && choice.cost?.kind === "resources";
  if (!paidChoice && !playActionCommand(action, seat)) return;
  // Inputs which change the cost need a fresh native quote after their declaration.
  if (action.inputs.some((i) => i.id === "xValue" || i.id === "alternateCostCardIds")) return;
  const target = action.inputs.find((i) => i.id === "targetId");
  const targetId =
    target?.kind === "entity-selection" ? target.candidates[0]?.entity.instanceId : undefined;
  // Fixed multi-target declarations must be present for the native quote to
  // validate the play, even when those targets do not change its cost.
  const targetIds = action.inputs
    .filter((input) => input.id === "targetIds" || /^targetIds:\d+$/.test(input.id))
    .sort((a, b) => Number(a.id.split(":")[1] ?? 1) - Number(b.id.split(":")[1] ?? 1))
    .flatMap((input) =>
      input.kind === "entity-selection"
        ? input.candidates
            .filter((candidate) => candidate.enabled !== false)
            .slice(0, input.min ?? 1)
            .flatMap((candidate) =>
              candidate.entity.instanceId ? [candidate.entity.instanceId] : [],
            )
        : [],
    );
  const command = paidChoice
    ? { type: "resolveChoice" as const, playerId: seat, choiceId: choice.id, optionId: "yes" }
    : playActionCommand(action, seat, {
        ...(targetId ? { targetId } : {}),
        ...(targetIds.length ? { targetIds } : {}),
        ...declarations,
      });
  if (!command) return;
  const cost = previewResourceCost(state, command);
  if (!cost || cost.total === 0) return;
  const resources = view.cards.filter(
    (card) => card.controller === seat && card.zone === "resource",
  );
  const options: InteractionOption[] = resources.flatMap((card, resourceIndex) => {
    if (card.controller !== seat || card.zone !== "resource" || !card.ready) return [];
    return resourcePaymentColors(state, card.instanceId).map((color) => ({
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
    ...(paidChoice
      ? { required: false, requiredWhen: [{ all: [{ inputId: "confirm", value: true }] }] }
      : { required: true }),
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
    const payment = resourcePaymentInput(state, view, seat, action, { healthReduction: health });
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
