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

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

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

  openGenreDialog(name: string, description: string): void {
    this.dialog.open(GenreCardComponent, {
      data: { Name: name, Description: description },
      width: '30em',
    });
  }

  openMovieDescription(title: string, description: string): void {
    this.dialog.open(MovieDescriptionCardComponent, {
      data: { Title: title, Description: description },
      width: '30em',
    });
  }

  showFavMovie(): void {
    const user = localStorage.getItem('user');
    this.fetchApiData.getUserProfile(user).subscribe((resp: any) => {
      this.FavMovie = resp.FavouriteMovies;
      return this.FavMovie;
    });
  }

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

  isFav(MovieID: string): boolean {
    return this.FavMovie.some((id) => id === MovieID);
  }

  setFavStatus(movie: any): void {
    this.isFav(movie._id)
      ? this.deleteFavMovie(movie._id, movie.Title)
      : this.addFavMovie(movie._id, movie.Title);
  }
}
