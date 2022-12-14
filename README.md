# ChainReaction with Minimax


## Abstract
The chain reaction is a multiplayer game where each player will be assigned a color. It is a two - dimensional array where each player gets a turn to choose a place on the board. After a player selects a cell on the board the counter on the cell increases, maximum of 3 in each counter else the counter splits to the adjacent rows or columns.
The objective of the Chain Reaction is to take control of the board by eliminating your opponents' orbs.
Players take turns placing their orbs in a cell. Once a cell has reached critical mass the orbs explode into the surrounding cells adding an extra orb and claiming the cell for the player. A player may only place their orbs in a blank cell or a cell that contains orbs of their own color. As soon as a player loses all their orbs they are out of the game.
We created ChainReaction from the beginning and used MiniMax Algorithm in Typescript to build a web application with Angular 15 Framework.

# Table of Contents

[ABSTRACT]()

[INTRODUCTION](#introduction)

CHAPTER 2: CHAIN REACTION GAME	7

2.1 RULES OF GAME	7

2.3 HEURISTIC STRATEGY	8

CHAPTER 3: ANGULAR FRAMEWORK	9

3.1 TYPESCRIPT	10

CHAPTER 4: MINIMAX ALGORITHM	11

CHAPTER 5: PROJECT IMPLEMENTATION	12

5.1 CLASS DIAGRAM	13

5.2 CLASSES AND DEPENDENCIES	14

5.3 GAME WORKING SCREENSHOTS	15

5.4 AI SPEED OPTIMIZATION	19

CHAPTER 6: CONCLUSION	21


# <a name="introduction">Introduction</a>

This project is a web application that has been developed in the Angular framework. It uses the Minimax Algorithm to implement the game of Chain Reaction. Chain Reaction is a two-player game where each player takes turns placing their pieces on the board in an attempt to take over the board. The goal of the game is to be the last player with pieces on the board.
The web application is implemented using the Angular framework and is written in TypeScript. The Minimax Algorithm is used to determine the best move for each player. The game also utilizes HTML5 and CSS3 for the user interface. The application is hosted on Firebase and can be accessed from any web browser.
The application has a simple user interface that allows the user to easily set up the game, choose the board size, and choose the each player. The user can also choose to play against the computer ,against another human player, or Computer-Computer with Human Interaction.
The application also features a scoreboard that displays the current scores of each player. This scoreboard is updated as each game progresses.
Overall, this project has implemented the game of Chain Reaction using the Minimax Algorithm in the Angular framework. The application is hosted on Firebase and can be accessed here.
