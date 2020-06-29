import { promises } from "fs";
import { join } from "path";
import { cwd } from "process";
import cheerio = require('cheerio');
import { SharedExtractor} from '../../shared/shared.extractor'
import { TestingModule, Test } from "@nestjs/testing";

describe('Shared component of across extractor', () => {

    let passMockHtml: CheerioStatic;
    let service: SharedExtractor;

    beforeEach(async () => {

        const goodFilePath = join(cwd(),
            'src', 'plugins', 'bursa-malaysia',
            'extract', 'shared',
            'spec', 'mock', 'shared_page_1.html')

        const cheerioStatic = async (filePath: string) => {
            const htmlPage = await promises.readFile(filePath);
            return cheerio.load(htmlPage);
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [SharedExtractor],
            imports: []
        }).compile()

        service = module.get<SharedExtractor>(SharedExtractor);
        passMockHtml = await cheerioStatic(goodFilePath)

    })


    it('should get the correct total number of pages', async () => {
        const totalPage = service.totalPage(passMockHtml);
        expect(totalPage).toBe(77);

    })

})