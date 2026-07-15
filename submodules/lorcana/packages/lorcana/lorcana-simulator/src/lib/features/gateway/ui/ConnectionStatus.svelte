<script lang="ts">
  import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "$lib/design-system/primitives/hover-card";
  import { Badge } from "$lib/design-system/primitives/badge";
  import { cn } from "$lib/utils.js";
  import type { ClassValue } from "clsx";
  import { stringifySimulatorConnectionDiagnostic } from "@tcg/game-page-contract/connection-diagnostic";
  import type { GatewayClientStore } from "../gateway-client.svelte.js";

  interface Props {
    gateway: GatewayClientStore;
    /** Sit inside a parent capsule: no outer pill border/background. */
    embedded?: boolean;
  }

  const { gateway, embedded = false }: Props = $props();

  const STATUS_DOT: Record<string, string> = {
    idle: "bg-slate-400",
    connecting: "bg-amber-400 animate-pulse",
    connected: "bg-emerald-400",
    disconnected: "bg-red-400",
    reconnecting: "bg-amber-400 animate-pulse",
  };

  const STATUS_LABEL: Record<string, string> = {
    idle: "Idle",
    connecting: "Connecting…",
    connected: "Connected",
    disconnected: "Disconnected",
    reconnecting: "Reconnecting…",
  };

  const dotClass = $derived(STATUS_DOT[gateway.status] ?? STATUS_DOT.idle);
  const label = $derived(STATUS_LABEL[gateway.status] ?? "Unknown");
  const latencyLabel = $derived(
    gateway.latencyMs !== null ? `${gateway.latencyMs}ms` : "—",
  );

  const triggerAriaLabel = $derived(
    embedded
      ? `Connection: ${label}. Latency ${latencyLabel}. Hover for details.`
      : "WebSocket connection status",
  );

  let copyFeedback = $state<"copied" | "failed" | null>(null);

  async function copyDiagnosticJson() {
    const route =
      typeof window === "undefined" ? "" : `${window.location.pathname}${window.location.search}`;
    const payload = stringifySimulatorConnectionDiagnostic({
      gameSlug: "lorcana",
      route,
      endpoint: {
        realtimeConfigured: true,
        namespace: gateway.namespace,
        path: "/v1/gateway/ws",
        transport: "websocket",
      },
      connection: {
        status: gateway.status,
        connectionId: gateway.connectionId ?? undefined,
        socketId: gateway.connectionId ?? undefined,
        authModeLabel: gateway.authenticated ? `Authenticated (${gateway.authMethod})` : gateway.authMethod,
        authenticated: gateway.authenticated,
        latencyMs: gateway.latencyMs ?? undefined,
        lastPongAt: gateway.lastPongTime ?? undefined,
        reconnectAttempts: gateway.reconnectAttempts,
        lastError: gateway.error ?? undefined,
        serverInitiatedClose: gateway.serverInitiatedClose,
      },
      events: gateway.error
        ? [{ at: new Date().toISOString(), type: "gateway_error", message: gateway.error }]
        : undefined,
    });
    try {
      if (typeof navigator === "undefined" || !navigator.clipboard) {
        copyFeedback = "failed";
        return;
      }
      await navigator.clipboard.writeText(payload);
      copyFeedback = "copied";
    } catch {
      copyFeedback = "failed";
    }
  }
</script>

<HoverCard openDelay={200}>
  <HoverCardTrigger>
    {#snippet child({ props })}
      {@const { class: triggerClass, ...triggerProps } = props}
      <button
        type="button"
        class={cn(
          "inline-flex cursor-pointer items-center justify-center text-slate-200 transition-colors hover:text-white",
          embedded
            ? "size-11 min-h-11 min-w-11 shrink-0 rounded-none border-0 bg-transparent hover:bg-white/10"
            : "gap-2 rounded-full border border-white/10 bg-black/45 px-3 py-2 text-sm backdrop-blur-md hover:bg-black/65",
          !embedded && gateway.status === "connected" && "border-emerald-500/25",
          !embedded && gateway.status === "disconnected" && "border-red-500/25",
          embedded && gateway.status === "connected" && "text-emerald-100",
          embedded && gateway.status === "disconnected" && "text-red-200",
          triggerClass as ClassValue,
        )}
        aria-label={triggerAriaLabel}
        {...triggerProps}
      >
        <span
          class={cn(
            "shrink-0 rounded-full",
            embedded ? "size-3 shadow-[0_0_0_1px_rgba(255,255,255,0.12)]" : "size-2",
            dotClass,
          )}
          aria-hidden="true"
        ></span>
        {#if !embedded}
          <span class="whitespace-nowrap">{label}</span>
          {#if gateway.status === "connected" && gateway.latencyMs !== null}
            <span class="text-slate-400">{latencyLabel}</span>
          {/if}
        {/if}
      </button>
    {/snippet}
  </HoverCardTrigger>

  <HoverCardContent
    class="w-72 border-white/10 bg-slate-950/95 text-slate-100 shadow-[0_24px_48px_-32px_rgba(2,6,23,0.95)] backdrop-blur-xl"
    sideOffset={8}
    side="bottom"
  >
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h4 class="text-sm font-semibold tracking-tight">Connection</h4>
        <Badge
          variant="outline"
          class={cn(
            "text-xs",
            gateway.status === "connected" && "border-emerald-500/30 text-emerald-300",
            gateway.status === "disconnected" && "border-red-500/30 text-red-300",
            (gateway.status === "connecting" || gateway.status === "reconnecting") &&
              "border-amber-500/30 text-amber-300",
          )}
        >
          {label}
        </Badge>
      </div>

      <dl class="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
        <div>
          <dt class="text-slate-400">Latency</dt>
          <dd class="mt-0.5 font-medium">{latencyLabel}</dd>
        </div>

        <div>
          <dt class="text-slate-400">Auth</dt>
          <dd class="mt-0.5 font-medium capitalize">
            {gateway.authenticated ? "Verified" : gateway.authMethod}
          </dd>
        </div>

        <div>
          <dt class="text-slate-400">Since</dt>
          <dd class="mt-0.5 tabular-nums font-medium">
            {new Date(gateway.statusChangedAt).toLocaleTimeString()}
          </dd>
        </div>

        {#if gateway.lastPongTime}
          <div>
            <dt class="text-slate-400">Last pong</dt>
            <dd class="mt-0.5 font-medium tabular-nums">
              {new Date(gateway.lastPongTime).toLocaleTimeString()}
            </dd>
          </div>
        {/if}

        {#if gateway.connectionId}
          <div>
            <dt class="text-slate-400">Connection ID</dt>
            <dd class="mt-0.5 truncate font-mono text-[10px]" title={gateway.connectionId}>
              {gateway.connectionId}
            </dd>
          </div>
        {/if}

        {#if gateway.reconnectAttempts > 0}
          <div>
            <dt class="text-slate-400">Reconnects</dt>
            <dd class="mt-0.5 font-medium">{gateway.reconnectAttempts}</dd>
          </div>
        {/if}

        {#if gateway.error}
          <div class="col-span-2">
            <dt class="text-red-400">Error</dt>
            <dd class="mt-0.5 text-red-300">{gateway.error}</dd>
          </div>
        {/if}

        {#if gateway.serverInitiatedClose}
          <div class="col-span-2">
            <dt class="text-amber-400">Deploy</dt>
            <dd class="mt-0.5 text-amber-300">Server update in progress</dd>
          </div>
        {/if}
      </dl>

      <button
        type="button"
        class="w-full rounded-md border border-sky-400/25 bg-sky-400/10 px-3 py-2 text-xs font-semibold text-sky-100 transition-colors hover:bg-sky-400/15"
        onclick={copyDiagnosticJson}
      >
        Copy diagnostic JSON
      </button>
      {#if copyFeedback}
        <p class={cn("text-xs", copyFeedback === "copied" ? "text-emerald-300" : "text-red-300")}>
          {copyFeedback === "copied" ? "Copied JSON to clipboard." : "Clipboard unavailable."}
        </p>
      {/if}
    </div>
  </HoverCardContent>
</HoverCard>
