import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private fauxPosts = [{
    id: 1,
    title:"testTitle",
    src:"/images/1.jpg",
    upvotes: 24,
    downvotes: 2,
    comments: [
      {
        id: 1,
        author:"Marcy",
        content:"Ale gupi",
        upvotes: 0,
        downvotes: 200
      }
    ],
    author:"Marcy",
  }]

  private fauxProfile=[{
    id:1,
    username: "Marcy",
    src:"/images/marcy.png",
    comments:[
      {
        id: 1,
        author:"Marcy",
        content:"Ale gupia",
        upvotes: 0,
        downvotes: 200
      }
    ]
  }]

  async getPostsHome(){
    return this.fauxPosts
  }


}
