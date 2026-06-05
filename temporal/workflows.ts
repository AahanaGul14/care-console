import { proxyActivities } from '@temporalio/workflow';
import type * as activities from './activities';

const {
  createTelehealthChannel,
  waitForParamedicNotes,
  waitForDoctorConsultation,
  archiveCase,
} = proxyActivities<typeof activities>({
  startToCloseTimeout: '24 hours',
  retry: {
    maximumAttempts: 3,
    initialInterval: '1s',
    backoffCoefficient: 2,
  },
});

export async function telehealthOnboardingWorkflow(
  caseId: string
): Promise<string> {
  console.log(`[Workflow] Starting for case ${caseId}`);

  await createTelehealthChannel(caseId);

  await waitForParamedicNotes(caseId);

  await waitForDoctorConsultation(caseId);

  await archiveCase(caseId);

  console.log(`[Workflow] Completed for case ${caseId} ✅`);

  return `Case ${caseId} completed successfully`;
}