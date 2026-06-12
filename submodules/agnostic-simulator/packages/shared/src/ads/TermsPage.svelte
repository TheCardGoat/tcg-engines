<script lang="ts">
	interface Props {
		siteName: string;
		siteUrl: string;
		supportEmail: string;
		legalEmail: string;
		privacyEmail: string;
	}

	let { siteName, siteUrl, supportEmail, legalEmail, privacyEmail }: Props = $props();
</script>

<svelte:head>
	<title>Terms of Service — {siteName}</title>
	<meta
		name="description"
		content="Terms of Service for {siteName}: the rules that govern your use of our unofficial Disney Lorcana fan simulator, community standards, Premium subscriptions, and disclaimers."
	/>
</svelte:head>

<div class="terms-page">
	<div class="prose max-w-3xl mx-auto">
		<h1>Terms of Service</h1>
		<p class="text-muted-foreground">Effective date: 2026-04-24</p>

		<h2>1. Introduction</h2>
		<p>
			These Terms of Service ("Terms") govern your access to and use of <strong>{siteName}</strong> ("{siteName}",
			"we", "our", or "us"), available at <a href="https://{siteUrl}">{siteUrl}</a> and related services
			(the "Service"). By creating an account or using the Service, you agree to these Terms and to our
			<a href="/privacy-policy">Privacy Policy</a>. If you do not agree, do not use the Service.
		</p>
		<p>
			The Service is operated by {siteName} with registered address at <strong
				>Avenida Paulista, 1106, Room 01; Floor 16, Bela Vista, São Paulo/SP, Brazil</strong
			>.
		</p>

		<h2>2. Unofficial Fan Project &mdash; Intellectual Property</h2>
		<p>
			{siteName} is an independent, non-commercial fan project made by fans, for fans. We are <strong
				>not affiliated with, endorsed by, or sponsored by</strong
			> The Walt Disney Company, Ravensburger AG, or any official Disney Lorcana entity.
		</p>
		<p>
			All Disney Lorcana names, card names, card images, character artwork, logos, and related
			intellectual property are the property of their respective owners (Disney and Ravensburger).
			{siteName} makes no claim of ownership over this content and uses it in good faith to enable informal
			community play. If you are a rights holder and have a concern about content on the Service, please
			contact us at <a href="mailto:{legalEmail}">{legalEmail}</a>.
		</p>
		<p>
			You retain ownership of user content you create (such as decks and screen names). By submitting
			content to the Service, you grant {siteName} a worldwide, non-exclusive, royalty-free license to
			host, display, and transmit that content as necessary to operate the Service.
		</p>

		<h2>3. Eligibility and Accounts</h2>
		<ul>
			<li>
				You must be at least 13 years old (or 16 in the EEA/UK, or the minimum digital-consent age in
				your jurisdiction) to use the Service.
			</li>
			<li>
				You are responsible for the accuracy of the information you provide, for the security of your
				credentials, and for all activity under your account.
			</li>
			<li>Accounts are personal. Do not share, sell, or transfer your account.</li>
			<li>
				Offensive, misleading, or impersonating usernames are prohibited. We may reject, suspend, or
				require renaming of usernames that violate community standards.
			</li>
			<li>
				You may delete your account at any time. See our <a href="/privacy-policy">Privacy Policy</a> for data
				retention details.
			</li>
		</ul>

		<h2>4. Code of Conduct</h2>
		<p>When using the Service, you agree not to:</p>
		<ul>
			<li>
				Use slurs, hate speech, sexual content involving minors, or other vulgar or abusive language in
				chat, usernames, deck names, or any other user-generated content.
			</li>
			<li>Harass, threaten, bully, or stalk other users.</li>
			<li>Impersonate other users, moderators, {siteName} staff, or any third party.</li>
			<li>
				Cheat, exploit bugs, use unauthorized automation or bots, or otherwise interfere with fair play.
			</li>
			<li>
				Attempt to access accounts, systems, or data that do not belong to you, or probe, scan, or test
				the vulnerability of the Service without written authorization.
			</li>
			<li>Use the Service to transmit malware, spam, or unsolicited advertising.</li>
			<li>
				Reverse engineer, scrape at scale, or redistribute the Service's code or assets beyond what is
				permitted by applicable law.
			</li>
			<li>
				Host organized tournaments, leagues, or events with entry fees, cash prizes, or official rankings
				using the Service. The official competitive scene has dedicated venues; {siteName} is for casual
				play and practice.
			</li>
		</ul>
		<p>
			We may mute, suspend, restrict, or terminate accounts that violate these rules, at our sole
			discretion, for any duration we deem appropriate. Where possible, we will give notice and an
			opportunity to appeal.
		</p>

		<h2>5. Decks and User Content</h2>
		<ul>
			<li>You may build, import, and share decks on the Service.</li>
			<li>
				We do not claim ownership of your decks. Deck content is visible only to opponents and
				spectators during matches, unless you opt in to features that publish or export it (for example,
				third-party deck-statistics integrations).
			</li>
			<li>
				If you submit a deck link or key to a third-party statistics or analytics service through the
				Service, you consent to {siteName} sharing the relevant deck and play data with that provider.
				See our <a href="/privacy-policy">Privacy Policy</a> for details.
			</li>
			<li>
				You are responsible for the content of your decks, names, and chat messages. Do not include
				personal information, offensive content, or third-party content you do not have the right to use.
			</li>
		</ul>

		<h2>6. Premium Subscriptions, Billing, and Refunds</h2>
		<p>
			{siteName} offers an optional paid "Premium" tier that unlocks additional features (for example,
			disabling advertisements). Subscriptions are processed by <strong>Stripe</strong> and
			<strong>Braintree</strong> (a PayPal service) as independent payment processors. By subscribing,
			you also agree to the applicable processor's terms.
		</p>
		<ul>
			<li>
				<strong>Billing cycle:</strong> Premium renews automatically at the end of each billing period using
				your selected payment method until you cancel.
			</li>
			<li>
				<strong>Cancellation:</strong> You may cancel at any time from your account settings. Cancellation
				takes effect at the end of the current billing period; you retain Premium access until then.
			</li>
			<li>
				<strong>Refunds:</strong> Except where required by applicable consumer-protection law (including
				the EU right of withdrawal where digital-content performance has not yet begun), fees are non-refundable.
				We may grant discretionary refunds for service outages or billing errors. EU/UK consumers may withdraw
				from a digital-services purchase within 14 days, unless performance began with your express consent
				and acknowledgement that the withdrawal right is thereby lost.
			</li>
			<li>
				<strong>Price and feature changes:</strong> We may change Premium pricing or features. We will provide
				at least 30 days' notice of material changes that affect existing paid subscribers, and you may cancel
				before the change takes effect.
			</li>
			<li>
				<strong>Taxes:</strong> Prices may exclude applicable taxes, which will be added at checkout where
				required.
			</li>
			<li>
				<strong>Chargebacks:</strong> Initiating a chargeback without first contacting us may result in account
				suspension.
			</li>
		</ul>

		<h2>7. Advertising</h2>
		<p>
			Advertising on the free tier of the Service is managed by <strong>Playwire LLC</strong> and its
			listed vendors under the IAB Transparency &amp; Consent Framework. In the EEA, UK, and Switzerland,
			advertising cookies load only with your consent through our Consent Management Platform. Under
			California law (CCPA/CPRA), you may opt out of "sharing" of personal information for cross-context
			behavioral advertising, including via the Global Privacy Control signal. See our <a
				href="/privacy-policy">Privacy Policy</a
			> for details. Premium subscribers do not see advertisements during authenticated sessions.
		</p>

		<h2>8. Service Availability and Development Status</h2>
		<p>
			{siteName} is under active development. You may encounter bugs, glitches, or temporary unavailability
			due to maintenance, updates, or issues outside our control. We make reasonable efforts to keep the
			Service available but do not guarantee uninterrupted or error-free operation. Please report issues
			to <a href="mailto:{supportEmail}">{supportEmail}</a> &mdash; clear reports help us fix problems faster.
		</p>

		<h2>9. Privacy</h2>
		<p>
			Our <a href="/privacy-policy">Privacy Policy</a> describes how we collect, use, and protect your personal
			information, including cookies, analytics (Google Analytics 4), advertising (Playwire), and your
			rights under GDPR, UK GDPR, LGPD, and CCPA/CPRA. It is incorporated into these Terms by reference.
		</p>

		<h2>10. Third-Party Services</h2>
		<p>
			The Service may integrate with or link to third-party services (for example, OAuth providers,
			payment processors, deck-statistics platforms, card-image sources). We are not responsible for the
			content, policies, or practices of third parties. Your use of those services is governed by their
			own terms and privacy policies.
		</p>

		<h2>11. Intellectual Property in the Service</h2>
		<p>
			Except for third-party content identified in Section 2 and user content, the {siteName} name, site
			design, original code, original illustrations, and compilation of content are owned by {siteName}
			or its licensors and are protected by applicable intellectual-property laws. We grant you a limited,
			non-exclusive, non-transferable, revocable license to use the Service for personal, non-commercial
			purposes consistent with these Terms.
		</p>

		<h2>12. Reporting Infringement</h2>
		<p>
			If you believe content on the Service infringes your intellectual-property rights, send a notice
			to <a href="mailto:{legalEmail}">{legalEmail}</a> including: (i) identification of the work; (ii)
			the URL or location of the allegedly infringing material; (iii) your contact information; (iv) a
			statement of good-faith belief that the use is not authorized; (v) a statement under penalty of
			perjury that the information is accurate and that you are authorized to act; and (vi) your physical
			or electronic signature.
		</p>

		<h2>13. Disclaimer of Warranties</h2>
		<p>
			THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND,
			EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
			NON-INFRINGEMENT, AND UNINTERRUPTED OR ERROR-FREE OPERATION. SOME JURISDICTIONS DO NOT ALLOW THE
			EXCLUSION OF IMPLIED WARRANTIES; IN THOSE JURISDICTIONS, THE EXCLUSIONS IN THIS SECTION APPLY TO
			THE FULLEST EXTENT PERMITTED BY LAW.
		</p>

		<h2>14. Limitation of Liability</h2>
		<p>
			TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, {siteName.toUpperCase()} AND ITS CONTRIBUTORS
			SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
			OR ANY LOSS OF PROFITS, REVENUES, DATA, OR GOODWILL, ARISING OUT OF OR RELATED TO YOUR USE OF
			THE SERVICE. OUR TOTAL AGGREGATE LIABILITY FOR ANY CLAIM ARISING OUT OF OR RELATED TO THE SERVICE
			WILL NOT EXCEED THE GREATER OF (A) THE AMOUNTS YOU PAID US IN THE 12 MONTHS BEFORE THE EVENT
			GIVING RISE TO THE CLAIM OR (B) USD 50.
		</p>
		<p>
			NOTHING IN THESE TERMS EXCLUDES OR LIMITS LIABILITY THAT CANNOT BE EXCLUDED OR LIMITED UNDER
			APPLICABLE LAW, INCLUDING LIABILITY FOR DEATH OR PERSONAL INJURY CAUSED BY NEGLIGENCE, FOR FRAUD,
			OR FOR CONSUMER RIGHTS THAT CANNOT BE WAIVED.
		</p>

		<h2>15. Indemnification</h2>
		<p>
			You agree to indemnify and hold harmless {siteName} and its contributors from any claim, demand,
			loss, or expense (including reasonable legal fees) arising from: (i) your use of the Service in
			violation of these Terms; (ii) your user content; or (iii) your violation of any law or of the
			rights of a third party. This section does not apply to the extent prohibited by applicable law
			(for example, for consumers under EU/UK law).
		</p>

		<h2>16. Termination</h2>
		<p>
			We may suspend or terminate your access to the Service at any time, with or without notice, for
			violations of these Terms or conduct that we reasonably believe is harmful to the Service or its
			community. You may stop using and delete your account at any time. Sections that by their nature
			should survive termination (including intellectual property, disclaimers, limitation of liability,
			indemnification, and governing law) will survive.
		</p>

		<h2>17. Changes to These Terms</h2>
		<p>
			We may update these Terms from time to time. The latest version will always be posted on this
			page, with the "Effective date" updated. For material changes, we will give reasonable prior notice
			(for example, by email to registered users or by prominent notice on the Service) before they take
			effect. Your continued use of the Service after the effective date constitutes acceptance of the
			updated Terms. If you do not agree, stop using the Service and, where applicable, cancel your
			subscription.
		</p>

		<h2>18. Governing Law and Dispute Resolution</h2>
		<p>
			These Terms are governed by the laws of Brazil, without regard to conflict-of-laws rules. Subject
			to mandatory consumer-protection rights in your country of residence (which entitle you to bring
			proceedings in your local courts and to rely on local mandatory law), you and {siteName} agree that
			the courts of São Paulo/SP, Brazil have exclusive jurisdiction over any dispute arising out of or
			related to the Service or these Terms.
		</p>

		<h2>19. Miscellaneous</h2>
		<ul>
			<li>
				<strong>Entire agreement:</strong> These Terms and the Privacy Policy constitute the entire agreement
				between you and {siteName} regarding the Service and supersede any prior agreements.
			</li>
			<li>
				<strong>Severability:</strong> If any provision is held unenforceable, the remaining provisions
				remain in effect.
			</li>
			<li>
				<strong>No waiver:</strong> Our failure to enforce any provision is not a waiver of our right to
				do so later.
			</li>
			<li>
				<strong>Assignment:</strong> You may not assign these Terms without our prior written consent. We
				may assign these Terms in connection with a merger, acquisition, or sale of assets.
			</li>
			<li>
				<strong>Force majeure:</strong> Neither party is liable for failure to perform due to events beyond
				reasonable control.
			</li>
		</ul>

		<h2>20. Contact</h2>
		<ul>
			<li>General support: <a href="mailto:{supportEmail}">{supportEmail}</a></li>
			<li>Legal and IP notices: <a href="mailto:{legalEmail}">{legalEmail}</a></li>
			<li>Privacy requests: <a href="mailto:{privacyEmail}">{privacyEmail}</a></li>
			<li>
				Postal address: <strong
					>Avenida Paulista, 1106, Room 01; Floor 16, Bela Vista, São Paulo/SP, Brazil</strong
				>
			</li>
		</ul>
	</div>
</div>

<style>
	.terms-page {
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
