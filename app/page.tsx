import { redirect } from "next/navigation";

import { WorkflowPlayground } from "@/components/playground/WorkflowPlayground";

export default function HomePage() {
  if (process.env.DEPLOY_TARGET === "github-pages") {
    return <WorkflowPlayground />;
  }

  redirect("/playground");
}
