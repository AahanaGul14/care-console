import { Worker } from '@temporalio/worker';
import * as activities from './activities';

async function runWorker() {
  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflows'),
    activities,
    taskQueue: 'telehealth-queue',
  });

  console.log('🚀 Temporal worker started. Listening on telehealth-queue...');
  await worker.run();
}

runWorker().catch((err) => {
  console.error('Worker failed to start:', err);
  process.exit(1);
});