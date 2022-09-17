import { execSync, exec } from "child_process";

export interface Account {
  title: string;
  account: string;
  code: string;
}

function execute(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, { encoding: 'utf-8' }, (error, stdout) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    })
  })
}

export async function listAccounts(): Promise<Account[]> {
  const result = await execute('/usr/local/bin/ykman oath accounts code')
  const lines = result.split("\n");
  return lines
    .filter(it => !!it)
    .map(line => {
      const index = line.lastIndexOf(" ");
      const titleAndAccount = line.substring(0, index).trim();
      const code = line.substring(index + 1).trim();
      const [title, account] = titleAndAccount.split(":");
      return { title, account, code };
    });
}
