import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Navbar } from "../navbar/navbar";
import { DatabaseService } from '../database-service';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [Navbar, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Profile {
  data = inject(DatabaseService)
  cdr = inject(ChangeDetectorRef)
  route = inject(ActivatedRoute)

  username : string = ""
  profileData : any
  profileLoaded = false
  expandedComments = false
  userCommentVotes: { [key: string]: 'upvote' | 'downvote' | null } = {}
  newCommentContent = ""

  async ngOnInit(){
    console.log(this.route.snapshot.queryParams['name'])
    if(this.route.snapshot.queryParams['name']){
      this.username = this.route.snapshot.queryParams['name'] || "-1"
      if(this.username !="-1"){
        this.profileData = await this.data.getProfile(this.username) 
        console.log(this.profileData)
        this.profileLoaded = true
        this.cdr.markForCheck()
      }
      

    }
    


  }

  toggleComments() {
    this.expandedComments = !this.expandedComments
    this.cdr.markForCheck()
  }

  getCommentVoteKey(commentId: number): string {
    return `profile-${commentId}`
  }

  upvoteComment(commentId: number) {
    this.data.upvoteComment(commentId)
    if (!this.profileData || !this.profileData.comments) return

    const comment = this.profileData.comments.find((c: any) => c.id === commentId)
    if (!comment) return

    const voteKey = this.getCommentVoteKey(commentId)
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

  downvoteComment(commentId: number) {
    this.data.downvoteComment(commentId)

    if (!this.profileData || !this.profileData.comments) return

    const comment = this.profileData.comments.find((c: any) => c.id === commentId)
    if (!comment) return

    const voteKey = this.getCommentVoteKey(commentId)
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

  async addComment() {
    await this.data.addCommentProfile(this.newCommentContent, this.profileData.id)
    this.newCommentContent = ""
    this.cdr.markForCheck()
  }


}
