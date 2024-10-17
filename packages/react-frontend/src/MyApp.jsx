// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";


function MyApp() {

const [characters, setCharacters] = useState([]);

function updateList(person) {
    postUser(person)
    .then(newUser => setCharacters([...characters, newUser]))
    .catch((error) => {
      console.log(error);
    });
}

function removeOneCharacter(index) {
        const deleteEntry = characters[index];
        const url = `http://localhost:8000/users/${deleteEntry.id}`;

        fetch(url, {method: "DELETE"}).then(response => {
                if(response.status === 204){
                        const updated = characters.filter((_, i) => i !== index);
                        setCharacters(updated);
                } else if(response.status === 404){
                        console.error("User not found");
                } else {
                        throw new Error("Failed to delete");
                }
        }).catch(error => {
                console.log(error);
        });
  }


function fetchUsers() {
  const promise = fetch("http://localhost:8000/users");
  return promise;
}

function postUser(person) {
  const promise = fetch("Http://localhost:8000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(person)
  }).then(response => {
	if (response.status === 201){
		return response.json();
	}else{
		throw new Error("Failed to add")
	}
  });

  return promise;
}

useEffect(() => {
  fetchUsers()
    .then((res) => res.json())
    .then((json) => setCharacters(json["users_list"]))
    .catch((error) => {
      console.log(error);
    });
}, [])

return (
  <div className="container">
    <Table
      characterData={characters}
      removeCharacter={removeOneCharacter}
    />
    <Form handleSubmit={updateList} />
  </div>
);


}
export default MyApp;
