import { Pipe, PipeTransform } from '@angular/core';
import { GeneralHelper } from '../../../helpers/general.helper';
import { TranslateService } from '../../../services/translate.service';

@Pipe({
  name: 'translate',
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  templateMatcher: RegExp = /{{\s?([^{}\s]*)\s?}}/g;

  transform(key: any, ...args: any[]): any {
    let interpolateParams: Object | undefined = undefined;
    if (GeneralHelper.isDefined(args[0]) && args.length) {
      if (typeof args[0] === 'string' && args[0].length) {
        let validArgs: string = args[0]
          .replace(/(\')?([a-zA-Z0-9_]+)(\')?(\s)?:/g, '"$2":')
          .replace(/:(\s)?(\')(.*?)(\')/g, ':"$3"');
        try {
          interpolateParams = JSON.parse(validArgs);
        } catch (e) {
          throw new SyntaxError(
            `Wrong parameter in TranslatePipe. Expected a valid Object, received: ${args[0]}`
          );
        }
      } else if (typeof args[0] === 'object' && !Array.isArray(args[0])) {
        interpolateParams = args[0];
      }
      
    }
    if (interpolateParams) {
      return this.translate.data[key]?.replace(this.templateMatcher, (substring: string, b: string) => {
        return (interpolateParams as any)[b];
      }) || key;
    }
    return this.translate.data[key] || key;
  }
}
