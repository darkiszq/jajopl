import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loginpage',
  imports: [],
  templateUrl: './loginpage.html',
  styleUrl: './loginpage.css',
})
export class Loginpage {
login = true
router = inject(Router)


loginToggle(){
  this.login = !this.login
}
logIn(){


  this.router.navigate([''])
}
register(){
  
    this.router.navigate([''])
}


}
