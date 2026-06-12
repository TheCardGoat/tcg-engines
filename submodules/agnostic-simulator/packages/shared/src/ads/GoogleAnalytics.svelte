<script lang="ts">
	import { onMount } from 'svelte';
	import { browser, dev } from '$app/environment';
	import { page } from '$app/state';
	import { trackGAPageView } from './googleAnalyticsUtils';

	interface Props {
		measurementId?: string;
		enableAutoPageTracking?: boolean;
	}

	let { measurementId = 'G-VMTX3NQNVY', enableAutoPageTracking = true }: Props = $props();

	onMount(() => {
		if (!browser) return;
		const s1 = document.createElement('script');
		s1.async = true;
		s1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
		document.head.appendChild(s1);

		const s2 = document.createElement('script');
		s2.id = 'google-analytics';
		s2.textContent = `
			window.dataLayer = window.dataLayer || [];
			function gtag(){dataLayer.push(arguments);}
			window.gtag = gtag;
			gtag('js', new Date());
			gtag('config', '${measurementId}', { page_path: window.location.pathname });
		`;
		document.head.appendChild(s2);
	});

	$effect(() => {
		if (!browser || !enableAutoPageTracking) return;
		const url = page.url.pathname + (page.url.search || '');
		trackGAPageView(url);
		if (dev) console.log('[GA] page_view', url);
	});
</script>
