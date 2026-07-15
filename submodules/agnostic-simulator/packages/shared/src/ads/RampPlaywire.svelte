<script lang="ts" module>
	const PUB_ID = 1025512;
	const WEBSITE_ID = 75732;
	const SCRIPT_ID = 'ramp-script';
	const SRC = `https://cdn.intergient.com/${PUB_ID}/${WEBSITE_ID}/ramp.js`;
	const allowList = ['/idle', '/matchmaking'];

	interface Ramp {
		que?: Array<() => void>;
		spaNewPage?: (pathname: string) => void;
		passiveMode?: boolean;
		showCmpModal?: () => void;
		[key: string]: unknown;
	}

	declare global {
		interface Window {
			ramp?: Ramp;
		}
	}

	export function isAllowedPath(pathname: string, disableAllowList?: boolean): boolean {
		if (disableAllowList) return true;
		return allowList.some((p) => pathname.includes(p));
	}

	export function removeRampScript(pathname: string, disableAllowList?: boolean): void {
		if (typeof window === 'undefined' || typeof document === 'undefined') {
            return;
        }
		if (isAllowedPath(pathname, disableAllowList)) {
			console.log('[Ramp] Pathname in allowlist, skipping removal:', pathname);
			return;
		}
		try {
			const el = document.getElementById(SCRIPT_ID);
			if (el) {
				el.remove();
				window.location.reload();
			}
		} catch (e) {
			console.error('[Ramp] Error removing script:', e);
		}
	}

	function mountRampScript(opts: {
		onSuccess?: () => void;
		onError: () => void;
		pathname: string;
		disableAllowList: boolean;
	}): void {
		if (!isAllowedPath(opts.pathname, opts.disableAllowList)) {
			console.log('[Ramp] Pathname not in allowlist, skipping init');
			return;
		}
		window.ramp = window.ramp || ({} as Ramp);
		window.ramp.que = window.ramp.que || [];
		window.ramp.passiveMode = true;

		const s = document.createElement('script');
		try {
			s.src = SRC;
			s.id = SCRIPT_ID;
			s.async = true;
			document.body.appendChild(s);
		} catch (e) {
			console.error('[Ramp] Error adding script:', e);
		}
		s.onload = () => opts.onSuccess?.();
		s.onerror = (e) => {
			console.error('[Ramp] Failed to load script:', e);
			opts.onError();
		};
	}
</script>

<script lang="ts">
	import { browser, dev } from '$app/environment';
	import { page } from '$app/state';
	import type { AdFreeUserState } from './ad-free-user';

	interface Props {
		/** Ad-free state computed by the consumer from its Better Auth session. */
		state: AdFreeUserState;
		removeScriptOnUnmount?: boolean;
		disableAllowList?: boolean;
	}

	let { state, removeScriptOnUnmount = false, disableAllowList = false }: Props = $props();

	let loaded = $state(false);
	const ads = $derived(state);
	const pathname = $derived(page.url.pathname);

	$effect(() => {
		if (!browser) return;
		if (dev) {
			console.log(
				'[Ramp]',
				JSON.stringify({ pathname, showAds: ads.showAds, isLoaded: ads.isLoaded, removeScriptOnUnmount }),
			);
		}
		if (!(PUB_ID && WEBSITE_ID)) {
			console.error('[Ramp] Missing Publisher Id and Website Id');
			return;
		}
		if (!ads.isLoaded) {
			console.log('[Ramp] User not loaded yet');
			return;
		}
		if (!ads.showAds) {
			if (loaded) {
				removeRampScript(pathname, disableAllowList);
				loaded = false;
			}
			return;
		}
		if (loaded) return;
		mountRampScript({
			onSuccess: () => (loaded = true),
			onError: () => (loaded = false),
			disableAllowList,
			pathname,
		});
		return () => {
			if (removeScriptOnUnmount) {
				removeRampScript(pathname, disableAllowList);
				loaded = false;
			}
		};
	});

	$effect(() => {
		if (!(browser && loaded)) return;
		if (!isAllowedPath(pathname, disableAllowList)) {
			console.log('[Ramp] Pathname not in allowlist, skipping spaNewPage:', pathname);
			return;
		}
		const t = setTimeout(() => {
			if (window.ramp?.que) {
				if (!isAllowedPath(pathname, disableAllowList)) return;
				window.ramp.que.push(() => {
					window.ramp?.spaNewPage?.(pathname);
				});
			}
		}, 1000);
		return () => clearTimeout(t);
	});
</script>
