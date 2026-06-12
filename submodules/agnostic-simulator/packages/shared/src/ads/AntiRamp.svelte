<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { removeRampScript } from './RampPlaywire.svelte';

	const pathname = $derived(page.url.pathname);

    // This component ensures that Ads can't be loaded, even by accident
	$effect(() => {
		if (!browser) {
            return;
        }
		removeRampScript(pathname, false);
	});
</script>
