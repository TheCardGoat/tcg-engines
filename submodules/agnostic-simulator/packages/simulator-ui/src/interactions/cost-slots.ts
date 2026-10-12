import type { OptionSelectionInput } from "@tcg/protocol";

type CostSlotsPresentation = Extract<
  NonNullable<OptionSelectionInput["presentation"]>,
  { kind: "cost-slots" }
>;

function asCostSlots(input: OptionSelectionInput): CostSlotsPresentation | undefined {
  const presentation = input.presentation;
  return presentation?.kind === "cost-slots" ? presentation : undefined;
}

/** Positional slot values padded to the slot count; unfilled slots are "". */
export function normalizeCostSlotValue(
  input: OptionSelectionInput,
  value: readonly string[] | undefined,
): string[] {
  const presentation = asCostSlots(input);
  if (!presentation) return [];
  return presentation.slots.map((_, index) =>
    typeof value?.[index] === "string" ? value[index]! : "",
  );
}

function optionEntity(input: OptionSelectionInput, optionId: string): string | undefined {
  return input.options.find((option) => option.id === optionId)?.entity?.instanceId;
}

/** Entities already engaged by the current draft; each resource pays at most one slot. */
export function assignedCostEntities(
  input: OptionSelectionInput,
  value: readonly string[] | undefined,
): Set<string> {
  const used = new Set<string>();
  for (const optionId of normalizeCostSlotValue(input, value)) {
    if (!optionId) continue;
    const entity = optionEntity(input, optionId);
    if (entity) used.add(entity);
  }
  return used;
}

function slotOptionsForEntity(
  input: OptionSelectionInput,
  slotIndex: number,
  entityId: string,
): string[] {
  const presentation = asCostSlots(input);
  if (!presentation) return [];
  return presentation.slots[slotIndex]!.optionIds.filter(
    (optionId) => optionEntity(input, optionId) === entityId,
  );
}

/**
 * Best (slotIndex, optionId) when one board-picked resource joins a draft.
 * Fails when the resource is already engaged or fits no unfilled slot. Colored
 * slots win over generic ones, so colored pips are paid by their color first.
 */
export function bestOptionForEntity(
  input: OptionSelectionInput,
  entityId: string,
  value: readonly string[] | undefined,
): { slotIndex: number; optionId: string } | undefined {
  const presentation = asCostSlots(input);
  if (!presentation) return undefined;
  const assigned = normalizeCostSlotValue(input, value);
  if (assignedCostEntities(input, value).has(entityId)) return undefined;
  const eligible = presentation.slots
    .map((slot, slotIndex) =>
      assigned[slotIndex]
        ? undefined
        : { slot, slotIndex, options: slotOptionsForEntity(input, slotIndex, entityId) },
    )
    .filter(
      (
        entry,
      ): entry is {
        slot: (typeof presentation.slots)[number];
        slotIndex: number;
        options: string[];
      } => Boolean(entry?.options.length),
    );
  const colored = eligible.find(({ slot }) => slot.color);
  if (colored) return { slotIndex: colored.slotIndex, optionId: colored.options[0]! };
  const generic = eligible[0];
  if (!generic) return undefined;
  return { slotIndex: generic.slotIndex, optionId: generic.options[0]! };
}

/**
 * Fill every unfilled slot of a cost-slots draft, keeping any resource the
 * player already picked. Unfilled slots with the fewest legal resources are
 * filled first, and each takes the option whose resource is least flexible
 * elsewhere, so monicolor sources cover their pip and flexible multicolor
 * sources stay ready. Returns the completed values, or undefined when no legal
 * completion exists (the draft keeps whatever the player chose).
 */
export function autoAssignCostSlots(
  input: OptionSelectionInput,
  value: readonly string[] | undefined,
): string[] | undefined {
  const presentation = asCostSlots(input);
  if (!presentation) return undefined;
  const assigned = normalizeCostSlotValue(input, value);
  const used = assignedCostEntities(input, value);
  const unfilled = presentation.slots.flatMap((_, index) => (assigned[index] ? [] : [index]));
  while (unfilled.length) {
    let target: { slotIndex: number; candidates: string[] } | undefined;
    for (const slotIndex of unfilled) {
      const candidates = presentation.slots[slotIndex]!.optionIds.filter((optionId) => {
        const entity = optionEntity(input, optionId);
        return entity && !used.has(entity);
      });
      if (!target || candidates.length < target.candidates.length)
        target = { slotIndex, candidates };
    }
    if (!target || !target.candidates.length) return undefined;
    const winner = target.candidates
      .map((optionId) => {
        const entity = optionEntity(input, optionId)!;
        const flexibility = input.options.filter(
          (option) => option.entity?.instanceId === entity,
        ).length;
        return { optionId, flexibility };
      })
      .reduce((a, b) => (a.flexibility <= b.flexibility ? a : b));
    assigned[target.slotIndex] = winner.optionId;
    used.add(optionEntity(input, winner.optionId)!);
    unfilled.splice(unfilled.indexOf(target.slotIndex), 1);
  }
  return assigned;
}
