import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { validateForm } from 'src/app/helpers/validateform';
import { AuthService } from 'src/app/services/auth.service';
import { ResetPasswordService } from 'src/app/services/reset-password.service';
import { UserStoreService } from 'src/app/services/user-store.service';


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
  public resetPasswordEmail !: string;
  public isValidEmail !:boolean;

  constructor(
    private fb: FormBuilder,
    private auth:AuthService,
    private router:Router,
    private userStore : UserStoreService,
    private resetPasswordService : ResetPasswordService){
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
          this.auth.storeToken(res.accessToken);
          this.auth.storeRefreshToken(res.refreshToken);
          let tokenPayLoad = this.auth.decodeToken();
          this.userStore.setFullNameForStore(tokenPayLoad.unique_name);
          this.userStore.setRoleForStore(tokenPayLoad.role);
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

  checkValidEmail(event:string){
    const value = event;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;
    this.isValidEmail = emailPattern.test(value);
    return this.isValidEmail;
  }

  confirmToSend(){
    if(this.checkValidEmail(this.resetPasswordEmail)){
      this.resetPasswordService.sendResetPasswordLink(this.resetPasswordEmail)
      .subscribe({
        next:(res)=>{
          alert("Reset Successfully!")
          this.resetPasswordEmail = "";
          const buttonRef = document.getElementById("closeBtn");
          buttonRef?.click();
        },
        error:(err) =>{
          alert("Something Went Wrong!")
        }
      })
    }
  }

}
