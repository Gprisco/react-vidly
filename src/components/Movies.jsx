import React, { Component } from "react";
import { getMovies } from "../services/fakeMovieService";
import { getGenres } from "../services/fakeGenreService";
import Pagination from "./common/Pagination";
import Genres from "./Genres";
import { paginate } from "../utils/paginate";
import MoviesTable from "./MoviesTable";
import _ from "lodash";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    pageSize: 4,
    currentPage: 1,
    currentFilter: "all",
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
    let movies = this.state.movies;
    const movieInDb = movies.find(m => m._id === _id);
    movies.splice(movies.indexOf(movieInDb), 1);
    this.setState({ movies: movies });
    return movieInDb;
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleFilter = _id => {
    this.setState({ currentFilter: _id, currentPage: 1 });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  getFilteredMovies = () => {
    const {
      movies: allMovies,
      currentFilter,
      pageSize,
      sortColumn,
      currentPage
    } = this.state;

    let filteredMovies = allMovies;

    let sorted = _.orderBy(
      filteredMovies,
      [sortColumn.path],
      [sortColumn.order]
    );
    let movies = paginate(sorted, currentPage, pageSize);

    if (currentFilter !== "all") {
      filteredMovies = allMovies.filter(m => m.genre._id === currentFilter);

      sorted = _.orderBy(filteredMovies, [sortColumn.path], [sortColumn.order]);

      movies = paginate(sorted, currentPage, pageSize);
    }

    return { totalCount: filteredMovies.length, data: movies };
  };

  render() {
    const {
      movies: allMovies,
      genres,
      currentFilter,
      pageSize,
      sortColumn,
      currentPage
    } = this.state;

    const { totalCount, data: movies } = this.getFilteredMovies();

    if (allMovies.length === 0)
      return <h5 className="m-2">No Movies Available</h5>;

    return (
      <div className="container-fluid">
        <div className="row m-4">
          <div className="col-2">
            <Genres
              genres={genres}
              onFilter={this.handleFilter}
              currentFilter={currentFilter}
            />
          </div>
          <div className="col">
            <h5 className="m-2">Showing {totalCount} Movies</h5>
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
      </div>
    );
  }
}

export default Movies;
