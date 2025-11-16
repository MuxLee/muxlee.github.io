import { Pipe, PipeTransform } from '@angular/core';

type TrimOptions = 'end' | 'start';

@Pipe({
    name: 'trim'
})
export class TrimPipe implements PipeTransform {

    transform(value: string, options?: TrimOptions): string {
        if (options === 'end') {
            return value.trimEnd();
        }
        else if (options === 'start') {
            return value.trimStart();
        }
        
        return value.trim();
    }

}