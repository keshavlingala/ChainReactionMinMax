import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
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


  async askForBestMove() {
    const move = await this.gameService.game.hint()
    console.log("Best Move", move)
  }
}
