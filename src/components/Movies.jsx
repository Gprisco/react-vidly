import React, { Component } from 'react';
import { getMovies } from '../services/fakeMovieService';

class Movies extends Component {
  state = {
    movies: getMovies()
  };

  render() {
    return (
      <div className="container-fluid">
        { this.state.movies.length === 0 ? <h5 className="m-2">No Movies Available</h5> : this.moviesTemplate() }
      </div>
    );
  }

  moviesTemplate = () => {
    return (
      <div>
        <h5 className="m-2">Showing { this.state.movies.length } Movies</h5>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Genre</th>
              <th scope="col">Stock</th>
              <th scope="col">Rate</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            { this.state.movies.map(m => this.listMovies(m)) }
          </tbody>
        </table>
      </div>
    );
  }

  listMovies = (m) => {
    return (
      <tr key={ m._id }>
        <td>{ m.title }</td>
        <td>{ m.genre.name }</td>
        <td>{ m.numberInStock }</td>
        <td>{ m.dailyRentalRate }</td>
        <td>
          <button
            id={ m._id }
            onClick={ e => this.handleDelete(e) } 
            className="btn btn-danger btn-sm"
          >
            Elimina
          </button>
        </td>
      </tr>
    );
  };

  handleDelete = (event) => {
    console.log(event.target.id); //this is the movie _id property

    let movies = this.state.movies;
    const movieInDb = movies.find(m => m._id === event.target.id);
    movies.splice(movies.indexOf(movieInDb), 1);
    this.setState({ movies: movies });
    return movieInDb;
  };
};

export default Movies;