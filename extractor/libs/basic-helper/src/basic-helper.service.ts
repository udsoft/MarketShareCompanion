import { Injectable } from '@nestjs/common';
import Axios from 'axios';

@Injectable()
export class BasicHelperService {

    getFilledArrayWithIncrementalNumber = (length: number) => {
        return Array(length).fill(0).map((e, i) => i + 1);
    }

    
    /**
     * Browser the url using the href and load the cheerio static.
     * @param url Url which need to be loaded as cheerio static
     */
    loadPage= async (url: URL): Promise<CheerioStatic> => {
        const href = url.href;
        const html = (await Axios.get(href)).data;
        const $ = cheerio.load(html);
        return $;
    }

}
