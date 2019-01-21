import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./Input";
import Select from "./Select";

class Form extends Component {
  state = {
    data: {},
    errors: {}
  };

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);
    if (!error) return null;

    const errors = {};
    error.details.map(item => (errors[item.path[0]] = item.message));

    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  handleSubmit = e => {
    e.preventDefault();

    const errors = this.validate();
    console.log(errors);
    this.setState({ errors: errors || {} });
    if (errors) return; //if there are errors, we don't want to call the server, return immediately

    this.doSubmit(e);
  };

  //Takes (e) as an argument, but we destructure it as we just need the currentTarget property
  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;

    this.setState({ data, errors });
  };

  renderButton = label => {
    return <button className="btn btn-primary">{label}</button>;
  };

  renderSelect = (name, label, data, id) => {
    const { genres, errors } = this.state;

    return (
      <Select
        name={name}
        label={label}
        onChange={this.handleChange}
        genres={genres}
        error={errors[name]}
        data={data}
        id={id}
      />
    );
  };

  renderInput = (name, label, type = "text") => {
    const { data, errors } = this.state;

    return (
      <Input
        type={type}
        name={name}
        value={data[name]}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  };
}

export default Form;
