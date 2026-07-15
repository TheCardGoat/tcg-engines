<script lang="ts">
  import BugIcon from "@lucide/svelte/icons/bug";
  import MessageSquarePlus from "@lucide/svelte/icons/message-square-plus";
  import { m } from "$lib/i18n/messages.js";
  import {
    SIMULATOR_SUPPORT_ACTIONS,
    type SimulatorSupportActionId,
  } from "@/features/simulator/support/support-links.js";

  interface SimulatorSupportActionsProps {
    surface?: "dialog" | "sheet";
    onOpenBugReport?: () => void;
    onOpenFeedback?: () => void;
  }

  let { surface = "dialog", onOpenBugReport, onOpenFeedback }: SimulatorSupportActionsProps = $props();

  const actionIcons = {
    reportBug: BugIcon,
    shareFeedback: MessageSquarePlus,
  } satisfies Record<SimulatorSupportActionId, typeof BugIcon>;

  function handleActionClick(actionId: SimulatorSupportActionId): void {
    if (actionId === "reportBug") {
      onOpenBugReport?.();
    } else {
      onOpenFeedback?.();
    }
  }
</script>

<div class={`support-actions support-actions--${surface}`}>
  {#each SIMULATOR_SUPPORT_ACTIONS as action (action.id)}
    {@const Icon = actionIcons[action.id]}
    <button
      type="button"
      class="support-action-button"
      onclick={() => handleActionClick(action.id)}
    >
      <div class="support-action-button__copy">
        <span class="support-action-button__label">{m[action.labelKey]({})}</span>
        <span class="support-action-button__meta">{m[action.descriptionKey]({})}</span>
      </div>
      <Icon class="size-4 shrink-0" />
    </button>
  {/each}
</div>

<style>
  .support-actions {
    display: grid;
    gap: 0.6rem;
  }

  .support-actions--sheet {
    gap: 0.45rem;
  }

  .support-action-button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.9rem;
    width: 100%;
    border-radius: 0.95rem;
    border: 1px solid rgba(125, 211, 252, 0.14);
    background: rgba(15, 23, 42, 0.72);
    padding: 0.85rem 0.95rem;
    color: #f8fafc;
    text-align: left;
    transition:
      border-color 160ms ease,
      background 160ms ease,
      transform 160ms ease;
  }

  .support-action-button:hover,
  .support-action-button:focus-visible {
    border-color: rgba(125, 211, 252, 0.4);
    background: rgba(15, 23, 42, 0.9);
    outline: none;
    transform: translateY(-1px);
  }

  .support-action-button__copy {
    display: grid;
    gap: 0.2rem;
    min-width: 0;
  }

  .support-action-button__label {
    font-size: 0.92rem;
    font-weight: 700;
    color: #f8fafc;
  }

  .support-action-button__meta {
    font-size: 0.76rem;
    line-height: 1.4;
    color: rgba(191, 219, 254, 0.72);
  }

  .support-actions--sheet .support-action-button {
    padding: 0.8rem 0.9rem;
  }

  .support-actions--sheet .support-action-button__label {
    font-size: 0.88rem;
  }
</style>
