import React from "react";
import Joi from "joi-browser";
import Form from "./common/Form";

class RegisterForm extends Form {
  state = {
    data: { username: "", password: "", name: "" },
    errors: {}
  };

  schema = {
    username: Joi.string()
      .email({ minDomainAtoms: 2 })
      .required(),
    password: Joi.string()
      .min(5)
      .max(30)
      .required(),
    name: Joi.string()
      .alphanum()
      .required()
  };

  doSubmit = () => {
    //Server call...
    console.log("submitted");
  };

  render() {
    return (
      <div className="container w-50">
        <h1>Register</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("username", "Username")}
          {this.renderInput("password", "Password", "password")}
          {this.renderInput("name", "Name")}
          {this.renderButton("Register")}
        </form>
      </div>
    );
  }
}

export default RegisterForm;
