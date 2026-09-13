<script lang="ts">
  import type { AuthoritativeCommandStatus } from "@tcg/lorcana-engine";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import TriangleAlert from "@lucide/svelte/icons/triangle-alert";
  import { Button } from "$lib/design-system/primitives/button";
  import { m } from "$lib/i18n/messages.js";

  interface Props {
    status: Exclude<AuthoritativeCommandStatus, { phase: "idle" }>;
    onRetry: () => void;
  }

  let { status, onRetry }: Props = $props();

  const message = $derived.by(() => {
    if (status.phase === "submitting") return m["sim.commandRecovery.submitting"]({});
    if (status.phase === "recovery_failed") return m["sim.commandRecovery.failed"]({});
    return status.recoveryCause === "stale_state"
      ? m["sim.commandRecovery.stale"]({})
      : m["sim.commandRecovery.reconciling"]({});
  });
</script>

<div
  class:failed={status.phase === "recovery_failed"}
  class="command-banner"
  role={status.phase === "recovery_failed" ? "alert" : "status"}
  aria-live={status.phase === "recovery_failed" ? "assertive" : "polite"}
  aria-atomic="true"
  data-testid="authoritative-command-banner"
>
  {#if status.phase === "recovery_failed"}
    <TriangleAlert class="command-banner__icon" aria-hidden="true" />
  {:else}
    <LoaderCircle class="command-banner__icon spinning" aria-hidden="true" />
  {/if}
  <span class="command-banner__message">{message}</span>
  {#if status.phase === "recovery_failed"}
    <Button size="sm" variant="secondary" onclick={onRetry}>
      {m["sim.commandRecovery.retry"]({})}
    </Button>
  {/if}
</div>

<style>
  .command-banner {
    position: absolute;
    z-index: 80;
    top: max(0.75rem, env(safe-area-inset-top));
    left: 50%;
    display: flex;
    width: max-content;
    max-width: min(38rem, calc(100vw - 1.5rem));
    min-height: 2.75rem;
    translate: -50% 0;
    align-items: center;
    gap: 0.65rem;
    border: 1px solid rgb(96 165 250 / 45%);
    border-radius: 0.75rem;
    background: rgb(15 30 49 / 97%);
    padding: 0.55rem 0.75rem;
    color: #eef6ff;
    box-shadow: 0 0.75rem 2rem rgb(2 8 23 / 42%);
  }

  .command-banner.failed {
    border-color: rgb(251 146 60 / 65%);
    background: rgb(56 25 15 / 97%);
  }

  :global(.command-banner__icon) {
    width: 1.05rem;
    height: 1.05rem;
    flex: 0 0 auto;
    color: #93c5fd;
  }

  .failed :global(.command-banner__icon) {
    color: #fdba74;
  }

  :global(.command-banner__icon.spinning) {
    animation: command-banner-spin 0.9s linear infinite;
  }

  .command-banner__message {
    min-width: 0;
    font-size: 0.875rem;
    font-weight: 650;
    line-height: 1.3;
    text-wrap: balance;
  }

  @keyframes command-banner-spin {
    to {
      rotate: 360deg;
    }
  }

  @media (max-width: 40rem) {
    .command-banner {
      top: calc(max(0.5rem, env(safe-area-inset-top)) + 3.25rem);
      width: calc(100vw - 1rem);
      max-width: none;
      justify-content: center;
    }

    .command-banner__message {
      flex: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.command-banner__icon.spinning) {
      animation-duration: 1.8s;
    }
  }
</style>
