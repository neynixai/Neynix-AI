export const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Approach", href: "#approach" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

export const services = [
  {
    id: "agents",
    number: "01",
    title: "AI Agents & Automation",
    description:
      "Build tool-using AI workflows that coordinate tasks, integrate systems, and automate defined business processes with appropriate controls.",
    capabilities: ["Agent orchestration", "Tool calling", "Workflow automation", "Human approval steps"],
  },
  {
    id: "llm",
    number: "02",
    title: "LLM Applications & RAG",
    description:
      "Turn business knowledge into useful AI experiences through retrieval, semantic search, and context-aware applications.",
    capabilities: [
      "Retrieval-Augmented Generation",
      "Knowledge assistants",
      "Semantic search",
      "Evaluation pipelines",
    ],
  },
  {
    id: "software",
    number: "03",
    title: "Custom Software Engineering",
    description:
      "Build the applications, APIs, and backend systems required to turn an idea into maintainable software.",
    capabilities: ["Web applications", "API development", "Backend engineering", "Database integration"],
  },
  {
    id: "products",
    number: "04",
    title: "AI Products & Consulting",
    description:
      "Explore AI opportunities, validate ideas, and develop prototypes and products around meaningful user problems.",
    capabilities: ["Technical discovery", "AI prototyping", "MVP development", "Architecture consulting"],
  },
] as const;

export const projectTypes = [
  "AI agents & automation",
  "LLM application / RAG",
  "Custom software",
  "AI product or prototype",
  "Consulting / discovery",
  "Something else",
] as const;
