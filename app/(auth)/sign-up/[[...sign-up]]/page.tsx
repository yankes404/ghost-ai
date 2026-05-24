import { SignUp } from "@clerk/nextjs"
import { Cpu, Share2, ScrollText } from "lucide-react"

const features = [
  {
    icon: Cpu,
    title: "AI Architecture Generation",
    description: "Describe your system, AI maps it to nodes and edges on a live canvas.",
  },
  {
    icon: Share2,
    title: "Real-time Collaboration",
    description: "Live cursors, presence indicators, and shared node editing across your team.",
  },
  {
    icon: ScrollText,
    title: "Instant Spec Generation",
    description: "Export a complete Markdown technical spec directly from the canvas graph.",
  },
]

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 flex-col bg-surface border-r border-surface-border px-14 py-10">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-brand flex items-center justify-center">
            <Share2 className="h-4 w-4 text-base" />
          </div>
          <span className="text-sm font-semibold text-copy-primary tracking-tight">Ghost AI</span>
        </div>

        <div className="flex flex-1 flex-col justify-center max-w-md">
          <h1 className="text-3xl font-bold text-copy-primary leading-snug">
            Design systems at the<br />speed of thought.
          </h1>
          <p className="mt-4 text-sm text-copy-secondary leading-relaxed">
            Describe your architecture in plain English. Ghost AI maps it to a shared canvas your whole team can refine in real time.
          </p>

          <div className="mt-10 space-y-7">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="h-9 w-9 shrink-0 rounded-lg bg-accent-dim flex items-center justify-center">
                  <Icon className="h-4 w-4 text-brand" />
                </div>
                <div>
                  <p className="text-sm font-medium text-copy-primary">{title}</p>
                  <p className="mt-0.5 text-sm text-copy-secondary">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-copy-muted">© 2026 Ghost AI. All rights reserved.</p>
      </div>

      <div className="flex flex-1 lg:w-1/2 items-center justify-center bg-base px-6">
        <SignUp />
      </div>
    </div>
  )
}
