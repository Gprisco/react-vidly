import React from "react";
import { toast } from "react-toastify";
import Joi from "joi-browser";
import { getMovies, saveMovie } from "../services/movieService";
import { getGenres } from "../services/genreService";
import Form from "./common/Form";

class MovieForm extends Form {
  state = {
    data: {
      _id: "new",
      title: "",
      genreId: "",
      stock: 0,
      rate: ""
    },
    movies: [],
    genres: [],
    errors: {}
  };

  schema = {
    _id: Joi.string().required(),
    title: Joi.string()
      .required()
      .min(5)
      .max(50)
      .label("Title"),
    genreId: Joi.string()
      .required()
      .label("Genre"),
    stock: Joi.number()
      .integer()
      .min(0)
      .required()
      .label("Number in Stock"),
    rate: Joi.number()
      .min(0)
      .max(10)
      .required()
      .label("Daily Rental Rate")
  };

  async componentDidMount() {
    const { data: movies } = await getMovies();
    const { data: genres } = await getGenres();
    const { id } = this.props.match.params;

    let movie = movies.find(m => m._id === id);

    if (id === "new") movie = this.state.data;

    if (movie) {
      const genreId = movie.genre ? movie.genre._id : "";

      this.setState({
        data: {
          _id: movie._id,
          title: movie.title,
          genreId: genreId,
          stock: movie.numberInStock || "",
          rate: movie.dailyRentalRate || ""
        },
        movies,
        genres
      });
    } else {
      this.props.history.replace("/not-found");
    }
  }

  doSubmit = async e => {
    //Server Call...

    const { _id, title, genreId, stock, rate } = e.currentTarget;
    const movie = {};

    movie.title = title.value;
    movie.genreId = genreId.value;
    movie.dailyRentalRate = rate.value;
    movie.numberInStock = stock.value;

    try {
      await saveMovie(movie, _id.value);
      this.props.history.replace("/movies");
    } catch (ex) {
      toast.error("An error occurred");
    }
  };

  render() {
    const { genres } = this.state;
    const { _id, genreId } = this.state.data;

    return (
      <div className="container w-50">
        <h1>Movie Form</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("title", "Title", "text")}
          {this.renderSelect("genreId", "Genre", genres, genreId)}
          {this.renderInput("stock", "Number in Stock", "number")}
          {this.renderInput("rate", "Rate", "text")}
          <input type="hidden" name="_id" id="_id" value={_id} />
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default MovieForm;
