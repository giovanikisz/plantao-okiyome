import React from "react";
import {
  Container,
  FormControl,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";

import axios from "axios";

function Register() {
  const dojosList = [
    { value: "sjq", name: "São Joaquim" },
    { value: "car", name: "Carrão" },
    { value: "smp", name: "São Miguel" },
    { value: "san", name: "Santana" },
    { value: "bra", name: "Bragança" },
    { value: "pir", name: "Pirituba" },
    { value: "gru", name: "Guarulhos" },
    { value: "mog", name: "Mogi das Cruzes" },
    { value: "sjc", name: "São José" },
  ];

  const categoriasList = [
    { value: "sho", name: "Shonembu" },
    { value: "pmt", name: "Pré Mahikaritai" },
    { value: "ofi", name: "Oficial" },
  ];

  const [nome, setNome] = React.useState("");
  const [dojo, setDojo] = React.useState("");
  const [categoria, setCategoria] = React.useState("");

  async function registaMembro(data) {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/register",
        data
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  function handleRegister(e) {
    var data = {
      nome,
      dojo,
      categoria,
    };
    registaMembro(data);
    console.log(data);
    // e.preventDefault();
  }

  const handleNome = (e) => {
    setNome(e.target.value);
  };

  const handleDojo = (e) => {
    setDojo(e.target.value);
  };
  const handleCategoria = (e) => {
    setCategoria(e.target.value);
  };

  return (
    <Container>
      <form onSubmit={handleRegister}>
        <FormControl fullWidth>
          <InputLabel>Nome</InputLabel>
          <TextField
            required
            sx={{ margin: 2 }}
            variant="outlined"
            onChange={handleNome}
          />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Dojo</InputLabel>
          <Select
            sx={{ margin: 2 }}
            required
            value={dojo}
            onChange={handleDojo}
          >
            {dojosList.map((dojosItem) => {
              return (
                <MenuItem key={dojosItem.value} value={dojosItem.value}>
                  {dojosItem.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Categoria</InputLabel>
          <Select
            sx={{ margin: 2 }}
            required
            value={categoria}
            onChange={handleCategoria}
          >
            {categoriasList.map((categoriasItem) => {
              return (
                <MenuItem
                  key={categoriasItem.value}
                  value={categoriasItem.value}
                >
                  {categoriasItem.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        {/* <Select>
          {categoriasList.map((categoriasItem) => {
            return (
              <MenuItem value={categoriasItem.value}>
                {categoriasItem.name}
              </MenuItem>
            );
          })}
        </Select> */}
        <Button type="submit" variant="contained">
          Registrar
        </Button>
      </form>
    </Container>
  );
}

export default Register;
