import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  onBlur() {
    this.submit = true; // Set submit to true on blur to trigger the error display
  }
  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });
  submit = false;
  alert = false;
  secretKey = 'd6F3Efeq';
  constructor(private formBuilder: FormBuilder, private router: Router) {}
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          // Validators.pattern(
          //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          // ),
        ],
      ],
    });
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  http = inject(HttpClient);
  onSubmit(): void {
    this.submit = true;
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    // });
    const encryptedData = this.encryptData(this.form.value);
    const request = {
      request_data: encryptedData,
    };
    if (this.form.valid) {
      this.http
        .post('http://localhost:3000/api/login', request)
        .subscribe((res: any) => {
          debugger
          if (res?.token) {
            sessionStorage.setItem('token', res.token);
            alert('log in successfull');
            this.router
              .navigate(['/dashboard'])
              .then(() => {
                console.log('Redirected to dashboard');
              })
              .catch((err) => {
                console.error('Redirect failed', err);
              });
            console.log('Form data:', this.form);
          } else {
            alert('Email or Password is incorrect');
            // this.alert = true;
            this.router
              .navigate(['/login'])
              .then(() => {
                console.log('Redirected to login page');
              })
              .catch((err) => {
                console.error('Redirect failed', err);
              });
          }
        });
    }

    console.log(JSON.stringify(this.form.value, null, 2));
  }
  encryptData(data: any): string {
    // Encrypt the form data using AES encryption
    return CryptoJS.AES.encrypt(
      JSON.stringify(data),
      this.secretKey
    ).toString();
  }
}
