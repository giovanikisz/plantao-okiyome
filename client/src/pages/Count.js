import { React, useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  FormControl,
  Button,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";

function registraOkiyome(data) {
  axios
    .put(`http://localhost:4000/api/okiyome/${data["id"]}`, data)
    .then((response) => {
      // Handle successful response
      console.log("Retorno da api", response.data);
    })
    .catch((error) => {
      // Handle errors
      console.error("Error:", error);
      return [];
    });
}

function Count() {
  // const membrosList = [
  //   { value: 1, name: "Amanda Sousa e Silva" },
  //   { value: 2, name: "Giovani Carmona Kisz" },
  // ];

  const okiyomesList = [
    {
      value: 1,
      label: "Mikumite - Frontal",
      points: 2,
    },
    {
      value: 2,
      label: "Mikumite - Corpo",
      points: 6,
    },
    {
      value: 3,
      label: "Mikumite - Completo",
      points: 14,
    },
    {
      value: 4,
      label: "Kumite - Frontal",
      points: 1,
    },
    {
      value: 3,
      label: "Kumite - Corpo",
      points: 3,
    },
    {
      value: 6,
      label: "Kumite - Completo",
      points: 7,
    },
    {
      value: 7,
      label: "Mahikaritai - Corpo",
      points: 3,
    },
    {
      value: 8,
      label: "Dirigente - Frontal",
      points: 1,
    },
    {
      value: 9,
      label: "Dirigente - Corpo",
      points: 10,
    },
    {
      value: 10,
      label: "Dirigente - Completo",
      points: 10,
    },
    {
      value: 11,
      label: "Dojotyo - Frontal",
      points: 1,
    },
    {
      value: 12,
      label: "Dojotyo - Corpo",
      points: 15,
    },
    {
      value: 13,
      label: "Dojotyo - Completo",
      points: 15,
    },
    {
      value: 99,
      label: "Trouxe convidado",
      points: 5,
    },
  ];
  const [membro, setMembro] = useState("");
  const [okiyomes, setOkiyomes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [dataMembros, setDataMembros] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/membros");
        setDataMembros(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   let membros = getMembros();
  //   console.setDataMembros(membros);
  //   console.log(dataMembros);
  //   setLoading(false);
  // }, [dataMembros]);

  function handleRegister(e) {
    let pontos = okiyomesList[okiyomes - 1].points;
    console.log("Okiyome raw", okiyomes);
    let data = {
      id: membro,
      okiyomes,
      pontos,
    };
    registraOkiyome(data);
    console.log("Dados enviador para a fun", data);
    e.preventDefault();
  }

  const handleMembro = (e) => {
    setMembro(e.target.value);
  };
  const handleOkiyome = (e) => {
    setOkiyomes(e.target.value);
  };

  return (
    <Container>
      {!isLoading && (
        <form onSubmit={handleRegister}>
          <FormControl fullWidth>
            <InputLabel>Membro</InputLabel>
            <Select
              sx={{ margin: 2 }}
              required
              value={membro}
              onChange={handleMembro}
            >
              {dataMembros.map((dataMembro) => {
                return (
                  <MenuItem key={dataMembro["_id"]} value={dataMembro["_id"]}>
                    {dataMembro["nome"]}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Okiyome</InputLabel>
            <Select
              sx={{ margin: 2 }}
              required
              value={okiyomes}
              onChange={handleOkiyome}
            >
              {okiyomesList.map((pontosItem) => {
                return (
                  <MenuItem key={pontosItem.value} value={pontosItem.value}>
                    {pontosItem.label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Button type="submit" variant="contained">
            Registrar
          </Button>
        </form>
      )}
    </Container>
  );
}

export default Count;
