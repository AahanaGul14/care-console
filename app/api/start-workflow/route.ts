import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const { caseId } = await req.json();

    if (!caseId) {
      return NextResponse.json({ error: "caseId is required" }, { status: 400 });
    }

    console.log("POST /api/start-workflow hit");
    console.log("Received caseId:", caseId);

    const projectRoot = process.cwd();
    const triggerScript = path.join(projectRoot, "temporal", "trigger.ts");

    console.log("Triggering workflow via child process...");

    const { stdout, stderr } = await execAsync(
      `npx tsx "${triggerScript}" ${caseId}`,
      { cwd: projectRoot, timeout: 10000 }
    );

    if (stdout) console.log("Trigger output:", stdout);
    if (stderr) console.warn("Trigger stderr:", stderr);

    console.log("Workflow triggered successfully");
    return NextResponse.json({
      success: true,
      workflowId: `telehealth-${caseId}`,
    });

  } catch (err: any) {
    console.warn("Temporal trigger failed:", err?.message);
    return NextResponse.json({
      success: true,
      warning: "Patient registered. Workflow could not start.",
      workflowId: null,
    });
  }
}
