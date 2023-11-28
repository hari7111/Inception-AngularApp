import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { validateForm } from 'src/app/helpers/validateform';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  type: string = "Password";
  isText: boolean = false;
  eyeIcon: String = "fa-eye-slash";
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder,
     private auth:AuthService,
      private router:Router) {

  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.auth.login(this.loginForm.value)
      .subscribe({
        next:(res)=>{
        alert('Login SuccesFully');
          this.loginForm.reset();
          this.router.navigate(['dashboard']);
        },
        error:(err)=>{
         alert('Something went wrong');
        }
      })

    }
    else {
      validateForm.validateAllFormFields(this.loginForm);
      alert("your form is invalid");
    }
  }

}
