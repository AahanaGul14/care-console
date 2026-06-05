import { Client, Connection } from '@temporalio/client';

async function triggerWorkflow(caseId: string) {
  try {
    console.log('Connecting to Temporal...');

    const connection = await Connection.connect({
      address: '127.0.0.1:7233',
    });

    const client = new Client({ connection });

    const handle = await client.workflow.start('telehealthOnboardingWorkflow', {
      taskQueue: 'telehealth-queue',
      workflowId: `telehealth-${caseId}`,
      args: [caseId],
    });

    console.log('✅ Workflow started:', handle.workflowId);
    await connection.close();
    process.exit(0);

  } catch (err: any) {
    console.error('❌ Failed:', err.message);
    process.exit(1);
  }
}

const caseId = process.argv[2];
if (!caseId) {
  console.error('Usage: npm run trigger <caseId>');
  process.exit(1);
}

triggerWorkflow(caseId);