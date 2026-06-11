import { Component } from '@angular/core';
import { Navbar } from "../navbar/navbar";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-memeadd',
  imports: [Navbar, FormsModule],
  templateUrl: './memeadd.html',
  styleUrl: './memeadd.css',
})
export class Memeadd {
  selectedFile: File | null = null;
  title = ""
  category = ""


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  onSubmit() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile);
      formData.append('title', this.title)
      formData.append('category', this.category)
      console.log(formData)
    }
  }



}
