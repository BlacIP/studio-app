"use client"

import { useRouter } from "next/navigation"
import { DashboardHero } from "./components/dashboard-hero"
import { InquiryList } from "./components/inquiry-list"
import { ProjectGrid } from "./components/project-grid"
import { TaskList } from "./components/task-list"
import { inquirySamples, projectSamples, taskSamples } from "./components/dashboard-data"
import { useDashboardRedirect } from "./hooks/use-dashboard-redirect"

export default function Page() {
  const router = useRouter()
  const { showLoading, publicUrl } = useDashboardRedirect({ router })

  if (showLoading) {
    return (
      <div className="px-6 py-10 text-sm text-text-sub-600">
        Loading your studio workspace...
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <DashboardHero
        publicUrl={publicUrl}
        onCreateProject={() => null}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <ProjectGrid projects={projectSamples} onViewAll={() => null} />
        </div>

        <div className="space-y-6">
          <TaskList tasks={taskSamples} onViewAll={() => null} />
          <InquiryList inquiries={inquirySamples} onViewInbox={() => null} />
        </div>
      </div>
    </div>
  )
}
