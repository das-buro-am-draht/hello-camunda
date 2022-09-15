import { ZBClient } from 'zeebe-node';
import * as path from 'path';
import * as fs from 'fs/promises';

const getProcessFilesDir = (): string =>
  path.resolve(process.cwd(), 'processes');

const getFilePaths = async (rootDir: string, fileEnding: string) => {
  const dirContent = await fs.readdir(rootDir, { withFileTypes: true });
  return dirContent
    .filter(
      (fileDescript) =>
        fileDescript.name.endsWith(`.${fileEnding}`) && fileDescript.isFile(),
    )
    .map((fileDescript) => path.resolve(rootDir, fileDescript.name));
};

const getProcessFilesPaths = async () => {
  const configDir = getProcessFilesDir();
  return getFilePaths(configDir, 'bpmn');
};

export const deployProcesses = async (zbClient: ZBClient) => {
  const processFiles = await getProcessFilesPaths();
  console.debug('About to deploy process files', processFiles);
  const deployResult = await zbClient.deployProcess(processFiles);
  deployResult.processes.forEach((processMeta) =>
    console.debug('Deployed process', processMeta.bpmnProcessId),
  );

  return {
    deployed: deployResult.processes,
  };
};
