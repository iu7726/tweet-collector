"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitterUserJob = void 0;
const libs_job_manager_1 = require("libs-job-manager");
const Logger_1 = require("../util/Logger");
class TwitterUserJob extends libs_job_manager_1.Job {
    constructor(jobRequest, model) {
        super(jobRequest);
        this.model = model;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const nextTwitterUserId = yield this.model.TwitterUser.getNextTwitterUser(this.request.twitterUserId);
            try {
                const influencer = yield this.model.TwitterUser.getTwitterUser(this.request.twitterUserId);
                if (influencer) {
                    yield this.updateUserProfile(influencer.twitterId);
                    return {
                        success: true,
                        jobName: 'user',
                        twitterUserId: this.request.twitterUserId,
                        nextTwitterUserId: nextTwitterUserId,
                        twitterUserTwitterId: influencer.twitterId,
                        lastAccessTime: influencer.lastAccessTime,
                        done: this.request.done,
                    };
                }
            }
            catch (err) {
                Logger_1.logger.error(err);
            }
            return {
                success: false,
                jobName: 'user',
                twitterUserId: this.request.twitterUserId,
                nextTwitterUserId: nextTwitterUserId,
                done: this.request.done
            };
        });
    }
    updateUserProfile(twitterUserTwitterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.model.TwitterApi.getUserInfo(twitterUserTwitterId);
            if (user) {
                const info = user;
                console.log(info);
                yield this.model.TwitterUser.updateTwitterUser(twitterUserTwitterId, {
                    username: info.username,
                    name: info.name,
                    profileImagePath: info.profile_image_url,
                    verified: info.verified
                });
            }
        });
    }
}
exports.TwitterUserJob = TwitterUserJob;
