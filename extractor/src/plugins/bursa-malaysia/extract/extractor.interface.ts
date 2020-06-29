
export interface TableExtractor extends Extractor{
    tableValidation($: CheerioStatic);
}


export interface Extractor{
    pageValidation($: CheerioStatic);
}