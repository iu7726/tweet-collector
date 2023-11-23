"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPointJobManager = void 0;
const libs_job_manager_1 = require("libs-job-manager");
const Utils_1 = require("../util/Utils");
class UserPointJobManager extends libs_job_manager_1.JobManager {
    constructor(cp) {
        super();
        this.cp = cp;
    }
    onResult(jobResult) {
        if (!jobResult.success) {
            (0, Utils_1.sendSlack)(`[User Point Job Manager] - ${jobResult.msg}`);
        }
    }
}
exports.UserPointJobManager = UserPointJobManager;
