import React from "react";

const Select = ({ data, name, label, errors, onChange, id }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <select
        onChange={onChange}
        className="custom-select"
        name={name}
        id={name}
        value={id}
      >
        <option value="">Select a Genre</option>
        {data.map(item => (
          <option key={item._id} value={item._id}>
            {item.name}
          </option>
        ))}
      </select>
      {errors && <div className="alert alert-danger">{errors[name]}</div>}
    </div>
  );
};

export default Select;
