import { projectTypes } from "@/lib/content";

export type ContactInput = {
  name: string;
  email: string;
  projectType: string;
  message: string;
};

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const LIMITS = { name: 100, email: 200, message: 4000, messageMin: 20 } as const;

/** Shared by the browser form and the API route so both enforce the same rules. */
export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();

  if (!name) errors.name = "Please enter your name.";
  else if (name.length > LIMITS.name) errors.name = `Please keep your name under ${LIMITS.name} characters.`;

  if (!email) errors.email = "Please enter your email address.";
  else if (email.length > LIMITS.email || !EMAIL_PATTERN.test(email))
    errors.email = "Please enter a valid email address, e.g. name@company.com.";

  if (!(projectTypes as readonly string[]).includes(input.projectType))
    errors.projectType = "Please choose the type of project.";

  if (!message) errors.message = "Please describe your project.";
  else if (message.length < LIMITS.messageMin)
    errors.message = `A little more detail helps — at least ${LIMITS.messageMin} characters.`;
  else if (message.length > LIMITS.message)
    errors.message = `Please keep the description under ${LIMITS.message} characters.`;

  return errors;
}
