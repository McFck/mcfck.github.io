import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GithubCommitData } from 'src/app/models/dataModels';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.less']
})
export class LandingComponent implements OnInit {

  constructor(private http: HttpClient) { }

  lastCommitData: GithubCommitData;

  ngOnInit(): void {
    this.http.get("https://api.github.com/repos/mcfck/mcfck.github.io/commits/main").pipe(catchError(err=>of(null))).subscribe(data =>{
      this.lastCommitData = data;
    })

    this.effectLogic();
  }

  effectLogic(): void {
    var slideBox = document.getElementById('sparkles');

    // setTimeout(function(){
    //   slideBox.style.display = 'none';
    //   slideBox.style.animation = 'none';
    // }, 3000); 
  }
}
