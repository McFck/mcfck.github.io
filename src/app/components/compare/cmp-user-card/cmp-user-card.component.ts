import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AnimeHelper } from 'src/app/helpers/anime.helper';
import { LoadedShikiUser, ParsedGeneralProfileStats } from 'src/app/models/dataModels';
import { AnimeService } from 'src/app/services/anime.service';

@Component({
  selector: 'cmp-user-card',
  templateUrl: './cmp-user-card.component.html',
  styleUrls: ['./cmp-user-card.component.less']
})
export class CmpUserCardComponent {

  @Input()
  label: string;

  @Input() set user(value: LoadedShikiUser) {
    if(!value) {
      this.userObj = null;
      return;
    }
    this.userObj = {...value};
    this.nickname = this.userObj?.nickname;
    this.parsedStats = AnimeHelper.parseUserProfileStats(this.userObj);
  }

  @Output()
  isLoading: EventEmitter<boolean> = new EventEmitter();

  @Output()
  userFetchEvent: EventEmitter<LoadedShikiUser> = new EventEmitter();

  userObj: LoadedShikiUser;
  parsedStats: ParsedGeneralProfileStats;
  nickname: string;

  constructor(private animeService: AnimeService) { }

  updateUser(): void {
    if (this.nickname) {
      this.isLoading.emit(true);
      this.animeService.getUserData(this.nickname)
      .subscribe(data=>{
        this.userObj = {
          ...data
        };
        this.parsedStats = AnimeHelper.parseUserProfileStats(this.userObj);
        this.userFetchEvent.emit(this.userObj);
        this.isLoading.emit(false);
      },
      _=>{
        this.userObj = null;
        this.userFetchEvent.emit(null);
        this.isLoading.emit(false);
      });
    } else {
      this.userFetchEvent.emit(null);
    }
  }
}
