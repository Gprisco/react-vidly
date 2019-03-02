import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getMovies, deleteMovie, saveMovie } from "../services/movieService";
import { getGenres } from "../services/genreService";
import Pagination from "./common/Pagination";
import Search from "./common/Search";
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
    currentSearch: "",
    sortColumn: { path: "title", order: "asc" }
  };

  async componentDidMount() {
    const { data: genres } = await getGenres();
    const { data: movies } = await getMovies();

    this.setState({
      movies,
      genres
    });
  }

  handleLike = id => {
    let movies = this.state.movies;
    movies.forEach(m => {
      if (m._id === id) m.liked = !m.liked;
    });
    this.setState({ movies });
  };

  handleDelete = async _id => {
    try {
      const { data: deletedMovie } = await deleteMovie(_id);
      const movies = this.state.movies.filter(m => m._id !== deletedMovie._id);
      this.setState({ movies });
      toast.success("Movie Deleted!");
    } catch (ex) {
      toast.error("An error occurred");
    }
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
    const { _id, title, genreId, stock, rate } = e.currentTarget;
    const { genres } = this.state;
    const genre = genres.find(g => g._id === genreId.value);

    const movie = {};

    movie._id = _id.value;
    movie.title = title.value;
    movie.genre = genre;
    movie.dailyRentalRate = rate.value;
    movie.numberInStock = stock.value;
    movie.liked = false;

    saveMovie(movie);

    const { data: movies } = getMovies();

    this.setState({ movies });

    this.props.done("Movie Saved");
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

    const { user } = this.props;

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
          {user && (
            <Link to="/movies/new" className="btn btn-primary mb-2">
              New Movie
            </Link>
          )}
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

    return <div className="container-fluid">{this.renderPage()}</div>;
  }
}

export default Movies;
