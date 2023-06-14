import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const BaseUrl = 'https://us-central1-bookstore-api-e63c8.cloudfunctions.net/bookstoreApi/apps';

export const fetchBooks = createAsyncThunk('books/fetchBooks', async () => {
  try {
    const res = await axios.get(`${BaseUrl}/hcbcyPwKLexrxoT378qc/books`);
    return res.data;
  } catch (error) {
    throw Error('Failed to fetch books');
  }
});

export const addBook = createAsyncThunk('books/addBook', async (book) => {
  const res = await axios.get(`${BaseUrl}/hcbcyPwKLexrxoT378qc/books`, book);
  return res.data;
});

const initialState = {
  books: [],
  isLoading: false,
  error: null,
};

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    // Add the addNewBook reducer
    addNewBook: (state, action) => {
      state.books.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        // Get the books data from the action payload
        const books = action.payload;

        // Create an empty array to store the new books data
        const newBooks = [];

        // Iterate over each book in the books data
        Object.keys(books).forEach((book) => {
          // Create a new book object with selected properties
          const newBook = {
            item_id: book,
            title: books[book][0].title,
            author: books[book][0].author,
            category: books[book][0].category,
          };

          // Add the new book object to the newBooks array
          newBooks.push(newBook);
        });

        // Return the updated state with the new books data and isLoading set to false
        return ({
          ...state,
          books: newBooks,
          isLoading: false,
        });
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
    builder
      .addCase(addBook.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addBook.fulfilled, (state) => {
        state.isLoading = false;
        state.books = [...state.books];
        state.error = null;
      })
      .addCase(addBook.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { addNewBook } = booksSlice.actions;
export default booksSlice.reducer;
