import type { StaticImageData } from "next/image";
import caModeScreenshot from "@/public/work/ca-mode.webp";

export type ProjectStatus = "poc" | "in-build" | "completed" | "hosted";

/** Badge label and dot style for each stage of a project. */
export const statuses: Record<ProjectStatus, { label: string; dot: string }> = {
  poc: { label: "POC", dot: "border border-offwhite/50" },
  "in-build": { label: "In build", dot: "border border-lime" },
  completed: { label: "Completed", dot: "bg-offwhite" },
  hosted: { label: "Hosted", dot: "bg-lime" },
};

type Point = { title: string; body: string };

export type Project = {
  /** URL segment: the project's page is served at /work/<slug>/. */
  slug: string;
  title: string;
  category: string;
  /** One or two sentences for the work card. */
  summary: string;
  /** The one-line pitch at the top of the project page. */
  tagline: string;
  image: StaticImageData;
  imageAlt: string;
  status: ProjectStatus;
  /** Why the project exists: the problem it answers. */
  why: { intro: string; points: Point[] };
  /** What the project is and does. */
  what: { intro: string; features: Point[] };
  /** Who it is built for. */
  audiences: Point[];
  /** The principles that shape how it is built. */
  principles: Point[];
  /** Where it stands today and what comes next. */
  progress: { now: string; next: string[] };
  /** Small print shown at the end of the page. */
  note?: string;
};

/**
 * Verified projects only. Update each project's status as it moves from POC to
 * hosted. Every project gets its own page, generated from this list.
 */
export const projects: Project[] = [
  {
    slug: "ca-mode",
    title: "CA Mode",
    category: "AI agents · Personal finance",
    summary:
      "A private finance copilot that answers questions about your INDmoney portfolio in plain language, runs its AI model on your own computer, and shows exactly how it reached every number.",
    tagline:
      "Ask your portfolio anything. Get answers built from your real numbers, worked out in code, and kept on your own computer.",
    image: caModeScreenshot,
    imageAlt:
      "CA Mode home screen: net worth, P&L and goal cards, recent chats, and a portfolio overview with a 7-day trend and market insights.",
    status: "in-build",
    why: {
      intro:
        "Most investors can see their portfolio, but few can easily question it. Asking “why did my net worth drop this week?” or “am I on track for my house deposit?” still means clicking through screens and doing the maths yourself.",
      points: [
        {
          title: "The answers are buried",
          body: "Stocks, mutual funds, US stocks and EPF sit in one app, but understanding what changed and why means piecing it together across many screens.",
        },
        {
          title: "General chatbots don’t know you",
          body: "A general AI assistant can explain what an SIP is, but not how yours is doing. Pasting your holdings into one sends your financial data to a third party.",
        },
        {
          title: "AI guesses at numbers",
          body: "Language models are unreliable at arithmetic. In personal finance, a confident wrong number is worse than no answer at all.",
        },
      ],
    },
    what: {
      intro:
        "CA Mode is a finance assistant with two specialised agents. One answers general finance questions and never sees your account. The other connects to INDmoney with read-only access and answers questions about your own portfolio, with charts and a step-by-step trace of how each answer was built.",
      features: [
        {
          title: "Two agents, clear boundaries",
          body: "Finance Agent explains concepts. Portfolio Analyzer works with your holdings, SIPs, watchlists and net worth. Each question is routed to the right one, and off-topic requests are declined.",
        },
        {
          title: "Read-only by design",
          body: "CA Mode reads your account through INDmoney’s read-only tools. It cannot trade, redeem or move money.",
        },
        {
          title: "A daily portfolio snapshot",
          body: "Every morning at 09:00 IST it records your net worth and holdings, so it can show trends and explain what changed since yesterday or last month.",
        },
        {
          title: "Goals you can trust",
          body: "Set a savings goal and see where you will land. Projections are calculated in code under your own return assumptions, and what-if scenarios are never saved.",
        },
        {
          title: "Answers you can check",
          body: "Bar, donut, line and candlestick charts when the data supports them, plus a call trace showing every tool the agent used to reach its answer.",
        },
        {
          title: "Private by default",
          body: "The AI model runs on your own computer, so questions and portfolio data never leave it. Each person has a PIN-protected profile, and a private mode saves nothing.",
        },
      ],
    },
    audiences: [
      {
        title: "Everyday investors",
        body: "People who invest through INDmoney and want plain-language answers about their own portfolio without becoming spreadsheet experts.",
      },
      {
        title: "Privacy-conscious households",
        body: "Families who want AI help with money but not at the cost of sending their financial data to an AI company. Several people can share one computer, each with their own profile.",
      },
      {
        title: "Goal-driven savers",
        body: "Anyone saving for a home, education or retirement who wants to see whether they are on track, and why, with numbers they can verify.",
      },
      {
        title: "Small teams",
        body: "Groups that want one shared, self-hosted finance assistant running behind their own access controls rather than a public service.",
      },
    ],
    principles: [
      {
        title: "Evidence before conclusions",
        body: "The agent retrieves the data it needs before it makes a claim, and every important number carries its source and date.",
      },
      {
        title: "Maths in code, not in the model",
        body: "Totals, changes and projections come from tested code. The language model explains the results; it does not calculate them.",
      },
      {
        title: "Honest about uncertainty",
        body: "When data is missing, stale or contradictory, CA Mode says so instead of guessing.",
      },
      {
        title: "Measured, not assumed",
        body: "The local model was chosen by scoring candidates on the project’s own tests for correct portfolio numbers, request routing and speed.",
      },
    ],
    progress: {
      now: "CA Mode is in active development. Profiles, both agents, read-only INDmoney access, daily snapshots, goals and charts all work today.",
      next: [
        "Investigations: “why did my portfolio change?” answered by comparing snapshots, verifying the calculations and naming the main contributors.",
        "Consistency checks that flag conflicting totals, mismatched snapshots and stale data before they reach an answer.",
        "Saved investigations you can return to, with the evidence behind each finding.",
      ],
    },
    note: "CA Mode is an independent project and is not affiliated with or endorsed by INDmoney. It provides information and analysis, not investment advice.",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
