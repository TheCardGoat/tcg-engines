<script lang="ts">
  import { Button } from "$lib/design-system/primitives/button";
  import { ONBOARDING_STEPS, type VsAiOnboardingState } from "./onboarding.svelte.js";

  interface VsAiOnboardingOverlayProps {
    onboarding: VsAiOnboardingState;
  }

  let { onboarding }: VsAiOnboardingOverlayProps = $props();

  const currentStepData = $derived(ONBOARDING_STEPS[onboarding.currentStep]);
  const isLastStep = $derived(onboarding.currentStep === ONBOARDING_STEPS.length - 1);
</script>

{#if onboarding.shouldShow && currentStepData}
  <div class="onboarding-backdrop" role="dialog" aria-modal="true" aria-label="Welcome walkthrough">
    <div class="onboarding-card">
      <div class="onboarding-step-indicator">
        {#each ONBOARDING_STEPS as _, i}
          <span
            class="step-dot"
            class:step-dot--active={i === onboarding.currentStep}
            class:step-dot--done={i < onboarding.currentStep}
          ></span>
        {/each}
      </div>

      <h3 class="onboarding-title">{currentStepData.title}</h3>
      <p class="onboarding-description">{currentStepData.description}</p>

      <div class="onboarding-actions">
        <Button
          variant="ghost"
          class="cursor-pointer text-slate-400 hover:text-slate-200 hover:bg-white/10"
          onclick={() => onboarding.dismiss()}
        >
          Skip
        </Button>
        <Button
          class="cursor-pointer"
          onclick={() => onboarding.nextStep()}
        >
          {isLastStep ? "Get started" : "Next"}
        </Button>
      </div>
    </div>
  </div>
{/if}

<style>
  .onboarding-backdrop {
    position: fixed;
    inset: 0;
    z-index: 50;
    display: grid;
    place-items: center;
    background: rgba(2, 6, 23, 0.75);
    backdrop-filter: blur(4px);
    padding: 1rem;
  }

  .onboarding-card {
    max-width: 28rem;
    width: 100%;
    padding: 1.5rem;
    border-radius: 1.2rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(15, 23, 42, 0.95);
    box-shadow: 0 24px 64px -16px rgba(0, 0, 0, 0.6);
    color: #e2e8f0;
  }

  .onboarding-step-indicator {
    display: flex;
    gap: 0.35rem;
    margin-bottom: 1rem;
  }

  .step-dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: rgba(100, 116, 139, 0.4);
    transition: background 200ms ease, transform 200ms ease;
  }

  .step-dot--active {
    background: #60a5fa;
    transform: scale(1.2);
  }

  .step-dot--done {
    background: rgba(96, 165, 250, 0.5);
  }

  .onboarding-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #f8fafc;
    margin-bottom: 0.4rem;
  }

  .onboarding-description {
    font-size: 0.88rem;
    line-height: 1.5;
    color: #94a3b8;
    margin-bottom: 1.2rem;
  }

  .onboarding-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }
</style>
