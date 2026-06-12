<script lang="ts">
	import { Button } from "$lib/design-system/primitives/button";
	import { analyticsConsent } from "$lib/analytics/analytics-consent.svelte.js";
	import { isAnalyticsConfigured, updateConsent } from "$lib/analytics/analytics.js";
	import { localizeHref } from "$lib/paraglide/runtime.js";

	// The banner renders only when:
	//   1. GA4 is actually configured for this build (PUBLIC_GA4_MEASUREMENT_ID
	//      set) — otherwise we'd ask permission for tracking that can't happen.
	//   2. The visitor's jurisdiction requires explicit opt-in (gdprStrict), AND
	//   3. They haven't made a decision yet (consentGranted === null), AND
	//   4. We're past hydration (avoids SSR/CSR markup mismatch).
	let mounted = $state(false);
	$effect(() => {
		mounted = true;
	});

	const visible = $derived(
		mounted &&
			isAnalyticsConfigured() &&
			analyticsConsent.gdprStrict &&
			analyticsConsent.consentGranted !== true &&
			analyticsConsent.consentGranted !== false,
	);

	function accept(): void {
		updateConsent(true);
	}
	function decline(): void {
		updateConsent(false);
	}
</script>

{#if visible}
	<aside
		class="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-4 py-3 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/80"
		role="region"
		aria-label="Analytics consent"
	>
		<div class="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
			<p class="text-sm text-muted-foreground">
				We use analytics cookies to understand how you play and improve the
				simulator. You can accept all, decline, or read our
				<a
					href={localizeHref("/privacy-policy")}
					class="underline underline-offset-2 hover:text-foreground"
				>
					privacy policy
				</a>
				for details.
			</p>
			<div class="flex gap-2 sm:shrink-0">
				<Button variant="outline" size="sm" onclick={decline}>Decline</Button>
				<Button size="sm" onclick={accept}>Accept all</Button>
			</div>
		</div>
	</aside>
{/if}
