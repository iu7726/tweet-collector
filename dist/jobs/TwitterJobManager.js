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
        if (!jobResult.success)
            return;
        switch (jobResult.jobName) {
            case 'user':
                Logger_1.logger.log("onResult", jobResult.jobName, jobRequest.influencerId);
                const twitterUserResult = jobResult;
                this.amp.publish(String(process.env.MQ_QUEUE_TWITTER_TWEET), {
                    influencerId: Number(jobResult.influencerId),
                    twitterId: twitterUserResult.typeId,
                    startTime: twitterUserResult.lastAccessTime
                });
                break;
            case 'main':
                Logger_1.logger.log("onResult", jobResult.jobName, "ListCount", jobResult.listCount);
                const twitterJobResult = jobResult;
                this.amp.publish(String(process.env.MQ_QUEUE_TWITTER_POSTING), {
                    influencerId: jobRequest.influencerId,
                    twitterId: twitterJobResult.typeId,
                    startTime: twitterJobResult.lastAccessTime
                });
                this.amp.publish(String(process.env.MQ_QUEUE_TWITTER_PROFILE), {
                    influencerId: Number(jobResult.nextInfluercerId)
                });
                break;
            default:
                break;
        }
    }
}
exports.TwitterJobManager = TwitterJobManager;
