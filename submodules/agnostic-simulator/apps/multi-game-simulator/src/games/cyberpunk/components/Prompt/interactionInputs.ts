import type {
  BooleanInput,
  EntitySelectionInput,
  InteractionAction,
  NumberInput,
  OptionSelectionInput,
} from "@tcg/protocol";

export function entityInput(
  action: InteractionAction,
  inputId: string,
  entityKind: EntitySelectionInput["entityKinds"][number],
): EntitySelectionInput | null {
  const input = action.inputs.find(
    (candidate): candidate is EntitySelectionInput =>
      candidate.kind === "entity-selection" &&
      candidate.id === inputId &&
      candidate.entityKinds.includes(entityKind),
  );
  return input ?? null;
}

export function optionInput(
  action: InteractionAction,
  inputId: string,
): OptionSelectionInput | null {
  const input = action.inputs.find(
    (candidate): candidate is OptionSelectionInput =>
      candidate.kind === "option-selection" && candidate.id === inputId,
  );
  return input ?? null;
}

export function booleanInput(action: InteractionAction, inputId: string): BooleanInput | null {
  const input = action.inputs.find(
    (candidate): candidate is BooleanInput =>
      candidate.kind === "boolean" && candidate.id === inputId,
  );
  return input ?? null;
}

export function numberInput(action: InteractionAction, inputId: string): NumberInput | null {
  const input = action.inputs.find(
    (candidate): candidate is NumberInput =>
      candidate.kind === "number" && candidate.id === inputId,
  );
  return input ?? null;
}
