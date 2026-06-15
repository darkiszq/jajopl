import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private http = inject(HttpClient);
  private cookieService = inject(CookieService);
  private apiUrl = 'http://localhost:3000';

  private getUserIdFromCookie(): number {
    const userCookie = this.cookieService.get('user');
    return userCookie ? parseInt(userCookie, 10) : -1;
  }

  private setCookie(name: string, value: string, days: number = 365): void {
    this.cookieService.set(name, value, { expires: days, path: '/' });
  }

  async getPostsHome() {
    console.log("request is here!!")
    const userId = this.getUserIdFromCookie();
    if (userId === -1) {
      console.error('User ID not found in cookie');
      return undefined;
    }
    return this.http.post<any[]>(`${this.apiUrl}/posts`, {userId : userId}).toPromise();
  }

  async addCommentPost(content_: string, postId_: number) {
    console.log("request is here!!")
    const userId = this.getUserIdFromCookie();
    if (userId === -1) {
      console.error('User ID not found in cookie');
      return false;
    }

    try {
      const response = await this.http.post<any>(
        `${this.apiUrl}/posts/${postId_}/comments`,
        { userId, content: content_, postId: postId_ }
      ).toPromise();
      return !!response?.success;
    } catch (err) {
      console.error('Error adding comment to post:', err);
      return false;
    }
  }

  async addCommentProfile(content: string, profileId: number) {
    const userId = this.getUserIdFromCookie();
    if (userId === -1) {
      console.error('User ID not found in cookie');
      return false;
    }

    try {
      const response = await this.http.post<any>(
        `${this.apiUrl}/user/${profileId}/comment`,
        { userId, content }
      ).toPromise();
      return !!response?.success;
    } catch (err) {
      console.error('Error adding comment to profile:', err);
      return false;
    }
  }

  async getProfileComments(userId: number) {
    const userIdLogged = this.getUserIdFromCookie();
    if (userIdLogged === -1) {
      console.error('User ID not found in cookie');
      return false;
    }
    try {
      return await this.http.post<any[]>(
        `${this.apiUrl}/user/${userId}/comments`, {userId : userIdLogged}
      ).toPromise();
    } catch (err) {
      console.error('Error fetching profile comments:', err);
      return [];
    }
  }

  async upvotePost(postId: number) {
    const userId = this.getUserIdFromCookie();
    if (userId === -1) {
      console.error('User ID not found in cookie');
      return false;
    }

    try {
      const response = await this.http.post<any>(
        `${this.apiUrl}/post/${postId}/vote`,
        { userId, voteType: 'upvote' }
      ).toPromise();
      return !!response?.success;
    } catch (err) {
      console.error('Error upvoting post:', err);
      return false;
    }
  }

  async downvotePost(postId: number) {
    const userId = this.getUserIdFromCookie();
    if (userId === -1) {
      console.error('User ID not found in cookie');
      return false;
    }

    try {
      const response = await this.http.post<any>(
        `${this.apiUrl}/post/${postId}/vote`,
        { userId, voteType: 'downvote' }
      ).toPromise();
      return !!response?.success;
    } catch (err) {
      console.error('Error downvoting post:', err);
      return false;
    }
  }

  async upvoteComment(commentId: number) {
    const userId = this.getUserIdFromCookie();
    if (userId === -1) {
      console.error('User ID not found in cookie');
      return false;
    }

    try {
      const response = await this.http.post<any>(
        `${this.apiUrl}/comment/${commentId}/vote`,
        { userId, voteType: 'upvote' }
      ).toPromise();
      return !!response?.success;
    } catch (err) {
      console.error('Error upvoting comment:', err);
      return false;
    }
  }

  async downvoteComment(commentId: number) {
    const userId = this.getUserIdFromCookie();
    if (userId === -1) {
      console.error('User ID not found in cookie');
      return false;
    }

    try {
      const response = await this.http.post<any>(
        `${this.apiUrl}/comment/${commentId}/vote`,
        { userId, voteType: 'downvote' }
      ).toPromise();
      return !!response?.success;
    } catch (err) {
      console.error('Error downvoting comment:', err);
      return false;
    }
  }

  async upvoteProfileComment(commentId: number) {
    console.log("upvoted!!")
    const userId = this.getUserIdFromCookie();
    if (userId === -1) {
      console.error('User ID not found in cookie');
      return false;
    }

    try {
      const response = await this.http.post<any>(
        `${this.apiUrl}/user-comment/${commentId}/vote`,
        { userId, voteType: 'upvote' }
      ).toPromise();
      return !!response?.success;
    } catch (err) {
      console.error('Error upvoting profile comment:', err);
      return false;
    }
  }

  async downvoteProfileComment(commentId: number) {
    const userId = this.getUserIdFromCookie();
    if (userId === -1) {
      console.error('User ID not found in cookie');
      return false;
    }

    try {
      const response = await this.http.post<any>(
        `${this.apiUrl}/user-comment/${commentId}/vote`,
        { userId, voteType: 'downvote' }
      ).toPromise();
      return !!response?.success;
    } catch (err) {
      console.error('Error downvoting profile comment:', err);
      return false;
    }
  }

  async getProfile(profileName: string) {
    const userIdLogged = this.getUserIdFromCookie();
    if (userIdLogged === -1) {
      console.error('User ID not found in cookie');
      return false;
    }


    try {
      const response = await this.http.post<any>(
        `${this.apiUrl}/profile/${profileName}`,{userId : userIdLogged}
      ).toPromise();

      if (response) {
        return {
          id: response.id,
          username: response.username,
          description: response.description,
          src: response.profilePicture,
          stats: response.stats,
          comments: response.profileComments || []
        };
      }
      return null;
    } catch (err) {
      console.error('Error fetching profile:', err);
      return null;
    }
  }

  async addMeme(formData: any) {
    const userId = this.getUserIdFromCookie();
    if (userId === -1) {
      console.error('User ID not found in cookie');
      return false;
    }

    try {
      const response = await this.http.post<any>(
        `${this.apiUrl}/postadd`,
        {
          userId,
          title: formData.title,
          categoryName: formData.category,
          imageBase64: formData.image
        }
      ).toPromise();
      console.log(formData.image)
      return !!response?.success;
    } catch (err) {
      console.error('Error adding meme:', err);
      return false;
    }
  }

  async searchPosts(category: string) {
    try {
      let userId_ = this.getCurrentUserId()

      return await this.http.post<any[]>(
        `${this.apiUrl}/posts/category/${category}`, {userId : userId_}
      ).toPromise();
    } catch (err) {
      console.error('Error searching posts by category:', err);
      return [];
    }
  }

  async register(username: string, password: string, description?: string) {
    try {
      const response = await this.http.post<any>(
        `${this.apiUrl}/register`,
        { username, password, description }
      ).toPromise();
      this.cookieService.set("user", response.userId)
      return response;
    } catch (err) {
      console.error('Error registering:', err);
      return null;
    }
  }

  async login(username: string, password: string) {
    try {
      console.log("Calling login endpoint");
      const response = await this.http.post<any>(
        `${this.apiUrl}/login`,
        { username, password }
      ).toPromise();
      console.log("Login response:", response);
      this.cookieService.set("user", response.userId)
      return response;
    } catch (err) {
      console.error('Error logging in:', err);
      return null;
    }
  }

  getCurrentUserId(): number {
    return this.getUserIdFromCookie();
  }

  

  logout(): void {
    this.cookieService.delete("user");
  }
}
