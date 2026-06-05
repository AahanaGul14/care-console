export async function createTelehealthChannel(caseId: string): Promise<void> {
  console.log(`[Activity] Channel created for case ${caseId}`);
}

export async function waitForParamedicNotes(caseId: string): Promise<void> {
  console.log(`[Activity] Waiting for paramedic notes on case ${caseId}`);

  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log(`[Activity] Paramedic notes confirmed for case ${caseId}`);
}

export async function waitForDoctorConsultation(caseId: string): Promise<void> {
  console.log(`[Activity] Waiting for doctor consultation on case ${caseId}`);

  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log(`[Activity] Doctor consultation confirmed for case ${caseId}`);
}

export async function archiveCase(caseId: string): Promise<void> {
  console.log(`[Activity] Archiving case ${caseId}`);
  console.log(`[Activity] Case ${caseId} archived. Workflow complete. ✅`);
}