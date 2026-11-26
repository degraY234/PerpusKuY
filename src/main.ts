// ============================================================================
// PerpusKuY — Modern TypeScript Digital Library Management Core
// ============================================================================

export type BookCategory =
  | 'Teknologi & Pemrograman'
  | 'Sains & AI'
  | 'Novel & Sastra'
  | 'Bisnis & Produktivitas';

export interface BookItem {
  id: number;
  title: string;
  author: string;
  category: BookCategory;
  stock: number;
  isbn: string;
}

export interface LoanRecord {
  id: number;
  bookId: number;
  bookTitle: string;
  borrowerName: string;
  borrowerNim: string;
  loanDate: string;
  status: 'Dipinjam' | 'Dikembalikan';
}

export class PerpusKuYEngine {
  private books: BookItem[] = [];
  private loans: LoanRecord[] = [];

  constructor(initialBooks: BookItem[] = [], initialLoans: LoanRecord[] = []) {
    this.books = [...initialBooks];
    this.loans = [...initialLoans];
  }

  public getBooks(query: string = '', category: string = ''): BookItem[] {
    const q = query.trim().toLowerCase();
    return this.books.filter((b) => {
      const matchQuery =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.isbn.toLowerCase().includes(q);
      const matchCat = !category || b.category === category;
      return matchQuery && matchCat;
    });
  }

  public addBook(book: Omit<BookItem, 'id'>): BookItem {
    const newBook: BookItem = { ...book, id: Date.now() };
    this.books.unshift(newBook);
    return newBook;
  }

  public borrowBook(bookId: number, borrowerName: string, borrowerNim: string): LoanRecord | null {
    const target = this.books.find((b) => b.id === bookId);
    if (!target || target.stock <= 0) return null;

    target.stock -= 1;
    const record: LoanRecord = {
      id: Date.now(),
      bookId: target.id,
      bookTitle: target.title,
      borrowerName: borrowerName.trim(),
      borrowerNim: borrowerNim.trim(),
      loanDate: new Date().toISOString().slice(0, 10),
      status: 'Dipinjam',
    };
    this.loans.unshift(record);
    return record;
  }

  public returnBook(loanId: number): boolean {
    const loan = this.loans.find((l) => l.id === loanId);
    if (!loan || loan.status === 'Dikembalikan') return false;

    loan.status = 'Dikembalikan';
    const book = this.books.find((b) => b.id === loan.bookId);
    if (book) {
      book.stock += 1;
    }
    return true;
  }

  public getLoans(): LoanRecord[] {
    return this.loans;
  }
}
