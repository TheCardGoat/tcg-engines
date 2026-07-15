<script lang="ts">
  import { analyticsConsent } from "./analytics-consent.svelte.js";
  import { updateConsent } from "./analytics.js";

  function accept() {
    updateConsent(true);
  }

  function decline() {
    updateConsent(false);
  }
</script>

{#if analyticsConsent.consentGranted === null}
  <div
    class="fixed bottom-0 left-0 right-0 z-50 border-t border-base-300 bg-base-200 px-4 py-3 shadow-lg"
  >
    <div class="mx-auto flex max-w-3xl flex-col items-center gap-3 sm:flex-row">
      <p class="text-sm text-base-content/80">
        We use analytics cookies to understand how you use the app and improve your experience.
      </p>
      <div class="flex shrink-0 gap-2">
        <button class="btn btn-sm btn-ghost" onclick={decline}>Decline</button>
        <button class="btn btn-sm btn-primary" onclick={accept}>Accept</button>
      </div>
    </div>
  </div>
{/if}
