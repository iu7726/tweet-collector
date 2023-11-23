"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostingJobManager = void 0;
const libs_job_manager_1 = require("libs-job-manager");
const Logger_1 = require("../util/Logger");
class PostingJobManager extends libs_job_manager_1.JobManager {
    onResult(jobResult) {
        Logger_1.logger.log(jobResult);
        jobResult.done();
    }
}
exports.PostingJobManager = PostingJobManager;
