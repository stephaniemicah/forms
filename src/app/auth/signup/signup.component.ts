import { Component, DestroyRef, inject } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, of } from 'rxjs';

// function mustContainQuestionMark(control: AbstractControl) {
//   if (control.value.includes('?')) {
//     return null;
//   }

//   return { doesNotContainQuestionMark: true };
// }

function emailIsUnique(control: AbstractControl) {
  if(control.value !== 'test@example.com') {
    return of(null);
  }

  return of({notUnique: true});
}

let initialEmailValue = '';
const savedForm = window.localStorage.getItem('saved-signup-form');
if (savedForm) {
  const loadedForm = JSON.parse(savedForm);
  initialEmailValue = loadedForm.email;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})

export class SignupComponent {
  private destroyRef = inject(DestroyRef);

  signupForm = new FormGroup({

    email: new FormControl(initialEmailValue, {
      validators: [Validators.email, Validators.required],
      asyncValidators: [emailIsUnique],
    }),
    passwords: new FormGroup({
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)],
      }),
      confirmPassword: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)],
      }),
    }),
    firstName: new FormControl('', { validators: [Validators.required] }),
    lastName: new FormControl('', { validators: [Validators.required] }),
    address: new FormGroup({
      street: new FormControl('', { validators: [Validators.required] }),
      number: new FormControl('', { validators: [Validators.required] }),
      postalCode: new FormControl('', { validators: [Validators.required] }),
      city: new FormControl('', { validators: [Validators.required] }),
    }),
    role: new FormControl<
    'student' | 'teacher' | 'employee' | 'founder' | 'other'
    >('student', { validators: [Validators.required]}),
    source: new FormArray([
      new FormControl(false),
      new FormControl(false),
      new FormControl(false),
    ]),
    agree: new FormControl(false, { validators: [Validators.required] })
  });

  get emailIsInvalid() {
    return (
      this.signupForm.controls.email.touched &&
      this.signupForm.controls.email.dirty &&
      this.signupForm.controls.email.invalid
    );
  }

  // get passwordIsInvalid() {
  //   return (
  //     this.signupForm.controls.password.touched &&
  //     this.signupForm.controls.password.dirty &&
  //     this.signupForm.controls.password.invalid
  //   );
  // }

  ngOnInit(): void {
    // const savedForm = window.localStorage.getItem('saved-login-form');

    // if (savedForm) {
    //   const loadedForm = JSON.parse(savedForm);
    //   this.loginForm.patchValue({
    //     email: loadedForm.email,
    //   });
    // }

    const subscription = this.signupForm.valueChanges.pipe(debounceTime(500)).subscribe({
      next: value => {
        window.localStorage.setItem(
          'saved-signup-form',
          JSON.stringify({email: value.email})
        );
      },
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onSubmit() {
    console.log(this.signupForm);
    const enteredEmail = this.signupForm.value.email;
    //const enteredPassword = this.signupForm.value.password;
    //console.log(enteredEmail, enteredPassword);
  }

  onReset(){
    this.signupForm.reset();
  }
}
