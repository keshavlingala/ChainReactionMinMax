import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {GameService} from "../game.service";


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {

  constructor(private dialog: MatDialog,
              public gameService: GameService) {
  }

  ngOnInit(): void {
    this.gameService.ngOnInit();
  }


}
