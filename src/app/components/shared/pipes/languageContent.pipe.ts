import { Pipe, PipeTransform } from '@angular/core';
import { GeneralHelper } from '../../../helpers/general.helper';
import { TranslateService } from '../../../services/translate.service';

@Pipe({
  name: 'languageContent',
  pure: false,
})
export class LanguageContentPipe implements PipeTransform {
  constructor(private translationService: TranslateService) {}

  transform(acceptedContent: any, acceptedLanguage: string, defaultContent: any): any {
    if(this.translationService.getLanguage() !== acceptedLanguage) return defaultContent;
    return acceptedContent;
  }
}
