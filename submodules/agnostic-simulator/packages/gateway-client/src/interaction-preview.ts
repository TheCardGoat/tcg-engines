import {
  InteractionPreviewRequest,
  RawGatewayInteractionPreviewMessageSchema,
  type InteractionPreviewResult,
} from "@tcg/protocol";
import type { GatewayHandle } from "./types.js";

type PreviewGateway = Pick<
  GatewayHandle,
  "onAny" | "onDisconnected" | "emit" | "getState" | "wouldHoldEmit"
>;

/** Read-only previews can be cancelled or retried; an old reply must never replace a newer draft. */
export function requestInteractionPreview(
  handle: PreviewGateway,
  gameId: string,
  request: InteractionPreviewRequest,
  options: { signal?: AbortSignal; timeoutMs?: number } = {},
): Promise<InteractionPreviewResult> {
  return new Promise((resolve, reject) => {
    const state = handle.getState();
    if (state.status !== "connected" || !state.authenticated || handle.wouldHoldEmit()) {
      reject(new Error("Connect to the match before previewing an action."));
      return;
    }
    if (options.signal?.aborted) {
      reject(new DOMException("Preview cancelled", "AbortError"));
      return;
    }
    const parsed = InteractionPreviewRequest.safeParse(request);
    if (!parsed.success) {
      reject(new Error("Invalid interaction preview request."));
      return;
    }
    const correlationId = crypto.randomUUID();
    const cleanups: (() => void)[] = [];
    let timer: ReturnType<typeof setTimeout> | undefined;
    let settled = false;
    const finish = (result: InteractionPreviewResult | Error) => {
      if (settled) return;
      settled = true;
      if (timer !== undefined) clearTimeout(timer);
      cleanups.forEach((cleanup) => cleanup());
      if (result instanceof Error) reject(result);
      else resolve(result);
    };
    try {
      cleanups.push(
        handle.onAny((event, payload) => {
          if (
            !payload ||
            typeof payload !== "object" ||
            !("correlationId" in payload) ||
            payload.correlationId !== correlationId
          )
            return;
          if (event === "gateway_error" || event === "error") {
            finish(
              new Error(
                "message" in payload && typeof payload.message === "string"
                  ? payload.message
                  : "Action preview failed.",
              ),
            );
            return;
          }
          if (event !== "interaction_preview") return;
          const message = RawGatewayInteractionPreviewMessageSchema.safeParse({
            ...payload,
            type: event,
          });
          if (!message.success) {
            finish(new Error("Invalid interaction preview response."));
            return;
          }
          if (message.data.gameId !== gameId) return;
          const result = message.data.result;
          if (
            result.status !== "unavailable" &&
            (result.stateVersion !== parsed.data.stateVersion ||
              result.action.id !== parsed.data.actionId)
          ) {
            finish(new Error("The match changed; refresh the declaration."));
            return;
          }
          finish(result);
        }),
      );
      cleanups.push(
        handle.onDisconnected(() => finish(new Error("Disconnected while previewing an action."))),
      );
      const abort = () => finish(new DOMException("Preview cancelled", "AbortError"));
      options.signal?.addEventListener("abort", abort, { once: true });
      cleanups.push(() => options.signal?.removeEventListener("abort", abort));
      timer = setTimeout(
        () => finish(new Error("Action preview timed out.")),
        options.timeoutMs ?? 4_000,
      );
      handle.emit("preview_interaction", { gameId, request: parsed.data, correlationId });
    } catch (error) {
      finish(error instanceof Error ? error : new Error("Action preview failed."));
    }
  });
}
