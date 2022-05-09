import { Component, OnInit, Input } from '@angular/core';

// You'll use this import to close the dialog on success
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user: any = {};
  Username = localStorage.getItem('user');
  movies: any[] = [];
  FavMovie: any = [];

  @Input() userData = {
    Username: this.user.Username,
    Email: this.user.Email,
    Password: this.user.Password,
    Birthday: this.user.Birthday,
  };

  constructor(
    public dialog: MatDialog,
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.getUserProfile();
    this.getFavourites();
  }

  /**
   * calls API endpoint to get user info
   * @function getUserProfile
   * @return user data in JSON format
   */
  getUserProfile(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.fetchApiData.getUserProfile(user).subscribe((result: any) => {
        this.user = result;
      });
    }
  }

  /**
   * calls API endpoint to update user info
   * @function editUserProfile
   
   */
  editUserProfile(): void {
    this.fetchApiData.editUserProfile(this.userData).subscribe((result) => {
      localStorage.setItem('user', result.Username);
      this.snackBar.open('Your profile was updated successfully.', 'OK', {
        duration: 2000,
      });
      setTimeout(() => {
        window.location.reload();
      });
    });
  }

  /**
   * calls API endpoint to delete a user
   * @function deleteUserProfile
   */
  deleteUserProfile(): void {
    if (confirm('Are you sure? This cannot be undone.')) {
      this.fetchApiData.deleteUserProfile().subscribe(() => {
        this.snackBar.open('Your account has been deleted!', 'OK', {
          duration: 2000,
        });
        localStorage.clear();
      });
      this.router.navigate(['welcome']);
    }
  }

  /**
   * displays users' favourite movies
   * @function getFavourites
   */
  getFavourites(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      this.movies.forEach((movie: any) => {
        if (this.user.FavouriteMovies.includes(movie._id)) {
          this.FavMovie.push(movie);
        }
      });
    });
  }

  /**
   * removes a movie from thye list of favourites
   * @function removeFavMovie
   * @param MovieID
   * @param Title
   */
  removeFavMovie(MovieID: string, Title: string): void {
    this.fetchApiData
      .deleteFavouriteMovie(this.user.Username, MovieID)
      .subscribe((resp) => {
        console.log(resp);
        this.snackBar.open(`${Title} removed from favourites`, 'OK', {
          duration: 1000,
        });
        setTimeout(function () {
          window.location.reload();
        }, 1000);
      });
  }
}
