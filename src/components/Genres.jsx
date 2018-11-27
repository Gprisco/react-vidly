import React, { Component } from "react";

class Genres extends Component {
  render() {
    const { onFilter, genres, currentFilter } = this.props;

    return (
      <ul className="list-group">
        <li
          style={{ cursor: "pointer" }}
          className={
            currentFilter === "all"
              ? "list-group-item active"
              : "list-group-item"
          }
          onClick={() => onFilter("all")}
        >
          All Genres
        </li>
        {genres.map(g => (
          <li
            style={{ cursor: "pointer" }}
            onClick={() => onFilter(g._id)}
            key={g._id}
            className={
              g._id === currentFilter
                ? "list-group-item active"
                : "list-group-item"
            }
          >
            {g.name}
          </li>
        ))}
      </ul>
    );
  }
}

export default Genres;
