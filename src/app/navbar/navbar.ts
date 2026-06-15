import { Component,inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  imports: [FormsModule],
  providers: [CookieService],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  searchedFor = ""
  cookieService = inject(CookieService)
  router = inject(Router)
  logout(){
    console.log("im trying")

    this.cookieService.delete("user")
    this.router.navigate(['/login'])
  }

}
