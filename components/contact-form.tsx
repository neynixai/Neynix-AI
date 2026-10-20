"use client";

import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { useId, useRef, useState } from "react";
import { CONTACT_FORM_ENDPOINT } from "@/config/site";
import { projectTypes } from "@/lib/content";
import { LIMITS, validateContact, type ContactErrors, type ContactInput } from "@/lib/contact-validation";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

const empty: ContactInput = { name: "", email: "", projectType: "", message: "" };

const fieldClass =
  "mt-2 block w-full rounded-md border bg-elevated px-3.5 py-3 text-[0.9375rem] text-offwhite placeholder:text-grey transition-colors focus:border-offwhite focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime";

export function ContactForm() {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<ContactInput>(empty);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const set = (field: keyof ContactInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validateContact(values);
    setErrors(found);
    const firstInvalid = (Object.keys(found) as (keyof ContactInput)[])[0];
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus({ kind: "sending" });
    const gotcha = (formRef.current?.elements.namedItem("_gotcha") as HTMLInputElement | null)?.value ?? "";
    try {
      const res = await fetch(CONTACT_FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          projectType: values.projectType,
          message: values.message.trim(),
          _subject: `New enquiry — ${values.projectType} — ${values.name.trim()}`,
          _gotcha: gotcha,
        }),
      });
      // Only a 2xx from the delivery service counts as sent.
      if (!res.ok) {
        setStatus({ kind: "error", message: "Your message couldn't be sent right now. Please try again in a moment." });
        return;
      }
      setStatus({ kind: "sent" });
      setValues(empty);
    } catch {
      setStatus({ kind: "error", message: "Network error — please check your connection and try again." });
    }
  }

  if (status.kind === "sent") {
    return (
      <div role="status" className="rounded-xl border border-line-strong bg-elevated p-8">
        <Check aria-hidden className="size-6 text-lime" strokeWidth={1.5} />
        <p className="mt-4 text-xl font-semibold tracking-tight">Thanks — your message has been sent.</p>
        <p className="mt-2 text-sm text-grey">You&rsquo;ll get a reply at the email address you provided.</p>
        <button
          type="button"
          onClick={() => setStatus({ kind: "idle" })}
          className="mt-6 text-sm text-offwhite underline underline-offset-4 hover:no-underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  const describedBy = (field: keyof ContactInput) => (errors[field] ? `${id}-${field}-error` : undefined);
  const border = (field: keyof ContactInput) => (errors[field] ? "border-danger" : "border-line-input");

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="relative grid gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor={`${id}-name`} className="text-sm font-medium">
          Name
        </label>
        <input
          id={`${id}-name`}
          name="name"
          autoComplete="name"
          maxLength={LIMITS.name}
          value={values.name}
          onChange={set("name")}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={describedBy("name")}
          className={`${fieldClass} ${border("name")}`}
        />
        <FieldError id={`${id}-name-error`} message={errors.name} />
      </div>

      <div>
        <label htmlFor={`${id}-email`} className="text-sm font-medium">
          Email
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          maxLength={LIMITS.email}
          value={values.email}
          onChange={set("email")}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={describedBy("email")}
          className={`${fieldClass} ${border("email")}`}
        />
        <FieldError id={`${id}-email-error`} message={errors.email} />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor={`${id}-projectType`} className="text-sm font-medium">
          Project type
        </label>
        <select
          id={`${id}-projectType`}
          name="projectType"
          value={values.projectType}
          onChange={set("projectType")}
          aria-invalid={Boolean(errors.projectType)}
          aria-describedby={describedBy("projectType")}
          className={`${fieldClass} ${border("projectType")} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%2385877E' stroke-width='1.5'%3E%3Cpath d='M2 4l4 4 4-4'/%3E%3C/svg%3E")] bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10 [&>option]:bg-elevated [&>option]:text-offwhite`}
        >
          <option value="" disabled>
            Select a project type
          </option>
          {projectTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <FieldError id={`${id}-projectType-error`} message={errors.projectType} />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor={`${id}-message`} className="text-sm font-medium">
          Project description
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={5}
          maxLength={LIMITS.message}
          value={values.message}
          onChange={set("message")}
          placeholder="What are you trying to build, and what does success look like?"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describedBy("message")}
          className={`${fieldClass} ${border("message")} resize-y`}
        />
        <FieldError id={`${id}-message-error`} message={errors.message} />
      </div>

      {/* Honeypot — hidden from people and assistive tech. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company
          <input name="_gotcha" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status.kind === "sending"}
          className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-lime bg-lime px-5 text-sm font-medium text-obsidian transition-colors hover:border-lime-hover hover:bg-lime-hover disabled:cursor-wait disabled:opacity-70"
        >
          {status.kind === "sending" ? (
            <>
              <LoaderCircle aria-hidden className="size-4 animate-spin" /> Sending…
            </>
          ) : (
            <>
              Send message
              <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
            </>
          )}
        </button>
        <p role="alert" aria-live="assertive" className="text-sm text-danger">
          {status.kind === "error" ? status.message : ""}
        </p>
      </div>
    </form>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-[0.8125rem] text-danger">
      {message}
    </p>
  );
}
