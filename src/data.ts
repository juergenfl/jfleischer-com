export type ToolEntry = {
  name: string
  blurb: string
  url: string
  tag: 'Tested' | 'Watching'
}

export type Category = {
  index: string
  title: string
  description: string
  tools: ToolEntry[]
}

export const categories: Category[] = [
  {
    index: '01',
    title: 'Reasoning & Chat',
    description: 'General-purpose models for thinking, writing and everyday work.',
    tools: [
      {
        name: 'Claude',
        blurb: 'Strong default for long-context reasoning, writing and coding help.',
        url: 'https://claude.ai',
        tag: 'Tested',
      },
      {
        name: 'ChatGPT',
        blurb: 'Broadest plugin/tooling ecosystem, solid for everyday tasks.',
        url: 'https://chatgpt.com',
        tag: 'Tested',
      },
    ],
  },
  {
    index: '02',
    title: 'Coding Agents',
    description: 'Tools that read, write and run code with you in the loop.',
    tools: [
      {
        name: 'Claude Code',
        blurb: 'Terminal-native agent for multi-file changes and repo-wide tasks.',
        url: 'https://claude.com/product/claude-code',
        tag: 'Tested',
      },
      {
        name: 'Cursor',
        blurb: 'Editor built around AI-assisted editing with tight diff review.',
        url: 'https://cursor.com',
        tag: 'Tested',
      },
    ],
  },
  {
    index: '03',
    title: 'Image & Video',
    description: 'Generation and editing for visual work.',
    tools: [
      {
        name: 'Midjourney',
        blurb: 'Still the reference point for stylized, art-directed stills.',
        url: 'https://midjourney.com',
        tag: 'Tested',
      },
      {
        name: 'Runway',
        blurb: 'Video generation and editing tools built for production pipelines.',
        url: 'https://runwayml.com',
        tag: 'Watching',
      },
    ],
  },
  {
    index: '04',
    title: 'Voice & Audio',
    description: 'Speech, narration and audio-native tools.',
    tools: [
      {
        name: 'ElevenLabs',
        blurb: 'Natural-sounding TTS and voice cloning with fine control.',
        url: 'https://elevenlabs.io',
        tag: 'Tested',
      },
      {
        name: 'NotebookLM',
        blurb: 'Turns a pile of documents into a surprisingly listenable briefing.',
        url: 'https://notebooklm.google',
        tag: 'Watching',
      },
    ],
  },
  {
    index: '05',
    title: 'Research & Search',
    description: 'Finding and grounding answers in real sources.',
    tools: [
      {
        name: 'Perplexity',
        blurb: 'Cited, source-linked answers — good first stop for open questions.',
        url: 'https://perplexity.ai',
        tag: 'Tested',
      },
      {
        name: 'Exa',
        blurb: 'Search built for agents and embeddings, not just humans.',
        url: 'https://exa.ai',
        tag: 'Watching',
      },
    ],
  },
  {
    index: '06',
    title: 'Automation & Workflows',
    description: 'Wiring models into pipelines that run without you.',
    tools: [
      {
        name: 'n8n',
        blurb: 'Self-hostable workflow automation with a real node editor.',
        url: 'https://n8n.io',
        tag: 'Tested',
      },
      {
        name: 'Zapier',
        blurb: 'Fastest path from "if this" to "then that" across SaaS apps.',
        url: 'https://zapier.com',
        tag: 'Watching',
      },
    ],
  },
]

export const pillars = [
  {
    title: 'Curated',
    body: 'We list what earns a place, not what buys one. No sponsored slots, no affiliate rankings dressed up as reviews.',
  },
  {
    title: 'Hands-On',
    body: 'Every entry gets used before it gets listed. If we have not run it against a real task, it is not in the directory.',
  },
  {
    title: 'Living Index',
    body: 'Tools change fast. Entries get re-tested and revised — we would rather correct ourselves than let stale advice sit.',
  },
]

export const labNotes = [
  { date: '2026-09-08', note: 'Added Claude Code as a first-class coding-agent entry.' },
  { date: '2026-08-22', note: 'Re-tested image models against a consistent prompt set.' },
  { date: '2026-08-01', note: 'Retired three tools that stopped shipping updates.' },
]
