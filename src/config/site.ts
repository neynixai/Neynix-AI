/**
 * Central brand and contact configuration.
 *
 * The values below are the live contact details. An environment variable with
 * the same name (see .env.example) overrides a value when set. To hide a link,
 * set its value here to "" — never put placeholder or invented details here.
 */

/** Public contact email. */
export const CONTACT_EMAIL = import.meta.env.PUBLIC_CONTACT_EMAIL || "neynixai@gmail.com";
/** Full LinkedIn profile or company page URL. */
export const LINKEDIN_URL =
  import.meta.env.PUBLIC_LINKEDIN_URL || "https://www.linkedin.com/in/nishaanth-k-n-a59a38232";
/** Full GitHub profile or organisation URL. */
export const GITHUB_URL = import.meta.env.PUBLIC_GITHUB_URL || "https://github.com/Nishaanth419";
/**
 * Web3Forms access key (https://web3forms.com). The site is static, so the
 * contact form posts straight to Web3Forms, which emails each message to the
 * address the key was created for. The key is designed to be public. Leave
 * empty to hide the form.
 */
export const WEB3FORMS_ACCESS_KEY = import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY || "";
/** Web3Forms submission endpoint; answers JSON with `success: true` on delivery. */
export const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
/**
 * Site assistant: the chatbot Worker's widget script, e.g.
 * "https://neynix-chatbot.<account>.workers.dev/widget.js" (see chatbot/README.md).
 * Leave empty to hide the assistant.
 */
export const CHAT_WIDGET_URL = import.meta.env.PUBLIC_CHAT_WIDGET_URL || "";
/**
 * Google Search Console verification code: the `content` value of the
 * <meta name="google-site-verification"> tag Search Console gives you.
 */
export const GOOGLE_SITE_VERIFICATION = import.meta.env.PUBLIC_GOOGLE_SITE_VERIFICATION || "";
/** This site's bot id in chatbot/bots.json. */
export const CHAT_BOT_ID = "neynix";
/** Production origin without a trailing slash, e.g. "https://neynix.ai". */
export const SITE_URL = (import.meta.env.PUBLIC_SITE_URL || "").replace(/\/$/, "");

export const siteConfig = {
  name: "NEYNIX AI",
  tagline: "Build what's next with AI.",
  shortDescription:
    "Independent AI engineering studio building intelligent software for real-world problems.",
  founder: "Nishaanth",
  founderTitle: "Founder & AI Engineer",
  url: SITE_URL,
  contact: {
    email: CONTACT_EMAIL,
  },
  social: {
    linkedin: LINKEDIN_URL,
    github: GITHUB_URL,
  },
  seo: {
    title: "NEYNIX AI | AI Engineering & Intelligent Software",
    description:
      "NEYNIX AI builds AI agents, intelligent applications, automation systems, and custom software for real-world problems.",
    keywords: [
      "AI engineering",
      "AI agents",
      "LLM applications",
      "RAG",
      "automation",
      "custom software",
      "AI consulting",
    ],
  },
} as const;

export type ContactLink = { label: string; href: string; external: boolean };

/** Only the contact channels that are actually configured. */
export function getContactLinks(): ContactLink[] {
  const links: ContactLink[] = [];
  if (CONTACT_EMAIL) links.push({ label: "Email", href: `mailto:${CONTACT_EMAIL}`, external: false });
  if (LINKEDIN_URL) links.push({ label: "LinkedIn", href: LINKEDIN_URL, external: true });
  if (GITHUB_URL) links.push({ label: "GitHub", href: GITHUB_URL, external: true });
  return links;
}
