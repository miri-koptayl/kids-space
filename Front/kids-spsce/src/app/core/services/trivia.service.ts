import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TriviaService {
  constructor(private http: HttpClient) {}

  getCategories() {
    return this.http.get('https://opentdb.com/api_category.php');
  }

  getQuestionsByCategory(categoryId: number, amount: number = 5) {
    return this.http.get(`https://opentdb.com/api.php?amount=${amount}&category=${categoryId}&type=multiple`);
  }
}
