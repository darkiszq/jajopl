import { Injectable } from '@angular/core';
import { ServerTestingModule } from '@angular/platform-server/testing';

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

  async addCommentPost(content_ : string, postId_:number){
    console.log(`Added comment to post at id ${postId_}`)
    let comment = {
        author:"Marcy", //do zmiany
        content: content_,
        upvotes: 0,
        downvotes: 0,
        postId : postId_
    }

    this.fauxPosts[0].comments.push({
      id: 2,
        author:"Marcy",
        content:content_,
        upvotes: 0,
        downvotes: 0
    })
    return true
  }

  async addCommentProfile(content:string, profileId : number){
    console.log(`Added comment to profile at id ${profileId}`)
    return true
  }
  async upvotePost(postId:number){
    console.log(`Added upvote to post at id ${postId}`)
    return true
  }
  async downvotePost(postId:number){
    console.log(`Added downvote to post at id ${postId}`)
    return true
  }
  async upvoteComment(commentId:number){
    console.log(`Added upvote to comment at id ${commentId}`)
    return true
  }
  async downvoteComment(commentId:number){
    console.log(`Added downvote to comment at id ${commentId}`)
    return true
  }


}
