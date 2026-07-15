<script lang="ts">
  import ShieldOff from "@lucide/svelte/icons/shield-off";
  import { authSession } from "$lib/auth/session.svelte.js";

  let isSigningIn = $state(false);
  let signInError = $state<string | null>(null);

  async function handleSignIn(): Promise<void> {
    if (isSigningIn) return;
    isSigningIn = true;
    signInError = null;
    try {
      const callbackPath =
        typeof window !== "undefined"
          ? window.location.pathname + window.location.search
          : undefined;
      await authSession.signInWithDiscord({ callbackPath });
    } catch (error) {
      console.error("Sign-in from overlay failed:", error);
      signInError = "Sign-in failed. Try refreshing instead.";
      isSigningIn = false;
    }
  }

  function handleReload(): void {
    window.location.reload();
  }
</script>

<div class="unauth-overlay" role="alert" aria-live="assertive">
  <div class="unauth-overlay__content">
    <div class="unauth-icon">
      <ShieldOff size={28} strokeWidth={1.8} />
    </div>
    <span class="unauth-overlay__label">Authentication lost</span>
    <span class="unauth-overlay__sublabel">Your session expired.</span>

    <button
      class="unauth-signin-button"
      onclick={handleSignIn}
      disabled={isSigningIn}
    >
      {#if isSigningIn}
        Redirecting&hellip;
      {:else}
        <svg
          class="unauth-signin-button__icon"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
        Sign in with Discord
      {/if}
    </button>

    <button class="unauth-reload-button" onclick={handleReload}>
      Refresh page instead
    </button>

    {#if signInError}
      <span class="unauth-overlay__error">{signInError}</span>
    {/if}
  </div>
</div>

<style>
  .unauth-overlay {
    position: absolute;
    inset: 0;
    z-index: 10;
    border-radius: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(
      ellipse at 50% 50%,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0.48) 100%
    );
    animation: overlay-fade-in 0.4s ease-out both;
  }

  @keyframes overlay-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .unauth-overlay__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
    pointer-events: auto;
  }

  .unauth-icon {
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(252, 165, 165, 0.85);
    animation: unauth-pulse 2.5s ease-in-out infinite;
  }

  @keyframes unauth-pulse {
    0%, 100% { transform: scale(1); opacity: 0.75; }
    50% { transform: scale(1.06); opacity: 1; }
  }

  .unauth-overlay__label {
    font-size: 0.75rem;
    font-weight: 600;
    color: rgba(252, 165, 165, 0.9);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
  }

  .unauth-overlay__sublabel {
    font-size: 0.7rem;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.5);
    letter-spacing: 0.02em;
  }

  .unauth-signin-button {
    margin-top: 0.5rem;
    padding: 0.45rem 1.1rem;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: white;
    background: #5865F2;
    border: 1px solid rgba(88, 101, 242, 0.7);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 0 12px rgba(88, 101, 242, 0.35);
  }

  .unauth-signin-button:hover:not(:disabled) {
    background: #4752C4;
    box-shadow: 0 0 20px rgba(88, 101, 242, 0.55);
    transform: translateY(-1px);
  }

  .unauth-signin-button:active:not(:disabled) {
    transform: translateY(0);
  }

  .unauth-signin-button:disabled {
    opacity: 0.7;
    cursor: wait;
  }

  .unauth-signin-button__icon {
    width: 16px;
    height: 16px;
  }

  .unauth-reload-button {
    margin-top: 0.1rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.02em;
    color: rgba(255, 255, 255, 0.6);
    background: transparent;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: color 0.2s ease;
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .unauth-reload-button:hover {
    color: rgba(255, 255, 255, 0.9);
  }

  .unauth-overlay__error {
    margin-top: 0.3rem;
    font-size: 0.7rem;
    color: rgba(252, 165, 165, 0.95);
    text-align: center;
    max-width: 18rem;
  }

  @media (prefers-reduced-motion: reduce) {
    .unauth-overlay { animation: none; }
    .unauth-icon { animation: none; }
  }
</style>
