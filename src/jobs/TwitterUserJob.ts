import { Job } from "libs-job-manager";
import { ModelManager } from "../models";
import { TwitterRequest, TwitterUserResult } from "../interface/TwitterInterface";
import { logger } from "../util/Logger";
import { TwitterUser } from "../entity/TwitterUser.entity";

export class TwitterUserJob extends Job<TwitterRequest, TwitterUserResult> {

    constructor(jobRequest: TwitterRequest, private readonly model: ModelManager) {
        super(jobRequest);
    }

    async execute(): Promise<TwitterUserResult> {
        const nextTwitterUserId = await this.model.TwitterUser.getNextTwitterUser(this.request.twitterUserId);
        try {
            const influencer: TwitterUser|undefined = await this.model.TwitterUser.getTwitterUser(this.request.twitterUserId);
            if( influencer ){
                await this.updateUserProfile(influencer.twitterId);
                return {
                    success: true,
                    jobName: 'user',
                    twitterUserId: this.request.twitterUserId,
                    nextTwitterUserId: nextTwitterUserId,
                    twitterUserTwitterId: influencer.twitterId,
                    lastAccessTime:influencer.lastAccessTime,
                    done: this.request.done,
                }
            }

        } catch (err) {
            logger.error(err)
        }
        return {
            success:false,
            jobName: 'user',
            twitterUserId: this.request.twitterUserId,
            nextTwitterUserId: nextTwitterUserId,
            done:this.request.done
        }
    }

    async updateUserProfile(twitterUserTwitterId: string): Promise<void> {

        const user = await this.model.TwitterApi.getUserInfo(twitterUserTwitterId);

        if (user) {
            const info = user;
            console.log(info);
            await this.model.TwitterUser.updateTwitterUser(twitterUserTwitterId, {
                username: info.username,
                name: info.name,
                profileImagePath: info.profile_image_url,
                verified: info.verified
            });
        }

    }

}