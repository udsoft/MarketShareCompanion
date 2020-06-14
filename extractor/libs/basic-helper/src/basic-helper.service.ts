import { Injectable } from '@nestjs/common';

@Injectable()
export class BasicHelperService {

    getFilledArrayWithIncrementalNumber = (length: number) => {
        return Array(length).fill(0).map((e, i) => i + 1);
    }
}
