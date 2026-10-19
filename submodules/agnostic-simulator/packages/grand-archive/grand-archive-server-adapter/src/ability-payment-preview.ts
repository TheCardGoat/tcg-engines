import type { EntityCandidate, InteractionInput, InteractionSubmissionValue } from "@tcg/protocol";
import type { GrandArchiveAbilityCost } from "@tcg/grand-archive-types";
import type {
  GrandArchiveCommand,
  GrandArchiveCostPreviewStep,
  GrandArchiveReservePaymentSource,
} from "@tcg/grand-archive-engine/simulator";
import { grandArchiveObjectId } from "@tcg/grand-archive-engine/runtime";

type AbilityCommand = Extract<GrandArchiveCommand, { move: "activate-ability" }>;
type Payment = Pick<
  AbilityCommand,
  "reservePayment" | "costSelections" | "costPaymentOrders" | "costOptionIndex" | "payOptionalCost"
>;

function index(value: string): number {
  if (!/^(0|[1-9][0-9]*)$/.test(value) || !Number.isSafeInteger(Number(value)))
    throw new Error("Invalid payment index.");
  return Number(value);
}
function ids(value: InteractionSubmissionValue): string[] {
  if (!Array.isArray(value) || value.some((id) => !id.trim()))
    throw new Error("Payment selections must be identifiers.");
  return value;
}
export function readGrandArchivePaymentDraft(
  values: Readonly<Record<string, InteractionSubmissionValue>>,
): Payment {
  const reserveParts: { start: number; sources: GrandArchiveReservePaymentSource[] }[] = [];
  const costSelections: ReturnType<typeof grandArchiveObjectId>[][] = [];
  const costPaymentOrders: { path: number[]; order: number[] }[] = [];
  let costOptionIndex: number | undefined;
  let payOptionalCost: boolean | undefined;
  for (const [id, value] of Object.entries(values)) {
    if (!id.startsWith("payment:")) continue;
    if (id.startsWith("payment:reserve:")) {
      reserveParts.push({
        start: index(id.slice("payment:reserve:".length)),
        sources: ids(value).map((source) => {
          if (source.startsWith("card:") && source.length > 5)
            return { kind: "card", cardId: grandArchiveObjectId(source.slice(5)) };
          if (source.startsWith("reservable:") && source.length > 11)
            return { kind: "reservable", objectId: grandArchiveObjectId(source.slice(11)) };
          throw new Error("Unknown reserve payment source.");
        }),
      });
    } else if (id.startsWith("payment:selection:")) {
      const position = index(id.slice("payment:selection:".length));
      // Bound array allocation by the number of submitted fields, never an arbitrary client index.
      if (position >= Object.keys(values).length)
        throw new Error("Invalid payment selection position.");
      costSelections[position] = ids(value).map(grandArchiveObjectId);
    } else if (id.startsWith("payment:order:")) {
      const path = id.slice("payment:order:".length);
      costPaymentOrders.push({
        path: path ? path.split(".").map(index) : [],
        order: ids(value).map(index),
      });
    } else if (id === "payment:option") {
      const selected = ids(value);
      if (selected.length !== 1) throw new Error("Choose one alternative cost.");
      costOptionIndex = index(selected[0]!);
    } else if (id === "payment:optional") {
      if (typeof value !== "boolean") throw new Error("Choose whether to pay the optional cost.");
      payOptionalCost = value;
    } else throw new Error("Unknown payment input.");
  }
  const reservePayment: GrandArchiveReservePaymentSource[] = [];
  for (const part of reserveParts.sort((a, b) => a.start - b.start)) {
    if (part.start !== reservePayment.length)
      throw new Error("Reserve payment steps must be consecutive.");
    reservePayment.push(...part.sources);
  }
  return {
    ...(reserveParts.length ? { reservePayment } : {}),
    ...(costSelections.length ? { costSelections } : {}),
    ...(costPaymentOrders.length ? { costPaymentOrders } : {}),
    ...(costOptionIndex !== undefined ? { costOptionIndex } : {}),
    ...(payOptionalCost !== undefined ? { payOptionalCost } : {}),
  };
}

function costText(cost: GrandArchiveAbilityCost): string {
  switch (cost.kind) {
    case "all":
      return cost.costs.map(costText).join("; ");
    case "one-of":
      return `Choose: ${cost.costs.map(costText).join(" or ")}`;
    case "optional":
      return `Optional: ${costText(cost.cost)}`;
    case "pay-reserve":
      return `Pay ${typeof cost.amount === "number" ? cost.amount : "the declared"} reserve`;
    case "pay-memory":
      return `Pay ${typeof cost.amount === "number" ? cost.amount : "the declared"} memory`;
    case "rest":
    case "select-and-rest":
      return "Rest";
    case "wake":
      return "Wake up";
    case "sacrifice":
    case "select-and-sacrifice":
      return "Sacrifice";
    case "banish-self":
      return "Banish this card";
    case "discard-self":
      return "Discard this card";
    case "move-self":
    case "select-and-move":
      return `Move from ${cost.from.replaceAll("-", " ")} to ${cost.to.replaceAll("-", " ")}`;
    case "add-counter":
      return "Add counters";
    case "remove-counter":
    case "select-and-remove-counters":
      return "Remove counters";
    case "recover":
      return "Recover damage";
    case "take-damage":
      return "Take damage";
    case "select-and-reveal":
    case "reveal":
      return "Reveal cards";
    case "delevel-champion":
      return "Delevel your champion";
  }
}

export function grandArchivePaymentInputs(
  steps: readonly GrandArchiveCostPreviewStep[],
  candidates: ReadonlyMap<string, EntityCandidate>,
): InteractionInput[] {
  const candidate = (id: string) => {
    const result = candidates.get(id);
    if (!result) throw new Error("This payment needs a private selection context.");
    return result;
  };
  return steps.map((step): InteractionInput => {
    const base = { id: step.id, required: true };
    switch (step.kind) {
      case "reserve-payment": {
        if (step.amount > step.candidates.length)
          throw new Error("There are not enough reserve payment sources.");
        return {
          ...base,
          kind: "option-selection",
          text: { key: `Pay ${step.amount} reserve.` },
          min: step.amount,
          max: step.amount,
          options: step.candidates.map((source) => {
            const id = source.kind === "card" ? source.cardId : source.objectId;
            const view = candidate(id);
            return {
              id: `${source.kind}:${id}`,
              entity: view.entity,
              text: view.text ?? { key: "Payment card" },
              enabled: true,
            };
          }),
        };
      }
      case "cost-selection": {
        if (step.allowRepeated && (step.maximum === undefined || step.maximum > 1))
          throw new Error("Counter payment needs a repeated-selection form.");
        const eligible = step.candidateIds.map(candidate);
        const maximum = Math.min(step.maximum ?? eligible.length, eligible.length);
        if (step.minimum > maximum)
          throw new Error("There are not enough eligible payment objects.");
        return {
          ...base,
          kind: "entity-selection",
          role: "cost",
          text: { key: costText(step.cost) },
          required: step.minimum > 0,
          min: step.minimum,
          max: maximum,
          ordered: false,
          entityKinds: ["card"],
          candidates: eligible,
        };
      }
      case "cost-order":
        return {
          ...base,
          kind: "ordering",
          text: { key: "Choose the cost payment order." },
          entityKind: "resource",
          min: step.costs.length,
          max: step.costs.length,
          candidates: step.costs.map((cost, i) => ({
            entity: { kind: "resource", instanceId: String(i) },
            text: { key: `${i + 1}. ${costText(cost)}` },
            enabled: true,
          })),
        };
      case "cost-option":
        return {
          ...base,
          kind: "option-selection",
          text: { key: "Choose a cost." },
          min: 1,
          max: 1,
          options: step.costs.map((cost, i) => ({
            id: String(i),
            text: { key: costText(cost) },
            enabled: true,
          })),
        };
      case "optional-cost":
        return {
          ...base,
          kind: "boolean",
          text: { key: `Pay the optional cost: ${costText(step.cost)}?` },
          trueText: { key: "Pay" },
          falseText: { key: "Decline" },
        };
    }
  });
}
