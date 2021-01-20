import { Component } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;

  constructor(
      private authService: AuthService
  ) {
  }

  onSwicthMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;
    if (this.isLoginMode) {

    } else {
      this.authService.signup(email, password).subscribe(res => {
        console.log(res);
        this.isLoading = false;
      }, error => {
        console.log(error);
        setTimeout(() => {
          this.isLoading = false;
        }, 3000);
      });
    }

    form.reset();
  }
}
