import axios from "axios";
import { logger } from "../../util/Logger";
import { twitterUtil } from "../../util/Utils";

export default class DelayApiModel {
    constructor(private readonly delayTime:number = 3000){}

    protected getHeaders() {
        return { 'Authorization' : `Bearer ${process.env.TWITTER_BEARER_TOKEN}`}
    }

    async GET<T>(requestUrl:string):Promise<T|undefined>{
        const st = new Date().getTime();
        let result:T|undefined;
        try{
             const axiosResult = await axios.get(
                requestUrl,
                {
                    headers: this.getHeaders()
                }
            );
            result = axiosResult.data;
        }catch(e){
            logger.error(e);
        }
        
        const dt = new Date().getTime() - st;
        if( this.delayTime > dt  ){
            await twitterUtil.wait(this.delayTime -dt)
        }

        return result !== undefined ? result as T : undefined;
    }

}