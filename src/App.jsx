

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { IoClose } from "react-icons/io5";
import {
  GiHeartBeats,      // HP
  GiBroadsword,      // Attack
  GiShield,          // Defense
  GiMagicSwirl,      // Special Attack
  GiCheckedShield,   // Special Defense
  GiSprint           // Speed
} from "react-icons/gi";

export default function App() {
  const typeColors = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    grass: "#7AC74C",
    electric: "#F7D02C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD"
  };

  const [data, setData] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  async function fetchData() {
    try {
      setLoading(true);
      const urls = await axios.get(
        "https://pokeapi.co/api/v2/pokemon?limit=300&offset=0"
      );

      const results = urls.data.results.map((item) => item.url);

      const pokemons = await Promise.all(
        results.map(async (url) => {
          const pokemon = await axios.get(url);
          const d = pokemon.data;

          return {
            name: d.name,
            height: d.height,
            weight: d.weight,
            image: d.sprites.other["official-artwork"].front_default,
            abilitie_1: d.abilities[0]?.ability.name || "",
            abilitie_2: d.abilities[1]?.ability.name || "",
            HP: d.stats[0].base_stat,
            attack: d.stats[1].base_stat,
            defense: d.stats[2].base_stat,
            special_attack: d.stats[3].base_stat,
            special_defense: d.stats[4].base_stat,
            speed: d.stats[5].base_stat,
            experience: d.base_experience,
            type_1: d.types[0]?.type.name || "",
            type_2: d.types[1]?.type.name || ""
          };
        })
      );

      setData(pokemons);
    } catch (err) {
      console.error("Error: " + err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter((d) =>
    d.name.toLowerCase().includes(text.trim().toLowerCase())
  );

  function Card({ d }) {
    return (
      <div className="card" onClick={() => setSelectedPokemon(d)}>
        <img src={d.image} alt={d.name} className="image" />
        <h2 className="name">{d.name}</h2>
        <div className="type">
          {d.type_1 && <p style={{ background: typeColors[d.type_1] }}>{d.type_1}</p>}
          {d.type_2 && <p style={{ background: typeColors[d.type_2] }}>{d.type_2}</p>}
        </div>
      </div>
    );
  }

  function Details({ d, onClose }) {
    return (
      <div id="display">
        <IoClose id="exit" onClick={onClose} />
        <div id="container">
          <Card d={d} />
          <div className="input-details">
            <Stat name="HP" value={d.HP} Icon={GiHeartBeats} color="var(--hp)" />
            <Stat name="Attack" value={d.attack} Icon={GiBroadsword} color="var(--attack)" />
            <Stat name="Defense" value={d.defense} Icon={GiShield} color="var(--defense)" />
            <Stat name="Sp. Atk" value={d.special_attack} Icon={GiMagicSwirl} color="var(--special-attack)" />
            <Stat name="Sp. Def" value={d.special_defense} Icon={GiCheckedShield} color="var(--special-defense)" />
            <Stat name="Speed" value={d.speed} Icon={GiSprint} color="var(--speed)" />
          </div>
        </div>
      </div>
    );
  }

  function Stat({ name, value, Icon, color }) {
    return (
      <div className="single-detaild" style={{ color }}>
        <div className="symbol"><Icon /></div>
        <div className="outsite">
          <div className="insite" style={{ width: `${value}%`, background: color }}></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {selectedPokemon && <Details d={selectedPokemon} onClose={() => setSelectedPokemon(null)} />}
      <h1 id="head">Pokemon World</h1>
      <input
        type="search"
        id="search"
        placeholder="Search Pokemons ..."
        onChange={(e) => setText(e.target.value)}
      />
      <div id="cards">
        {filteredData.length > 0 ? (
          filteredData.map((d) => <Card key={d.name} d={d} />)
        ) : (
          <div id="error">Not found "{text}"</div>
        )}
      </div>
      {loading && (
        <div id="loading">
          <video autoPlay loop muted playsInline controls={false} src="/loading.mp4" />
        </div>
      )}
    </div>
  );
}
