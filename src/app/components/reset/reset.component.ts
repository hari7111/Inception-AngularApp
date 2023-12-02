import { Component } from '@angular/core';
import { ResetPassword } from 'src/app/models/reset-password';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmPasswordValidator } from 'src/app/helpers/confirm-password.validators';
import { ActivatedRoute, Router } from '@angular/router';
import { validateForm } from 'src/app/helpers/validateform';
import { ResetPasswordService } from 'src/app/services/reset-password.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent {
  resetPasswordForm!: FormGroup;
  emailToReset!: string;
  emailToken!: string;
  resetPasswordObj = new ResetPassword()
  public resetPasswordEmail !: string;
  public isValidEmail !:boolean;

  constructor(
    private fb: FormBuilder,
    private router:Router,
    private activatedRoute :ActivatedRoute,
    private resetPasswordService : ResetPasswordService){
  }

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required]
    },{
      validator :ConfirmPasswordValidator("password","confirmPassword")
    });

    this.activatedRoute.queryParams.subscribe(val=>{
      this.emailToReset = val['email'];
      var urlToken = val['code'];

      this.emailToken = urlToken.replace(/ /g,'+');
    })
  }

  reset(){
    if(this.resetPasswordForm.valid){
      this.resetPasswordObj.email = this.emailToReset;
      this.resetPasswordObj.newPassword = this.resetPasswordForm.value.password;
      this.resetPasswordObj.confirmPassword =  this.resetPasswordForm.value.confirmPassword;
      this.resetPasswordObj.emailToken = this.emailToken;

      this.resetPasswordService.resetPassword(this.resetPasswordObj)
      .subscribe({
        next:(res)=>{
          alert("Password Reset Succssfully!");
          this.router.navigate(['/']);
        },
        error:(err)=>{
          alert("Something went wrong!");
        }

      })
    }else{
      validateForm.validateAllFormFields(this.resetPasswordForm);
    }
  }
}
