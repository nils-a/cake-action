"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const exec_1 = require("@actions/exec");
const toolsDirectory_1 = require("./toolsDirectory");
const platform_1 = require("./platform");
const dotnetToolInstall = 'dotnet tool install';
const dotnetCake = 'dotnet-cake';
class DotNet {
    static disableTelemetry() {
        core.exportVariable('DOTNET_CLI_TELEMETRY_OPTOUT', '1');
    }
    static installLocalCakeTool(targetDirectory = new toolsDirectory_1.ToolsDirectory()) {
        return __awaiter(this, void 0, void 0, function* () {
            const cakeTool = platform_1.Platform.isWindows() ? `${dotnetCake}.exe` : dotnetCake;
            if (targetDirectory.containsFile(cakeTool)) {
                core.info(`The Cake.Tool already exists in ${targetDirectory}, skipping installation`);
                return;
            }
            return DotNet.installLocalTool('Cake.Tool', targetDirectory);
        });
    }
    static installLocalTool(toolName, targetDirectory = new toolsDirectory_1.ToolsDirectory()) {
        return __awaiter(this, void 0, void 0, function* () {
            const exitCode = yield exec_1.exec(dotnetToolInstall, ['--tool-path', targetDirectory.path, toolName]);
            if (exitCode != 0) {
                throw new Error(`Failed to install ${toolName}. Exit code: ${exitCode}`);
            }
        });
    }
}
exports.DotNet = DotNet;