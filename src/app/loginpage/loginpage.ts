import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../database-service';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-loginpage',
  imports: [FormsModule],
  providers: [CookieService],
  templateUrl: './loginpage.html',
  styleUrl: './loginpage.css',
})
export class Loginpage {
login = true
router = inject(Router)
data = inject(DatabaseService)
userData = {
  username : "",
  password :""
}
error = false


loginToggle(){
  this.login = !this.login
}
async logIn(){
  console.log("Login attempt with:", this.userData.username);
  const result = await this.data.login(this.userData.username, this.userData.password);
  console.log("Login result:", result);
  
  if(result?.success){
    console.log("Login successful, navigating to home");
    this.router.navigate([''])
  }
  else{
    console.log("Login failed");
    this.error = true
  }  
}
async register(){
  if(await this.data.register(this.userData.username, this.userData.password)){
  this.router.navigate([''])
  }
  else{
    this.error = true
  }
  
}


}
