import { JobManager } from "libs-job-manager";
import { TwitterPostResult, TwitterRequest, TwitterResult } from 'src/interface/TwitterInterface';
import { TwitterPostJob } from '../jobs/TwitterPostJob';
import { logger } from '../util/Logger';

export class PostingJobManager extends JobManager<
        TwitterRequest, 
        TwitterPostResult, 
        TwitterPostJob
    > {

    onResult(jobResult: TwitterPostResult): void {
        logger.log(jobResult)
        jobResult.done();
    }
}