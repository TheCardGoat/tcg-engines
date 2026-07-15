import {
  assertNeverInteractionInput,
  assertNeverInteractionIntent,
  type InteractionInput,
  type InteractionIntent,
} from "./interactions";

export const interactionIntentTextKeys = {
  "play-card": "interaction.intent.playCard",
  "resource-card": "interaction.intent.resourceCard",
  attack: "interaction.intent.attack",
  activate: "interaction.intent.activate",
  "move-card": "interaction.intent.moveCard",
  pass: "interaction.intent.pass",
  undo: "interaction.intent.undo",
  concede: "interaction.intent.concede",
  mulligan: "interaction.intent.mulligan",
  "choose-option": "interaction.intent.chooseOption",
  "choose-targets": "interaction.intent.chooseTargets",
  "order-cards": "interaction.intent.orderCards",
  custom: "interaction.intent.custom",
} as const satisfies Record<InteractionIntent, `interaction.intent.${string}`>;

export const interactionInputTextKeys = {
  "entity-selection": "interaction.input.entitySelection",
  "option-selection": "interaction.input.optionSelection",
  boolean: "interaction.input.boolean",
  number: "interaction.input.number",
  ordering: "interaction.input.ordering",
} as const satisfies Record<InteractionInput["kind"], `interaction.input.${string}`>;

export function interactionInputKindForTypecheck(input: InteractionInput): string {
  switch (input.kind) {
    case "entity-selection":
      return input.role;
    case "option-selection":
      return input.options[0]?.id ?? input.id;
    case "boolean":
      return input.trueText.key;
    case "number":
      return input.step === undefined ? input.id : `${input.id}:${input.step}`;
    case "ordering":
      return input.entityKind;
    default:
      return assertNeverInteractionInput(input);
  }
}

export function interactionIntentForTypecheck(intent: InteractionIntent): string {
  switch (intent) {
    case "play-card":
    case "resource-card":
    case "attack":
    case "activate":
    case "move-card":
    case "pass":
    case "undo":
    case "concede":
    case "mulligan":
    case "choose-option":
    case "choose-targets":
    case "order-cards":
    case "custom":
      return interactionIntentTextKeys[intent];
    default:
      return assertNeverInteractionIntent(intent);
  }
}
