import { Pipe, PipeTransform  } from '@angular/core';

@Pipe({
  name: 'arrayJoin'
})
export class ArrayJoinPipe implements PipeTransform {

  transform (input: any, character: string = ''): any {

    if (!Array.isArray(input)) {
      return input;
    }

    return input.join(character);

  }

}
