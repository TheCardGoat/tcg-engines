<script lang="ts">
	interface Props {
		siteName: string;
		privacyEmail: string;
	}

	let { siteName, privacyEmail }: Props = $props();
</script>

<svelte:head>
	<title>Privacy Policy — {siteName}</title>
	<meta
		name="description"
		content="Privacy Policy for {siteName}: how we collect, use, and protect your personal information when you use our unofficial Disney Lorcana fan simulator."
	/>
</svelte:head>

<div class="privacy-page">
	<div class="prose max-w-3xl mx-auto">
		<h1>Privacy Policy</h1>
		<p class="text-muted-foreground">Effective date: 2026-05-20</p>

		<h2>1. Introduction</h2>
		<p>
			{siteName} ("{siteName}", "we", "our", or "us") respects your privacy and is committed to
			protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and
			safeguard your information when you use our Service. Please read this policy carefully. If you do
			not agree with the terms of this Privacy Policy, please do not access the Service.
		</p>

		<h2>2. Information We Collect</h2>
		<h3>2.1 Information You Provide</h3>
		<ul>
			<li><strong>Account information:</strong> email address, display name, and authentication tokens when you sign in via third-party providers (e.g., Discord).</li>
			<li><strong>User content:</strong> decks, deck names, and other content you create while using the Service.</li>
			<li><strong>Communication:</strong> messages you send to us (e.g., support emails).</li>
		</ul>

		<h3>2.2 Information Collected Automatically</h3>
		<ul>
			<li><strong>Usage data:</strong> pages visited, features used, session duration, and similar interaction data.</li>
			<li><strong>Device information:</strong> browser type, operating system, screen resolution, and device type.</li>
			<li><strong>Operational telemetry:</strong> performance metrics, page-load timing, errors, and service events used to operate and improve the Service.</li>
			<li><strong>Cookies and similar technologies:</strong> we use cookies and similar tracking technologies as described in Section 5.</li>
		</ul>

		<h2>3. How We Use Your Information</h2>
		<p>We use the information we collect to:</p>
		<ul>
			<li>Provide, maintain, and improve the Service.</li>
			<li>Process transactions and send related information, including confirmations and receipts.</li>
			<li>Send technical notices, updates, security alerts, and support messages.</li>
			<li>Respond to your comments, questions, and requests.</li>
			<li>Monitor and analyze trends, usage, and activities.</li>
			<li>Detect, investigate, and prevent fraudulent or unauthorized activities.</li>
			<li>Personalize and improve your experience.</li>
		</ul>

		<h2>4. How We Share Your Information</h2>
		<p>We may share your information in the following situations:</p>
		<ul>
			<li><strong>Service providers:</strong> with third-party vendors who perform services on our behalf (e.g., payment processing via Stripe and Braintree, advertising via Playwire, analytics via Google Analytics 4, and observability via SigNoz/OpenTelemetry).</li>
			<li><strong>Legal requirements:</strong> if required by law or in response to valid requests by public authorities.</li>
			<li><strong>Business transfers:</strong> in connection with a merger, acquisition, or sale of assets.</li>
			<li><strong>With your consent:</strong> when you have given us explicit consent to share your information.</li>
		</ul>

		<h2>5. Cookies and Tracking Technologies</h2>
		<p>
			We use cookies and similar technologies for analytics (Google Analytics 4), observability
			(SigNoz/OpenTelemetry), and advertising (Playwire and its vendors under the IAB Transparency
			&amp; Consent Framework). Observability data helps us diagnose errors, measure page performance,
			and keep the Service reliable. In the EEA, UK,
			and Switzerland, advertising cookies load only with your consent through our Consent Management
			Platform. Under California law (CCPA/CPRA), you may opt out of "sharing" of personal information
			for cross-context behavioral advertising, including via the Global Privacy Control signal.
		</p>
		<p>
			Premium subscribers do not see advertisements during authenticated sessions.
		</p>

		<h2>6. Data Retention</h2>
		<p>
			We retain your personal data only for as long as necessary to fulfill the purposes described in
			this Privacy Policy, unless a longer retention period is required by law. When you delete your
			account, we will delete your personal data within 30 days, except where we are required to retain
			it for legal purposes.
		</p>

		<h2>7. Data Security</h2>
		<p>
			We implement appropriate technical and organizational measures to protect your personal data
			against unauthorized access, alteration, disclosure, or destruction. However, no method of
			transmission over the Internet or electronic storage is 100% secure.
		</p>

		<h2>8. Your Rights</h2>
		<p>Depending on your location, you may have the following rights:</p>
		<ul>
			<li><strong>Access:</strong> request a copy of the personal data we hold about you.</li>
			<li><strong>Rectification:</strong> request correction of inaccurate or incomplete data.</li>
			<li><strong>Erasure:</strong> request deletion of your personal data.</li>
			<li><strong>Portability:</strong> request transfer of your data in a structured, machine-readable format.</li>
			<li><strong>Objection:</strong> object to our processing of your personal data.</li>
			<li><strong>Restriction:</strong> request restriction of processing of your personal data.</li>
			<li><strong>Withdraw consent:</strong> withdraw consent at any time where we rely on consent to process your data.</li>
		</ul>
		<p>
			To exercise any of these rights, contact us at
			<a href="mailto:{privacyEmail}">{privacyEmail}</a>.
		</p>

		<h2>9. International Data Transfers</h2>
		<p>
			Your information may be transferred to and processed in countries other than your country of
			residence. These countries may have data protection laws that are different from the laws of your
			country. We take appropriate safeguards to ensure your data is protected in accordance with
			applicable law.
		</p>

		<h2>10. Children's Privacy</h2>
		<p>
			The Service is not directed to children under 13 (or 16 in the EEA/UK). We do not knowingly
			collect personal information from children. If we learn that we have collected personal information
			from a child, we will take steps to delete that information.
		</p>

		<h2>11. Changes to This Privacy Policy</h2>
		<p>
			We may update this Privacy Policy from time to time. The updated version will be indicated by a
			revised "Effective date" and will be effective as soon as it is accessible. We encourage you to
			review this Privacy Policy frequently.
		</p>

		<h2>12. Contact Us</h2>
		<p>
			If you have questions or comments about this Privacy Policy, please contact us at
			<a href="mailto:{privacyEmail}">{privacyEmail}</a>.
		</p>
	</div>
</div>

<style>
	.privacy-page {
		padding: 1.5rem 1rem 3rem;
	}
	.prose {
		color: var(--foreground);
	}
	.prose h1 {
		font-size: 1.875rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
	}
	.prose h2 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-top: 1.5rem;
		margin-bottom: 0.5rem;
	}
	.prose h3 {
		font-size: 1.1rem;
		font-weight: 600;
		margin-top: 1rem;
		margin-bottom: 0.4rem;
	}
	.prose p {
		margin-bottom: 0.75rem;
	}
	.prose a {
		color: var(--brand-gold, #c9a22d);
		text-decoration: underline;
	}
	.prose ul {
		list-style: disc;
		padding-left: 1.25rem;
		margin-bottom: 0.75rem;
	}
	.prose li {
		margin-bottom: 0.25rem;
	}
</style>
