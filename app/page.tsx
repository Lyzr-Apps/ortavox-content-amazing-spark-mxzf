'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import {
  FiHome,
  FiSearch,
  FiFileText,
  FiEdit3,
  FiSend,
  FiCopy,
  FiCheck,
  FiAlertCircle,
  FiArrowRight,
  FiChevronRight,
  FiTrendingUp,
  FiUsers,
  FiClock,
  FiTarget,
  FiStar,
  FiZap,
  FiActivity,
  FiBookOpen,
  FiGlobe,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiRefreshCw,
  FiGrid,
} from 'react-icons/fi'
import {
  HiOutlineSparkles,
  HiOutlineDocumentText,
  HiOutlineRocketLaunch,
  HiOutlineLightBulb,
  HiOutlineHashtag,
  HiOutlineChartBar,
  HiOutlineCheckCircle,
} from 'react-icons/hi2'

// ============================================================
// CONSTANTS
// ============================================================

const AGENT_IDS = {
  TOPIC_RESEARCH: '69983ee1d67766dd690a80b5',
  CONTENT_MANAGER: '69983ebc0b3f0d6fd42f7af6',
  DRAFT_EDITOR: '69983ee20b3f0d6fd42f7b00',
  PUBLISHING: '69983ef5d4c096ee4884af86',
}

const AGENTS_INFO = [
  { id: AGENT_IDS.TOPIC_RESEARCH, name: 'Topic Research', desc: 'Discovers trending topics and content gaps' },
  { id: AGENT_IDS.CONTENT_MANAGER, name: 'Content Manager', desc: 'Coordinates blog, social, and SEO creation' },
  { id: AGENT_IDS.DRAFT_EDITOR, name: 'Draft Editor', desc: 'Refines drafts for clarity and brand voice' },
  { id: AGENT_IDS.PUBLISHING, name: 'Publishing', desc: 'Publishes to Notion and schedules via Calendar' },
]

type ViewType = 'dashboard' | 'topics' | 'generate' | 'editor' | 'publish'

// ============================================================
// SAMPLE DATA
// ============================================================

const SAMPLE_TOPIC_RESEARCH = {
  research_summary: 'The AI voice agent market continues to grow rapidly in 2026, driven by enterprise adoption and advances in multilingual NLP. Key areas of interest include multimodal AI convergence, real-time sentiment analysis, and vertical-specific voice solutions.',
  trending_topics: [
    {
      title: 'How Multimodal AI Is Supercharging Voice Agents',
      description: 'Exploring the convergence of voice, vision, and text understanding in next-gen AI agents that can simultaneously process audio, images, and text for richer customer interactions.',
      target_audience: 'CTO/VP Engineering at mid-to-large enterprises',
      key_angles: ['Technical architecture', 'Real-world use cases', 'ROI data', 'Integration patterns'],
      search_interest: 'High - 15,000/mo estimated',
      content_type: 'Blog post + whitepaper',
      priority: 'High',
    },
    {
      title: 'Voice AI for Healthcare: Reducing Administrative Burden',
      description: 'How voice agents are transforming patient intake, appointment scheduling, and post-visit follow-ups in healthcare settings.',
      target_audience: 'Healthcare CIOs and Operations Directors',
      key_angles: ['HIPAA compliance', 'Patient experience data', 'Cost reduction metrics'],
      search_interest: 'Medium - 8,200/mo estimated',
      content_type: 'Blog post + case study',
      priority: 'Medium',
    },
    {
      title: 'Building Trust in AI Voice Interactions',
      description: 'Strategies for making AI voice agents feel more natural, transparent, and trustworthy to end users.',
      target_audience: 'Product managers and UX leaders',
      key_angles: ['Transparency design patterns', 'User research findings', 'Ethical considerations'],
      search_interest: 'High - 11,500/mo estimated',
      content_type: 'Blog post + infographic',
      priority: 'High',
    },
  ],
  industry_insights: [
    'Enterprise voice AI adoption grew 45% YoY in 2025',
    'Multilingual support is the #1 requested feature for voice agents',
    'Average CSAT improvement of 23% when implementing voice AI in customer service',
    '72% of enterprises plan to increase voice AI investment in 2026',
  ],
}

const SAMPLE_CONTENT_PACKAGE = {
  content_package_title: 'Content Kit: AI Voice Agents in Customer Service',
  topic: 'How AI Voice Agents Are Reshaping Customer Service',
  blog_post: {
    title: 'Why AI Voice Agents Are the Future of Customer Experience',
    meta_description: 'Explore how AI voice agents transform customer service with natural conversations, reduced wait times, and 24/7 availability.',
    read_time: '8 min read',
    content: '## Introduction\n\nIn 2026, the way businesses interact with customers is undergoing a fundamental shift. AI voice agents are no longer experimental technology -- they are production-ready solutions driving measurable improvements in customer satisfaction and operational efficiency.\n\n## The Technology Behind Modern Voice Agents\n\nAt the core of this revolution lies advanced NLP and speech recognition technology. Modern AI voice agents can understand context, detect emotion, and respond naturally in real-time conversations.\n\n### Key Capabilities\n\n- **Natural language understanding** across multiple languages\n- **Sentiment analysis** for real-time emotional awareness\n- **Context retention** across multi-turn conversations\n- **Seamless handoff** to human agents when needed\n\n## Measurable Business Impact\n\nOrganizations implementing AI voice agents report:\n\n1. 80% reduction in average wait times\n2. 35% decrease in customer service costs\n3. 23% improvement in customer satisfaction scores\n4. 24/7 availability without staffing constraints\n\n## Getting Started with Voice AI\n\nThe journey to AI-powered customer service starts with identifying high-volume, repetitive interactions that can be automated without compromising quality.\n\n## Conclusion\n\nAI voice agents represent the next evolution of customer experience. Organizations that embrace this technology today will have a significant competitive advantage tomorrow.',
  },
  social_media: {
    linkedin: 'The future of customer service is not just automated -- it is conversational.\n\nAt Ortavox, we have seen firsthand how AI voice agents are transforming customer interactions:\n\n- 80% reduction in wait times\n- 35% lower service costs\n- 23% higher CSAT scores\n\nThe key? Natural conversations that understand context, emotion, and intent.\n\nWhat has been your experience with AI-powered customer service? Share your thoughts below.\n\n#AIVoiceAgents #CustomerExperience #ConversationalAI #Ortavox',
    twitter_thread: [
      'AI voice agents are changing how businesses talk to customers. Here is what you need to know (thread):',
      '1/ Traditional IVR systems frustrate customers with rigid menus. AI voice agents understand natural language and respond conversationally.',
      '2/ The results speak for themselves: 80% less wait time, 35% cost reduction, 23% higher satisfaction scores.',
      '3/ The best part? These agents work 24/7, handle multiple languages, and seamlessly hand off to humans when needed.',
      '4/ Getting started is easier than you think. Start with high-volume, repetitive interactions and expand from there. Learn more at ortavox.ai',
    ],
    facebook: 'Imagine never putting a customer on hold again.\n\nAI voice agents make that possible by providing natural, conversational customer service 24/7. They understand context, detect emotion, and resolve issues faster than ever.\n\nThe results? 80% less wait time and 23% happier customers.\n\nReady to transform your customer experience?',
    instagram_caption: 'The future of customer service is here, and it speaks your language.\n\nAI voice agents are revolutionizing how businesses connect with their customers -- naturally, efficiently, and around the clock.\n\nSwipe to see the impact.\n\n#AIVoiceAgents #ConversationalAI #CustomerExperience #FutureOfWork #Ortavox',
  },
  seo_recommendations: {
    primary_keywords: ['AI voice agents', 'conversational AI', 'customer service automation', 'voice AI customer experience'],
    meta_title: 'AI Voice Agents: Transforming Customer Experience in 2026 | Ortavox',
    meta_description: 'Discover how AI voice agents reduce wait times by 80% and boost customer satisfaction by 23%. Learn the technology behind conversational AI customer service.',
    readability_score: 'Grade 9 (Flesch-Kincaid)',
  },
  status: 'Ready for Review',
}

const SAMPLE_EDITOR_RESULT = {
  edited_content: '## Introduction\n\nIn 2026, AI voice agents have moved from experimental pilots to mission-critical infrastructure. Organizations worldwide are discovering that conversational AI does not just automate customer service -- it fundamentally improves it.\n\n## The Technology Behind Modern Voice Agents\n\nModern AI voice agents leverage advanced natural language processing, real-time speech recognition, and sophisticated dialogue management to deliver human-like interactions at scale.\n\n### Key Capabilities\n\n- **Natural language understanding** across 40+ languages\n- **Real-time sentiment analysis** for emotional awareness\n- **Multi-turn context retention** for complex conversations\n- **Intelligent escalation** to human agents when needed\n\n## Measurable Business Impact\n\nOrganizations implementing Ortavox voice agents consistently report:\n\n1. **80% reduction** in average wait times\n2. **35% decrease** in customer service operational costs\n3. **23% improvement** in CSAT scores\n4. **24/7 availability** without incremental staffing costs\n\n## Getting Started\n\nBegin by identifying your highest-volume, most repetitive customer interactions. These are ideal candidates for voice AI automation.\n\n## Conclusion\n\nAI voice agents represent the next evolution of customer experience. Early adopters gain a significant competitive advantage in customer satisfaction and operational efficiency.',
  quality_score: 8.5,
  editorial_summary: 'Overall strong piece with good structure. Improved transitions between sections, tightened the introduction for more impact, added specific data points, and strengthened brand mentions. CTA could be more direct.',
  changes_made: [
    { type: 'Clarity', description: 'Tightened the introduction to lead with impact rather than general statements' },
    { type: 'Data', description: 'Added specific language count (40+) for multilingual capability' },
    { type: 'Brand Voice', description: 'Incorporated Ortavox brand mention naturally in the results section' },
    { type: 'Grammar', description: 'Fixed subject-verb agreement in paragraph 3 and corrected punctuation' },
    { type: 'Tone', description: 'Softened overly promotional language while maintaining confidence' },
  ],
  suggestions: [
    'Consider adding a customer quote or testimonial for social proof',
    'The statistics section could benefit from a comparison chart or visual',
    'Add a specific CTA with link to demo or contact page',
    'Consider including a brief case study from a real deployment',
  ],
  brand_voice_alignment: 'Strong - maintains Ortavox\'s professional yet approachable tone throughout. Technical accuracy is high without being exclusionary.',
}

const SAMPLE_PUBLISHING_RESULT = {
  publishing_status: 'Successfully Published',
  notion_page: {
    status: 'Created',
    page_title: 'Blog: AI Voice Agents Reshaping Customer Experience',
    tags: ['blog', 'AI voice agents', 'customer experience', 'Q1-2026'],
  },
  calendar_event: {
    status: 'Created',
    event_title: 'Publish: AI Voice Agents Blog Post',
    scheduled_date: '2026-02-25T09:00:00Z',
    reminders: ['1 day before', '1 hour before'],
  },
  summary: 'Content saved to Notion workspace and publishing scheduled for Feb 25, 2026 at 9:00 AM UTC. Reminders set for 1 day and 1 hour before publication.',
}

// ============================================================
// INTERFACES
// ============================================================

interface TrendingTopic {
  title: string
  description: string
  target_audience: string
  key_angles: string[]
  search_interest: string
  content_type: string
  priority: string
}

interface TopicResearchResult {
  research_summary: string
  trending_topics: TrendingTopic[]
  industry_insights: string[]
}

interface ContentPackageResult {
  content_package_title: string
  topic: string
  blog_post: {
    title: string
    meta_description: string
    read_time: string
    content: string
  }
  social_media: {
    linkedin: string
    twitter_thread: string[]
    facebook: string
    instagram_caption: string
  }
  seo_recommendations: {
    primary_keywords: string[]
    meta_title: string
    meta_description: string
    readability_score: string
  }
  status: string
}

interface DraftEditorResult {
  edited_content: string
  quality_score: number
  editorial_summary: string
  changes_made: Array<{ type: string; description: string }>
  suggestions: string[]
  brand_voice_alignment: string
}

interface PublishingResult {
  publishing_status: string
  notion_page: {
    status: string
    page_title: string
    tags: string[]
  }
  calendar_event: {
    status: string
    event_title: string
    scheduled_date: string
    reminders: string[]
  }
  summary: string
}

// ============================================================
// HELPERS
// ============================================================

function renderMarkdown(text: string) {
  if (!text) return null
  return (
    <div className="space-y-2">
      {text.split('\n').map((line, i) => {
        if (line.startsWith('### '))
          return (
            <h4 key={i} className="font-semibold text-sm mt-3 mb-1 text-slate-100">
              {line.slice(4)}
            </h4>
          )
        if (line.startsWith('## '))
          return (
            <h3 key={i} className="font-semibold text-base mt-4 mb-2 text-slate-50">
              {line.slice(3)}
            </h3>
          )
        if (line.startsWith('# '))
          return (
            <h2 key={i} className="font-bold text-lg mt-5 mb-2 text-white">
              {line.slice(2)}
            </h2>
          )
        if (line.startsWith('- ') || line.startsWith('* '))
          return (
            <li key={i} className="ml-4 list-disc text-sm text-slate-300">
              {formatInline(line.slice(2))}
            </li>
          )
        if (/^\d+\.\s/.test(line))
          return (
            <li key={i} className="ml-4 list-decimal text-sm text-slate-300">
              {formatInline(line.replace(/^\d+\.\s/, ''))}
            </li>
          )
        if (!line.trim()) return <div key={i} className="h-2" />
        return (
          <p key={i} className="text-sm text-slate-300 leading-relaxed">
            {formatInline(line)}
          </p>
        )
      })}
    </div>
  )
}

function formatInline(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  if (parts.length === 1) return text
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-slate-100">
        {part}
      </strong>
    ) : (
      part
    )
  )
}

function getPriorityColor(priority: string): string {
  const p = (priority ?? '').toLowerCase()
  if (p === 'high') return 'bg-red-500/20 text-red-400 border-red-500/30'
  if (p === 'medium') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
  return 'bg-green-500/20 text-green-400 border-green-500/30'
}

function getScoreColor(score: number): string {
  if (score >= 8) return 'text-emerald-400'
  if (score >= 6) return 'text-yellow-400'
  return 'text-red-400'
}

function getScoreBg(score: number): string {
  if (score >= 8) return 'bg-emerald-500/20 border-emerald-500/30'
  if (score >= 6) return 'bg-yellow-500/20 border-yellow-500/30'
  return 'bg-red-500/20 border-red-500/30'
}

// ============================================================
// INLINE COMPONENTS
// ============================================================

function Spinner({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-violet-500/20" />
        <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-2 border-transparent border-t-violet-500 animate-spin" />
      </div>
      <p className="text-sm text-slate-400 animate-pulse">{text}</p>
    </div>
  )
}

function InlineError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300">
      <FiAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm">{message}</p>
        {onRetry && (
          <button onClick={onRetry} className="mt-2 text-xs text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors">
            Try again
          </button>
        )}
      </div>
    </div>
  )
}

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text ?? '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [text])
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-slate-100 border border-slate-600/50 transition-all duration-200"
    >
      {copied ? <FiCheck className="w-3.5 h-3.5 text-emerald-400" /> : <FiCopy className="w-3.5 h-3.5" />}
      {copied ? 'Copied' : (label ?? 'Copy')}
    </button>
  )
}

function SidebarButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`group relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${active ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
    >
      {icon}
      <span className="absolute left-full ml-3 px-2.5 py-1 rounded-md bg-slate-800 text-xs text-slate-200 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 border border-slate-700 z-50">
        {label}
      </span>
    </button>
  )
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-lg font-semibold text-slate-100">{value}</p>
      </div>
    </div>
  )
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${active ? 'bg-violet-600 text-white shadow-md shadow-violet-600/25' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
    >
      {label}
    </button>
  )
}

function AgentStatusPanel({ activeAgentId }: { activeAgentId: string | null }) {
  return (
    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Agent Status</h3>
      <div className="space-y-2">
        {AGENTS_INFO.map((agent) => (
          <div key={agent.id} className="flex items-center gap-2.5">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${activeAgentId === agent.id ? 'bg-violet-400 animate-pulse' : 'bg-slate-600'}`} />
            <span className={`text-xs ${activeAgentId === agent.id ? 'text-violet-300 font-medium' : 'text-slate-500'}`}>
              {agent.name}
            </span>
            {activeAgentId === agent.id && (
              <span className="text-[10px] text-violet-400 ml-auto">Active</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// VIEW: DASHBOARD
// ============================================================

function DashboardView({
  onNavigate,
  sampleMode,
}: {
  onNavigate: (view: ViewType) => void
  sampleMode: boolean
}) {
  const quickActions = [
    {
      icon: <FiSearch className="w-6 h-6" />,
      title: 'Suggest Topics',
      desc: 'Research trending topics and content gaps in the AI voice agent space',
      view: 'topics' as ViewType,
      color: 'bg-blue-500/20 text-blue-400',
      borderColor: 'border-blue-500/20 hover:border-blue-500/40',
    },
    {
      icon: <HiOutlineSparkles className="w-6 h-6" />,
      title: 'Generate Content',
      desc: 'Create a full content package: blog post, social media, and SEO',
      view: 'generate' as ViewType,
      color: 'bg-violet-500/20 text-violet-400',
      borderColor: 'border-violet-500/20 hover:border-violet-500/40',
    },
    {
      icon: <FiEdit3 className="w-6 h-6" />,
      title: 'Edit Draft',
      desc: 'Refine and polish your content with AI-powered editorial review',
      view: 'editor' as ViewType,
      color: 'bg-amber-500/20 text-amber-400',
      borderColor: 'border-amber-500/20 hover:border-amber-500/40',
    },
    {
      icon: <HiOutlineRocketLaunch className="w-6 h-6" />,
      title: 'Publish Content',
      desc: 'Save to Notion and schedule publishing via Google Calendar',
      view: 'publish' as ViewType,
      color: 'bg-emerald-500/20 text-emerald-400',
      borderColor: 'border-emerald-500/20 hover:border-emerald-500/40',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Ortavox Content Hub</h1>
        <p className="text-slate-400 text-base max-w-2xl">
          Your AI-powered content creation pipeline. Research topics, generate multi-platform content packages, refine drafts, and publish -- all from one place.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<FiTrendingUp className="w-5 h-5" />} label="Topics Researched" value={sampleMode ? '24' : '--'} color="bg-blue-500/20 text-blue-400" />
        <StatCard icon={<FiFileText className="w-5 h-5" />} label="Content Packages" value={sampleMode ? '12' : '--'} color="bg-violet-500/20 text-violet-400" />
        <StatCard icon={<FiEdit3 className="w-5 h-5" />} label="Drafts Edited" value={sampleMode ? '18' : '--'} color="bg-amber-500/20 text-amber-400" />
        <StatCard icon={<FiSend className="w-5 h-5" />} label="Published" value={sampleMode ? '9' : '--'} color="bg-emerald-500/20 text-emerald-400" />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.title}
              onClick={() => onNavigate(action.view)}
              className={`group flex items-start gap-4 p-5 rounded-xl bg-slate-800/50 border transition-all duration-300 hover:bg-slate-800 hover:shadow-lg ${action.borderColor} text-left`}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${action.color}`}>
                {action.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-100">{action.title}</h3>
                  <FiArrowRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-1 transition-all duration-200" />
                </div>
                <p className="text-sm text-slate-400 mt-1">{action.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Workflow Overview */}
      <div>
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Content Workflow</h2>
        <div className="flex items-center gap-2 flex-wrap">
          {['Research Topics', 'Generate Content', 'Edit Draft', 'Publish'].map((step, i) => (
            <React.Fragment key={step}>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
                <span className="w-6 h-6 rounded-full bg-violet-600/30 text-violet-400 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                <span className="text-sm text-slate-300">{step}</span>
              </div>
              {i < 3 && <FiChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// VIEW: TOPIC RESEARCH
// ============================================================

function TopicResearchView({
  onUseTopic,
  sampleMode,
  activeAgentId,
  setActiveAgentId,
}: {
  onUseTopic: (topic: string) => void
  sampleMode: boolean
  activeAgentId: string | null
  setActiveAgentId: (id: string | null) => void
}) {
  const [focusArea, setFocusArea] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<TopicResearchResult | null>(null)

  useEffect(() => {
    if (sampleMode && !result && !loading) {
      setResult(SAMPLE_TOPIC_RESEARCH as TopicResearchResult)
    }
    if (!sampleMode && result === SAMPLE_TOPIC_RESEARCH) {
      setResult(null)
    }
  }, [sampleMode])

  const handleResearch = useCallback(async () => {
    setLoading(true)
    setError(null)
    setActiveAgentId(AGENT_IDS.TOPIC_RESEARCH)
    try {
      const message = focusArea.trim()
        ? `Research trending topics and content opportunities related to: ${focusArea}`
        : 'Research trending topics, industry news, and content gaps in the AI voice agent and conversational AI space. Suggest high-impact content ideas.'
      const res = await callAIAgent(message, AGENT_IDS.TOPIC_RESEARCH)
      if (res.success) {
        const data = res?.response?.result as TopicResearchResult | undefined
        if (data) {
          setResult(data)
        } else {
          setError('Received an empty response from the agent.')
        }
      } else {
        setError(res?.error ?? 'Failed to research topics. Please try again.')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
      setActiveAgentId(null)
    }
  }, [focusArea, setActiveAgentId])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Topic Research</h1>
        <p className="text-slate-400 text-sm">Discover trending topics and content opportunities in AI and voice technology.</p>
      </div>

      {/* Input Section */}
      <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Focus Area (optional)</label>
          <input
            type="text"
            value={focusArea}
            onChange={(e) => setFocusArea(e.target.value)}
            placeholder="e.g., voice AI in healthcare, multilingual support, enterprise adoption..."
            className="w-full px-4 py-2.5 rounded-lg bg-slate-900/70 border border-slate-700 text-slate-200 text-sm placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-colors"
          />
        </div>
        <button
          onClick={handleResearch}
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-violet-600/20"
        >
          {loading ? <FiRefreshCw className="w-4 h-4 animate-spin" /> : <FiSearch className="w-4 h-4" />}
          {loading ? 'Researching...' : 'Suggest Topics'}
        </button>
      </div>

      {/* Loading */}
      {loading && <Spinner text="Analyzing trends and identifying content opportunities..." />}

      {/* Error */}
      {error && <InlineError message={error} onRetry={handleResearch} />}

      {/* Results */}
      {!loading && result && (
        <div className="space-y-6">
          {/* Research Summary */}
          {result?.research_summary && (
            <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <HiOutlineLightBulb className="w-4 h-4 text-violet-400" />
                Research Summary
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">{result.research_summary}</p>
            </div>
          )}

          {/* Trending Topics */}
          {Array.isArray(result?.trending_topics) && result.trending_topics.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-200 mb-4">Trending Topics</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {result.trending_topics.map((topic, idx) => (
                  <div key={idx} className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 transition-colors space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold text-slate-100 text-base leading-tight">{topic?.title ?? 'Untitled'}</h3>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border flex-shrink-0 ${getPriorityColor(topic?.priority ?? '')}`}>
                        {topic?.priority ?? '--'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400">{topic?.description ?? ''}</p>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <FiUsers className="w-3.5 h-3.5 text-slate-500" />
                        <span className="truncate">{topic?.target_audience ?? '--'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <FiTrendingUp className="w-3.5 h-3.5 text-slate-500" />
                        <span className="truncate">{topic?.search_interest ?? '--'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <FiFileText className="w-3.5 h-3.5 text-slate-500" />
                        <span className="truncate">{topic?.content_type ?? '--'}</span>
                      </div>
                    </div>
                    {/* Key Angles */}
                    {Array.isArray(topic?.key_angles) && topic.key_angles.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {topic.key_angles.map((angle, ai) => (
                          <span key={ai} className="px-2 py-0.5 text-[10px] rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20">
                            {angle}
                          </span>
                        ))}
                      </div>
                    )}
                    <button
                      onClick={() => onUseTopic(topic?.title ?? '')}
                      className="inline-flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors mt-1"
                    >
                      <FiArrowRight className="w-3.5 h-3.5" />
                      Use This Topic
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Industry Insights */}
          {Array.isArray(result?.industry_insights) && result.industry_insights.length > 0 && (
            <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <HiOutlineChartBar className="w-4 h-4 text-violet-400" />
                Industry Insights
              </h2>
              <ul className="space-y-2">
                {result.industry_insights.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <FiChevronRight className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================================
// VIEW: CONTENT GENERATION
// ============================================================

function ContentGenerationView({
  initialTopic,
  onContentCreated,
  sampleMode,
  activeAgentId,
  setActiveAgentId,
}: {
  initialTopic: string
  onContentCreated: (pkg: ContentPackageResult) => void
  sampleMode: boolean
  activeAgentId: string | null
  setActiveAgentId: (id: string | null) => void
}) {
  const [formData, setFormData] = useState({
    topic: initialTopic,
    contentType: 'all',
    audience: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ContentPackageResult | null>(null)
  const [activeTab, setActiveTab] = useState('blog')
  const [socialTab, setSocialTab] = useState('linkedin')

  useEffect(() => {
    if (initialTopic) {
      setFormData((prev) => ({ ...prev, topic: initialTopic }))
    }
  }, [initialTopic])

  useEffect(() => {
    if (sampleMode && !result && !loading) {
      setResult(SAMPLE_CONTENT_PACKAGE as ContentPackageResult)
      onContentCreated(SAMPLE_CONTENT_PACKAGE as ContentPackageResult)
    }
    if (!sampleMode && result === SAMPLE_CONTENT_PACKAGE) {
      setResult(null)
    }
  }, [sampleMode])

  const handleGenerate = useCallback(async () => {
    if (!formData.topic.trim()) return
    setLoading(true)
    setError(null)
    setActiveAgentId(AGENT_IDS.CONTENT_MANAGER)
    try {
      let message = `Create a comprehensive content package about: ${formData.topic}`
      if (formData.audience.trim()) {
        message += `\nTarget audience: ${formData.audience}`
      }
      if (formData.contentType === 'blog') {
        message += '\nFocus on blog post content only.'
      } else if (formData.contentType === 'social') {
        message += '\nFocus on social media content only.'
      } else {
        message += '\nInclude blog post, social media content for all platforms, and SEO recommendations.'
      }
      const res = await callAIAgent(message, AGENT_IDS.CONTENT_MANAGER)
      if (res.success) {
        const data = res?.response?.result as ContentPackageResult | undefined
        if (data) {
          setResult(data)
          onContentCreated(data)
        } else {
          setError('Received an empty response from the agent.')
        }
      } else {
        setError(res?.error ?? 'Failed to generate content. Please try again.')
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
      setActiveAgentId(null)
    }
  }, [formData, setActiveAgentId, onContentCreated])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Generate Content</h1>
        <p className="text-slate-400 text-sm">Create a full multi-platform content package with one click.</p>
      </div>

      {/* Input Form */}
      <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Topic / Brief *</label>
          <textarea
            value={formData.topic}
            onChange={(e) => setFormData((prev) => ({ ...prev, topic: e.target.value }))}
            placeholder="Describe the topic or provide a brief for the content package..."
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg bg-slate-900/70 border border-slate-700 text-slate-200 text-sm placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-colors resize-none"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Content Type</label>
            <select
              value={formData.contentType}
              onChange={(e) => setFormData((prev) => ({ ...prev, contentType: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-900/70 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-colors"
            >
              <option value="all">Blog + Social Media + SEO</option>
              <option value="blog">Blog Post Only</option>
              <option value="social">Social Media Only</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Target Audience (optional)</label>
            <input
              type="text"
              value={formData.audience}
              onChange={(e) => setFormData((prev) => ({ ...prev, audience: e.target.value }))}
              placeholder="e.g., CTO/VP Engineering, B2B SaaS leaders..."
              className="w-full px-4 py-2.5 rounded-lg bg-slate-900/70 border border-slate-700 text-slate-200 text-sm placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-colors"
            />
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading || !formData.topic.trim()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-violet-600/20"
        >
          {loading ? <FiRefreshCw className="w-4 h-4 animate-spin" /> : <HiOutlineSparkles className="w-4 h-4" />}
          {loading ? 'Generating...' : 'Generate Content'}
        </button>
      </div>

      {/* Loading */}
      {loading && <Spinner text="Creating your content package. This may take a moment..." />}

      {/* Error */}
      {error && <InlineError message={error} onRetry={handleGenerate} />}

      {/* Results */}
      {!loading && result && (
        <div className="space-y-4">
          {/* Package Header */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white">{result?.content_package_title ?? 'Content Package'}</h2>
              <p className="text-sm text-slate-400">{result?.topic ?? ''}</p>
            </div>
            {result?.status && (
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {result.status}
              </span>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 flex-wrap">
            <TabButton label="Blog Post" active={activeTab === 'blog'} onClick={() => setActiveTab('blog')} />
            <TabButton label="Social Media" active={activeTab === 'social'} onClick={() => setActiveTab('social')} />
            <TabButton label="SEO" active={activeTab === 'seo'} onClick={() => setActiveTab('seo')} />
          </div>

          {/* Blog Post Tab */}
          {activeTab === 'blog' && result?.blog_post && (
            <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{result.blog_post?.title ?? 'Untitled'}</h3>
                  <p className="text-sm text-slate-400 mt-1">{result.blog_post?.meta_description ?? ''}</p>
                </div>
                {result.blog_post?.read_time && (
                  <span className="flex items-center gap-1 text-xs text-slate-400 flex-shrink-0 bg-slate-700/50 px-2.5 py-1 rounded-full">
                    <FiClock className="w-3 h-3" />
                    {result.blog_post.read_time}
                  </span>
                )}
              </div>
              <div className="border-t border-slate-700/50 pt-4">
                {renderMarkdown(result.blog_post?.content ?? '')}
              </div>
              <div className="flex gap-2 pt-2">
                <CopyButton text={result.blog_post?.content ?? ''} label="Copy Blog" />
              </div>
            </div>
          )}

          {/* Social Media Tab */}
          {activeTab === 'social' && result?.social_media && (
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <TabButton label="LinkedIn" active={socialTab === 'linkedin'} onClick={() => setSocialTab('linkedin')} />
                <TabButton label="X / Twitter" active={socialTab === 'twitter'} onClick={() => setSocialTab('twitter')} />
                <TabButton label="Facebook" active={socialTab === 'facebook'} onClick={() => setSocialTab('facebook')} />
                <TabButton label="Instagram" active={socialTab === 'instagram'} onClick={() => setSocialTab('instagram')} />
              </div>

              {socialTab === 'linkedin' && (
                <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <FiGlobe className="w-4 h-4 text-blue-400" />
                    <h3 className="font-semibold text-slate-200 text-sm">LinkedIn Post</h3>
                  </div>
                  <div className="whitespace-pre-wrap text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-lg border border-slate-700/30">
                    {result.social_media?.linkedin ?? ''}
                  </div>
                  <CopyButton text={result.social_media?.linkedin ?? ''} />
                </div>
              )}

              {socialTab === 'twitter' && (
                <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <HiOutlineHashtag className="w-4 h-4 text-sky-400" />
                    <h3 className="font-semibold text-slate-200 text-sm">X / Twitter Thread</h3>
                  </div>
                  <div className="space-y-2">
                    {Array.isArray(result.social_media?.twitter_thread) &&
                      result.social_media.twitter_thread.map((tweet, idx) => (
                        <div key={idx} className="flex gap-3 items-start bg-slate-900/50 p-3 rounded-lg border border-slate-700/30">
                          <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {idx + 1}
                          </span>
                          <p className="text-sm text-slate-300 leading-relaxed">{tweet}</p>
                        </div>
                      ))}
                  </div>
                  <CopyButton text={Array.isArray(result.social_media?.twitter_thread) ? result.social_media.twitter_thread.join('\n\n') : ''} label="Copy Thread" />
                </div>
              )}

              {socialTab === 'facebook' && (
                <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <FiGlobe className="w-4 h-4 text-blue-500" />
                    <h3 className="font-semibold text-slate-200 text-sm">Facebook Post</h3>
                  </div>
                  <div className="whitespace-pre-wrap text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-lg border border-slate-700/30">
                    {result.social_media?.facebook ?? ''}
                  </div>
                  <CopyButton text={result.social_media?.facebook ?? ''} />
                </div>
              )}

              {socialTab === 'instagram' && (
                <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <FiGrid className="w-4 h-4 text-pink-400" />
                    <h3 className="font-semibold text-slate-200 text-sm">Instagram Caption</h3>
                  </div>
                  <div className="whitespace-pre-wrap text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-lg border border-slate-700/30">
                    {result.social_media?.instagram_caption ?? ''}
                  </div>
                  <CopyButton text={result.social_media?.instagram_caption ?? ''} />
                </div>
              )}
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && result?.seo_recommendations && (
            <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-5">
              <div className="flex items-center gap-2">
                <FiTarget className="w-4 h-4 text-violet-400" />
                <h3 className="font-semibold text-slate-200">SEO Recommendations</h3>
              </div>

              {/* Keywords */}
              {Array.isArray(result.seo_recommendations?.primary_keywords) && result.seo_recommendations.primary_keywords.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Primary Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.seo_recommendations.primary_keywords.map((kw, idx) => (
                      <span key={idx} className="px-3 py-1 text-xs rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Meta */}
              <div className="space-y-3">
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Meta Title</h4>
                  <p className="text-sm text-slate-300 bg-slate-900/50 px-3 py-2 rounded-lg border border-slate-700/30">
                    {result.seo_recommendations?.meta_title ?? '--'}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Meta Description</h4>
                  <p className="text-sm text-slate-300 bg-slate-900/50 px-3 py-2 rounded-lg border border-slate-700/30">
                    {result.seo_recommendations?.meta_description ?? '--'}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Readability Score</h4>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-sm rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                    <FiStar className="w-3.5 h-3.5" />
                    {result.seo_recommendations?.readability_score ?? '--'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================================
// VIEW: DRAFT EDITOR
// ============================================================

function DraftEditorView({
  initialContent,
  onAcceptChanges,
  sampleMode,
  activeAgentId,
  setActiveAgentId,
}: {
  initialContent: string
  onAcceptChanges: (content: string) => void
  sampleMode: boolean
  activeAgentId: string | null
  setActiveAgentId: (id: string | null) => void
}) {
  const [draftContent, setDraftContent] = useState(initialContent)
  const [instructions, setInstructions] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<DraftEditorResult | null>(null)
  const [changesExpanded, setChangesExpanded] = useState(true)

  useEffect(() => {
    if (initialContent) {
      setDraftContent(initialContent)
    }
  }, [initialContent])

  useEffect(() => {
    if (sampleMode && !result && !loading) {
      setResult(SAMPLE_EDITOR_RESULT as DraftEditorResult)
      if (!draftContent) {
        setDraftContent(SAMPLE_CONTENT_PACKAGE.blog_post.content)
      }
    }
    if (!sampleMode && result === SAMPLE_EDITOR_RESULT) {
      setResult(null)
    }
  }, [sampleMode])

  const handleRefine = useCallback(async () => {
    if (!draftContent.trim()) return
    setLoading(true)
    setError(null)
    setActiveAgentId(AGENT_IDS.DRAFT_EDITOR)
    try {
      let message = `Please review and refine the following content draft:\n\n${draftContent}`
      if (instructions.trim()) {
        message += `\n\nEditing instructions: ${instructions}`
      }
      const res = await callAIAgent(message, AGENT_IDS.DRAFT_EDITOR)
      if (res.success) {
        const data = res?.response?.result as DraftEditorResult | undefined
        if (data) {
          setResult(data)
        } else {
          setError('Received an empty response from the editor.')
        }
      } else {
        setError(res?.error ?? 'Failed to refine draft. Please try again.')
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
      setActiveAgentId(null)
    }
  }, [draftContent, instructions, setActiveAgentId])

  const handleAccept = useCallback(() => {
    if (result?.edited_content) {
      setDraftContent(result.edited_content)
      onAcceptChanges(result.edited_content)
    }
  }, [result, onAcceptChanges])

  const qualityScore = typeof result?.quality_score === 'number' ? result.quality_score : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Draft Editor</h1>
        <p className="text-slate-400 text-sm">Refine and polish your content with AI-powered editorial review.</p>
      </div>

      {/* Input Section */}
      <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Content Draft *</label>
          <textarea
            value={draftContent}
            onChange={(e) => setDraftContent(e.target.value)}
            placeholder="Paste your content draft here, or navigate from the Generate Content section..."
            rows={10}
            className="w-full px-4 py-2.5 rounded-lg bg-slate-900/70 border border-slate-700 text-slate-200 text-sm placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-colors resize-y font-mono leading-relaxed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Editing Instructions (optional)</label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="e.g., Make it more concise, add more data points, adjust tone to be more formal..."
            rows={2}
            className="w-full px-4 py-2.5 rounded-lg bg-slate-900/70 border border-slate-700 text-slate-200 text-sm placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-colors resize-none"
          />
        </div>
        <button
          onClick={handleRefine}
          disabled={loading || !draftContent.trim()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-violet-600/20"
        >
          {loading ? <FiRefreshCw className="w-4 h-4 animate-spin" /> : <FiEdit3 className="w-4 h-4" />}
          {loading ? 'Refining...' : 'Refine Draft'}
        </button>
      </div>

      {/* Loading */}
      {loading && <Spinner text="Reviewing and polishing your draft..." />}

      {/* Error */}
      {error && <InlineError message={error} onRetry={handleRefine} />}

      {/* Results */}
      {!loading && result && (
        <div className="space-y-4">
          {/* Score and Summary Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Quality Score */}
            {qualityScore !== null && (
              <div className={`p-4 rounded-xl border ${getScoreBg(qualityScore)} flex items-center gap-3`}>
                <div className={`text-3xl font-bold ${getScoreColor(qualityScore)}`}>
                  {qualityScore.toFixed(1)}
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Quality Score</p>
                  <p className={`text-sm font-medium ${getScoreColor(qualityScore)}`}>
                    {qualityScore >= 8 ? 'Excellent' : qualityScore >= 6 ? 'Good' : 'Needs Work'}
                  </p>
                </div>
              </div>
            )}

            {/* Brand Voice */}
            {result?.brand_voice_alignment && (
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 col-span-1 md:col-span-2">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Brand Voice Alignment</p>
                <p className="text-sm text-slate-300">{result.brand_voice_alignment}</p>
              </div>
            )}
          </div>

          {/* Editorial Summary */}
          {result?.editorial_summary && (
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Editorial Summary</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{result.editorial_summary}</p>
            </div>
          )}

          {/* Changes Made */}
          {Array.isArray(result?.changes_made) && result.changes_made.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <button
                onClick={() => setChangesExpanded(!changesExpanded)}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Changes Made ({result.changes_made.length})
                </h3>
                {changesExpanded ? <FiChevronUp className="w-4 h-4 text-slate-500" /> : <FiChevronDown className="w-4 h-4 text-slate-500" />}
              </button>
              {changesExpanded && (
                <div className="mt-3 space-y-2">
                  {result.changes_made.map((change, idx) => (
                    <div key={idx} className="flex items-start gap-3 py-2 border-b border-slate-700/30 last:border-0">
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-violet-500/15 text-violet-300 border border-violet-500/20 flex-shrink-0">
                        {change?.type ?? '--'}
                      </span>
                      <p className="text-sm text-slate-300">{change?.description ?? ''}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Suggestions */}
          {Array.isArray(result?.suggestions) && result.suggestions.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Suggestions</h3>
              <ul className="space-y-2">
                {result.suggestions.map((sug, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <HiOutlineLightBulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    {sug}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Edited Content */}
          {result?.edited_content && (
            <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Edited Content</h3>
                <CopyButton text={result.edited_content} label="Copy" />
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/30 max-h-96 overflow-y-auto">
                {renderMarkdown(result.edited_content)}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleAccept}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
            >
              <HiOutlineCheckCircle className="w-4 h-4" />
              Accept Changes
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// VIEW: PUBLISHING
// ============================================================

function PublishingView({
  contentTitle,
  contentBody,
  sampleMode,
  activeAgentId,
  setActiveAgentId,
}: {
  contentTitle: string
  contentBody: string
  sampleMode: boolean
  activeAgentId: string | null
  setActiveAgentId: (id: string | null) => void
}) {
  const [publishForm, setPublishForm] = useState({
    pageTitle: contentTitle,
    tags: '',
    scheduledDate: '',
    scheduledTime: '09:00',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<PublishingResult | null>(null)
  const [previewExpanded, setPreviewExpanded] = useState(false)

  useEffect(() => {
    if (contentTitle) {
      setPublishForm((prev) => ({ ...prev, pageTitle: contentTitle }))
    }
  }, [contentTitle])

  useEffect(() => {
    if (sampleMode && !result && !loading) {
      setResult(SAMPLE_PUBLISHING_RESULT as PublishingResult)
    }
    if (!sampleMode && result === SAMPLE_PUBLISHING_RESULT) {
      setResult(null)
    }
  }, [sampleMode])

  const handlePublish = useCallback(async () => {
    if (!publishForm.pageTitle.trim()) return
    setLoading(true)
    setError(null)
    setActiveAgentId(AGENT_IDS.PUBLISHING)
    try {
      const scheduledDateTime = publishForm.scheduledDate && publishForm.scheduledTime
        ? `${publishForm.scheduledDate}T${publishForm.scheduledTime}:00`
        : ''
      const tagsArray = publishForm.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      const publishMessage = `Please publish the following content:

Title: ${publishForm.pageTitle}
${tagsArray.length > 0 ? `Tags: ${tagsArray.join(', ')}` : ''}
${scheduledDateTime ? `Scheduled Date: ${scheduledDateTime}` : 'Publish as soon as possible'}

Content:
${contentBody || 'No content body provided.'}

Please save this to Notion and create a Google Calendar event for the publishing date.`

      const res = await callAIAgent(publishMessage, AGENT_IDS.PUBLISHING)
      if (res.success) {
        const data = res?.response?.result as PublishingResult | undefined
        if (data) {
          setResult(data)
        } else {
          setError('Received an empty response from the publishing agent.')
        }
      } else {
        setError(res?.error ?? 'Failed to publish content. Please try again.')
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
      setActiveAgentId(null)
    }
  }, [publishForm, contentBody, setActiveAgentId])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Publish Content</h1>
        <p className="text-slate-400 text-sm">Save to Notion and schedule publishing via Google Calendar.</p>
      </div>

      {/* Content Preview */}
      {contentBody && (
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <button
            onClick={() => setPreviewExpanded(!previewExpanded)}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <HiOutlineDocumentText className="w-4 h-4 text-violet-400" />
              Content Preview
            </h3>
            {previewExpanded ? <FiChevronUp className="w-4 h-4 text-slate-500" /> : <FiChevronDown className="w-4 h-4 text-slate-500" />}
          </button>
          {previewExpanded && (
            <div className="mt-3 bg-slate-900/50 p-4 rounded-lg border border-slate-700/30 max-h-60 overflow-y-auto">
              {renderMarkdown(contentBody)}
            </div>
          )}
        </div>
      )}

      {/* Publishing Form */}
      <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-4">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Publishing Details</h3>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Page Title *</label>
          <input
            type="text"
            value={publishForm.pageTitle}
            onChange={(e) => setPublishForm((prev) => ({ ...prev, pageTitle: e.target.value }))}
            placeholder="Enter the title for the Notion page..."
            className="w-full px-4 py-2.5 rounded-lg bg-slate-900/70 border border-slate-700 text-slate-200 text-sm placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Tags (comma-separated)</label>
          <input
            type="text"
            value={publishForm.tags}
            onChange={(e) => setPublishForm((prev) => ({ ...prev, tags: e.target.value }))}
            placeholder="e.g., blog, AI voice agents, Q1-2026"
            className="w-full px-4 py-2.5 rounded-lg bg-slate-900/70 border border-slate-700 text-slate-200 text-sm placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-colors"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Publishing Date</label>
            <input
              type="date"
              value={publishForm.scheduledDate}
              onChange={(e) => setPublishForm((prev) => ({ ...prev, scheduledDate: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-900/70 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Publishing Time</label>
            <input
              type="time"
              value={publishForm.scheduledTime}
              onChange={(e) => setPublishForm((prev) => ({ ...prev, scheduledTime: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-900/70 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-colors"
            />
          </div>
        </div>
        <button
          onClick={handlePublish}
          disabled={loading || !publishForm.pageTitle.trim()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-violet-600/20"
        >
          {loading ? <FiRefreshCw className="w-4 h-4 animate-spin" /> : <HiOutlineRocketLaunch className="w-4 h-4" />}
          {loading ? 'Publishing...' : 'Publish to Notion & Schedule'}
        </button>
      </div>

      {/* Loading */}
      {loading && <Spinner text="Publishing content and creating calendar event..." />}

      {/* Error */}
      {error && <InlineError message={error} onRetry={handlePublish} />}

      {/* Results */}
      {!loading && result && (
        <div className="space-y-4">
          {/* Status Banner */}
          <div className={`p-4 rounded-xl border flex items-center gap-3 ${(result?.publishing_status ?? '').toLowerCase().includes('success') ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
            {(result?.publishing_status ?? '').toLowerCase().includes('success') ? (
              <HiOutlineCheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            ) : (
              <FiAlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
            )}
            <div>
              <p className="text-sm font-semibold text-slate-200">{result?.publishing_status ?? 'Unknown status'}</p>
              {result?.summary && <p className="text-xs text-slate-400 mt-0.5">{result.summary}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Notion Page */}
            {result?.notion_page && (
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-3">
                <div className="flex items-center gap-2">
                  <FiBookOpen className="w-4 h-4 text-violet-400" />
                  <h3 className="font-semibold text-slate-200 text-sm">Notion Page</h3>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-slate-500">Status</p>
                    <p className="text-sm text-slate-300">{result.notion_page?.status ?? '--'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Page Title</p>
                    <p className="text-sm text-slate-300">{result.notion_page?.page_title ?? '--'}</p>
                  </div>
                  {Array.isArray(result.notion_page?.tags) && result.notion_page.tags.length > 0 && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Tags</p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.notion_page.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-0.5 text-[10px] rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Calendar Event */}
            {result?.calendar_event && (
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-3">
                <div className="flex items-center gap-2">
                  <FiCalendar className="w-4 h-4 text-violet-400" />
                  <h3 className="font-semibold text-slate-200 text-sm">Calendar Event</h3>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-slate-500">Status</p>
                    <p className="text-sm text-slate-300">{result.calendar_event?.status ?? '--'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Event Title</p>
                    <p className="text-sm text-slate-300">{result.calendar_event?.event_title ?? '--'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Scheduled Date</p>
                    <p className="text-sm text-slate-300">{result.calendar_event?.scheduled_date ?? '--'}</p>
                  </div>
                  {Array.isArray(result.calendar_event?.reminders) && result.calendar_event.reminders.length > 0 && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Reminders</p>
                      <ul className="space-y-1">
                        {result.calendar_event.reminders.map((rem, idx) => (
                          <li key={idx} className="flex items-center gap-1.5 text-xs text-slate-400">
                            <FiClock className="w-3 h-3 text-slate-500" />
                            {rem}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// ERROR BOUNDARY
// ============================================================

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: '' }
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-slate-400 mb-4 text-sm">{this.state.error}</p>
            <button
              onClick={() => this.setState({ hasError: false, error: '' })}
              className="px-4 py-2 bg-violet-600 text-white rounded-md text-sm hover:bg-violet-500 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

// ============================================================
// MAIN PAGE COMPONENT
// ============================================================

export default function Page() {
  const [activeView, setActiveView] = useState<ViewType>('dashboard')
  const [sampleMode, setSampleMode] = useState(false)
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null)

  // Cross-view state
  const [selectedTopic, setSelectedTopic] = useState('')
  const [currentContentPackage, setCurrentContentPackage] = useState<ContentPackageResult | null>(null)
  const [currentEditedContent, setCurrentEditedContent] = useState('')

  // Navigation handlers
  const handleUseTopic = useCallback((topic: string) => {
    setSelectedTopic(topic)
    setActiveView('generate')
  }, [])

  const handleContentCreated = useCallback((pkg: ContentPackageResult) => {
    setCurrentContentPackage(pkg)
  }, [])

  const handleAcceptEditorChanges = useCallback((content: string) => {
    setCurrentEditedContent(content)
  }, [])

  const navigateToEditor = useCallback(() => {
    setActiveView('editor')
  }, [])

  const navigateToPublish = useCallback(() => {
    setActiveView('publish')
  }, [])

  // Derive content for editor and publisher
  const editorContent = currentEditedContent || currentContentPackage?.blog_post?.content || ''
  const publishTitle = currentContentPackage?.blog_post?.title || ''
  const publishBody = currentEditedContent || currentContentPackage?.blog_post?.content || ''

  const navItems = [
    { icon: <FiHome className="w-5 h-5" />, label: 'Dashboard', view: 'dashboard' as ViewType },
    { icon: <FiSearch className="w-5 h-5" />, label: 'Research Topics', view: 'topics' as ViewType },
    { icon: <HiOutlineSparkles className="w-5 h-5" />, label: 'Generate Content', view: 'generate' as ViewType },
    { icon: <FiEdit3 className="w-5 h-5" />, label: 'Edit Draft', view: 'editor' as ViewType },
    { icon: <HiOutlineRocketLaunch className="w-5 h-5" />, label: 'Publish', view: 'publish' as ViewType },
  ]

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-950 text-slate-200 flex">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 h-screen w-[72px] bg-slate-900/80 border-r border-slate-800 flex flex-col items-center py-5 gap-2 z-50">
          {/* Logo */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-violet-500 flex items-center justify-center mb-4 shadow-lg shadow-violet-600/30">
            <FiZap className="w-5 h-5 text-white" />
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-1.5 flex-1">
            {navItems.map((item) => (
              <SidebarButton
                key={item.view}
                icon={item.icon}
                label={item.label}
                active={activeView === item.view}
                onClick={() => setActiveView(item.view)}
              />
            ))}
          </nav>

          {/* Bottom Section */}
          <div className="flex flex-col items-center gap-2 mt-auto">
            <div className="w-8 h-px bg-slate-700 mb-1" />
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
              <FiActivity className="w-4 h-4" />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-[72px] flex-1 min-h-screen">
          {/* Top Bar */}
          <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-violet-400">Ortavox</span>
              <span className="text-slate-600">/</span>
              <span className="text-sm text-slate-400">
                {activeView === 'dashboard' && 'Dashboard'}
                {activeView === 'topics' && 'Topic Research'}
                {activeView === 'generate' && 'Generate Content'}
                {activeView === 'editor' && 'Draft Editor'}
                {activeView === 'publish' && 'Publish'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              {/* Sample Data Toggle */}
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <span className="text-xs text-slate-400">Sample Data</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={sampleMode}
                    onChange={() => setSampleMode(!sampleMode)}
                    className="sr-only"
                  />
                  <div className={`w-9 h-5 rounded-full transition-colors duration-200 ${sampleMode ? 'bg-violet-600' : 'bg-slate-700'}`}>
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${sampleMode ? 'translate-x-4' : ''}`} />
                  </div>
                </div>
              </label>

              {/* Quick Navigation Buttons (contextual) */}
              {activeView === 'generate' && currentContentPackage && (
                <div className="flex gap-2">
                  <button onClick={navigateToEditor} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors">
                    <FiEdit3 className="w-3.5 h-3.5" />
                    Edit Draft
                  </button>
                  <button onClick={navigateToPublish} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors">
                    <HiOutlineRocketLaunch className="w-3.5 h-3.5" />
                    Publish
                  </button>
                </div>
              )}
              {activeView === 'editor' && currentEditedContent && (
                <button onClick={navigateToPublish} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors">
                  <HiOutlineRocketLaunch className="w-3.5 h-3.5" />
                  Publish
                </button>
              )}
            </div>
          </header>

          {/* Content Area */}
          <div className="flex">
            <div className="flex-1 p-6 max-w-5xl">
              {activeView === 'dashboard' && (
                <DashboardView onNavigate={setActiveView} sampleMode={sampleMode} />
              )}
              {activeView === 'topics' && (
                <TopicResearchView
                  onUseTopic={handleUseTopic}
                  sampleMode={sampleMode}
                  activeAgentId={activeAgentId}
                  setActiveAgentId={setActiveAgentId}
                />
              )}
              {activeView === 'generate' && (
                <ContentGenerationView
                  initialTopic={selectedTopic}
                  onContentCreated={handleContentCreated}
                  sampleMode={sampleMode}
                  activeAgentId={activeAgentId}
                  setActiveAgentId={setActiveAgentId}
                />
              )}
              {activeView === 'editor' && (
                <DraftEditorView
                  initialContent={editorContent}
                  onAcceptChanges={handleAcceptEditorChanges}
                  sampleMode={sampleMode}
                  activeAgentId={activeAgentId}
                  setActiveAgentId={setActiveAgentId}
                />
              )}
              {activeView === 'publish' && (
                <PublishingView
                  contentTitle={publishTitle}
                  contentBody={publishBody}
                  sampleMode={sampleMode}
                  activeAgentId={activeAgentId}
                  setActiveAgentId={setActiveAgentId}
                />
              )}
            </div>

            {/* Right Sidebar - Agent Status */}
            <div className="hidden xl:block w-64 p-6 pt-6 space-y-4 flex-shrink-0">
              <AgentStatusPanel activeAgentId={activeAgentId} />

              {/* Workflow Progress */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Workflow Progress</h3>
                <div className="space-y-2.5">
                  {[
                    { label: 'Research', done: !!currentContentPackage || activeView !== 'dashboard' },
                    { label: 'Generate', done: !!currentContentPackage },
                    { label: 'Edit', done: !!currentEditedContent },
                    { label: 'Publish', done: false },
                  ].map((step, i) => (
                    <div key={step.label} className="flex items-center gap-2.5">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${step.done ? 'border-violet-500 bg-violet-500/20' : 'border-slate-600'}`}>
                        {step.done && <FiCheck className="w-3 h-3 text-violet-400" />}
                      </div>
                      <span className={`text-xs ${step.done ? 'text-slate-300' : 'text-slate-500'}`}>{step.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  )
}
