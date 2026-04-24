import BookCard from './BookCard';

export default function BookGrid({ books, onSaveChange }) {
  return (
    <div className="book-grid">
      {books.map((book) => (
        <BookCard key={book.id} book={book} onSaveChange={onSaveChange} />
      ))}
    </div>
  );
}
