/**
 * Validation-error envelope helper.
 *
 * Bridge between the typed log-message catalog
 * (`packages/engine/src/gundam/i18n/`) and the framework-level
 * `MoveValidationResult` shape. Call sites build a rejection by picking
 * a catalog key + payload; we render the English string (for backward
 * compat with consumers that read `error`) and attach the raw
 * `{ key, values }` envelope so downstream translators can re-render
 * per locale.
 */

import type {
  MoveValidationErrorEnvelope,
  MoveValidationResult,
} from "../../../types/move-types.ts";
import type { GundamLogMessageKey, GundamLogMessageMap } from "../../logging.ts";
import {
  renderGundamLogTemplate,
  type GundamLogTemplateValues,
} from "../../i18n/render-log-template.ts";

// The typed payload shapes in `GundamLogMessageMap` are all composed of
// primitive/array-of-primitive fields, so they are structurally compatible
// with `GundamLogTemplateValues<TKey>`. This alias documents the overlap
// and lets call sites pass the typed payload directly.
type RejectPayload<TKey extends GundamLogMessageKey> = GundamLogMessageMap[TKey] &
  GundamLogTemplateValues<TKey>;

export function rejectWithKey<TKey extends GundamLogMessageKey>(
  key: TKey,
  values: RejectPayload<TKey>,
  errorCode: string,
): Extract<MoveValidationResult, { valid: false }> {
  const envelope: MoveValidationErrorEnvelope = {
    key,
    values: { ...values },
  };
  const error = renderGundamLogTemplate(key, values);
  return { valid: false, error, errorCode, envelope };
}
