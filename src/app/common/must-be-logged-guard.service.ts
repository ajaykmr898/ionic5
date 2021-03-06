import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class MustBeLoggedGuard implements CanActivate {

    constructor(private router: Router, private authService: AuthService) {}

    async canActivate(): Promise<boolean> {

        let isLogged = await this.authService.isLoggedForGuards();

        if (!isLogged) {
            await this.router.navigateByUrl('/login');
            return false;
        }
        return true;
    }

}
