import { Component, Input, OnInit } from '@angular/core';
import { ANIME_TYPE, AnimeData } from 'src/app/models/dataModels';

const MINIMUM_SCORE_DIFF = 1.5;

@Component({
  selector: 'anime-community-block',
  templateUrl: './anime-community-block.component.html',
  styleUrls: ['./anime-community-block.component.less']
})
export class AnimeCommunityBlockComponent implements OnInit {

  constructor() { }

  @Input()
  type: ANIME_TYPE;

  @Input()
  liked: AnimeData[];

  @Input()
  disliked: AnimeData[];

  ngOnInit(): void {
    this.liked = this.liked.filter(entry=>entry?.diffMe > MINIMUM_SCORE_DIFF);
    this.disliked = this.disliked.filter(entry=>entry?.diffThem > MINIMUM_SCORE_DIFF);
  }
}
