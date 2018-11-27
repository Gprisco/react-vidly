import React, { Component } from "react";
import { getMovies } from "../services/fakeMovieService";
import { getGenres } from "../services/fakeGenreService";
import Like from "./common/Like";
import Pagination from "./common/Pagination";
import Genres from "./Genres";
import { paginate } from "../utils/paginate";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    pageSize: 4,
    currentPage: 1,
    currentFilter: "all"
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

  handleDelete = event => {
    console.log(event.target.id); //this is the movie _id property

    let movies = this.state.movies;
    const movieInDb = movies.find(m => m._id === event.target.id);
    movies.splice(movies.indexOf(movieInDb), 1);
    this.setState({ movies: movies });
    return movieInDb;
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleFilter = _id => {
    this.setState({ currentFilter: _id });
  };

  render() {
    const {
      movies: allMovies,
      genres,
      currentFilter,
      pageSize,
      currentPage
    } = this.state;

    let movies = paginate(allMovies, currentPage, pageSize);

    if (currentFilter !== "all") {
      movies = movies.filter(m => m.genre._id === currentFilter);
    }

    if(allMovies.length === 0)
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
            <h5 className="m-2">Showing {movies.length} Movies</h5>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">Genre</th>
                  <th scope="col">Stock</th>
                  <th scope="col">Rate</th>
                  <th scope="col" />
                  <th scope="col" />
                </tr>
              </thead>
              <tbody>
                {movies.map(m => (
                  <tr key={m._id}>
                    <td>{m.title}</td>
                    <td>{m.genre.name}</td>
                    <td>{m.numberInStock}</td>
                    <td>{m.dailyRentalRate}</td>
                    <td>
                      <Like
                        onLike={this.handleLike}
                        liked={m.liked}
                        id={m._id}
                      />
                    </td>
                    <td>
                      <button
                        id={m._id}
                        onClick={e => this.handleDelete(e)}
                        className="btn btn-danger btn-sm"
                      >
                        Elimina
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              items={allMovies.length}
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
