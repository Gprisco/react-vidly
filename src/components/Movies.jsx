import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import { getMovies } from "../services/fakeMovieService";
import { getGenres } from "../services/fakeGenreService";
import Pagination from "./common/Pagination";
import Search from "./common/Search";
import Genres from "./Genres";
import { paginate } from "../utils/paginate";
import MoviesTable from "./MoviesTable";
import MovieForm from "./MovieForm";
import _ from "lodash";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    pageSize: 4,
    currentPage: 1,
    currentFilter: "all",
    currentSearch: "",
    sortColumn: { path: "title", order: "asc" }
  };

  componentDidMount() {
    this.setState({
      movies: getMovies(),
      genres: getGenres()
    });
  }

  handleLike = id => {
    let movies = this.state.movies;
    movies.forEach(m => {
      if (m._id === id) m.liked = !m.liked;
    });
    this.setState({ movies });
  };

  handleDelete = _id => {
    const { movies } = this.state;

    let movieInDb = movies.find(m => m._id === _id);
    movies.splice(movies.indexOf(movieInDb), 1);
    this.setState({ movies });
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleFilter = _id => {
    this.setState({ currentFilter: _id, currentPage: 1, currentSearch: "" });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  handleSearch = e => {
    const currentSearch = e.currentTarget.search.value;
    let { currentFilter, currentPage, sortColumn } = this.state;

    if (currentSearch !== "") {
      currentFilter = "all";
      currentPage = 1;
      sortColumn = { path: "title", order: "asc" };
    }

    this.setState({ currentSearch, currentFilter, currentPage, sortColumn });
  };

  handleSave = e => {
    const { title, genreId, stock, rate } = e.currentTarget;
    const { _id } = e.currentTarget;
    const { movies, genres } = this.state;

    let foundMovie = false;

    const movie = {};
    const genre = genres.find(g => g._id === genreId.value);

    movies.forEach(m => {
      if (m._id === _id.value) {
        m._id = _id.value;
        m.title = title.value;
        m.genre = genre;
        m.dailyRentalRate = rate.value;
        m.numberInStock = stock.value;
        m.liked = false;

        foundMovie = true;
      }
    });

    if (!foundMovie) {
      movie._id = _id.value;
      movie.title = title.value;
      movie.genre = genre;
      movie.dailyRentalRate = rate.value;
      movie.numberInStock = stock.value;
      movie.liked = false;

      movies.push(movie);
    }

    this.setState({ movies });
  };

  getFilteredMovies = () => {
    const {
      movies: allMovies,
      currentFilter,
      pageSize,
      sortColumn,
      currentPage,
      currentSearch
    } = this.state;

    let searchedMovies = allMovies;

    if (currentSearch !== "") {
      searchedMovies = _.filter(allMovies, movie => {
        return movie.title.match(new RegExp(currentSearch, "i")) !== null;
      });
    }

    let filteredMovies = searchedMovies;

    let sorted = _.orderBy(
      filteredMovies,
      [sortColumn.path],
      [sortColumn.order]
    );

    let movies = paginate(sorted, currentPage, pageSize);

    if (currentFilter !== "all") {
      filteredMovies = searchedMovies.filter(
        m => m.genre._id === currentFilter
      );

      sorted = _.orderBy(filteredMovies, [sortColumn.path], [sortColumn.order]);

      movies = paginate(sorted, currentPage, pageSize);
    }

    return { totalCount: filteredMovies.length, data: movies };
  };

  renderPage = () => {
    const {
      genres,
      currentFilter,
      pageSize,
      sortColumn,
      currentPage,
      currentSearch
    } = this.state;

    const { totalCount, data: movies } = this.getFilteredMovies();

    return (
      <div className="row m-4">
        <div className="col-2">
          <Genres
            genres={genres}
            onFilter={this.handleFilter}
            currentFilter={currentFilter}
          />
        </div>
        <div className="col">
          <Link to="/movies/new" className="btn btn-primary mb-2">
            New Movie
          </Link>
          <h5 className="m-2">Showing {totalCount} Movies</h5>
          <Search value={currentSearch} onSearch={this.handleSearch} />
          <MoviesTable
            movies={movies}
            sortColumn={sortColumn}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          />
          <Pagination
            items={totalCount}
            pageSize={pageSize}
            onPageChange={this.handlePageChange}
            currentPage={currentPage}
          />
        </div>
      </div>
    );
  };

  render() {
    const { movies: allMovies } = this.state;

    if (allMovies.length === 0)
      return <h5 className="m-2">No Movies Available</h5>;

    return (
      <div className="container-fluid">
        <Route
          path="/movies/:id"
          render={props => (
            <MovieForm
              {...props}
              genres={this.state.genres}
              movies={this.state.movies}
              onSave={this.handleSave}
            />
          )}
        />
        <Route path="/movies" exact render={this.renderPage} />
      </div>
    );
  }
}

export default Movies;
