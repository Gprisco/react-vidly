import React, { Component } from "react";
import { Link } from "react-router-dom";
import Like from "./common/Like";
import Table from "./common/Table";
import auth from "../services/authService";

class MoviesTable extends Component {
  columns = [
    {
      path: "title",
      label: "Title",
      content: movie => <Link to={`/movies/${movie._id}`}>{movie.title}</Link>
    },
    { path: "genre.name", label: "Genre" },
    { path: "numberInStock", label: "Stock" },
    { path: "dailyRentalRate", label: "Rate" },
    {
      key: "like",
      content: movie => (
        <Like onLike={this.props.onLike} liked={movie.liked} id={movie._id} />
      )
    }
  ];

  buttonKey = {
    key: "delete",
    content: movie => (
      <button
        id={movie._id}
        onClick={() => this.props.onDelete(movie._id)}
        className="btn btn-danger btn-sm"
      >
        Elimina
      </button>
    )
  };

  constructor() {
    super();
    const user = auth.getCurrentUser();
    if (user && user.isAdmin) {
      this.columns.push(this.buttonKey);
    }
  }

  render() {
    const { movies, onSort, sortColumn } = this.props;

    return (
      <React.Fragment>
        <Table
          columns={this.columns}
          data={movies}
          onSort={onSort}
          sortColumn={sortColumn}
        />
      </React.Fragment>
    );
  }
}

export default MoviesTable;
