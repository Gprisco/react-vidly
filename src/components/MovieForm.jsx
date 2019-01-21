import React from "react";
import Joi from "joi-browser";
import Form from "./common/Form";

class MovieForm extends Form {
  state = {
    data: {
      _id: new Date().toDateString(),
      title: "",
      genreId: "",
      stock: 0,
      rate: ""
    },
    errors: {}
  };

  schema = {
    _id: Joi.string(),
    title: Joi.string()
      .required()
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

  componentDidMount() {
    const { movies } = this.props;
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
        }
      });
    } else {
      this.props.history.replace("/not-found");
    }
  }

  doSubmit = e => {
    //Server Call...
    console.log("Submitted");

    this.props.onSave(e);

    this.props.history.replace("/movies");
  };

  render() {
    const { genres } = this.props;
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
