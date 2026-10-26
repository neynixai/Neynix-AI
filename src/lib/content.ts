export const navLinks = [
  { label: "Services", href: "/#services" },
  { label: "Approach", href: "/#approach" },
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
] as const;

export const services = [
  {
    id: "agents",
    number: "01",
    title: "AI Agents & Automation",
    description:
      "Build AI agents and workflows that automate real business processes and integrate with your tools.",
    capabilities: ["Agent orchestration", "Tool integration", "Workflow automation", "Human-in-the-loop"],
  },
  {
    id: "llm",
    number: "02",
    title: "LLM Applications & RAG",
    description:
      "Turn your data into useful AI experiences with retrieval, semantic search, and context-aware applications.",
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
    id: "execution",
    number: "04",
    title: "Fast & Efficient Execution",
    description: "We deliver high-quality products quickly—without cutting corners.",
    capabilities: ["Agile development", "Scalable infrastructure", "Clean architecture", "Ongoing support"],
  },
  {
    id: "consulting",
    number: "05",
    title: "Bespoke AI Solutions & Consulting",
    description: "Explore AI opportunities, validate ideas, and build solutions tailored to your business.",
    capabilities: ["Technical discovery", "MVP development", "AI prototyping", "Architecture consulting"],
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
