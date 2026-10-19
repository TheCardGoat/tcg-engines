import type { AcCommand } from "@tcg/alpha-clash-engine";
import { readResourcePayment } from "./resource-payment";

type PlayDeclaration = NonNullable<Extract<AcCommand, { type: "resolveChoice" }>["play"]>;

export function readRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Invalid command declaration.");
  return Object.fromEntries(Object.entries(value));
}

export function readStrings(value: unknown): string[] | undefined {
  if (value === undefined) return;
  if (!Array.isArray(value) || !value.every((entry): entry is string => typeof entry === "string"))
    throw new Error("Invalid card list.");
  return value;
}

export function readInteger(value: unknown): number | undefined {
  if (value === undefined) return;
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0)
    throw new Error("Invalid nonnegative integer declaration.");
  return value;
}

function readIntegers(value: unknown): number[] | undefined {
  if (value === undefined) return;
  if (!Array.isArray(value)) throw new Error("Invalid integer list.");
  return value.map((entry) => {
    const parsed = readInteger(entry);
    if (parsed === undefined) throw new Error("Invalid integer list.");
    return parsed;
  });
}

function readBoolean(value: unknown): boolean | undefined {
  if (value === undefined) return;
  if (typeof value !== "boolean") throw new Error("Invalid boolean declaration.");
  return value;
}

export function readString(value: unknown): string | undefined {
  if (value === undefined) return;
  if (typeof value !== "string") throw new Error("Invalid target declaration.");
  return value;
}

export function readDivision(value: unknown): Record<string, number> | undefined {
  if (value === undefined) return;
  return Object.fromEntries(
    Object.entries(readRecord(value)).map(([id, amount]) => {
      const parsed = readInteger(amount);
      if (parsed === undefined) throw new Error("Invalid divided amount.");
      return [id, parsed];
    }),
  );
}

/** Declarations shared by playing from hand and responding from hand or a set card. */
export function readCommonDeclaration(payload: Record<string, unknown>) {
  return {
    costReductionSacrificeIds: readStrings(payload.costReductionSacrificeIds),
    resourcePayment: readResourcePayment(payload.resourcePayment),
    declineSelfCostReduction: readBoolean(payload.declineSelfCostReduction),
    selfCostReductionCount: readInteger(payload.selfCostReductionCount),
    declinedConditionalDiscounts: readIntegers(payload.declinedConditionalDiscounts),
    modeIndex: readInteger(payload.modeIndex),
    modeIndices: readIntegers(payload.modeIndices),
    sendCostCardIds: readStrings(payload.sendCostCardIds),
    targetId: readString(payload.targetId),
    discardCostIds: readStrings(payload.discardCostIds),
    targetIds: readStrings(payload.targetIds),
    xValue: readInteger(payload.xValue),
  };
}

/** Explicitly cover every native play field; actor and card identity stay server-owned. */
export function readPlayDeclaration(payload: Record<string, unknown>): PlayDeclaration {
  if (payload.manifest !== undefined && payload.manifest !== true)
    throw new Error("Invalid Manifest declaration.");
  return {
    ...readCommonDeclaration(payload),
    alternateCostCardIds: readStrings(payload.alternateCostCardIds),
    manifest: payload.manifest === true ? (true as const) : undefined,
  } satisfies Record<keyof PlayDeclaration, unknown>;
}
