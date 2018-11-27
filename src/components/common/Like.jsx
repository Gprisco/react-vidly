import React from "react";

const Like = props => {
  if (props.liked)
    return (
      <i
        onClick={() => props.onLike(props.id)}
        className="fa fa-heart"
        style={{ cursor: "pointer" }}
      />
    );
  return (
    <i
      onClick={() => props.onLike(props.id)}
      className="fa fa-heart-o"
      style={{ cursor: "pointer" }}
    />
  );
};

export default Like;
