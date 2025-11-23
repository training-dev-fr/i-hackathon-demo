import React from "react";

export default function Counter() {
  let count = 0;

  function handleClick() {
    count = count + 1;
    console.log("Nouveau compteur :", count);
  }

  return (
    <div>
      <h2>Compteur : {count}</h2>
      <button onClick={handleClick}>+1</button>
    </div>
  );
}