<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '$lib/components/ui/card';
	import { Package } from '@lucide/svelte';

	interface Props {
		title?: string;
		description?: string;
		actionLabel?: string;
		actionHref?: string;
		onAction?: () => void;
		icon?: typeof Package;
		class?: string;
	}

	let {
		title = 'Nothing here yet',
		description = '',
		actionLabel = '',
		actionHref = '',
		onAction,
		icon: Icon = Package,
		class: className = ''
	}: Props = $props();
</script>

<Card class={className}>
	<CardContent class="flex flex-col items-center justify-center py-12 text-center">
		<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
			<Icon class="h-6 w-6 text-muted-foreground" />
		</div>
		<CardHeader class="p-0 space-y-2">
			<CardTitle class="text-lg">{title}</CardTitle>
			{#if description}
				<CardDescription class="max-w-md text-sm">
					{description}
				</CardDescription>
			{/if}
		</CardHeader>
		{#if actionLabel}
			<div class="mt-4">
				{#if actionHref}
					<Button href={actionHref} size="sm">
						{actionLabel}
					</Button>
				{:else if onAction}
					<Button onclick={onAction} size="sm">
						{actionLabel}
					</Button>
				{/if}
			</div>
		{/if}
	</CardContent>
</Card>
