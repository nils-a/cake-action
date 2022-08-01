import * as fs from 'fs';
import * as path from 'path';
import * as ini from 'ini';
import { Platform } from './platform';

export class ToolsDirectory {
  private readonly _path: string;

  constructor(path: string|null = null) {
    if (!path) {
      path = this.getDefaultToolsFolder();
    }

    this._path = path as string;
  }

  get path(): string {
    return path.normalize(this._path);
  }

  getDefaultToolsFolder(): string {
    if (fs.existsSync('./cake.config')) {
      const cfg = ini.parse(fs.readFileSync('./cake.config', 'utf-8'));
      const folder = cfg['paths']?.['tools'] as string;
      if (folder) {
        return folder.replace('\\', '/');
      }
    }

    return "tools";
  }

  create() {
    if (!fs.existsSync(this.path)) {
      fs.mkdirSync(this.path);
    }
  }

  append(...segment: string[]): string {
    return path.join(this.path, ...segment);
  }

  containsFile(fileName: string, ...subdirectory: string[]): boolean {
    return fs.existsSync(this.append(...subdirectory, fileName));
  }

  containsTool(toolName: string): boolean {
    const executableName = Platform.isWindows() ? `${toolName}.exe` : toolName;
    return this.containsFile(executableName);
  }

  containsToolWithVersion(packageId: string, version: string): boolean {
    return this.containsFile('project.assets.json', '.store', packageId, version);
  }

  toString(): string {
    return this.path;
  }
}
