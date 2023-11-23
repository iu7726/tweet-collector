"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitterJobManager = void 0;
const libs_job_manager_1 = require("libs-job-manager");
const Logger_1 = require("../util/Logger");
class TwitterJobManager extends libs_job_manager_1.JobManager {
    constructor(cp, amp) {
        super();
        this.cp = cp;
        this.amp = amp;
    }
    onResult(jobResult, jobRequest) {
        jobResult.done();
        console.log(jobResult);
        if (!jobResult.success)
            return;
        switch (jobResult.jobName) {
            case 'user':
                const twitterUserResult = jobResult;
                Logger_1.logger.log("onResult", twitterUserResult.jobName, twitterUserResult.twitterUserId);
                this.amp.publish(String(process.env.MQ_QUEUE_TWITTER_TWEET), {
                    twitterUserId: twitterUserResult.twitterUserId,
                    twitterUserTwitterId: twitterUserResult.twitterUserTwitterId,
                    lastAccessTime: twitterUserResult.lastAccessTime
                });
                break;
            case 'main':
                const twitterJobResult = jobResult;
                Logger_1.logger.log("onResult", twitterJobResult.jobName, "ListCount", twitterJobResult.listCount);
                this.amp.publish(String(process.env.MQ_QUEUE_TWITTER_POSTING), {
                    twitterUserId: jobRequest.twitterUserId,
                });
                this.amp.publish(String(process.env.MQ_QUEUE_TWITTER_PROFILE), {
                    twitterUserId: Number(jobResult.nextTwitterUserId)
                });
                break;
            default:
                break;
        }
    }
}
exports.TwitterJobManager = TwitterJobManager;
