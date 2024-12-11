import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { GuardService } from "./guards.service";

export const AuthGuard: CanActivateFn = (route, state) => {
    const guardService = inject( GuardService );
    const router = inject( Router );
    const userRole = localStorage.getItem( 'role' );

    if( userRole ){
        if (guardService.isAdmin( userRole )){
            return true;
        }else{
            router.navigateByUrl('/users');
            return false;
        }
    }

    router.navigateByUrl('/users');
    return false;
};