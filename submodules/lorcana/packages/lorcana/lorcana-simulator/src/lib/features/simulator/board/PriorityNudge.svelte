<script lang="ts">
  import BellRing from "@lucide/svelte/icons/bell-ring";
  import MessageCircle from "@lucide/svelte/icons/message-circle";
  import X from "@lucide/svelte/icons/x";
  import { Button } from "$lib/design-system/primitives/button";
  import { m } from "$lib/i18n/messages.js";

  interface PriorityNudgeProps {
    canPassTurn?: boolean;
    onSendThinking?: () => void;
    onPassTurn?: () => void;
    onDismiss?: () => void;
  }

  let {
    canPassTurn = false,
    onSendThinking,
    onPassTurn,
    onDismiss,
  }: PriorityNudgeProps = $props();
</script>

<aside class="priority-nudge" role="status" aria-live="polite" data-testid="priority-nudge">
  <div class="priority-nudge__icon" aria-hidden="true">
    <BellRing class="size-4" />
  </div>

  <div class="priority-nudge__content">
    <p class="priority-nudge__title">{m["sim.priorityNudge.title"]({})}</p>
    <p class="priority-nudge__body">{m["sim.priorityNudge.body"]({})}</p>

    <div class="priority-nudge__actions" aria-label={m["sim.priorityNudge.actionsAria"]({})}>
      {#if canPassTurn}
        <Button class="priority-nudge__button priority-nudge__button--primary" onclick={() => onPassTurn?.()}>
          {m["sim.priorityNudge.passPriority"]({})}
        </Button>
      {/if}

      <Button variant="outline" class="priority-nudge__button" onclick={() => onSendThinking?.()}>
        <MessageCircle class="size-3.5" />
        {m["sim.priorityNudge.thinking"]({})}
      </Button>

      <Button variant="outline" class="priority-nudge__button" onclick={() => onDismiss?.()}>
        {m["sim.priorityNudge.close"]({})}
      </Button>
    </div>
  </div>

  <button
    type="button"
    class="priority-nudge__dismiss"
    aria-label={m["sim.priorityNudge.dismiss"]({})}
    title={m["sim.priorityNudge.dismiss"]({})}
    onclick={() => onDismiss?.()}
  >
    <X class="size-3.5" />
  </button>
</aside>

<style>
  .priority-nudge {
    position: absolute;
    right: clamp(0.75rem, 2vw, 1.25rem);
    bottom: calc(5.75rem + env(safe-area-inset-bottom));
    z-index: 46;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: 0.7rem;
    width: min(28rem, calc(100vw - 1.5rem));
    padding: 0.8rem;
    border: 1px solid rgba(250, 204, 21, 0.42);
    border-radius: 0.75rem;
    background:
      linear-gradient(180deg, rgba(39, 30, 12, 0.96), rgba(17, 24, 39, 0.96)),
      rgba(15, 23, 42, 0.96);
    color: #f8fafc;
    box-shadow:
      0 18px 44px rgba(2, 6, 23, 0.56),
      0 0 0 1px rgba(250, 204, 21, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }

  .priority-nudge__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 999px;
    border: 1px solid rgba(250, 204, 21, 0.48);
    background: rgba(180, 83, 9, 0.22);
    color: #fde68a;
  }

  .priority-nudge__content {
    min-width: 0;
  }

  .priority-nudge__title {
    margin: 0;
    font-size: 0.8rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #fef3c7;
  }

  .priority-nudge__body {
    margin: 0.18rem 0 0;
    color: rgba(226, 232, 240, 0.92);
    font-size: 0.82rem;
    line-height: 1.35;
  }

  .priority-nudge__actions {
    display: flex;
    flex-wrap: nowrap;
    gap: 0.4rem;
    margin-top: 0.65rem;
    max-width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: thin;
    -webkit-overflow-scrolling: touch;
  }

  :global(.priority-nudge__button) {
    flex: 0 0 auto;
    min-height: 2rem;
    gap: 0.35rem;
    border-color: rgba(250, 204, 21, 0.28);
    background: rgba(15, 23, 42, 0.42);
    color: #f8fafc;
    padding: 0.36rem 0.58rem;
    font-size: 0.74rem;
    font-weight: 750;
    white-space: nowrap;
  }

  :global(.priority-nudge__button:hover) {
    border-color: rgba(250, 204, 21, 0.5);
    background: rgba(51, 65, 85, 0.72);
  }

  :global(.priority-nudge__button--primary) {
    border-color: rgba(250, 204, 21, 0.64);
    background: linear-gradient(180deg, rgba(180, 83, 9, 0.9), rgba(120, 53, 15, 0.96));
    color: #fff7ed;
  }

  .priority-nudge__dismiss {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.65rem;
    height: 1.65rem;
    border-radius: 999px;
    border: 1px solid rgba(148, 163, 184, 0.22);
    background: rgba(15, 23, 42, 0.48);
    color: rgba(226, 232, 240, 0.82);
    cursor: pointer;
  }

  .priority-nudge__dismiss:hover,
  .priority-nudge__dismiss:focus-visible {
    border-color: rgba(226, 232, 240, 0.42);
    color: #f8fafc;
    outline: none;
  }

  @media (max-width: 767px) {
    .priority-nudge {
      right: 0.65rem;
      left: 0.65rem;
      bottom: calc(4.9rem + env(safe-area-inset-bottom));
      width: auto;
      padding: 0.72rem;
    }

    .priority-nudge__actions {
      padding-bottom: 0.1rem;
    }

    :global(.priority-nudge__button) {
      justify-content: center;
      padding-inline: 0.52rem;
    }
  }
</style>
