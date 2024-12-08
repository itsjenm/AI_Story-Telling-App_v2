"use client";

import { useState, useEffect } from "react";
import { useChat } from "ai/react";

export default function Chat({ onStoryGenerated }) {
  const { messages, append, isLoading } = useChat({
    api: '/api/chat',
  });

  const [story, setStory] = useState("");

  const genres = [
    { emoji: "🧙", value: "Fantasy" },
    { emoji: "🕵️", value: "Mystery" },
    { emoji: "💑", value: "Romance" },
    { emoji: "🚀", value: "Sci-Fi" },
  ];
  const tones = [
    { emoji: "😊", value: "Happy" },
    { emoji: "😢", value: "Sad" },
    { emoji: "😏", value: "Sarcastic" },
    { emoji: "😂", value: "Funny" },
  ];
  const [characters, setCharacters] = useState<
    { name: string; description: string; personality: string }[]
  >([]);
  const [newCharacter, setNewCharacter] = useState({
    name: "",
    description: "",
    personality: "",
  });

  const [state, setState] = useState({
    genre: "",
    tone: "",
  });


  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  useEffect(() => {
    if (messages.length > 0 && !messages[messages.length - 1]?.content.startsWith("Generate")) {
      const generatedStory = messages[messages.length - 1]?.content;
      setStory(generatedStory);
      onStoryGenerated(generatedStory);
    }
  }, [messages, onStoryGenerated]);

  const handleCharacterChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setNewCharacter({
      ...newCharacter,
      [name]: value,
    });
  };

  const addCharacter = () => {
    if (editingIndex !== null) {
      const updatedCharacters = characters.map((character, index) =>
        index === editingIndex ? newCharacter : character
      );
      setCharacters([...updatedCharacters]);
      setEditingIndex(null);
    } else {
      setCharacters([...characters, newCharacter]);
    }
    setNewCharacter({ name: "", description: "", personality: "" });
  };

  const editCharacter = (index: number) => {
    setNewCharacter(characters[index]);
    setEditingIndex(index);
  };

  const deleteCharacter = (index: number) => {
    const updatedCharacters = characters.filter((_, i) => i !== index);
    setCharacters(updatedCharacters);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (text) {
        const lines = text.split(/\r?\n/).map(line => line.trim()).filter(line => line);
        let name, description, personality;
  
        if (lines.length === 1) {
          // Assuming the format is "name,description,personality"
          [name, description, personality] = lines[0].split(',').map(item => item.trim());
        } else if (lines.length >= 3) {
          [name, description, personality] = lines;
        }
  
        setNewCharacter({ name, description, personality });
      }
    };
    reader.readAsText(file);
  };



  return (
    <main className="mx-auto w-full p-24 flex flex-col">
      <div className="p4 m-4">
        <div className="flex flex-col items-center justify-center space-y-8 text-white">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Story Telling App</h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Customize the story by creating a character
            </p>
          </div>

          <div className="space-y-4 bg-opacity-25 items-center bg-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-semibold">Create a character</h3>

            <div className="flex flex-col space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={newCharacter.name}
                onChange={handleCharacterChange}
                className="p-2 bg-gray-800 text-white rounded"
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={newCharacter.description}
                onChange={handleCharacterChange}
                className="p-2 bg-gray-800 text-white rounded"
              />
              <input
                type="text"
                name="personality"
                placeholder="Personality"
                value={newCharacter.personality}
                onChange={handleCharacterChange}
                className="p-2 bg-gray-800 text-white rounded"
              />
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded centered"
              onClick={addCharacter}>
              {editingIndex !== null ? "Update Character" : "Add Character"}
            </button>
            <input
              type="file"
              accept=".txt"
              onChange={handleFileChange}
              className="p-2 bg-gray-800 text-white rounded"
            />
          </div>

          <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
            <h2 className="text-xl font-semibold">Characters</h2>
            <table className="min-w-full bg-gray-800 text-white rounded-lg">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-600">Name</th>
                  <th className="py-2 px-4 border-b border-gray-600">
                    Description
                  </th>
                  <th className="py-2 px-4 border-b border-gray-600">
                    Personality
                  </th>
                  <th className="py-2 px-4 border-b border-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {characters.map((character, index) => (
                  <tr key={index} className="hover:bg-gray-700">
                    <td className="py-2 px-4 border-b border-gray-600">
                      {character.name}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-600">
                      {character.description}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-600">
                      {character.personality}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-600">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => editCharacter(index)}>
                        Edit
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => deleteCharacter(index)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-semibold">Genre</h3>

            <div className="flex flex-wrap justify-center">
              {genres.map(({ value, emoji }) => (
                <div
                  key={value}
                  className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg">
                  <input
                    id={value}
                    type="radio"
                    value={value}
                    name="genre"
                    onChange={handleChange}
                  />
                  <label className="ml-2" htmlFor={value}>
                    {`${emoji} ${value}`}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-semibold">Tones</h3>
            <div className="flex flex-wrap justify-center">
              {tones.map(({ value, emoji }) => (
                <div
                  key={value}
                  className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg">
                  <input
                    id={value}
                    type="radio"
                    name="tone"
                    value={value}
                    onChange={handleChange}
                  />
                  <label className="ml-2" htmlFor={value}>
                    {`${emoji} ${value}`}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-enter space-y-8 text-white">
          
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            disabled={isLoading || !state.genre || !state.tone}
            onClick={() =>
              append({
                role: "user",
                content: `Generate a ${state.genre} story in a ${
                  state.tone
                } tone with the following characters: ${characters
                  .map(
                    (character) =>
                      `${character.name} (Description: ${character.description}, Personality: ${character.personality})`
                  )
                  .join(", ")}`,
              })
            }>
            Generate Story
          </button>
        </div>
        <div
          hidden={
            messages.length === 0 ||
            messages[messages.length - 1]?.content.startsWith("Generate")
          }
          >
          {/* {messages[messages.length - 1]?.content} */}
        </div>
      </div>
    </main>
  );
}