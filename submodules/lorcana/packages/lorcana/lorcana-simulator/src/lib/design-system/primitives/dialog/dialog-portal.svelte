<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";

	let { to, ...restProps }: DialogPrimitive.PortalProps = $props();

	const resolvePortalTarget = (): DialogPrimitive.PortalProps["to"] => {
		if (to !== undefined || typeof document === "undefined") {
			return to;
		}

		return document.querySelector(".simulator-dark, .dark") ?? document.body;
	};
</script>

<DialogPrimitive.Portal to={resolvePortalTarget()} {...restProps} />
