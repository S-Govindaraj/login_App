import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  const localToken = sessionStorage.getItem('token');
  console.log(localToken);
  if(localToken != null){
    return true;
  }
  else {
    alert('You are not Directly Redirect to Login without Login')
    router.navigateByUrl('login')
    return false;
  }
};
