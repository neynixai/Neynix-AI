interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_CONTACT_EMAIL?: string;
  readonly PUBLIC_LINKEDIN_URL?: string;
  readonly PUBLIC_GITHUB_URL?: string;
  readonly PUBLIC_WEB3FORMS_ACCESS_KEY?: string;
  readonly PUBLIC_CHAT_WIDGET_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
