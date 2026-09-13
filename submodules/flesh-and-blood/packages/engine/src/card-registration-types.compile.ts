import type { FabKeyword } from "@tcg/flesh-and-blood-types";
import type { FabCardDefinitionInput, FabRegisteredCardDefinition } from "./cards.ts";

declare const registered: FabRegisteredCardDefinition;

const color: "red" | "yellow" | "blue" | "purple" | null = registered.base.color;
const keywords: readonly FabKeyword[] = registered.base.keywords;
void color;
void keywords;

const looseInput: FabCardDefinitionInput = {
  canonicalId: "compile-only",
  types: ["Action"],
  pitch: "1",
  keywords: ["go-again"],
};
void looseInput;

// @ts-expect-error Loose registration inputs must supply their type-box vocabulary.
const incompleteInput: FabCardDefinitionInput = { canonicalId: "incomplete" };
void incompleteInput;

// @ts-expect-error Normalized inputs cannot also carry loose rules fields.
const contradictoryInput: FabCardDefinitionInput = {
  ...registered,
  types: ["Action"],
};
void contradictoryInput;

// @ts-expect-error Registered cards require a normalized base record and layout.
const unregistered: FabRegisteredCardDefinition = looseInput;
void unregistered;

// @ts-expect-error String keywords are not legal in the registered runtime record.
const illegalRuntimeKeywords: FabRegisteredCardDefinition["base"]["keywords"] = ["go-again"];
void illegalRuntimeKeywords;
