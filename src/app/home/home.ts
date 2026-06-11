import { Component, inject, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { DatabaseService } from '../database-service';
import { arrayBuffer } from 'stream/consumers';
import { FormsModule } from '@angular/forms';
import { Console } from 'console';
import { Navbar } from "../navbar/navbar";


@Component({
  selector: 'app-home',
  imports: [FormsModule, Navbar],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home {
  data= inject(DatabaseService)
  cdr = inject(ChangeDetectorRef)
  postsLoaded= false
  posts = Array<any>()
  userVotes = new Map<number, 'upvote' | 'downvote' | null>()
  expandedComments = new Set<number>()
  userCommentVotes: { [key: string]: 'upvote' | 'downvote' | null } = {}
  newCommentContent = ""



  async ngOnInit() {
    try{
      this.posts = await this.data.getPostsHome()
      this.posts.forEach(post => {
        this.userVotes.set(post.id, null)
      })
      this.postsLoaded = true
      this.cdr.markForCheck()
    }
    catch(e){

    }


  }

  upvotePost(id : number){
    this.data.upvotePost(id)
    const post = this.posts.find(p => p.id === id)
    if (!post) return

    const currentVote = this.userVotes.get(id)
    
    if (currentVote === 'upvote') {
      post.upvotes = Number(post.upvotes) - 1
      this.userVotes.set(id, null)
    } else {
      if (currentVote === 'downvote') {
        post.downvotes = Number(post.downvotes) - 1
      }
      post.upvotes = Number(post.upvotes) + 1
      this.userVotes.set(id, 'upvote')
    }
    this.cdr.markForCheck()
  }

  downvotePost(id:number){
    this.data.downvotePost(id)
    const post = this.posts.find(p => p.id === id)
    if (!post) return

    const currentVote = this.userVotes.get(id)
    
    if (currentVote === 'downvote') {
      post.downvotes = Number(post.downvotes) - 1
      this.userVotes.set(id, null)
    } else {
      if (currentVote === 'upvote') {
        post.upvotes = Number(post.upvotes) - 1
      }
      post.downvotes = Number(post.downvotes) + 1
      this.userVotes.set(id, 'downvote')
    }
    this.cdr.markForCheck()
  }


  toggleComments(postId: number) {
    if (this.expandedComments.has(postId)) {
      this.expandedComments.delete(postId)
    } else {
      this.expandedComments.clear()
      this.expandedComments.add(postId)
    }
    this.cdr.markForCheck()
  }

  getCommentVoteKey(postId: number, commentId: number): string {
    return `${postId}-${commentId}`
  }

  upvoteComment(postId: number, commentId: number) {
    this.data.upvoteComment(commentId)
    const post = this.posts.find((p: any) => p.id === postId)
    if (!post || !post.comments) return

    const comment = post.comments.find((c: any) => c.id === commentId)
    if (!comment) return

    const voteKey = this.getCommentVoteKey(postId, commentId)
    const currentVote = this.userCommentVotes[voteKey]

    if (currentVote === 'upvote') {
      comment.upvotes = (Number(comment.upvotes) || 0) - 1
      this.userCommentVotes[voteKey] = null
    } else {
      if (currentVote === 'downvote') {
        comment.downvotes = (Number(comment.downvotes) || 0) - 1
      }
      comment.upvotes = (Number(comment.upvotes) || 0) + 1
      this.userCommentVotes[voteKey] = 'upvote'
    }
    this.cdr.markForCheck()
  }

  downvoteComment(postId: number, commentId: number) {
    this.data.downvoteComment(commentId)

    const post = this.posts.find((p: any) => p.id === postId)
    if (!post || !post.comments) return

    const comment = post.comments.find((c: any) => c.id === commentId)
    if (!comment) return

    const voteKey = this.getCommentVoteKey(postId, commentId)
    const currentVote = this.userCommentVotes[voteKey]

    if (currentVote === 'downvote') {
      comment.downvotes = (Number(comment.downvotes) || 0) - 1
      this.userCommentVotes[voteKey] = null
    } else {
      if (currentVote === 'upvote') {
        comment.upvotes = (Number(comment.upvotes) || 0) - 1
      }
      comment.downvotes = (Number(comment.downvotes) || 0) + 1
      this.userCommentVotes[voteKey] = 'downvote'
    }
    this.cdr.markForCheck()
  } 


  async addComment(postId:number){
    this.data.addCommentPost(this.newCommentContent,postId)
    this.posts = await this.data.getPostsHome()
    this.cdr.markForCheck()
  }

  


}
