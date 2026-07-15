<script lang="ts">
import { SITE_NAME } from "$lib/config/site";

export interface SeoAlternate {
	hreflang: string;
	href: string;
}

interface Props {
	title: string;
	description: string;
	canonicalUrl?: string;
	ogImage?: string;
	jsonLd?: Record<string, unknown> | Record<string, unknown>[];
	alternates?: SeoAlternate[];
	locale?: string;
}

let { title, description, canonicalUrl, ogImage, jsonLd, alternates, locale }: Props = $props();

const OG_LOCALE_MAP: Record<string, string> = {
	en: "en_US",
	de: "de_DE",
	fr: "fr_FR",
	es: "es_ES",
	it: "it_IT",
	"pt-br": "pt_BR",
};
const ogLocale = $derived(locale ? OG_LOCALE_MAP[locale] ?? locale : undefined);

function escapeAttr(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

function safeJsonLdString(
	json: Record<string, unknown> | Record<string, unknown>[],
): string {
	return JSON.stringify(json).replace(/<\/(script)/gi, "<\\/$1");
}
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={escapeAttr(description)} />
	{#if canonicalUrl}
		<link rel="canonical" href={canonicalUrl} />
	{/if}
	<meta property="og:title" content={escapeAttr(title)} />
	<meta property="og:description" content={escapeAttr(description)} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={SITE_NAME} />
	{#if canonicalUrl}
		<meta property="og:url" content={canonicalUrl} />
	{/if}
	{#if ogImage}
		<meta property="og:image" content={ogImage} />
	{/if}
	{#if ogLocale}
		<meta property="og:locale" content={ogLocale} />
	{/if}
	{#if alternates?.length}
		{#each alternates as alt}
			<link rel="alternate" hreflang={alt.hreflang} href={escapeAttr(alt.href)} />
		{/each}
		{#each alternates.filter((a) => a.hreflang !== "x-default" && a.hreflang !== locale) as alt}
			<meta property="og:locale:alternate" content={OG_LOCALE_MAP[alt.hreflang] ?? alt.hreflang} />
		{/each}
	{/if}
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={escapeAttr(title)} />
	<meta name="twitter:description" content={escapeAttr(description)} />
	{#if ogImage}
		<meta name="twitter:image" content={ogImage} />
	{/if}
	{#if jsonLd}
		<script type="application/ld+json">
			{safeJsonLdString(jsonLd)}
		</script>
	{/if}
</svelte:head>
