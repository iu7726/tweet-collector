import { createJsonTypeInstance } from 'amqmodule';
import dotenv from 'dotenv';
import ConnectionPool from 'libs-connection-pool';
import { Mode } from 'libs-job-manager';
import { TwitterJob } from './jobs/TwitterJob';
import { TwitterPostJob } from './jobs/TwitterPostJob';
import { TwitterUserJob } from './jobs/TwitterUserJob';
import { PostingJobManager } from './managers/PostingJobManager';
import { TwitterJobManager } from './managers/TwitterJobManager';
import { useModel } from './models';
import { RoutingKey } from './util/Constants';
import { initLogger, logger } from "./util/Logger";
import { EnumKey } from './util/Utils';

dotenv.config();

(async () => {
    initLogger('OG-worker');

    logger.load("og community worker starting...")
    logger.log("NODE_ENV :", process.env.NODE_ENV)
    const cp = new ConnectionPool(
        {
            host: String(process.env.MYSQL_HOST),
            writerHost: String(process.env.MYSQL_HOST),
            readerHost: String(process.env.MYSQL_RO_HOST),
            user: String(process.env.MYSQL_USER),
            password: String(process.env.MYSQL_PASSWORD),
            database: String(process.env.MYSQL_DATABASE),
        }
    );

    logger.log("cp connect complete...")
    const mqInstance = await createJsonTypeInstance({
        host: String(process.env.MQ_HOST),
        id: String(process.env.MQ_ID),
        pw: String(process.env.MQ_PW),
        port: parseInt(String(process.env.MQ_PORT))
    })
    mqInstance.setExchange(String(process.env.MQ_EXCHANGE_ALPHA))

    logger.log("mq connect complete...")

    logger.log("Tweet Consumer Setting...")

    const twitterJobManager = new TwitterJobManager(cp, mqInstance).setMode(Mode.Sync);
    const postingJobManager = new PostingJobManager().setMode(Mode.Async);

    const model = useModel(cp);

    let isConsumed = false;

    mqInstance.consume(RoutingKey.POSTING, (payload, done: () => void) => {
        logger.log("Event", EnumKey(RoutingKey)(RoutingKey.POSTING), payload);

        postingJobManager.addJob(new TwitterPostJob({
            twitterUserId: payload.twitterUserId,
            done: done,
        }, model))
    }, 10)


    mqInstance.consume(RoutingKey.PROFILE, (payload, done: () => void) => {
        logger.log("Event", EnumKey(RoutingKey)(RoutingKey.PROFILE), payload);

        isConsumed = true;

        twitterJobManager.addJob(new TwitterUserJob({
            twitterUserId: payload.twitterUserId,
            done: done,
        }, model))
    }, 1)


    mqInstance.consume(RoutingKey.TWEET, (payload, done: () => void) => {
        logger.log("Event", EnumKey(RoutingKey)(RoutingKey.TWEET), payload);

        isConsumed = true;

        twitterJobManager.addJob(new TwitterJob({
            twitterUserId: payload.twitterUserId,
            twitterUserTwitterId: payload.twitterUserTwitterId,
            lastAccessTime: payload.lastAccessTime,
            done: done,
        }, model))
    }, 1)

    logger.log("Tweet Consumer Complete...")

    logger.log("og community started...")

    setTimeout(() => {
        if (!isConsumed) {
            logger.info("Start Getting Twitter")
            mqInstance.publish(String(process.env.MQ_QUEUE_TWITTER_PROFILE), {
                twitterUserId: 1
            })
        }
    }, 1000)

})();