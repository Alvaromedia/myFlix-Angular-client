import { Component, OnInit, Input, Inject } from '@angular/core';

// You'll use this import to close the dialog on success
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

// This import brings in the API calls we created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';
import { DirectorCardComponent } from '../director-card/director-card.component';
import { GenreCardComponent } from '../genre-card/genre-card.component';
import { MovieDescriptionCardComponent } from '../movie-description-card/movie-description-card.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  user: any = localStorage.getItem('user');

  FavMovie: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.getMovies();
    this.showFavMovie();
  }

  /**
   * function to show movies
   * @function getMovies
   * @returns movies
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  /**
   * open Director dialog
   * @function openDirectorDialog
   * @param name
   * @param bio
   * @param birth
   * @param death
   */
  openDirectorDialog(
    name: string,
    bio: string,
    birth: Date,
    death: Date
  ): void {
    this.dialog.open(DirectorCardComponent, {
      data: { Name: name, Bio: bio, Birth: birth, Death: death },
      width: '30em',
    });
  }

  /**
   * open genre dialog
   * @function openGenreDialog
   * @param name
   * @param description
   */

  openGenreDialog(name: string, description: string): void {
    this.dialog.open(GenreCardComponent, {
      data: { Name: name, Description: description },
      width: '30em',
    });
  }

  /**
   * open description dialog
   * @function openMovieDescription
   * @param title
   * @param description
   */
  openMovieDescription(title: string, description: string): void {
    this.dialog.open(MovieDescriptionCardComponent, {
      data: { Title: title, Description: description },
      width: '30em',
    });
  }

  /**
   * fetch all favourited movies
   * @function showFavMovie
   */
  showFavMovie(): void {
    const user = localStorage.getItem('user');
    this.fetchApiData.getUserProfile(user).subscribe((resp: any) => {
      this.FavMovie = resp.FavouriteMovies;
      return this.FavMovie;
    });
  }

  /**
   * lets a user add a movie to their favourites
   * @function addFavMovie
   * @param MovieID
   * @param Title
   */
  addFavMovie(MovieID: string, Title: string): void {
    this.fetchApiData
      .addFavouriteMovie(this.user.Username, MovieID)
      .subscribe((resp: any) => {
        console.log(resp);
        this.snackBar.open(
          `${Title} has been added to your favourites.`,
          'OK',
          {
            duration: 3000,
          }
        );
        this.showFavMovie();
      });
  }

  /**
   * lets a user delete a movie from favourites
   * @function addFavMovie
   * @param MovieID
   * @param Title
   */
  deleteFavMovie(MovieID: string, Title: string): void {
    this.fetchApiData
      .deleteFavouriteMovie(this.user.Username, MovieID)
      .subscribe((resp: any) => {
        console.log(resp);
        this.snackBar.open(`${Title} removed from favourites.`, 'OK', {
          duration: 3000,
        });
        this.showFavMovie();
      });
  }

  /**
   * checks if a movie is in favourites
   * @param MovieID
   * @returns boolean
   */
  isFav(MovieID: string): boolean {
    return this.FavMovie.some((id) => id === MovieID);
  }

  /**
   * toggle favourites
   * @function setFavStatus
   * @param movie
   */
  setFavStatus(movie: any): void {
    this.isFav(movie._id)
      ? this.deleteFavMovie(movie._id, movie.Title)
      : this.addFavMovie(movie._id, movie.Title);
  }
}
