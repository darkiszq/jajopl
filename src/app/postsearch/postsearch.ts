import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Navbar } from "../navbar/navbar";
import { DatabaseService } from '../database-service';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-postsearch',
  imports: [Navbar, FormsModule],
  templateUrl: './postsearch.html',
  styleUrl: './postsearch.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Postsearch {
  data = inject(DatabaseService)
  cdr = inject(ChangeDetectorRef)
  route = inject(ActivatedRoute)
  postData = Array<any>()
  categorySearched = ""
  postsLoaded = false
  userVotes = new Map<number, 'upvote' | 'downvote' | null>()
  expandedComments = new Set<number>()
  userCommentVotes: { [key: string]: 'upvote' | 'downvote' | null } = {}
  newCommentContent = ""

  async ngOnInit(){
    console.log(this.route.snapshot.queryParams['category'])
    if(this.route.snapshot.queryParams['category']){
      this.categorySearched = this.route.snapshot.queryParams['category'] || "-1"
      if(this.categorySearched !="-1"){
        this.postData = await this.data.searchPosts(this.categorySearched)
        this.postData.forEach(post => {
          this.userVotes.set(post.id, null)
        })
        console.log(this.postData)
        this.postsLoaded = true
        this.cdr.markForCheck()
      }
      

    }
    


  }

  upvotePost(id : number){
    this.data.upvotePost(id)
    const post = this.postData.find(p => p.id === id)
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
    const post = this.postData.find(p => p.id === id)
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
    const post = this.postData.find((p: any) => p.id === postId)
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

    const post = this.postData.find((p: any) => p.id === postId)
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
    this.newCommentContent = ""
    this.cdr.markForCheck()
  }


}
