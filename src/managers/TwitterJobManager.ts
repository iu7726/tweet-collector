import { AMQModule } from 'amqmodule';
import ConnectionPool from 'libs-connection-pool';
import { JobManager } from "libs-job-manager";
import { TwitterJobRequest, TwitterRequest, TwitterJobResult, TwitterUserResult } from 'src/interface/TwitterInterface';
import { TwitterJob } from '../jobs/TwitterJob';
import { TwitterUserJob } from '../jobs/TwitterUserJob';
import { logger } from '../util/Logger';

export class TwitterJobManager extends JobManager<
    TwitterRequest | TwitterJobRequest,
    TwitterUserResult | TwitterJobResult,
    TwitterJob | TwitterUserJob
> {
    constructor(private readonly cp: ConnectionPool, private readonly amp: AMQModule<any>) {
        super();
    }

    onResult(jobResult: TwitterUserResult | TwitterJobResult, jobRequest: TwitterRequest): void {

        jobResult.done();
        console.log(jobResult);
        if (!jobResult.success) return;

        switch (jobResult.jobName) {
            case 'user':
                const twitterUserResult = jobResult as TwitterUserResult;
                logger.log("onResult", twitterUserResult.jobName, twitterUserResult.twitterUserId)
        
                this.amp.publish(String(process.env.MQ_QUEUE_TWITTER_TWEET), {
                    twitterUserId: twitterUserResult.twitterUserId,
                    twitterUserTwitterId: twitterUserResult.twitterUserTwitterId,
                    lastAccessTime: twitterUserResult.lastAccessTime
                })
                break;
            case 'main':
                const twitterJobResult = jobResult as TwitterJobResult;
                logger.log("onResult", twitterJobResult.jobName, "ListCount", twitterJobResult.listCount)

                this.amp.publish(String(process.env.MQ_QUEUE_TWITTER_POSTING), {
                    twitterUserId: jobRequest.twitterUserId,
                })

                this.amp.publish(String(process.env.MQ_QUEUE_TWITTER_PROFILE), {
                    twitterUserId: Number(jobResult.nextTwitterUserId)
                })
                break;
            default:
                break;
        }
    }
}