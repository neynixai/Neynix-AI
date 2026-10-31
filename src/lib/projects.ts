import type { ImageMetadata } from "astro";
import caModeScreenshot from "@/assets/work/ca-mode.webp";
import caModeAnswerTrace from "@/assets/work/ca-mode-answer-trace.webp";
import caModeChat from "@/assets/work/ca-mode-chat.webp";
import caModeGoals from "@/assets/work/ca-mode-goals.webp";
import caModePlanning from "@/assets/work/ca-mode-planning.webp";

export type ProjectStatus = "poc" | "in-build" | "completed" | "hosted";

/** Badge label and dot style for each stage of a project. */
export const statuses: Record<ProjectStatus, { label: string; dot: string }> = {
  poc: { label: "POC", dot: "border border-offwhite/50" },
  "in-build": { label: "In build", dot: "border border-lime" },
  completed: { label: "Completed", dot: "bg-offwhite" },
  hosted: { label: "Hosted", dot: "bg-lime" },
};

type Point = { title: string; body: string };

/** A screenshot shown in the project page's gallery, with the title and explanation listed beside it. */
export type Screen = { image: ImageMetadata; alt: string; title: string; caption: string };

/** A paid or free plan, shown in the project page's pricing section. */
export type PricingPlan = {
  name: string;
  /** Shown large, e.g. "₹599" or "Contact us". */
  price: string;
  /** Follows the price, e.g. "per month". */
  period?: string;
  summary: string;
  features: string[];
  /** A site path ("/#contact") or a full URL, which opens in a new tab. */
  cta: { label: string; href: string };
  /** Drawn with a lime border to stand out. */
  featured?: boolean;
};

export type Project = {
  /** URL segment: the project's page is served at /work/<slug>/. */
  slug: string;
  title: string;
  category: string;
  /** One or two sentences for the work card. */
  summary: string;
  /** Search and social description for the project page; about 150 characters. */
  description: string;
  /** Short topic labels, shown on the card and page and used as page keywords. */
  tags: string[];
  /** The one-line pitch at the top of the project page. */
  tagline: string;
  image: ImageMetadata;
  imageAlt: string;
  status: ProjectStatus;
  /** Where the running app can be tried, if it is online. */
  liveUrl?: string;
  /** More screenshots, shown in a gallery on the project page. */
  screens?: Screen[];
  /** Why the project exists: the problem it answers. */
  why: { intro: string; points: Point[] };
  /** What the project is and does. */
  what: { intro: string; features: Point[] };
  /** Who it is built for. */
  audiences: Point[];
  /** The principles that shape how it is built. */
  principles: Point[];
  /** The plans people can choose, if the project is sold. */
  pricing?: { intro: string; plans: PricingPlan[]; refund?: { title: string; points: string[] }; note?: string };
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
      "A private finance copilot that answers questions about your INDmoney portfolio in plain language, works out every number in code, and shows exactly how it reached each answer. Live now and free to try.",
    description:
      "A live AI finance copilot for INDmoney investors: plain-language portfolio answers, figures worked out in code, and history locked with your own PIN.",
    tags: ["AI agents", "Local LLM", "Tool calling", "Personal finance", "Privacy-first", "Data visualisation"],
    tagline:
      "Ask your portfolio anything. Get answers built from your real numbers, worked out in code, and locked with your own PIN.",
    image: caModeScreenshot,
    imageAlt:
      "CA Mode dashboard in dark mode: portfolio value, total invested, today's change and returns, an asset allocation ring, a one-year performance chart, top holdings, goals, AI insights and quick actions.",
    status: "hosted",
    liveUrl: "https://129-225-97-229.sslip.io/",
    screens: [
      {
        image: caModeChat,
        alt: "CA Mode chat: Finance Agent, running on the local Ollama model, works out the monthly investment needed for a house down payment goal.",
        title: "Ask in plain language",
        caption:
          "Finance Agent answers general finance questions with an open-source model run with Ollama, not a cloud AI service. It never sees your account.",
      },
      {
        image: caModeAnswerTrace,
        alt: "A CA Mode answer with its trace expanded: the request was classified, saved goals were used, the goal was calculated in code, the figures were checked and a completeness check passed.",
        title: "See how it answered",
        caption:
          "Open the trace under any answer to see how the question was routed, which model answered, and the checks the answer passed.",
      },
      {
        image: caModeGoals,
        alt: "CA Mode Goals page: a home down payment goal with its projection, ways to close the gap and the kinds of investment that suit its timeline.",
        title: "Goals worked out in code",
        caption:
          "Each goal is projected in code under your own return assumption, with ways to close any gap and the kinds of investment that suit its timeline.",
      },
      {
        image: caModePlanning,
        alt: "CA Mode SIP calculator: monthly investment, expected return and years, with the estimated value and a year-by-year chart.",
        title: "Plan with calculators",
        caption:
          "SIP, lumpsum, goal, loan EMI and income tax calculators run in your browser. They assume a steady return, so every result is an estimate.",
      },
    ],
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
        "CA Mode is a finance assistant with two specialised agents. One answers general finance questions and never sees your account. The other connects to INDmoney with read-only access and answers questions about your own portfolio, with charts and a step-by-step trace of how each answer was built. It is live: sign in with Google and try it free.",
      features: [
        {
          title: "Two agents, clear boundaries",
          body: "Finance Agent explains concepts. Portfolio Analyzer works with your holdings, SIPs, watchlists and net worth. Each question is routed to the right one, and off-topic requests are declined.",
        },
        {
          title: "Read-only by design",
          body: "CA Mode reads your account through INDmoney’s read-only tools. It cannot trade, change SIPs, move money or change account settings.",
        },
        {
          title: "A daily portfolio snapshot",
          body: "Every morning at 09:00 IST, before the market opens, it records your net worth and holdings, so it can show trends and explain what changed since yesterday or last month.",
        },
        {
          title: "“Why did my portfolio change?”",
          body: "A fixed workflow in code compares two snapshots, splits each holding’s change into price and units held, and runs consistency checks before reporting. It says what changed, and never guesses why.",
        },
        {
          title: "Goals you can trust",
          body: "Projections are calculated in code under your own return assumption, with ways to close any gap. Fixed rules show which kinds of investment suit each goal’s timeline, and fund figures are dated and sourced, never ranked.",
        },
        {
          title: "Every broker, not just one",
          body: "Upload your monthly NSDL or CDSL statement to include holdings at other brokers. It is read offline, and only the holdings are kept: never the PDF, its password or your personal details.",
        },
        {
          title: "Questions with several parts",
          body: "Ask for your net worth and a monthly target in one question. The agent plans its tool calls, the plan is checked in code, and independent steps run at the same time.",
        },
        {
          title: "Answers you can check",
          body: "Bar, donut, line and candlestick charts when the data supports them, a trace of every step behind an answer, and a warning on any figure that doesn’t match your INDmoney data.",
        },
        {
          title: "Private by design",
          body: "Chats, goals and snapshots are sealed with your PIN, so not even whoever runs the server can read them. Answers come from an open-source model run with Ollama, not a cloud AI service.",
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
        body: "Teams and organisations that want their own hosted copy, with its own server, database and model and a Google sign-in for each member, rather than a shared service.",
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
        body: "The model was chosen on the project’s own tests: gpt-oss-20b got 23 of 24 portfolio figures right in about 9 seconds an answer. Every change is graded the same way, in code.",
      },
    ],
    pricing: {
      intro:
        "Start free on the shared copy. Pay for monthly credits on a privately hosted model, or for a copy of CA Mode hosted for your team alone.",
      plans: [
        {
          name: "Free",
          price: "₹0",
          summary: "Try CA Mode on the shared copy.",
          features: [
            "10 questions a day, starting again at midnight IST",
            "Finance Agent and Portfolio Analyzer",
            "INDmoney connection, goals and daily portfolio snapshots",
            "History encrypted with your PIN",
          ],
          cta: { label: "Start free", href: "https://129-225-97-229.sslip.io/" },
        },
        {
          name: "Individual",
          price: "₹599",
          period: "per month, excluding GST",
          summary: "For one person. Answers come from a privately hosted language model, and each month comes with its own credits.",
          features: [
            "3,000 credits a month (1 credit = 1,000 tokens), renewed on the day your plan started",
            "Top up any time once your monthly credits are used",
            "Answers from a privately hosted LLM, not a shared cloud AI service",
            "Sign in and ask, with no AI keys to buy or manage",
            "Everything in Free",
            "Full refund within 30 days of paying",
          ],
          cta: { label: "Get Individual", href: "/#contact" },
          featured: true,
        },
        {
          name: "Team or organisation",
          price: "Contact us",
          summary: "A copy hosted for your team alone, so the price depends on its size.",
          features: [
            "Its own server, database and model, run by us",
            "Each member signs in with their own Google account",
            "Unlimited questions for every member",
            "Daily backups and updates",
          ],
          cta: { label: "Talk to us", href: "/#contact" },
        },
      ],
      refund: {
        title: "Refund policy",
        points: [
          "Ask within 30 days of paying and we refund the full amount, whatever you have used.",
          "One refund per user.",
          "To ask, write to us through the contact section of this site.",
        ],
      },
      note: "There is no online checkout yet. Get in touch and we move your existing profile to the new plan, so your chats, goals and snapshots stay where they are. Prices are in Indian rupees and exclude GST.",
    },
    progress: {
      now: "CA Mode is live: sign in with Google and ask 10 questions a day, free. Both agents, daily snapshots, investigations, goals, broker statements and charts all work today.",
      next: [
        "Checkout for the Individual plan, so unlimited questions can be bought in the app.",
        "Live answer traces that show each step as it happens, instead of arriving with the finished answer.",
        "Fund overlap: showing when two of your funds own the same companies.",
        "Fewer misquoted figures in investigation answers, tracked on the project’s evals.",
      ],
    },
    note: "CA Mode is an independent project and is not affiliated with or endorsed by INDmoney. It provides information and analysis, not investment advice.",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
