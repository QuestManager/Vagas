import { Pipe, PipeTransform  } from '@angular/core';
import { isNumber } from 'util';

@Pipe({
  name: 'personHeight'
})
export class PersonHeightPipe implements PipeTransform {

  transform (input: any): any {

    if (!isNumber(parseInt(input, 10))) {
      return input;
    }

    return parseInt(input, 10) / 100;

  }

}
