"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { buildStudioBaseUrl } from "@/lib/studio-url"
import { useStudio } from "@/lib/hooks/use-studio"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SectionHeader } from "@/components/ui/section-header"
import * as StatusBadge from "@/components/ui/status-badge"
import * as ProgressBar from "@/components/ui/progress-bar"

const projectSamples = [
  {
    id: "p-1",
    title: "Modern Love Session",
    location: "Brooklyn, NY",
    status: "In progress",
    progress: 72,
    accent: "from-[#d1c5b3] via-[#e6dfd4] to-[#f3f1ec]",
  },
  {
    id: "p-2",
    title: "City Editorial",
    location: "SoHo Loft",
    status: "Review",
    progress: 48,
    accent: "from-[#cfd6df] via-[#e1e6ec] to-[#f3f6f9]",
  },
  {
    id: "p-3",
    title: "Golden Hour Portraits",
    location: "Santa Monica",
    status: "Uploading",
    progress: 86,
    accent: "from-[#e4c9b4] via-[#f2ddd0] to-[#fbf6f1]",
  },
]

const taskSamples = [
  {
    id: "t-1",
    title: "Select hero images for City Editorial",
    due: "Today",
  },
  {
    id: "t-2",
    title: "Send contract to Harper + Luca",
    due: "Tomorrow",
  },
  {
    id: "t-3",
    title: "Finalize edits for Golden Hour set",
    due: "Fri",
  },
]

const inquirySamples = [
  {
    id: "c-1",
    name: "Arianna Summers",
    type: "Couples session",
    status: "New",
    received: "2h ago",
  },
  {
    id: "c-2",
    name: "Mason Ward",
    type: "Brand shoot",
    status: "Waiting",
    received: "Yesterday",
  },
  {
    id: "c-3",
    name: "Hana + Jae",
    type: "Engagement",
    status: "Follow up",
    received: "2d ago",
  },
]

export default function Page() {
  const router = useRouter()
  const { data: studio, error: studioError, isValidating } = useStudio()
  const [studioSlug, setStudioSlug] = useState("")

  useEffect(() => {
    if (studioError) {
      router.replace("/login")
      return
    }
    if (!studio) {
      return
    }
    if (studio.status === "ONBOARDING") {
      router.replace("/onboarding")
      return
    }
    setStudioSlug(studio.slug || "")
  }, [router, studio, studioError])

  if (!studio && isValidating) {
    return (
      <div className="px-6 py-10 text-sm text-text-sub-600">
        Loading your studio workspace...
      </div>
    )
  }

  const publicUrl = studioSlug ? buildStudioBaseUrl(studioSlug) : ""

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 rounded-2xl border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-text-sub-600">
            Studio overview
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-text-strong-950">
            Studio dashboard
          </h1>
          <p className="mt-2 text-sm text-text-sub-600">
            Recent work, tasks, and inquiries in one calm view.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {publicUrl ? (
            <Button asChild variant="outline">
              <a href={publicUrl} target="_blank" rel="noreferrer">
                View public studio
              </a>
            </Button>
          ) : null}
          <Button>Create new project</Button>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <SectionHeader
            eyebrow="Recent"
            title="In-progress projects"
            description="Your most active projects, ready for the next move."
            action={<Button variant="ghost">View all</Button>}
          />
          <div className="grid gap-4 md:grid-cols-2">
            {projectSamples.map((project) => (
              <Card
                key={project.id}
                className="group overflow-hidden rounded-2xl border-stroke-soft-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative">
                  <div
                    className={`aspect-[4/3] w-full bg-gradient-to-br ${project.accent}`}
                  />
                  <div className="absolute left-4 top-4">
                    <StatusBadge.Root variant="stroke" status="pending">
                      <StatusBadge.Dot />
                      <span className="text-xs font-medium text-text-sub-600">
                        {project.status}
                      </span>
                    </StatusBadge.Root>
                  </div>
                </div>
                <div className="space-y-4 px-5 pb-5 pt-4">
                  <div>
                    <h3 className="text-lg font-semibold text-text-strong-950">
                      {project.title}
                    </h3>
                    <p className="text-sm text-text-sub-600">
                      {project.location}
                    </p>
                  </div>
                  <ProgressBar.Root value={project.progress} max={100} />
                  <div className="flex items-center justify-between text-xs text-text-sub-600">
                    <span>{project.progress}% complete</span>
                    <Button variant="ghost" size="sm">
                      Open
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="rounded-2xl border-stroke-soft-200 bg-bg-white-0 p-5 shadow-sm">
            <SectionHeader
              title="Priority tasks"
              description="Focus on what moves today forward."
              action={<Button variant="ghost">View all</Button>}
            />
            <div className="mt-4 space-y-3">
              {taskSamples.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-xl border border-stroke-soft-200 bg-bg-weak-50/60 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-text-strong-950">
                      {task.title}
                    </p>
                    <p className="text-xs text-text-sub-600">Due {task.due}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Done
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-2xl border-stroke-soft-200 bg-bg-white-0 p-5 shadow-sm">
            <SectionHeader
              title="Client inquiries"
              description="Stay responsive with fresh leads."
              action={<Button variant="ghost">View inbox</Button>}
            />
            <div className="mt-4 space-y-3">
              {inquirySamples.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stroke-soft-200 bg-bg-weak-50/60 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-text-strong-950">
                      {inquiry.name}
                    </p>
                    <p className="text-xs text-text-sub-600">
                      {inquiry.type} · {inquiry.received}
                    </p>
                  </div>
                  <Button size="sm">Respond</Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
