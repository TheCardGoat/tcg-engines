import { playActionCommand } from "./play-action-command";
import {
  previewResourceCost,
  getDefinition,
  type MatchState,
  type PlayerId,
  type ProjectedState,
} from "@tcg/alpha-clash-engine";
import type { InteractionAction, InteractionInput, InteractionSubmission } from "@tcg/protocol";
import { resourcePaymentInput } from "./resource-payment";

export function sacrificeRoute(values: InteractionSubmission["values"]): string | undefined {
  const value = values.sacrificeRoute;
  if (value === undefined) return;
  if (!Array.isArray(value) || value.length !== 1 || typeof value[0] !== "string")
    throw new Error("Choose one sacrifice payment.");
  return value[0];
}
export function sacrificeDeclaration(
  values: InteractionSubmission["values"],
): string[] | undefined {
  const route = sacrificeRoute(values);
  if (route === undefined) return;
  if (route === "none") return [];
  if (route.startsWith("card:")) return [route.slice(5)];
  if (!/^count:[1-9]\d*$/.test(route)) throw new Error("Invalid sacrifice payment.");
  const ids = values[`sacrificeCards:${route}`];
  if (
    !Array.isArray(ids) ||
    !ids.every((id): id is string => typeof id === "string") ||
    ids.length !== Number(route.slice(6)) ||
    new Set(ids).size !== ids.length
  )
    throw new Error("Select the declared number of distinct Clash cards.");
  return ids;
}

/** Fixed per-card reductions use one quote per count, followed by an ordinary
 * card selection. Single-card pip reductions require one quote per candidate.
 * Neither path enumerates pairs of tokens on a large board. */
export function withSacrificeReductions(
  action: InteractionAction,
  state: MatchState,
  view: ProjectedState,
  seat: PlayerId,
): InteractionAction {
  const cardId = action.source?.instanceId;
  if (!cardId || !playActionCommand(action, seat)) return action;
  const definition = getDefinition(state, cardId);
  const discount =
    "sacrificeCostReduction" in definition ? definition.sacrificeCostReduction : undefined;
  if (!discount) return action;
  const target = action.inputs.find((i) => i.id === "targetId");
  const targetId =
    target?.kind === "entity-selection" ? target.candidates[0]?.entity.instanceId : undefined;
  const quote = (ids: string[]) =>
    previewResourceCost(
      state,
      playActionCommand(action, seat, {
        targetId,
        costReductionSacrificeIds: ids,
      })!,
    );
  const candidates = view.cards.filter(
    (c) =>
      c.controller === seat &&
      c.zone === "clash" &&
      !c.faceDown &&
      c.definitionId &&
      quote([c.instanceId]),
  );
  const routes = [{ id: "none", label: "Pay without sending cards", ids: [] as string[] }];
  if (typeof discount.perCard === "number") {
    for (let count = 1; count <= Math.min(discount.max, candidates.length); count++)
      routes.push({
        id: `count:${count}`,
        label: `Send ${count} Clash ${count === 1 ? "card" : "cards"} to Oblivion`,
        ids: candidates.slice(0, count).map((c) => c.instanceId),
      });
  } else {
    for (const [index, card] of candidates.entries())
      routes.push({
        id: `card:${card.instanceId}`,
        label: `Send ${card.name} (${index + 1}) to Oblivion`,
        ids: [card.instanceId],
      });
  }
  const inputs: InteractionInput[] = [];
  for (const route of routes) {
    const requiredWhen = [{ all: [{ inputId: "sacrificeRoute", value: [route.id] }] }];
    if (route.id.startsWith("count:"))
      inputs.push({
        kind: "entity-selection",
        role: "cost",
        id: `sacrificeCards:${route.id}`,
        text: { key: "Choose Clash cards to send" },
        required: false,
        requiredWhen,
        entityKinds: ["card"],
        min: route.ids.length,
        max: route.ids.length,
        ordered: false,
        candidates: candidates.map((c, index) => ({
          entity: { kind: "card", instanceId: c.instanceId },
          text: { key: `${c.name} (${index + 1})` },
          enabled: true,
        })),
      });
    const payment = resourcePaymentInput(state, view, seat, action, {
      costReductionSacrificeIds: route.ids,
    });
    if (payment)
      inputs.push({
        ...payment,
        id: route.id === "none" ? "resourcePayment" : `sacrificeResourcePayment:${route.id}`,
        required: false,
        requiredWhen,
      });
  }
  return {
    ...action,
    inputs: [
      ...action.inputs,
      {
        kind: "option-selection",
        id: "sacrificeRoute",
        text: { key: "Choose sacrifice payment" },
        required: false,
        min: 1,
        max: 1,
        options: routes.map((r) => ({ id: r.id, text: { key: r.label }, enabled: true })),
      },
      ...inputs,
    ],
  };
}
