import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Navbar } from "../navbar/navbar";
import { DatabaseService } from '../database-service';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
@Component({
  selector: 'app-profile',
  imports: [Navbar, FormsModule],
  providers:[CookieService],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Profile {
  data = inject(DatabaseService)
  cdr = inject(ChangeDetectorRef)
  route = inject(ActivatedRoute)
  cookieService = inject(CookieService)
  username : string = ""
  profileData : any
  profileLoaded = false
  expandedComments = false
  userCommentVotes: { [key: string]: 'upvote' | 'downvote' | null } = {}
  newCommentContent = ""
  router = inject(Router)

  platformId = inject(PLATFORM_ID)

  async ngOnInit() {
    
    if (isPlatformBrowser(this.platformId)) {
    const user = this.getCookie('user');
    
    if (!user) {
      this.router.navigate(['/login']);
    }
    }
  
    console.log(this.route.snapshot.queryParams['name'])
    if(this.route.snapshot.queryParams['name']){
      this.username = this.route.snapshot.queryParams['name'] || "-1"
      if(this.username !="-1"){
        this.profileData = await this.data.getProfile(this.username) 
        console.log(this.profileData)
        console.log(this.profileData.comments)
        for(let comment of this.profileData.comments){
          let voteKey = this.getCommentVoteKey(comment.id)
          if(comment.userVote == "upvote"){
            this.userCommentVotes[voteKey] = 'upvote'
          }
          if(comment.userVote == "downvote"){
            this.userCommentVotes[voteKey] = 'downvote'
          }
        }


        this.profileLoaded = true
        this.cdr.markForCheck()
      }
      

    }
    


  }

  getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

  toggleComments() {
    this.expandedComments = !this.expandedComments
    this.cdr.markForCheck()
  }

  getCommentVoteKey(commentId: number): string {
    return `profile-${commentId}`
  }

  upvoteComment(commentId: number) {
    this.data.upvoteProfileComment(commentId)
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
    this.data.downvoteProfileComment(commentId)

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
